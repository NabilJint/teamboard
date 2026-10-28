#!/bin/bash
PORT=3002
BASE="http://localhost:$PORT/api/trpc"
AUTH="http://localhost:$PORT/api/auth"
PASS=0
FAIL=0

check() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [[ "$actual" == *"$expected"* ]]; then
    echo "✅ $name"
    PASS=$((PASS+1))
  else
    echo "❌ $name — expected '$expected' in response"
    echo "   Got: $actual" | head -3
    FAIL=$((FAIL+1))
  fi
}

# Sign in via Better Auth email/password and return the session_token cookie value.
sign_in() {
  local email="$1"
  local password="$2"
  local headers
  headers=$(curl -s -D - "$AUTH/sign-in/email" \
    -H "content-type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}" -o /dev/null)
  echo "$headers" | grep -i "^set-cookie:" | grep -o "better-auth.session_token=[^;]*" | head -1 | cut -d= -f2
}

echo "=== Guardrail Regression Test ==="
echo ""

# --- Real Better Auth sessions (cookie-based auth) ---
TOKEN_USER1=$(sign_in "user-1@test.local" "password123")
TOKEN_USER2=$(sign_in "user-2@test.local" "password123")

# 1. Auth: no session → 401
R=$(curl -s "$BASE/project.list?input=%7B%22json%22%3A%7B%7D%7D")
check "1. Auth (no session → 401)" "UNAUTHORIZED" "$R"

# 2. Tenant: user-2 signed in, but org-2 header (not a member) → 403.
#    Better Auth handles identity (cookie); the Block handles tenancy (x-organization-id).
R=$(curl -s "$BASE/project.list?input=%7B%22json%22%3A%7B%7D%7D" \
  -b "better-auth.session_token=$TOKEN_USER2" \
  -H "x-organization-id: org-2")
check "2. Tenant (non-member → 403)" "Not a member" "$R"

# 3. Permissions: user-2 (MEMBER in org-1) update → 403
PROJ_ID=$(curl -s "$BASE/project.list?input=%7B%22json%22%3A%7B%7D%7D" \
  -b "better-auth.session_token=$TOKEN_USER1" \
  -H "x-organization-id: org-1" \
  | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
R=$(curl -s -X POST "$BASE/project.update" \
  -b "better-auth.session_token=$TOKEN_USER2" \
  -H "x-organization-id: org-1" \
  -H "content-type: application/json" \
  -d "{\"json\":{\"id\":\"$PROJ_ID\",\"name\":\"MEMBER attempt\"}}")
check "3. Permissions (MEMBER → 403)" "Insufficient permissions" "$R"

# 4. Plan gate: org-1 FREE over limit → 403
psql teamboard -c "UPDATE \"Organization\" SET plan = 'FREE' WHERE id = 'org-1';" > /dev/null
R=$(curl -s -X POST "$BASE/project.create" \
  -b "better-auth.session_token=$TOKEN_USER1" \
  -H "x-organization-id: org-1" \
  -H "content-type: application/json" \
  -d '{"json":{"name":"Should be blocked"}}')
check "4. Plan limit (FREE over limit → 403)" "FREE plan allows" "$R"

# 5. x-plan header ignored (plan comes from DB, not header)
R=$(curl -s -X POST "$BASE/project.create" \
  -b "better-auth.session_token=$TOKEN_USER1" \
  -H "x-organization-id: org-1" \
  -H "x-plan: PRO" \
  -H "content-type: application/json" \
  -d '{"json":{"name":"Header spoof attempt"}}')
check "5. x-plan header ignored (DB wins)" "FREE plan allows" "$R"

# 6. Rate limit: 4 calls to ping (GET query), 4th → 429
for i in 1 2 3 4; do
  R=$(curl -s "$BASE/project.ping?input=%7B%7D" \
    -b "better-auth.session_token=$TOKEN_USER1" \
    -H "x-organization-id: org-1")
done
check "6. Rate limit (4th call → 429)" "TOO_MANY_REQUESTS" "$R"

# 7. Audit + usage: create a project in org-2 (PRO), check DB
psql teamboard -c "UPDATE \"Organization\" SET plan = 'PRO' WHERE id = 'org-2';" > /dev/null
BEFORE=$(psql teamboard -t -c "SELECT count FROM \"Usage\" WHERE \"organizationId\"='org-2' AND resource='project';" | xargs)
R=$(curl -s -X POST "$BASE/project.create" \
  -b "better-auth.session_token=$TOKEN_USER1" \
  -H "x-organization-id: org-2" \
  -H "content-type: application/json" \
  -d '{"json":{"name":"Regression audit test"}}')
sleep 1
AFTER=$(psql teamboard -t -c "SELECT count FROM \"Usage\" WHERE \"organizationId\"='org-2' AND resource='project';" | xargs)
check "7. Usage counter incremented" "$((BEFORE+1))" "$AFTER"

AUDIT=$(psql teamboard -t -c "SELECT count(*) FROM \"AuditLog\" WHERE action='project.create' AND \"organizationId\"='org-2';" | xargs)
check "7b. Audit log row exists" "" "$AUDIT"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="

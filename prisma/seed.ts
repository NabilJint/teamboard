import { prisma } from "@/server/db/prisma";

const CREDENTIAL_PASSWORD =
  "3e858a9f2add7a1f8db05cd411b29188:5516a7dfd7dabd77e29834521dd5325ff6746e5c1b7e3041c6058e2ecc0392892ce63e87695f76bea728fb5e03bcf1f9841308e2767c51a335714f0bf7fb8f83";

// Idempotent: remove any prior credential account for this user, then create one.
async function ensureCredentialAccount(userId: string) {
  await prisma.account.deleteMany({
    where: { userId, providerId: "credential" },
  });
  await prisma.account.create({
    data: {
      userId,
      accountId: userId,
      providerId: "credential",
      password: CREDENTIAL_PASSWORD,
    },
  });
}

async function main() {
  // Users (upsert: safe to re-run)
  await prisma.user.upsert({
    where: { id: "user-1" },
    update: {},
    create: {
      id: "user-1",
      email: "user-1@test.local",
      name: "User One",
    },
  });
  await prisma.user.upsert({
    where: { id: "user-2" },
    update: {},
    create: {
      id: "user-2",
      email: "user-2@test.local",
      name: "User Two",
    },
  });

  // Better Auth credential accounts so both users can sign in with email/password.
  await ensureCredentialAccount("user-1");
  await ensureCredentialAccount("user-2");

  // Organizations (upsert: safe to re-run)
  await prisma.organization.upsert({
    where: { id: "org-1" },
    update: { plan: "FREE" },
    create: { id: "org-1", name: "Org One", plan: "FREE" },
  });
  await prisma.organization.upsert({
    where: { id: "org-2" },
    update: { plan: "FREE" },
    create: { id: "org-2", name: "Org Two", plan: "FREE" },
  });

  // Memberships (upsert: safe to re-run)
  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: "user-1", organizationId: "org-1" } },
    update: { role: "OWNER" },
    create: {
      userId: "user-1",
      organizationId: "org-1",
      role: "OWNER",
    },
  });
  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: "user-1", organizationId: "org-2" } },
    update: { role: "OWNER" },
    create: {
      userId: "user-1",
      organizationId: "org-2",
      role: "OWNER",
    },
  });
  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: "user-2", organizationId: "org-1" } },
    update: { role: "MEMBER" },
    create: {
      userId: "user-2",
      organizationId: "org-1",
      role: "MEMBER",
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

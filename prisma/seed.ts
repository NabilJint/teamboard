import { prisma } from "@/server/db/prisma";

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

  // User-2 as MEMBER in org-1
  await prisma.user.upsert({
    where: { id: "user-2" },
    update: {},
    create: {
      id: "user-2",
      email: "user-2@test.local",
      name: "User Two",
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

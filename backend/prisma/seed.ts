// prisma/seed.ts

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [UserRole.MANAGER, UserRole.SALES_AGENT, UserRole.DRIVER];
  
  for (let i = 0; i < 10; i++) {
    const role = roles[i % roles.length]; // Cycle through the roles
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        phone: `123456789${i}`,
        role: role,
        agentCode: `AC123${i}`,
      },
    });

    const client = await prisma.client.create({
      data: {
        description: `Test client ${i}`,
        companyName: `Test Company ${i}`,
        taxCode: `TC123${i}`,
        latitude: i,
        longitude: i,
        totalOrder: i,
        clientCode: `CC123${i}`,
        salesAgent: {
          connect: {
            id: user.id,
          },
        },
        phones: {
          create: [
            {
              number: `123456789${i}`,
            },
          ],
        },
        emails: {
          create: [
            {
              address: `test${i}@test.com`,
            },
          ],
        },
      },
    });

    await prisma.visit.create({
      data: {
        meetingTime: new Date(),
        conclusion: `Test conclusion ${i}`,
        nextMeeting: new Date(),
        invoice: i * 100,
        visitCode: `VC123${i}`,
        clientId: client.id,
        userId: user.id,
      },
    });

    console.log(`Created new user: ${user.name} (ID: ${user.id})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
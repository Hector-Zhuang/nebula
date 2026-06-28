import { PrismaClient, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@nebula.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'password123';
  const displayName = process.env.SEED_ADMIN_NAME || 'Nebula Admin';

  await prisma.user.upsert({
    where: { email },
    update: {
      displayName,
      status: UserStatus.ACTIVE,
    },
    create: {
      email,
      displayName,
      status: UserStatus.ACTIVE,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  console.log(`[seed] admin user ready: ${email} / ${password}`);
}

main()
  .catch(error => {
    console.error('[seed] failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

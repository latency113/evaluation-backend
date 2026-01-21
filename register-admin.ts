import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from './src/providers/database/generated/client.js';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { username },
    update: { password: hashedPassword },
    create: {
      username,
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Admin user created/updated:', admin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
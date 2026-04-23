const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@campushire.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Admin User',
      email: 'admin@campushire.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin credentials configured:');
  console.log('Email: admin@campushire.com');
  console.log('Password: admin123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

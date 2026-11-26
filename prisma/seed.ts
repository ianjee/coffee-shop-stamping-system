import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || "owner";
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error("Set ADMIN_PASSWORD to a password of at least 12 characters in .env");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash }
  });
  console.log(`Admin account ready: ${username}`);
}

main().finally(() => prisma.$disconnect());

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await getSession();
  if (!session.adminId) redirect("/admin/login");

  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId }
  });

  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requireCustomer() {
  const session = await getSession();
  if (!session.customerId) redirect("/");

  const customer = await prisma.customer.findUnique({
    where: { id: session.customerId }
  });

  if (!customer || customer.status !== "ACTIVE") redirect("/");
  return customer;
}

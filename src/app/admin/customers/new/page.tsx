import { requireAdmin } from "@/lib/auth";
import NewCustomerForm from "./new-form";
export default async function NewCustomer() { await requireAdmin(); return <main className="wrap"><h1 className="text-2xl font-bold">Add Customer</h1><NewCustomerForm /></main>; }

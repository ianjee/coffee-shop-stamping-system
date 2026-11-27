import { requireAdmin } from "@/lib/auth";
import NewCustomerForm from "./new-form";
import AdminNav from "@/components/AdminNav";
export default async function NewCustomer() { await requireAdmin(); return <><AdminNav /><main className="page"><div className="page-head"><p className="eyebrow">People</p><h1>Add Customer</h1></div><NewCustomerForm /></main></>; }

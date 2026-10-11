import { CrmShell } from "@/components/crm/shell";
import { CompaniesPage } from "@/components/crm/companies";
export const metadata = { title: "Companies | Sales CRM" };
export default function Page() { return <CrmShell><CompaniesPage /></CrmShell>; }

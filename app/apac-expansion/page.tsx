import {CrmShell} from "@/components/crm/shell";
import {EmeaOverview} from "@/components/crm/emea-overview";
import data from "@/components/crm/apac-expansion-data.json";
export const metadata={title:"APAC Expansion | Sales CRM"};
export default function Page(){return <CrmShell><EmeaOverview data={data}/></CrmShell>;}

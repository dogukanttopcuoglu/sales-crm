import {CrmShell} from "@/components/crm/shell";
import {EmeaOverview} from "@/components/crm/emea-overview";
import data from "@/components/crm/north-america-data.json";
export const metadata={title:"North America | Sales CRM"};
export default function Page(){return <CrmShell><EmeaOverview data={data}/></CrmShell>;}

import {CrmShell} from "@/components/crm/shell";
import {TeamOverview} from "@/components/crm/team-overview";
import data from "@/components/crm/sdr-team-data.json";
export const metadata={title:data.title+" | Sales CRM"};
export default function Page(){return <CrmShell><TeamOverview data={data}/></CrmShell>;}

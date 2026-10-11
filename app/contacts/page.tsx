import {CrmShell} from "@/components/crm/shell";
import {ContactsPage} from "@/components/crm/contacts";
export const metadata={title:"Contacts | Sales CRM"};
export default function Page(){return <CrmShell><ContactsPage/></CrmShell>;}

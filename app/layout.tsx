import type { Metadata } from "next";
import localFont from "next/font/local";
import { Agentation } from "agentation";
import "./globals.css";
const inter = localFont({ variable: "--font-inter", display: "swap", src: [
 { path: "../public/crm/fonts/Inter-400.ttf", weight: "400", style: "normal" },
 { path: "../public/crm/fonts/Inter-500.ttf", weight: "500", style: "normal" },
 { path: "../public/crm/fonts/Inter-600.ttf", weight: "600", style: "normal" },
] });
export const metadata: Metadata = { title: "EMEA Enterprise | Sales CRM", description: "EMEA Enterprise pipeline overview" };
export default function RootLayout({ children }: LayoutProps<"/">) {
 return <html lang="en" className={`${inter.variable} h-full antialiased`}><body>{children}{process.env.NODE_ENV === "development" && <Agentation />}</body></html>;
}

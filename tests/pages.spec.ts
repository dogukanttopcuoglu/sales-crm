import { test, expect } from "@playwright/test";
import { crmRoutes } from "../components/crm/routes";
for (const route of crmRoutes) for (const width of [1440,768,390]) {
 test(`${route.slug} at ${width}`,async ({page})=>{
  const errors:string[]=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
  await page.setViewportSize({width,height:1024});
  await page.goto(`/${route.slug}`);
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading",{name:route.title,exact:true}).first()).toBeVisible();
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>Promise.all(Array.from(document.images).filter(i=>i.getBoundingClientRect().width>0&&i.getBoundingClientRect().top<innerHeight).map(i=>i.decode())));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`artifacts/${route.slug}-${width}.png`,fullPage:true});
  expect(errors).toEqual([]);
 });
}

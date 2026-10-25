// Run with Playwright installed, or via the Playwright skill run.js. All form submissions are mocked.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:3107';
const path = require('node:path');
const ARTIFACTS = process.env.MAZ_QA_ARTIFACTS || path.join(require('node:os').tmpdir(), 'maz-works-qa');
fs.mkdirSync(ARTIFACTS, {recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:false});
 const page=await browser.newPage({reducedMotion:'reduce'});
 const errors=[]; const responses=[]; const results=[]; let requestBody; let mode='rejected'; let release;
 page.on('pageerror', e=>errors.push(e.message));
 page.on('console', m=>{if(m.type()==='error') errors.push(m.text());});
 page.on('response', r=>{if(r.status()>=400) responses.push({url:r.url(),status:r.status()});});
 await page.route('https://formsubmit.co/**',async route=>{
  requestBody=route.request().postDataJSON();
  if(mode==='pending') await new Promise(resolve=>{release=resolve;});
  if(mode==='offline') return route.abort();
  await route.fulfill({status:200,contentType:'application/json',body:mode==='malformed'?'{}':JSON.stringify({success:mode==='success'?'true':'false'})});
 });
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/3d-printing','/demos','/work/jobfilter','/work/scrap-finance-partners','/faq','/about']){
   await page.goto(TARGET_URL+route,{waitUntil:'networkidle'});
   await page.locator('img').evaluateAll(async images => { await Promise.all(images.map(img => { img.loading='eager'; return img.decode().catch(()=>{}); })); });
   const metrics=await page.evaluate(()=>({height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,contactY:document.querySelector('#contact,#personalise')?.getBoundingClientRect().top+scrollY,inputs:[...document.querySelectorAll('input:not([type=hidden]),textarea,select')].filter(e=>e.getBoundingClientRect().height&&e.tabIndex>=0).map(e=>({name:e.name,size:getComputedStyle(e).fontSize})),brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));
   assert.equal(metrics.overflow,false,`${width} ${route} overflow`); assert.deepEqual(metrics.brokenImages,[]);
   if(width<=390 && route==='/') assert.ok(metrics.inputs.every(input=>parseFloat(input.size)>=16), 'Mobile form text must be at least 16px');
   results.push({width,route,...metrics});
   if([390,1440].includes(width)&&['/','/3d-printing'].includes(route)) await page.screenshot({path:`${ARTIFACTS}/maz-after-${width}-${route==='/'?'home':'objects'}.png`,fullPage:true});
  }
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto(TARGET_URL);
 await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Skip to main content');
 await page.keyboard.press('Enter'); assert.equal(await page.evaluate(()=>document.activeElement.id),'main-content');
 await page.locator('[name=name]').fill('Example Customer');
 await page.locator('[name=email]').fill('customer@example.com');
 await page.locator('[name=problem]').fill('Bookings & follow-up\nSecond line + £49');
 await page.getByRole('link',{name:'Talk about admin'}).click();
 assert.equal(await page.locator('[name=service]').inputValue(),'automation');
 assert.equal(await page.locator('[name=name]').inputValue(),'Example Customer');
 assert.match(await page.locator('[name=problem]').inputValue(),/Bookings/);
 assert.equal(await page.evaluate(()=>document.activeElement.name),'problem');
 await page.goBack(); assert.equal(await page.locator('[name=service]').inputValue(),'unsure');
 await page.goForward(); assert.equal(await page.locator('[name=service]').inputValue(),'automation');
 await page.locator('.mw-form-options > summary').click();
 await page.locator('[name=nextStep]').selectOption({label:'Just answer my question first'});
 for(const failMode of ['rejected','malformed']){
  mode=failMode; await page.getByRole('button',{name:'Send enquiry',exact:true}).click();
  await page.getByRole('status').filter({hasText:'Delivery was not confirmed'}).waitFor();
  assert.equal(await page.locator('[name=email]').inputValue(),'customer@example.com');
  const recovery=new URL(await page.getByRole('link',{name:'send it by email instead'}).getAttribute('href'));
  assert.match(recovery.searchParams.get('body'),/Email: customer@example.com/);
  assert.equal(requestBody.next_step,'Just answer my question first');
 }
 await page.getByText('No email app? Copy your enquiry',{exact:true}).click();
 const recovered=await page.locator('.enquiry-recovery textarea').inputValue();
 assert.match(recovered,/To: info@mazworks.uk/); assert.match(recovered,/Bookings & follow-up\nSecond line \+ £49/);
 await page.screenshot({path:ARTIFACTS+'/enquiry-recovery-mobile.png'});
 mode='pending'; await page.getByRole('button',{name:'Send enquiry',exact:true}).click();
 await page.getByRole('button',{name:'Sending…'}).waitFor(); assert.equal(await page.locator('[name=email]').isDisabled(),true);
 mode='success'; release(); await page.getByRole('button',{name:'Send another',exact:true}).waitFor();
 assert.equal(await page.locator('[name=email]').inputValue(),''); await page.getByRole('button',{name:'Send another',exact:true}).click(); assert.equal(await page.evaluate(()=>document.activeElement.name),'name');
 await page.locator('[name=name]').fill('   '); await page.locator('[name=email]').fill('customer@example.com'); await page.locator('[name=problem]').fill('Example');
 await page.getByRole('button',{name:'Send enquiry',exact:true}).click(); await page.getByRole('alert').filter({hasText:'Add your name'}).waitFor(); assert.equal(await page.evaluate(()=>document.activeElement.name),'name');
 // Every product and artwork estimate, then the progressive enquiry and recovery.
 await page.goto(TARGET_URL+'/3d-printing');
 for(const [id,price] of [['touch-one',29],['touch-three',49],['touch-carry',79]]){
  const radio=page.locator(`input[name=bundle][value="${id}"]`);
  if(await radio.count()===0) { console.log('Bundle IDs:',await page.locator('[name=bundle]').evaluateAll(es=>es.map(e=>e.value))); throw new Error('Unknown bundle '+id); }
  await radio.check();
  for(const artwork of [false,true]){
   await page.locator('[name=artwork]').setChecked(artwork);
   assert.equal(await page.locator('.objects-estimate dd').innerText(),`£${price+(artwork?10:0)}`);
  }
 }
 await page.locator('[name=businessName]').fill('Example Shop'); await page.locator('.objects-optional-details > summary').click();
 await page.locator('[name=name]').fill('Example Customer'); await page.locator('[name=email]').fill('customer@example.com');
 await page.locator('[name=helpFindingLinks]').check(); mode='malformed'; await page.getByRole('button',{name:'Send my enquiry'}).click();
 await page.getByRole('status').filter({hasText:'Delivery was not confirmed'}).waitFor();
 assert.equal(requestBody.estimated_product_price,'£89 before delivery or unusual requests'); assert.equal(requestBody.destination_links,'Not supplied yet');
 assert.equal(await page.locator('[name=businessName]').inputValue(),'Example Shop');
 await page.getByText('No email app? Copy your enquiry',{exact:true}).click(); assert.match(await page.locator('.enquiry-recovery textarea').inputValue(),/Email: customer@example.com/);
 mode='success'; await page.getByRole('button',{name:'Send my enquiry'}).click(); await page.getByRole('button',{name:'Send another enquiry'}).click(); assert.equal(await page.getByRole('button',{name:'Send my enquiry'}).isEnabled(),true);
 results.push({checks:'Service links preserve drafts and browser history; blank validation and focus; both forms reject malformed/provider failures; pending locks inputs; confirmed success/reset/retry; mailto and webmail recovery; six prices; keyboard skip; 28 responsive route checks',errors,responses});
 assert.deepEqual(errors,[]); assert.deepEqual(responses,[]);
 fs.writeFileSync(`${ARTIFACTS}/maz-after.json`,JSON.stringify(results,null,2)); console.log(JSON.stringify(results,null,2)); await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

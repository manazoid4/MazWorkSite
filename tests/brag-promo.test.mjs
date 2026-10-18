import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const scene=await fs.readFile(path.join(root,'public/promo/brag/scene.html'),'utf8');
const page=await fs.readFile(path.join(root,'app/brag/page.tsx'),'utf8');
const plan=await fs.readFile(path.join(root,'assets/promo/brag/brag-plan.md'),'utf8');

test('/brag includes a finite, seekable 20-second film with replay and pause',()=>{
 assert.match(scene,/const DURATION=20/);
 assert.match(scene,/window\.seek=/);
 assert.match(scene,/id="toggle"/);
 assert.match(scene,/id="replay"/);
 assert.equal((scene.match(/class="slide s[1-5]"/g)||[]).length,5);
 assert.match(scene,/data-end="20"/);
});

test('the film tells a specific flow without fabricated client results',()=>{
 for(const text of ['THE PHONE','FOLLOW-UP','Missed call','Helpful text','Request captured','JobFilter','Scrap Finance Partners','Get my free preview']){
  assert.ok(scene.includes(text),'film missing '+text);
 }
 assert.match(scene,/Illustrative workflow, not connected to a real customer or phone line/);
 assert.match(scene,/Not an actual sent message/);
 assert.match(page,/Illustrative workflow/);
 assert.doesNotMatch(scene,/\b(?:100%|10x|million|guaranteed bookings)\b/i);
});

test('brand matches current site, site preview is noindexed and main CTA stays canonical',()=>{
 assert.match(scene,/#f6f6f3/);
 assert.match(scene,/#151615/);
 assert.match(scene,/#ff6b1a/);
 assert.match(page,/robots: \{ index: false, follow: false \}/);
 assert.match(page,/\{MAIN_CTA\}/);
 assert.match(page,/\/free-plan\?src=dm-brag#leak-check-form/);
 assert.match(plan,/20 seconds total/);
});

test('static export includes accessible noindex promo preview',async()=>{
 let html;
 try{html=await fs.readFile(path.join(root,'out/brag.html'),'utf8');}
 catch{html=await fs.readFile(path.join(root,'out/brag/index.html'),'utf8');}
 assert.match(html,/Maz Works \/ The 20-second film/);
 assert.match(html,/promo\/brag\/scene\.html/);
 assert.match(html,/name="robots" content="noindex, nofollow"/);
});

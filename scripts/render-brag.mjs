// /brag renderer for the source-owned promo scene. Does not run during Vercel builds.
// From repo root: node scripts/render-brag.mjs
// Optional local tools: npm i --no-save playwright; npx playwright install chromium; ffmpeg on PATH.
// Produces a 20-second H264/AAC film, the chosen poster as frame 0 and a VTT transcript.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); execFileSync('ffmpeg', ['-version'], { stdio:'ignore' }); }
catch { console.error('Install optional Playwright + Chromium and FFmpeg before rendering.'); process.exit(1); }

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const film=path.join(root,'public','promo','brag','scene.html');
const output=path.join(root,'brag-output');
const FRAME_RATE=24, SECONDS=20, TOTAL=FRAME_RATE*SECONDS;
const cues=[
  [0,3.2,'The phone rang. You were busy. A customer calls while you are working.'],
  [3.2,6.7,'A helpful follow-up text goes out on its own. Example, not a real message.'],
  [6.7,12.8,'Missed call. Helpful text. Request captured for you to review. Illustrative workflow.'],
  [12.8,16.5,'Designed and built in house. JobFilter, my own software product. Scrap Finance Partners, a client website.'],
  [16.5,20,'Show me the problem. Get my free demo at mazworks.uk/free-plan.']
];
function srt(s){ const ms=Math.round(s*1000); return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`; }
mkdirSync(output,{recursive:true});
const temp=mkdtempSync(path.join(tmpdir(),'maz-brag-'));
try {
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1,reducedMotion:'no-preference'});
  await page.goto(pathToFileURL(film).href+'?render=1');
  await page.evaluate(()=>document.fonts.ready);
  for(let n=0;n<TOTAL;n++){
   await page.evaluate(t=>window.seek(t),n/FRAME_RATE);
   await page.screenshot({path:path.join(temp,`f${String(n).padStart(4,'0')}.png`)});
  }
  await page.evaluate(()=>window.seek(10.5));
  await page.screenshot({path:path.join(temp,'poster.png')});
 }finally{await browser.close();}
 // Brag poster must also be the idle thumbnail (frame 0) without extending the duration.
 cpSync(path.join(temp,'poster.png'),path.join(temp,'f0000.png'));
 const music='aevalsrc=0.018*sin(2*PI*110*t)+0.013*sin(2*PI*164.81*t)+0.009*sin(2*PI*220*t):s=44100:d=20';
 execFileSync('ffmpeg',['-y','-loglevel','error','-framerate',String(FRAME_RATE),'-i',path.join(temp,'f%04d.png'),'-f','lavfi','-i',music,
  '-c:v','libx264','-preset','slow','-crf','28','-pix_fmt','yuv420p','-profile:v','high','-movflags','+faststart',
  '-c:a','aac','-b:a','96k','-af','highpass=f=75,lowpass=f=1700,afade=t=in:st=0:d=0.7,afade=t=out:st=18.7:d=1.3',
  '-t',String(SECONDS),path.join(output,'brag.mp4')],{timeout:300000});
 execFileSync('ffmpeg',['-y','-loglevel','error','-i',path.join(temp,'poster.png'),'-q:v','3',path.join(output,'brag.jpg')]);
 writeFileSync(path.join(output,'brag.vtt'),'WEBVTT\n\n'+cues.map(([a,b,t])=>`${srt(a)} --> ${srt(b)}\n${t}\n`).join('\n'));
 console.log(`/brag render ready: brag-output/brag.mp4 (${(statSync(path.join(output,'brag.mp4')).size/1024/1024).toFixed(2)} MB) and brag.jpg, brag.vtt. Review before uploading or posting.`);
}finally{rmSync(temp,{recursive:true,force:true});}

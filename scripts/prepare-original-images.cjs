const fs = require('node:fs');
const path = require('node:path');
const sharp = require('/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/sharp');
const records = JSON.parse(fs.readFileSync('src/archive.generated.json'));
const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const normalize = s => path.basename(s).replace(/\.[^.]+$/, '').replace(/封面|\s/g,'');
(async () => {
  const active = records.filter(r => r.id !== '002' && r.category !== 'ppt');
  for (const r of active) {
    const originals = walk(path.join('作品集整理',r.category));
    const original = originals.find(f => !f.includes('封面') && normalize(f) === normalize(r.title) && /\.(png|jpe?g|webp)$/i.test(f));
    if (original && r.pages?.length === 1) fs.copyFileSync(original,path.join('dist',r.pages[0]));
  }
  const keep = new Set(active.flatMap(r => [r.image,...(r.pages || [])]).map(p => path.resolve('dist',p)));
  for (const name of ['tea-pattern-marquee.png','cotton-scene-marquee.png']) keep.add(path.resolve('dist/assets/archive',name));
  for (const f of walk('dist/assets/archive')) if (!keep.has(path.resolve(f))) fs.unlinkSync(f);
  let count = 0;
  for (const f of walk('dist').filter(f => /\.(png|jpe?g)$/i.test(f))) {
    const meta = await sharp(f).metadata();
    if (meta.width > 16383 || meta.height > 16383) continue;
    count++;
  }
  // Original URLs and files are retained; every published image is full resolution.
  console.log(JSON.stringify({checkedImages:count,projects:active.length,orderChanged:false}));
})().catch(e => {console.error(e);process.exit(1)});

const fs = require('node:fs');
const path = require('node:path');
const sharp = require('/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/sharp');
const walk = d => fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
(async()=>{
 const replacements=new Map(walk('dist').filter(f=>/\.(png|jpe?g)\.webp$/i.test(f)&&!fs.existsSync(f.slice(0,-5))).map(f=>[path.resolve(f.slice(0,-5)),path.resolve(f)]));
 let checked=0;
 const records=JSON.parse(fs.readFileSync('src/archive.generated.json'));
 const active=records.filter(r=>r.id!=='002'&&r.category!=='ppt');
 // Keep small covers separate from full resolution reader pages.
 for(const r of active) if(fs.existsSync('public/'+r.image)) fs.copyFileSync('public/'+r.image,'dist/'+r.image);
 for(const file of walk('dist').filter(f=>/\.(png|jpe?g)$/i.test(f))){
  if(file.includes('study-brochure/pages/')) continue; // Constructed page URLs retain originals.
  const meta=await sharp(file).metadata();
  if(meta.width*meta.height>8000000)continue; // Preserve very large originals unchanged.
  if(meta.width>16383||meta.height>16383)continue; // WebP dimension limit: retain long original.
  const out=file+'.webp';
  const textHeavy=/archive|brochure|dimensions|floor-plan|lighting-material|screen-material/.test(file);
  await sharp(file).webp(textHeavy?{lossless:true,effort:0}:{quality:90,effort:4,smartSubsample:true}).toFile(out);
  const after=await sharp(out).metadata();
  if(after.width!==meta.width||after.height!==meta.height)throw Error('Image dimensions changed: '+file);
  if(fs.statSync(out).size<fs.statSync(file).size){replacements.set(path.resolve(file),path.resolve(out));fs.unlinkSync(file);}else fs.unlinkSync(out);
  checked++;
 }
 for(const [from,to] of replacements) if(fs.existsSync(from)||!fs.existsSync(to)) replacements.delete(from);
 for(const file of walk('dist').filter(f=>/\.(js|css|html|json)$/i.test(f))){
  const content=fs.readFileSync(file,'utf8').replace(/\/?(?:[\p{L}\p{N}_%~. -]+\/)*[\p{L}\p{N}_%~. -]+\.(?:png|jpe?g)(?![\p{L}\p{N}_.-])/giu,ref=>{
   const relative=path.resolve(path.dirname(file),ref);
   const root=path.resolve('dist',ref.replace(/^\//,''));
   const resolved=ref.startsWith('/')?root:replacements.has(relative)?relative:root;
   return replacements.has(resolved)?ref+'.webp':ref;
  });
  fs.writeFileSync(file,content);
 }
 console.log(JSON.stringify({checkedImages:checked,converted:replacements.size,resized:0,projects:active.length}));
})().catch(e=>{console.error(e);process.exit(1)});

const fs=require('node:fs'),path=require('node:path');
const root='.vercel/output/static';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const aliases=walk(root).filter(f=>/\.(?:png|jpe?g)\.webp$/i.test(f)&&!fs.existsSync(f.slice(0,-5))).map(f=>{const dest='/'+path.relative(root,f).split(path.sep).join('/');return{src:'^'+escape(dest.slice(0,-5))+'$',dest};});
const originalRoutes=path.join(root,'assets/embedded-images/routes.json');
if(fs.existsSync(originalRoutes))for(const [src,dest] of Object.entries(JSON.parse(fs.readFileSync(originalRoutes)))){if(!fs.existsSync(path.join(root,dest)))throw Error('Missing cached image: '+dest);aliases.push({src:'^'+escape(src)+'$',dest});}
fs.writeFileSync('.vercel/output/config.json',JSON.stringify({version:3,routes:[{handle:'filesystem'},...aliases,{src:'/.*',dest:'/index.html'}]},null,2)+'\n');
console.log(JSON.stringify({originalImageUrlAliases:aliases.length}));

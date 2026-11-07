const fs = require('node:fs');
const path = require('node:path');
const dataFile = 'src/archive.generated.json';
const records = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const original = JSON.stringify(records.map(({image, ...record}) => record));
const normalize = name => name.replace(/\.(?:png|jpe?g|webp|pdf)$/i, '').replace(/封面|\s/g, '');
let matched = 0;
for (const record of records) {
  const directory = path.join('作品集整理', record.category);
  if (!fs.existsSync(directory)) continue;
  const title = record.category === '画册' && record.title === '企业画册1' ? '企业画册' : record.title;
  const covers = fs.readdirSync(directory).filter(name => /封面/.test(name) && /\.(png|jpe?g|webp)$/i.test(name) && normalize(name) === normalize(title));
  if (covers.length > 1) throw new Error(`Multiple named covers: ${record.title}`);
  if (!covers.length) continue;
  const filename = covers[0];
  const target = `assets/archive/named-cover-${record.id}${path.extname(filename).toLowerCase()}`;
  fs.copyFileSync(path.join(directory, filename), path.join('public', target));
  record.image = target;
  matched++;
  console.log(`${record.id}: ${record.title} ← ${filename}`);
}
if (JSON.stringify(records.map(({image, ...record}) => record)) !== original) throw new Error('Project order or detail content changed');
fs.writeFileSync(dataFile, JSON.stringify(records, null, 2) + '\n');
console.log(JSON.stringify({namedCovers: matched,orderChanged:false,detailPagesChanged:false}));

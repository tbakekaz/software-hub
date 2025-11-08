import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.cwd(), 'lib/i18n');
if (!fs.existsSync(dir)) {
  console.log('i18n dir not found, skip');
  process.exit(0);
}

const files = ['zh.ts', 'kk.ts', 'ru.ts', 'en.ts'].map((f) => path.join(dir, f));
const dicts = files
  .filter((f) => fs.existsSync(f))
  .map((f) => ({ name: path.basename(f), mod: require('node:module').createRequire(import.meta.url)(f) }));

if (dicts.length < 2) {
  console.log('Not enough dictionaries to compare.');
  process.exit(0);
}

function flatten(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    const nk = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') Object.assign(acc, flatten(v, nk));
    else acc[nk] = true;
    return acc;
  }, {});
}

const base = dicts[0];
const baseKeys = Object.keys(flatten(base.mod.default || base.mod));
let ok = true;
for (const d of dicts.slice(1)) {
  const keys = Object.keys(flatten(d.mod.default || d.mod));
  const missing = baseKeys.filter((k) => !keys.includes(k));
  if (missing.length) {
    ok = false;
    console.log(`Missing keys in ${d.name}:`, missing);
  }
}
if (ok) console.log('i18n dictionaries are consistent.');





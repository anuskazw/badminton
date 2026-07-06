const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../db/database.json');
const dest = path.resolve(__dirname, '../public/database.json');

if (!fs.existsSync(src)) {
  console.error('Error: db/database.json no encontrado');
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('✓ public/database.json actualizado desde db/database.json');

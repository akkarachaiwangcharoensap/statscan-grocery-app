#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const src = path.resolve(process.cwd(), 'public', 'grocery-app-logo.png');
const outDir = path.resolve(process.cwd(), 'public');

const targets = [
  { name: 'apple-touch-icon-180.png', size: 180 },
  { name: 'apple-touch-icon-167.png', size: 167 },
  { name: 'apple-touch-icon-152.png', size: 152 },
  { name: 'apple-touch-icon-120.png', size: 120 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'android-chrome-192.png', size: 192 },
  { name: 'android-chrome-512.png', size: 512 }
];

async function run() {
  if (!fs.existsSync(src)) {
    console.error(`Source icon not found at ${src}. Please add 'public/grocery-app-logo.png' and re-run.`);
    process.exit(1);
  }

  for (const t of targets) {
    const outPath = path.join(outDir, t.name);
    try {
      await sharp(src)
        .resize(t.size, t.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ quality: 90 })
        .toFile(outPath);
      console.log(`Generated ${t.name}`);
    } catch (err) {
      console.error(`Failed to generate ${t.name}:`, err);
    }
  }

  console.log('Icon generation complete.');
}

run();

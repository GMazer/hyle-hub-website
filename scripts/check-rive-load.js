import fs from 'fs';
import path from 'path';

const rivePath = path.resolve('public', 'galaxy.riv');

try {
  const buffer = fs.readFileSync(rivePath);
  const header = buffer.subarray(0, 4).toString('utf8');

  if (header !== 'RIVE') {
    console.error(`[check-rive-load] Invalid header "${header}" for ${rivePath}`);
    process.exit(1);
  }

  console.log(`[check-rive-load] OK: ${rivePath} (${buffer.length} bytes)`);
} catch (error) {
  console.error(`[check-rive-load] Failed to read ${rivePath}`, error);
  process.exit(1);
}

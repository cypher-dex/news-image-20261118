// News image of Wednesday 18 November 2026: entry.png beside this file, rendered from
// poster.html with headless Chrome at 1024x1024. Writes it to /output/entry.png, or to
// $MAKEFUN_OUTPUT_DIR when that is set.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const image = readFileSync(new URL('./entry.png', import.meta.url));

// The gate takes a whole PNG of at most 1 MiB and 1024x1024: fail loudly here rather
// than ship a file it would refuse.
const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
if (!signature.every((byte, i) => image[i] === byte)) throw new Error('entry.png is not a PNG');
if (image.length > 1048576) throw new Error(`entry.png is ${image.length} bytes, over 1 MiB`);
const [width, height] = [image.readUInt32BE(16), image.readUInt32BE(20)];
if (width > 1024 || height > 1024) throw new Error(`entry.png is ${width}x${height}, over 1024x1024`);
const iend = image.subarray(image.length - 12);
if (iend.toString('latin1', 4, 8) !== 'IEND') throw new Error('entry.png is truncated: no IEND chunk at its end');

writeFileSync(join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png'), image);

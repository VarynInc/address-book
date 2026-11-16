import { readFileSync, writeFileSync } from 'node:fs';

const packagePath = new URL('../package.json', import.meta.url);
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const version = packageJson.version.match(/^(\d+)\.(\d+)\.(\d+)$/);

if (!version) throw new Error(`Cannot increment unsupported package version: ${packageJson.version}`);

packageJson.version = `${version[1]}.${version[2]}.${Number(version[3]) + 1}`;
writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log(`Package version updated to ${packageJson.version}`);

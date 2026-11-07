import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';

// Every commit gets its own version: <major>.<minor> from package.json, patch = commit count.
// Example: package.json 1.0.0 + 42 commits -> 1.0.42
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

let commit = 'development';
let commitCount = null;
let committedAt = null;
let branch = null;
try {
  commit = git('rev-parse', '--short', 'HEAD');
  committedAt = git('log', '-1', '--format=%cI');
  branch = process.env.WORKERS_CI_BRANCH || process.env.GITHUB_HEAD_REF || git('rev-parse', '--abbrev-ref', 'HEAD');
  // A shallow clone only knows the last few commits, so its count would be wrong.
  if (git('rev-parse', '--is-shallow-repository') !== 'true') commitCount = Number(git('rev-list', '--count', 'HEAD'));
} catch {}

const [major = '0', minor = '0', patch = '0'] = String(pkg.version).split('.');
const version = commitCount === null ? `${major}.${minor}.${patch}` : `${major}.${minor}.${commitCount}`;
const builtAt = new Date().toISOString();
const buildId = `${builtAt.replace(/\D/g, '').slice(0, 14)}-${commit}`;
const info = { version, buildId, commit, branch, committedAt, builtAt };

mkdirSync('src/app/core/version', { recursive: true });
writeFileSync('src/app/core/version/build-info.ts', `export const BUILD_INFO = ${JSON.stringify(info)} as const;\n`);
writeFileSync('public/version.json', JSON.stringify({ ...info, releasedAt: builtAt, releaseNotes: [] }, null, 2));
console.log(`Odivon ${version} (${commit})`);

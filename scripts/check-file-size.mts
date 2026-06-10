import fs from 'node:fs';
import path from 'node:path';

type FileCategory = 'component' | 'hook' | 'util' | 'test';

const limits: Record<FileCategory, number> = {
  component: 200,
  hook: 150,
  util: 200,
  test: 800,
};

const ignored = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  'coverage',
  '.codebase-memory',
  'logs',
]);

const shouldIgnore = (filePath: string) => {
  const parts = filePath.split(path.sep);
  return parts.some(part => ignored.has(part));
};

const getLimit = (filePath: string) => {
  const fileName = path.basename(filePath);
  const normalized = filePath.split(path.sep).join('/');

  if (fileName.includes('.test.') || fileName.includes('.spec.')) {
    return limits.test;
  }

  if (normalized.includes('/hooks/') || /^use[A-Z]/.test(fileName)) {
    return limits.hook;
  }

  if (
    normalized.includes('/utils/') ||
    normalized.includes('/lib/') ||
    fileName.endsWith('.utils.ts')
  ) {
    return limits.util;
  }

  if (fileName.endsWith('.tsx')) {
    return limits.component;
  }

  return null;
};

const walk = (dir: string): string[] => {
  return fs.readdirSync(dir).flatMap((item: string) => {
    const fullPath = path.join(dir, item);

    if (shouldIgnore(fullPath)) {
      return [];
    }

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      return walk(fullPath);
    }

    return [fullPath];
  });
};

const isRootDir = () => {
  const cwd = process.cwd();
  return (
    fs.existsSync(path.join(cwd, 'backend/package.json')) &&
    fs.existsSync(path.join(cwd, 'frontend/package.json')) &&
    fs.existsSync(path.join(cwd, 'shared/package.json'))
  );
};

const dirsToScan = isRootDir() ? ['backend', 'frontend', 'shared'] : ['.'];

const files = dirsToScan.flatMap(dir => walk(dir));

let failed = false;

for (const file of files) {
  const limit = getLimit(file);

  if (!limit) {
    continue;
  }

  const lines = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter((line: string) => line.trim().length > 0).length;

  if (lines > limit) {
    console.log(`❌ ${file}: ${lines} lines (limit ${limit})`);
    failed = true;
  }
}

const noExitCode = process.argv.includes('--no-exit-code');

if (failed) {
  if (!noExitCode) {
    process.exit(1);
  }
} else {
  console.log('✅ File sizes OK');
}

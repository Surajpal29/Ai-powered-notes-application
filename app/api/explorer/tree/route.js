import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const WORKSPACE_ROOT = process.cwd();
const IGNORED_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  '.env',
  '.env.*',
  '*.log',
];

async function buildTree(dir) {
  try {
    const items = await fs.readdir(dir);
    const tree = [];

    for (const item of items) {
      // Skip ignored files/folders
      if (IGNORED_PATTERNS.some(pattern => {
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace('*', '.*'));
          return regex.test(item);
        }
        return item === pattern;
      })) {
        continue;
      }

      const itemPath = path.join(dir, item);
      const relativePath = path.relative(WORKSPACE_ROOT, itemPath);
      const stats = await fs.stat(itemPath);

      if (stats.isDirectory()) {
        const children = await buildTree(itemPath);
        tree.push({
          name: item,
          path: relativePath,
          type: 'folder',
          children,
        });
      } else {
        tree.push({
          name: item,
          path: relativePath,
          type: 'file',
          size: stats.size,
          lastModified: stats.mtime,
        });
      }
    }

    // Sort folders first, then files, both alphabetically
    return tree.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'folder' ? -1 : 1;
    });
  } catch (error) {
    console.error('Error building tree:', error);
    return [];
  }
}

export async function GET() {
  try {
    const tree = await buildTree(WORKSPACE_ROOT);
    return NextResponse.json(tree);
  } catch (error) {
    console.error('Error in GET /api/explorer/tree:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file tree' },
      { status: 500 }
    );
  }
} 
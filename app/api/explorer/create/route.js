import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const WORKSPACE_ROOT = process.cwd();

export async function POST(request) {
  try {
    const { name, type, parentPath } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Ensure valid name (no special characters except - and _)
    if (!/^[a-zA-Z0-9-_.]+$/.test(name)) {
      return NextResponse.json(
        { error: 'Invalid name. Use only letters, numbers, hyphens, and underscores' },
        { status: 400 }
      );
    }

    const targetPath = parentPath
      ? path.join(WORKSPACE_ROOT, parentPath, name)
      : path.join(WORKSPACE_ROOT, name);

    // Ensure the target path is within workspace
    if (!targetPath.startsWith(WORKSPACE_ROOT)) {
      return NextResponse.json(
        { error: 'Access denied: Target location is outside workspace' },
        { status: 403 }
      );
    }

    // Check if path already exists
    try {
      await fs.access(targetPath);
      return NextResponse.json(
        { error: \`A \${type} with this name already exists\` },
        { status: 400 }
      );
    } catch {
      // Path doesn't exist, we can proceed
    }

    if (type === 'folder') {
      await fs.mkdir(targetPath);
    } else {
      await fs.writeFile(targetPath, '', 'utf-8');
    }

    return NextResponse.json({
      message: \`\${type} created successfully\`,
      path: path.relative(WORKSPACE_ROOT, targetPath),
    });
  } catch (error) {
    console.error('Error in POST /api/explorer/create:', error);
    return NextResponse.json(
      { error: 'Failed to create item', details: error.message },
      { status: 500 }
    );
  }
} 
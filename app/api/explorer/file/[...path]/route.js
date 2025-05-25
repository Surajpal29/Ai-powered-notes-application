import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const WORKSPACE_ROOT = process.cwd();

// Get file content
export async function GET(request, { params }) {
  try {
    const filePath = path.join(WORKSPACE_ROOT, ...params.path);

    // Ensure the file is within workspace
    if (!filePath.startsWith(WORKSPACE_ROOT)) {
      return NextResponse.json(
        { error: 'Access denied: File is outside workspace' },
        { status: 403 }
      );
    }

    const content = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error in GET /api/explorer/file/[...path]:', error);
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: error.code === 'ENOENT' ? 404 : 500 }
    );
  }
}

// Update file content
export async function PUT(request, { params }) {
  try {
    const filePath = path.join(WORKSPACE_ROOT, ...params.path);

    // Ensure the file is within workspace
    if (!filePath.startsWith(WORKSPACE_ROOT)) {
      return NextResponse.json(
        { error: 'Access denied: File is outside workspace' },
        { status: 403 }
      );
    }

    const { content } = await request.json();
    await fs.writeFile(filePath, content, 'utf-8');
    return NextResponse.json({ message: 'File updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/explorer/file/[...path]:', error);
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: error.code === 'ENOENT' ? 404 : 500 }
    );
  }
}

// Delete file
export async function DELETE(request, { params }) {
  try {
    const filePath = path.join(WORKSPACE_ROOT, ...params.path);

    // Ensure the file is within workspace
    if (!filePath.startsWith(WORKSPACE_ROOT)) {
      return NextResponse.json(
        { error: 'Access denied: File is outside workspace' },
        { status: 403 }
      );
    }

    await fs.unlink(filePath);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/explorer/file/[...path]:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: error.code === 'ENOENT' ? 404 : 500 }
    );
  }
} 
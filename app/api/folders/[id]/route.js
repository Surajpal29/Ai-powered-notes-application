import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Folder from '@/models/folder';
import Note from '@/models/note';
import { options } from '../../auth/[...nextauth]/options';

// Get a specific folder
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const folder = await Folder.findOne({
      _id: params.id,
      userId: session.user.id,
      isDeleted: false,
    }).select('-__v');

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json(folder);
  } catch (error) {
    console.error(`Error in GET /api/folders/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch folder', details: error.message },
      { status: 500 }
    );
  }
}

// Update a folder
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { name, description, color, icon, parentId } = data;

    await connectDB();

    const folder = await Folder.findOne({
      _id: params.id,
      userId: session.user.id,
      isDeleted: false,
    });

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Check for duplicate folder name in the same parent
    if (name && name !== folder.name) {
      const existingFolder = await Folder.findOne({
        userId: session.user.id,
        name: name.trim(),
        parentId: parentId || null,
        _id: { $ne: params.id },
        isDeleted: false,
      });

      if (existingFolder) {
        return NextResponse.json(
          { error: 'A folder with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Check if parent folder exists and belongs to user
    if (parentId && parentId !== folder.parentId?.toString()) {
      const parentFolder = await Folder.findOne({
        _id: parentId,
        userId: session.user.id,
        isDeleted: false,
      });

      if (!parentFolder) {
        return NextResponse.json(
          { error: 'Parent folder not found' },
          { status: 404 }
        );
      }

      // Prevent circular reference
      if (parentId === params.id) {
        return NextResponse.json(
          { error: 'Cannot set folder as its own parent' },
          { status: 400 }
        );
      }
    }

    const updatedFolder = await Folder.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name: name?.trim() || folder.name,
          description: description?.trim(),
          color: color || folder.color,
          icon: icon || folder.icon,
          parentId: parentId || null,
        },
      },
      { new: true }
    ).select('-__v');

    return NextResponse.json(updatedFolder);
  } catch (error) {
    console.error(`Error in PATCH /api/folders/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update folder', details: error.message },
      { status: 500 }
    );
  }
}

// Delete a folder
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const folderId = params.id;
    const folder = await Folder.findOne({
      _id: folderId,
      userId: session.user.id,
    });

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Move all notes in this folder to root (no folder)
    await Note.updateMany(
      { folderId: folderId },
      { $set: { folderId: null } }
    );

    // Delete the folder
    await Folder.findByIdAndDelete(folderId);

    return NextResponse.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/folders/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete folder', details: error.message },
      { status: 500 }
    );
  }
} 
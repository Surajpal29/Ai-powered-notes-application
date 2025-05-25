import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Folder from '@/models/folder';
import { options } from '../auth/[...nextauth]/options';

// Get all folders for the current user
export async function GET() {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const folders = await Folder.find({
      userId: session.user.id,
      isDeleted: false,
    })
      .sort({ name: 1 })
      .select('-__v')
      .lean();

    return NextResponse.json(folders);
  } catch (error) {
    console.error('Error in GET /api/folders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folders', details: error.message },
      { status: 500 }
    );
  }
}

// Create a new folder
export async function POST(request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { name, description, color, icon, parentId } = data;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if parent folder exists and belongs to user
    if (parentId) {
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
    }

    // Check for duplicate folder name in the same parent
    const existingFolder = await Folder.findOne({
      userId: session.user.id,
      name: name.trim(),
      parentId: parentId || null,
      isDeleted: false,
    });

    if (existingFolder) {
      return NextResponse.json(
        { error: 'A folder with this name already exists' },
        { status: 400 }
      );
    }

    const folder = await Folder.create({
      userId: session.user.id,
      name: name.trim(),
      description: description?.trim(),
      color,
      icon,
      parentId: parentId || null,
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/folders:', error);
    return NextResponse.json(
      { error: 'Failed to create folder', details: error.message },
      { status: 500 }
    );
  }
} 
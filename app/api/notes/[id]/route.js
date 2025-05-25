import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Note from '@/models/note';
import { options } from '../../auth/[...nextauth]/options';

// Get a specific note
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const note = await Note.findOne({
      _id: params.id,
      userId: session.user.id,
      isDeleted: false,
    }).select('-__v');

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error(`Error in GET /api/notes/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch note', details: error.message },
      { status: 500 }
    );
  }
}

// Update a note
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, content, contentHtml, tags, folderId, isFavorite, isArchived } = data;

    await connectDB();

    const note = await Note.findOne({
      _id: params.id,
      userId: session.user.id,
      isDeleted: false,
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const updates = {};

    // Only update fields that are provided
    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();
    if (contentHtml !== undefined) updates.contentHtml = contentHtml;
    if (tags !== undefined) updates.tags = tags.map(tag => tag.trim());
    if (folderId !== undefined) updates.folderId = folderId;
    if (isFavorite !== undefined) updates.isFavorite = isFavorite;
    if (isArchived !== undefined) updates.isArchived = isArchived;

    const updatedNote = await Note.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true }
    ).select('-__v');

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error(`Error in PATCH /api/notes/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update note', details: error.message },
      { status: 500 }
    );
  }
}

// Delete a note
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const note = await Note.findOne({
      _id: params.id,
      userId: session.user.id,
      isDeleted: false,
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Soft delete the note
    await Note.findByIdAndUpdate(params.id, { isDeleted: true });

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(`Error in DELETE /api/notes/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete note', details: error.message },
      { status: 500 }
    );
  }
} 
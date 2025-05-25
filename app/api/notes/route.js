import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Note from '@/models/note';
import { options } from '../auth/[...nextauth]/options';

// Get all notes for the current user
export async function GET(request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      console.error('No user session found in API route');
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');
    const query = searchParams.get('query');
    const sortBy = searchParams.get('sortBy');
    const isFavorite = searchParams.get('isFavorite');
    const hasAI = searchParams.get('hasAI');
    const shared = searchParams.get('shared');
    const isDeleted = searchParams.get('isDeleted');

    console.log('API Request params:', {
      userId: session.user.id,
      folderId,
      query,
      sortBy,
      isFavorite,
      hasAI,
      shared,
      isDeleted
    });

    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError.message },
        { status: 500 }
      );
    }

    const filter = {
      userId: session.user.id,
      isDeleted: isDeleted === 'true',
    };

    // Add folder filter if specified
    if (folderId) {
      filter.folderId = folderId;
    }

    // Add favorite filter
    if (isFavorite === 'true') {
      filter.isFavorite = true;
    }

    // Add AI filter
    if (hasAI === 'true') {
      filter.hasAI = true;
    }

    // Add shared filter
    if (shared === 'true') {
      filter.shared = true;
    }

    // Add search filter if specified
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ];
    }

    console.log('MongoDB filter:', filter);

    // Determine sort order
    let sortOptions = { updatedAt: -1 }; // Default sort by last updated
    switch (sortBy) {
      case 'title':
        sortOptions = { title: 1 }; // Sort alphabetically
        break;
      case 'created':
        sortOptions = { createdAt: -1 }; // Sort by creation date, newest first
        break;
      case 'modified':
      case 'recent':
      default:
        sortOptions = { updatedAt: -1 }; // Sort by last modified, newest first
        break;
    }

    console.log('MongoDB sort options:', sortOptions);

    const notes = await Note.find(filter)
      .sort(sortOptions)
      .populate('folder', 'name')
      .select('-__v')
      .lean();

    console.log(`Found ${notes.length} notes`);
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Detailed API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch notes',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Create a new note
export async function POST(request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, content, contentHtml, tags, folderId } = data;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const note = await Note.create({
      userId: session.user.id,
      title: title.trim(),
      content: content.trim(),
      contentHtml: contentHtml || content.trim(),
      tags: tags?.map(tag => tag.trim()) || [],
      folderId: folderId || null,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/notes:', error);
    return NextResponse.json(
      { error: 'Failed to create note', details: error.message },
      { status: 500 }
    );
  }
} 
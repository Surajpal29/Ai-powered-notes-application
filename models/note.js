import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null, // null means root folder
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
  },
  contentHtml: {
    type: String, // Store rendered HTML content
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isFavorite: {
    type: Boolean,
    default: false,
  },
  hasAI: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
  }],
}, {
  timestamps: true,
});

// Create compound indexes for better query performance
noteSchema.index({ userId: 1, isDeleted: 1 });
noteSchema.index({ userId: 1, folderId: 1, isDeleted: 1 });
noteSchema.index({ userId: 1, isFavorite: 1 });
noteSchema.index({ userId: 1, updatedAt: -1 });

// Only create the model if it doesn't exist
const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);

export default Note; 
import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Folder name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    default: '#6B7280', // Default gray color
  },
  icon: {
    type: String,
    default: 'folder', // Default icon name
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null, // null means root folder
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

// Create compound indexes for better query performance
folderSchema.index({ userId: 1, parentId: 1, isDeleted: 1 });
folderSchema.index({ userId: 1, name: 1 });

const Folder = mongoose.models.Folder || mongoose.model('Folder', folderSchema);

export default Folder; 
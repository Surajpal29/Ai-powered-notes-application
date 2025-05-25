import { useState } from "react";
import { format } from "date-fns";
import {
  TrashIcon,
  PencilIcon,
  StarIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

const NoteCard = ({ note, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete note");

      toast.success("Note deleted successfully");
      onDelete?.();
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFavorite = async () => {
    setIsFavoriting(true);
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFavorite: !note.isFavorite,
        }),
      });

      if (!response.ok) throw new Error("Failed to update note");

      toast.success(
        note.isFavorite ? "Removed from favorites" : "Added to favorites"
      );
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to update note");
      console.error("Error updating note:", error);
    } finally {
      setIsFavoriting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Note Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium line-clamp-1">{note.title}</h3>
          <div className="flex items-center space-x-2 ml-2">
            <button
              onClick={toggleFavorite}
              disabled={isFavoriting}
              className="text-yellow-500 hover:text-yellow-600 disabled:opacity-50"
              title={
                note.isFavorite ? "Remove from favorites" : "Add to favorites"
              }>
              {note.isFavorite ? (
                <StarIconSolid className="h-5 w-5" />
              ) : (
                <StarIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-600 disabled:opacity-50"
              title="Delete note">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <FolderIcon className="h-4 w-4 mr-1" />
            <span>{note.folderId ? "In folder" : "Root"}</span>
          </div>
          <div>{format(new Date(note.updatedAt), "MMM d, yyyy")}</div>
        </div>
      </div>

      {/* Note Content */}
      <div className="p-4">
        <div
          className="prose dark:prose-invert max-w-none line-clamp-3 text-sm"
          dangerouslySetInnerHTML={{ __html: note.contentHtml }}
        />
      </div>

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteCard;

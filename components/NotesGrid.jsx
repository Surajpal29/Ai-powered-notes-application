import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  PlusIcon,
  StarIcon as StarIconOutline,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Star, Loader, Sparkles } from "lucide-react";
import Link from "next/link";
import CreateNoteModal from "./CreateNoteModal";
import FolderModal from "./FolderModal";
import FolderTree from "./FolderTree";

const NotesGrid = ({ view = "grid", filter = "all", sortBy = "recent" }) => {
  const { data: session } = useSession();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    if (session) {
      fetchNotes();
    }
  }, [session, selectedFolderId, filter, sortBy]);

  const fetchNotes = async () => {
    try {
      if (!session?.user?.id) {
        console.error("No user session found");
        toast.error("Please sign in to view notes");
        return;
      }

      setLoading(true);
      let queryParams = new URLSearchParams();

      if (selectedFolderId) {
        queryParams.append("folderId", selectedFolderId);
      }

      switch (filter) {
        case "favorites":
          queryParams.append("isFavorite", "true");
          break;
        case "recent":
          queryParams.append("sort", "recent");
          break;
        case "ai":
          queryParams.append("hasAI", "true");
          break;
        case "shared":
          queryParams.append("shared", "true");
          break;
        case "trash":
          queryParams.append("isDeleted", "true");
          break;
      }

      // Handle different sorting options
      switch (sortBy) {
        case "title":
          queryParams.append("sortBy", "title");
          break;
        case "modified":
          queryParams.append("sortBy", "updatedAt");
          break;
        case "created":
          queryParams.append("sortBy", "createdAt");
          break;
        case "recent":
        default:
          queryParams.append("sortBy", "recent");
          break;
      }

      console.log("Fetching notes with params:", queryParams.toString());
      const response = await fetch(`/api/notes?${queryParams.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(errorData.error || "Failed to fetch notes");
      }

      const data = await response.json();
      console.log("Fetched notes:", data);
      setNotes(data);
    } catch (error) {
      console.error("Error details:", error);
      toast.error(error.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleCreateFolder = () => {
    setSelectedFolder(null);
    setIsFolderModalOpen(true);
  };

  const handleCreateNote = () => {
    setIsNoteModalOpen(true);
  };

  const handleNoteCreated = () => {
    setIsNoteModalOpen(false);
    fetchNotes();
  };

  const toggleFavorite = async (noteId) => {
    try {
      const note = notes.find((n) => n._id === noteId);
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !note.isFavorite }),
      });

      if (!response.ok) throw new Error("Failed to update note");

      setNotes(
        notes.map((n) =>
          n._id === noteId ? { ...n, isFavorite: !n.isFavorite } : n
        )
      );
      toast.success(
        note.isFavorite ? "Removed from favorites" : "Added to favorites"
      );
    } catch (error) {
      toast.error("Failed to update favorite status");
      console.error("Error updating favorite:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: filter === "trash" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: filter === "trash" ? null : JSON.stringify({ isDeleted: true }),
      });

      if (!response.ok) throw new Error("Failed to delete note");

      setNotes(notes.filter((n) => n._id !== noteId));
      setActiveNote(null);
      toast.success(
        filter === "trash" ? "Note permanently deleted" : "Note moved to trash"
      );
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Error deleting note:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 dark:text-gray-400">
        <FileText className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No notes found</p>
        <p className="text-sm mt-1">Create a new note to get started</p>
        <button
          onClick={handleCreateNote}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Create Note
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Notes Content */}
      <div className="bg-transparent">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            {selectedFolderId && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing notes in selected folder
              </span>
            )}
          </div>
          <button
            onClick={handleCreateNote}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            <PlusIcon className="h-5 w-5" />
            <span>New Note</span>
          </button>
        </div>
        <AnimatePresence>
          <div
            className={`grid ${
              view === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "grid-cols-1 gap-4"
            }`}>
            {notes.map((note) => (
              <motion.div
                key={note._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 ${
                  view === "list" ? "flex items-center" : ""
                }`}>
                <Link href={`/notes/${note._id}`} className="w-full">
                  <div
                    className={`p-4 ${
                      view === "list" ? "flex items-center justify-between" : ""
                    }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2 flex-1">
                        <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {note.title || "Untitled Note"}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {note.hasAI && (
                          <Sparkles className="h-4 w-4 text-purple-500" />
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(note._id);
                          }}
                          className="text-gray-400 hover:text-yellow-500">
                          {note.isFavorite ? (
                            <StarIconSolid className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <StarIconOutline className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    {view === "grid" && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {note.content || "No content"}
                      </p>
                    )}
                    <div
                      className={`flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 ${
                        view === "grid" ? "mt-4" : "mt-0"
                      }`}>
                      <span>
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      {note.folder && (
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {note.folder.name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <CreateNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onNoteCreated={handleNoteCreated}
        folderId={selectedFolderId}
      />
      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        folder={selectedFolder}
        onSuccess={() => {
          setIsFolderModalOpen(false);
          fetchNotes();
        }}
      />
    </div>
  );
};

export default NotesGrid;

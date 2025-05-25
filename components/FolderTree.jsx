import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FolderIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const FolderTree = ({ onFolderSelect, selectedFolderId, onFolderUpdate }) => {
  const { data: session } = useSession();
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    if (session) {
      fetchFolders();
    }
  }, [session]);

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/folders");
      if (!response.ok) throw new Error("Failed to fetch folders");
      const data = await response.json();
      setFolders(data);

      // Expand the parent folder of the selected folder
      if (selectedFolderId) {
        const selectedFolder = data.find((f) => f._id === selectedFolderId);
        if (selectedFolder?.parentId) {
          setExpandedFolders(
            (prev) => new Set([...prev, selectedFolder.parentId])
          );
        }
      }
    } catch (error) {
      toast.error("Failed to load folders");
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async (folderId, e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        "Are you sure you want to delete this folder? Notes will be moved to root."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete folder");

      toast.success("Folder deleted successfully");
      fetchFolders();
      if (selectedFolderId === folderId) {
        onFolderSelect(null);
      }
      onFolderUpdate?.();
    } catch (error) {
      toast.error("Failed to delete folder");
      console.error("Error deleting folder:", error);
    }
  };

  const handleEditFolder = async (folderId, e) => {
    e.stopPropagation();
    const folder = folders.find((f) => f._id === folderId);
    if (folder) {
      setEditingFolder(folder);
      setNewFolderName(folder.name);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingFolder || !newFolderName.trim()) return;

    try {
      const response = await fetch(`/api/folders/${editingFolder._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });

      if (!response.ok) throw new Error("Failed to update folder");

      toast.success("Folder updated successfully");
      fetchFolders();
      setEditingFolder(null);
      setNewFolderName("");
      onFolderUpdate?.();
    } catch (error) {
      toast.error("Failed to update folder");
      console.error("Error updating folder:", error);
    }
  };

  const handleCreateSubfolder = async (parentId, e) => {
    e.stopPropagation();
    const name = window.prompt("Enter subfolder name:");
    if (!name) return;

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), parentId }),
      });

      if (!response.ok) throw new Error("Failed to create folder");

      toast.success("Subfolder created successfully");
      fetchFolders();
      setExpandedFolders((prev) => new Set([...prev, parentId]));
      onFolderUpdate?.();
    } catch (error) {
      toast.error("Failed to create subfolder");
      console.error("Error creating subfolder:", error);
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const buildFolderTree = (parentId = null, level = 0) => {
    const folderItems = folders.filter(
      (folder) => folder.parentId === parentId
    );

    if (!folderItems.length) return null;

    return (
      <ul className={`space-y-1 ${level > 0 ? "ml-4" : ""}`}>
        <AnimatePresence>
          {folderItems.map((folder) => {
            const hasChildren = folders.some((f) => f.parentId === folder._id);
            const isExpanded = expandedFolders.has(folder._id);
            const isSelected = folder._id === selectedFolderId;
            const isEditing = editingFolder?._id === folder._id;

            return (
              <motion.li
                key={folder._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}>
                <div
                  className={`group flex items-center space-x-1 p-1 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800
                    ${isSelected ? "bg-blue-100 dark:bg-blue-900" : ""}`}
                  onClick={() => onFolderSelect(folder._id)}>
                  {hasChildren ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFolder(folder._id);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      {isExpanded ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <span className="w-6" />
                  )}
                  <FolderIcon
                    className={`h-5 w-5 ${
                      isSelected
                        ? "text-blue-600"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  {isEditing ? (
                    <form onSubmit={handleSaveEdit} className="flex-1">
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        autoFocus
                        onBlur={handleSaveEdit}
                      />
                    </form>
                  ) : (
                    <span className="text-sm truncate flex-1">
                      {folder.name}
                    </span>
                  )}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCreateSubfolder(folder._id, e)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500"
                      title="Create subfolder">
                      <PlusIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleEditFolder(folder._id, e)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-blue-500"
                      title="Rename folder">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteFolder(folder._id, e)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-500"
                      title="Delete folder">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {isExpanded && buildFolderTree(folder._id, level + 1)}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="min-w-[200px] p-2">
      <div className="font-medium mb-2">Folders</div>
      {buildFolderTree()}
    </div>
  );
};

export default FolderTree;

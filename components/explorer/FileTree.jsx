"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Plus,
  MoreVertical,
  Trash,
  Edit,
} from "lucide-react";
import { toast } from "react-hot-toast";
import CreateNodeModal from "./CreateNodeModal";

const FileTree = ({ onFileSelect, onFolderSelect, selectedNode, onUpdate }) => {
  const [tree, setTree] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState(null);
  const [createModalParent, setCreateModalParent] = useState(null);

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    try {
      const response = await fetch("/api/explorer/tree");
      if (!response.ok) throw new Error("Failed to fetch file tree");
      const data = await response.json();
      setTree(data);
    } catch (error) {
      toast.error("Failed to load file tree");
      console.error("Error fetching file tree:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node, e) => {
    e.stopPropagation();
    if (node.type === "file") {
      onFileSelect(node);
    } else {
      onFolderSelect(node);
      toggleFolder(node.path);
    }
  };

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleContextMenu = (e, node) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      x: rect.right,
      y: rect.top,
      node,
    });
  };

  const handleCreateNode = (type, parentPath) => {
    setCreateModalType(type);
    setCreateModalParent(parentPath);
    setIsCreateModalOpen(true);
    setContextMenu(null);
  };

  const handleDeleteNode = async (node) => {
    if (!confirm(`Are you sure you want to delete this ${node.type}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/explorer/${node.type}/${encodeURIComponent(node.path)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error(`Failed to delete ${node.type}`);

      toast.success(`${node.type} deleted successfully`);
      fetchTree();
      onUpdate?.();
    } catch (error) {
      toast.error(error.message);
      console.error(`Error deleting ${node.type}:`, error);
    }
  };

  const buildTree = (nodes, level = 0) => {
    return (
      <ul className={`${level > 0 ? "ml-4" : ""}`}>
        <AnimatePresence>
          {nodes.map((node) => {
            const isExpanded = expandedFolders.has(node.path);
            const isSelected = selectedNode?.path === node.path;

            return (
              <motion.li
                key={node.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}>
                <div
                  className={`group flex items-center space-x-1 p-1.5 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isSelected ? "bg-blue-50 dark:bg-blue-900/50" : ""
                  }`}
                  onClick={(e) => handleNodeClick(node, e)}
                  onContextMenu={(e) => handleContextMenu(e, node)}>
                  {node.type === "folder" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFolder(node.path);
                      }}
                      className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <span className="w-5" />
                  )}
                  {node.type === "folder" ? (
                    <Folder className="h-5 w-5 text-blue-500" />
                  ) : (
                    <File className="h-5 w-5 text-gray-500" />
                  )}
                  <span className="text-sm truncate flex-1">{node.name}</span>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                    {node.type === "folder" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateNode("file", node.path);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        title="Create new file">
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContextMenu(e, node);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {node.type === "folder" && node.children && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}>
                    {buildTree(node.children, level + 1)}
                  </motion.div>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="relative p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Files</h2>
        <button
          onClick={() => handleCreateNode("folder", null)}
          className="p-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
          New Folder
        </button>
      </div>

      {buildTree(tree)}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}>
          {contextMenu.node.type === "folder" && (
            <button
              onClick={() => handleCreateNode("file", contextMenu.node.path)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
              New File
            </button>
          )}
          <button
            onClick={() => handleDeleteNode(contextMenu.node)}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            Delete
          </button>
        </div>
      )}

      {/* Create Modal */}
      <CreateNodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        type={createModalType}
        parentPath={createModalParent}
        onSuccess={() => {
          fetchTree();
          onUpdate?.();
        }}
      />

      {/* Click outside to close context menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default FileTree;

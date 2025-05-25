"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import Editor from "@monaco-editor/react";

const FileViewer = ({ file, onUpdate }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [file.path]);

  const fetchContent = async () => {
    try {
      const response = await fetch(
        `/api/explorer/file/${encodeURIComponent(file.path)}`
      );
      if (!response.ok) throw new Error("Failed to fetch file content");
      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      toast.error("Failed to load file content");
      console.error("Error fetching file content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `/api/explorer/file/${encodeURIComponent(file.path)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) throw new Error("Failed to save file");

      toast.success("File saved successfully");
      onUpdate?.();
    } catch (error) {
      toast.error(error.message);
      console.error("Error saving file:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/explorer/file/${encodeURIComponent(file.path)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete file");

      toast.success("File deleted successfully");
      onUpdate?.();
    } catch (error) {
      toast.error(error.message);
      console.error("Error deleting file:", error);
    }
  };

  const getLanguage = () => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const languageMap = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      go: "go",
      rs: "rust",
      rb: "ruby",
      php: "php",
      html: "html",
      css: "css",
      scss: "scss",
      less: "less",
      json: "json",
      md: "markdown",
      sql: "sql",
      yaml: "yaml",
      yml: "yaml",
      xml: "xml",
      sh: "shell",
      bash: "shell",
    };
    return languageMap[ext] || "plaintext";
  };

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div>
          <h2 className="text-lg font-medium">{file.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {file.path}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50">
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : "Save"}</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Editor
            height="100%"
            defaultLanguage={getLanguage()}
            value={content}
            onChange={setContent}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default FileViewer;

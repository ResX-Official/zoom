'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Folder, 
  File, 
  Download, 
  Trash2, 
  ArrowLeft, 
  Home,
  HardDrive,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Code
} from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: string;
  path: string;
}

interface FileBrowserProps {
  userId: string;
}

const FileBrowser = ({ userId }: FileBrowserProps) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [contents, setContents] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [pathHistory, setPathHistory] = useState<string[]>(['/']);

  useEffect(() => {
    loadDirectory('/');
  }, [userId]);

  const loadDirectory = async (path: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/files?userId=${userId}&path=${encodeURIComponent(path)}`);
      const data = await response.json();
      
      if (data.contents) {
        setContents(data.contents);
        setCurrentPath(data.path);
      }
    } catch (error) {
      console.error('Failed to load directory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToPath = (path: string) => {
    setPathHistory(prev => [...prev, path]);
    loadDirectory(path);
  };

  const goBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = [...pathHistory];
      newHistory.pop();
      const previousPath = newHistory[newHistory.length - 1];
      setPathHistory(newHistory);
      loadDirectory(previousPath);
    }
  };

  const goHome = () => {
    setPathHistory(['/']);
    loadDirectory('/');
  };

  const getFileIcon = (fileName: string, type: string) => {
    if (type === 'folder') {
      return <Folder className="w-5 h-5 text-blue-500" />;
    }

    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'txt':
      case 'md':
      case 'doc':
      case 'docx':
      case 'pdf':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return <Image className="w-5 h-5 text-green-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return <Video className="w-5 h-5 text-purple-500" />;
      case 'mp3':
      case 'wav':
      case 'flac':
        return <Music className="w-5 h-5 text-orange-500" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <Archive className="w-5 h-5 text-yellow-500" />;
      case 'js':
      case 'ts':
      case 'html':
      case 'css':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
        return <Code className="w-5 h-5 text-red-500" />;
      case 'exe':
      case 'msi':
        return <HardDrive className="w-5 h-5 text-gray-600" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return Math.round(bytes / (1024 * 1024)) + ' MB';
    return Math.round(bytes / (1024 * 1024 * 1024)) + ' GB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleFileClick = async (item: FileItem) => {
    if (item.type === 'folder') {
      navigateToPath(item.path);
    } else {
      setSelectedFile(item);
      // Try to fetch real file content if in Electron
      if (typeof window !== 'undefined' && (window as any).electronAPI && item.path) {
        try {
          const content = (window as any).electronAPI.readFile(item.path);
          if (content) {
            setFileContent(content);
          } else {
            setFileContent(`Unable to read file: ${item.name}\n\nPath: ${item.path}`);
          }
        } catch (error) {
          setFileContent(`Error reading file: ${item.name}\n\nPath: ${item.path}\n\nError: ${error}`);
        }
      } else {
        // Fallback for browser or if path not available
        setFileContent(`File: ${item.name}\n\nPath: ${item.path}\n\nSize: ${item.size} bytes\n\nModified: ${item.modified}\n\nNote: File content requires Electron app.`);
      }
    }
  };

  const handleDownload = async (item: FileItem) => {
    try {
      const response = await fetch('/api/admin/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'download_file',
          userId,
          filePath: item.path
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Create download link
        const blob = new Blob([data.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const handleDelete = async (item: FileItem) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        const response = await fetch('/api/admin/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'delete_file',
            userId,
            filePath: item.path
          })
        });
        
        const data = await response.json();
        if (data.success) {
          loadDirectory(currentPath); // Refresh current directory
        }
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <Card className="bg-dark-1 border-dark-3">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            File Explorer
          </CardTitle>
          <CardDescription className="text-gray-400">
            Browse user&apos;s files and folders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Path Navigation */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              disabled={pathHistory.length <= 1}
              className="border-dark-3 text-gray-400"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goHome}
              className="border-dark-3 text-gray-400"
            >
              <Home className="w-4 h-4" />
            </Button>
            <div className="flex-1 bg-dark-2 rounded px-3 py-2 text-sm text-gray-300">
              {currentPath}
            </div>
          </div>

          {/* File List */}
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              contents.map((item) => (
                <div
                  key={item.path}
                  className="flex items-center gap-3 p-3 rounded-lg border border-dark-3 hover:border-dark-2 cursor-pointer transition-colors"
                  onClick={() => handleFileClick(item)}
                >
                  {getFileIcon(item.name, item.type)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {item.type === 'file' 
                        ? `${formatFileSize(item.size)} • ${formatDate(item.modified)}`
                        : `Folder • ${formatDate(item.modified)}`
                      }
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.type === 'file' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item);
                          }}
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}

            {contents.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-400">
                This folder is empty
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Viewer */}
      {selectedFile && (
        <Card className="bg-dark-1 border-dark-3">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                {getFileIcon(selectedFile.name, selectedFile.type)}
                {selectedFile.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="border-gray-500 text-gray-500"
              >
                Close
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-400">
              {formatFileSize(selectedFile.size)} • {formatDate(selectedFile.modified)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-dark-2 rounded-lg p-4">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-auto max-h-96">
                {fileContent}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileBrowser;


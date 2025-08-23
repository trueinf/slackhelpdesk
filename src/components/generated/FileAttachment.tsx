"use client";

import React from 'react';
import { FileText, Image, Video, Music, Archive, Download, ExternalLink, File } from 'lucide-react';
interface FileAttachmentProps {
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    thumbnail?: string;
  };
  showPreview?: boolean;
}
export const FileAttachment = ({
  file,
  showPreview = true
}: FileAttachmentProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-5 h-5" />;
    if (type.includes('zip') || type.includes('archive')) return <Archive className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };
  const getFileColor = (type: string) => {
    if (type.startsWith('image/')) return 'text-green-600 bg-green-50 border-green-200';
    if (type.startsWith('video/')) return 'text-purple-600 bg-purple-50 border-purple-200';
    if (type.startsWith('audio/')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (type.includes('pdf')) return 'text-red-600 bg-red-50 border-red-200';
    if (type.includes('document')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (type.includes('zip') || type.includes('archive')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  // Image preview
  if (file.type.startsWith('image/') && showPreview) {
    return <div className="max-w-sm">
        <div className="relative group">
          <img src={file.thumbnail || file.url} alt={file.name} className="rounded-lg max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(file.url, '_blank')} />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ExternalLink className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <span className="truncate">{file.name}</span>
          <span className="ml-2 flex-shrink-0">{formatFileSize(file.size)}</span>
        </div>
      </div>;
  }

  // Video preview
  if (file.type.startsWith('video/') && showPreview) {
    return <div className="max-w-sm">
        <div className="relative">
          <video src={file.url} poster={file.thumbnail} controls className="rounded-lg max-h-64 w-full">
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <span className="truncate">{file.name}</span>
          <span className="ml-2 flex-shrink-0">{formatFileSize(file.size)}</span>
        </div>
      </div>;
  }

  // Generic file attachment
  return <div className={`inline-flex items-center space-x-3 p-3 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer ${getFileColor(file.type)}`}>
      <div className="flex-shrink-0">
        {getFileIcon(file.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{file.name}</div>
        <div className="text-xs opacity-75">{formatFileSize(file.size)}</div>
      </div>
      <div className="flex items-center space-x-1">
        <button onClick={() => window.open(file.url, '_blank')} className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors" title="Open file">
          <ExternalLink className="w-4 h-4" />
        </button>
        <button onClick={() => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        link.click();
      }} className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors" title="Download file">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>;
};
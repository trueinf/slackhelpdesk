import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Smile, Paperclip, AtSign, Hash, Bold, Italic, Code, X } from 'lucide-react';
interface MessageInputProps {
  onSendMessage: (content: string, files?: File[]) => void;
  placeholder?: string;
}

// @component: MessageInput
export const MessageInput = ({
  onSendMessage,
  placeholder = "Message #general"
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSend = () => {
    if (message.trim() || attachedFiles.length > 0) {
      onSendMessage(message.trim(), attachedFiles);
      setMessage('');
      setAttachedFiles([]);
      setIsExpanded(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    // Expand toolbar if message has content
    setIsExpanded(e.target.value.length > 0 || attachedFiles.length > 0);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
    setIsExpanded(true);
    e.target.value = ''; // Reset input
  };
  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    if (attachedFiles.length === 1 && !message.trim()) {
      setIsExpanded(false);
    }
  };
  const insertFormatting = (format: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = message.substring(start, end);
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `*${selectedText || 'bold text'}*`;
        break;
      case 'italic':
        formattedText = `_${selectedText || 'italic text'}_`;
        break;
      case 'code':
        formattedText = `\`${selectedText || 'code'}\``;
        break;
    }
    const newMessage = message.substring(0, start) + formattedText + message.substring(end);
    setMessage(newMessage);

    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + formattedText.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // @return
  return <div className="border-t border-gray-200 bg-white">
      <div className="px-4 py-3">
        {/* File Attachments */}
        {attachedFiles.length > 0 && <div className="mb-3 space-y-2">
            {attachedFiles.map((file, index) => <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                </div>
                <button onClick={() => removeFile(index)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>)}
          </div>}

        {/* Formatting Toolbar */}
        {isExpanded && <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-100">
            <button onClick={() => insertFormatting('bold')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button onClick={() => insertFormatting('italic')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Italic">
              <Italic className="w-4 h-4" />
            </button>
            <button onClick={() => insertFormatting('code')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Code">
              <Code className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
              <AtSign className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors">
              <Hash className="w-4 h-4" />
            </button>
          </div>}
        
        {/* Input Area */}
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea ref={textareaRef} value={message} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder={placeholder} className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2.5 pr-20 focus:outline-none focus:ring-2 focus:ring-slack-accent focus:border-transparent text-sm leading-5 min-h-[44px] max-h-32" rows={1} />
            
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors">
                <Smile className="w-4 h-4" />
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button onClick={handleSend} disabled={!message.trim() && attachedFiles.length === 0} className={`p-2.5 rounded-lg transition-all ${message.trim() || attachedFiles.length > 0 ? 'bg-slack-accent hover:bg-opacity-90 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Helper Text */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>
            <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line
          </span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar" />
    </div>;
};
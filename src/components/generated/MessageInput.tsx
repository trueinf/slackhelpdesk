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
  return <div className="border-t border-gray-200 bg-white" data-magicpath-id="0" data-magicpath-path="MessageInput.tsx">
      <div className="px-4 py-3" data-magicpath-id="1" data-magicpath-path="MessageInput.tsx">
        {/* File Attachments */}
        {attachedFiles.length > 0 && <div className="mb-3 space-y-2" data-magicpath-id="2" data-magicpath-path="MessageInput.tsx">
            {attachedFiles.map((file, index) => <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2" data-magicpath-id="3" data-magicpath-path="MessageInput.tsx">
                <div className="flex items-center space-x-2" data-magicpath-id="4" data-magicpath-path="MessageInput.tsx">
                  <Paperclip className="w-4 h-4 text-gray-500" data-magicpath-id="5" data-magicpath-path="MessageInput.tsx" />
                  <span className="text-sm text-gray-700 truncate" data-magicpath-id="6" data-magicpath-path="MessageInput.tsx">{file.name}</span>
                  <span className="text-xs text-gray-500" data-magicpath-id="7" data-magicpath-path="MessageInput.tsx">({formatFileSize(file.size)})</span>
                </div>
                <button onClick={() => removeFile(index)} className="p-1 hover:bg-gray-200 rounded transition-colors" data-magicpath-id="8" data-magicpath-path="MessageInput.tsx">
                  <X className="w-4 h-4 text-gray-500" data-magicpath-id="9" data-magicpath-path="MessageInput.tsx" />
                </button>
              </div>)}
          </div>}

        {/* Formatting Toolbar */}
        {isExpanded && <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-100" data-magicpath-id="10" data-magicpath-path="MessageInput.tsx">
            <button onClick={() => insertFormatting('bold')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Bold" data-magicpath-id="11" data-magicpath-path="MessageInput.tsx">
              <Bold className="w-4 h-4" data-magicpath-id="12" data-magicpath-path="MessageInput.tsx" />
            </button>
            <button onClick={() => insertFormatting('italic')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Italic" data-magicpath-id="13" data-magicpath-path="MessageInput.tsx">
              <Italic className="w-4 h-4" data-magicpath-id="14" data-magicpath-path="MessageInput.tsx" />
            </button>
            <button onClick={() => insertFormatting('code')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Code" data-magicpath-id="15" data-magicpath-path="MessageInput.tsx">
              <Code className="w-4 h-4" data-magicpath-id="16" data-magicpath-path="MessageInput.tsx" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" data-magicpath-id="17" data-magicpath-path="MessageInput.tsx"></div>
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" data-magicpath-id="18" data-magicpath-path="MessageInput.tsx">
              <AtSign className="w-4 h-4" data-magicpath-id="19" data-magicpath-path="MessageInput.tsx" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" data-magicpath-id="20" data-magicpath-path="MessageInput.tsx">
              <Hash className="w-4 h-4" data-magicpath-id="21" data-magicpath-path="MessageInput.tsx" />
            </button>
          </div>}
        
        {/* Input Area */}
        <div className="flex items-end space-x-3" data-magicpath-id="22" data-magicpath-path="MessageInput.tsx">
          <div className="flex-1 relative" data-magicpath-id="23" data-magicpath-path="MessageInput.tsx">
            <textarea ref={textareaRef} value={message} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder={placeholder} className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2.5 pr-20 focus:outline-none focus:ring-2 focus:ring-slack-accent focus:border-transparent text-sm leading-5 min-h-[44px] max-h-32" rows={1} data-magicpath-id="24" data-magicpath-path="MessageInput.tsx" />
            
            <div className="absolute right-2 bottom-2 flex items-center space-x-1" data-magicpath-id="25" data-magicpath-path="MessageInput.tsx">
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors" data-magicpath-id="26" data-magicpath-path="MessageInput.tsx">
                <Smile className="w-4 h-4" data-magicpath-id="27" data-magicpath-path="MessageInput.tsx" />
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors" data-magicpath-id="28" data-magicpath-path="MessageInput.tsx">
                <Paperclip className="w-4 h-4" data-magicpath-id="29" data-magicpath-path="MessageInput.tsx" />
              </button>
            </div>
          </div>
          
          <button onClick={handleSend} disabled={!message.trim() && attachedFiles.length === 0} className={`p-2.5 rounded-lg transition-all ${message.trim() || attachedFiles.length > 0 ? 'bg-slack-accent hover:bg-opacity-90 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} data-magicpath-id="30" data-magicpath-path="MessageInput.tsx">
            <Send className="w-4 h-4" data-magicpath-id="31" data-magicpath-path="MessageInput.tsx" />
          </button>
        </div>
        
        {/* Helper Text */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500" data-magicpath-id="32" data-magicpath-path="MessageInput.tsx">
          <span data-magicpath-id="33" data-magicpath-path="MessageInput.tsx">
            <strong data-magicpath-id="34" data-magicpath-path="MessageInput.tsx">Enter</strong> to send, <strong data-magicpath-id="35" data-magicpath-path="MessageInput.tsx">Shift + Enter</strong> for new line
          </span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar" data-magicpath-id="36" data-magicpath-path="MessageInput.tsx" />
    </div>;
};
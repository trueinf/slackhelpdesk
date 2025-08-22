import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Smile, Paperclip, AtSign, Hash, Bold, Italic, Code } from 'lucide-react';
interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

// @component: MessageInput
export const MessageInput = ({
  onSendMessage
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
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
    setIsExpanded(e.target.value.length > 0);
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

  // @return
  return <div className="border-t border-gray-200 bg-white" data-magicpath-id="0" data-magicpath-path="MessageInput.tsx">
      <div className="px-4 py-3" data-magicpath-id="1" data-magicpath-path="MessageInput.tsx">
        {isExpanded && <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-100" data-magicpath-id="2" data-magicpath-path="MessageInput.tsx">
            <button onClick={() => insertFormatting('bold')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Bold" data-magicpath-id="3" data-magicpath-path="MessageInput.tsx">
              <Bold className="w-4 h-4" data-magicpath-id="4" data-magicpath-path="MessageInput.tsx" />
            </button>
            <button onClick={() => insertFormatting('italic')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Italic" data-magicpath-id="5" data-magicpath-path="MessageInput.tsx">
              <Italic className="w-4 h-4" data-magicpath-id="6" data-magicpath-path="MessageInput.tsx" />
            </button>
            <button onClick={() => insertFormatting('code')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Code" data-magicpath-id="7" data-magicpath-path="MessageInput.tsx">
              <Code className="w-4 h-4" data-magicpath-id="8" data-magicpath-path="MessageInput.tsx" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" data-magicpath-id="9" data-magicpath-path="MessageInput.tsx"></div>
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" data-magicpath-id="10" data-magicpath-path="MessageInput.tsx">
              <AtSign className="w-4 h-4" data-magicpath-id="11" data-magicpath-path="MessageInput.tsx" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" data-magicpath-id="12" data-magicpath-path="MessageInput.tsx">
              <Hash className="w-4 h-4" data-magicpath-id="13" data-magicpath-path="MessageInput.tsx" />
            </button>
          </div>}
        
        <div className="flex items-end space-x-3" data-magicpath-id="14" data-magicpath-path="MessageInput.tsx">
          <div className="flex-1 relative" data-magicpath-id="15" data-magicpath-path="MessageInput.tsx">
            <textarea ref={textareaRef} value={message} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Message #general" className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-5 min-h-[40px] max-h-32" rows={1} data-magicpath-id="16" data-magicpath-path="MessageInput.tsx" />
            
            <div className="absolute right-2 bottom-2 flex items-center space-x-1" data-magicpath-id="17" data-magicpath-path="MessageInput.tsx">
              <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors" data-magicpath-id="18" data-magicpath-path="MessageInput.tsx">
                <Smile className="w-4 h-4" data-magicpath-id="19" data-magicpath-path="MessageInput.tsx" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors" data-magicpath-id="20" data-magicpath-path="MessageInput.tsx">
                <Paperclip className="w-4 h-4" data-magicpath-id="21" data-magicpath-path="MessageInput.tsx" />
              </button>
            </div>
          </div>
          
          <button onClick={handleSend} disabled={!message.trim()} className={`p-2 rounded-lg transition-all ${message.trim() ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} data-magicpath-id="22" data-magicpath-path="MessageInput.tsx">
            <Send className="w-4 h-4" data-magicpath-id="23" data-magicpath-path="MessageInput.tsx" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500" data-magicpath-id="24" data-magicpath-path="MessageInput.tsx">
          <span data-magicpath-id="25" data-magicpath-path="MessageInput.tsx">
            <strong data-magicpath-id="26" data-magicpath-path="MessageInput.tsx">Enter</strong> to send, <strong data-magicpath-id="27" data-magicpath-path="MessageInput.tsx">Shift + Enter</strong> for new line
          </span>
        </div>
      </div>
    </div>;
};
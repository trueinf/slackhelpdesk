import React, { useState } from 'react';
import { MoreHorizontal, MessageSquare, Smile, Reply } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
  reactions: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  threadCount?: number;
}
interface MessageItemProps {
  message: Message;
  onAddReaction: (messageId: string, emoji: string) => void;
  showAvatar: boolean;
}
const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '💯'];

// @component: MessageItem
export const MessageItem = ({
  message,
  onAddReaction,
  showAvatar
}: MessageItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\*[^*]+\*|_[^_]+_|`[^`]+`|https?:\/\/[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={index} className="font-bold" data-magicpath-id="0" data-magicpath-path="MessageItem.tsx">{part.slice(1, -1)}</strong>;
      } else if (part.startsWith('_') && part.endsWith('_')) {
        return <em key={index} className="italic" data-magicpath-id="1" data-magicpath-path="MessageItem.tsx">{part.slice(1, -1)}</em>;
      } else if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono" data-magicpath-id="2" data-magicpath-path="MessageItem.tsx">
            {part.slice(1, -1)}
          </code>;
      } else if (part.match(/https?:\/\/[^\s]+/)) {
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" data-magicpath-id="3" data-magicpath-path="MessageItem.tsx">
            {part}
          </a>;
      }
      return part;
    });
  };

  // @return
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.2
  }} className={`group relative px-4 py-2 hover:bg-gray-50 transition-colors ${showAvatar ? 'mt-4' : 'mt-0.5'}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => {
    setIsHovered(false);
    setShowEmojiPicker(false);
  }} data-magicpath-id="4" data-magicpath-path="MessageItem.tsx">
      <div className="flex space-x-3" data-magicpath-id="5" data-magicpath-path="MessageItem.tsx">
        <div className="flex-shrink-0 w-10" data-magicpath-id="6" data-magicpath-path="MessageItem.tsx">
          {showAvatar ? <img src={message.avatar} alt={message.username} className="w-10 h-10 rounded-full object-cover" data-magicpath-id="7" data-magicpath-path="MessageItem.tsx" /> : <div className="w-10 h-10 flex items-center justify-center text-xs text-gray-400 hover:text-gray-600 transition-colors" data-magicpath-id="8" data-magicpath-path="MessageItem.tsx">
              {formatTime(message.timestamp)}
            </div>}
        </div>
        
        <div className="flex-1 min-w-0" data-magicpath-id="9" data-magicpath-path="MessageItem.tsx">
          {showAvatar && <div className="flex items-center space-x-2 mb-1" data-magicpath-id="10" data-magicpath-path="MessageItem.tsx">
              <span className="font-semibold text-gray-900" data-magicpath-id="11" data-magicpath-path="MessageItem.tsx">{message.username}</span>
              <span className="text-xs text-gray-500" data-magicpath-id="12" data-magicpath-path="MessageItem.tsx">
                {formatTime(message.timestamp)}
              </span>
            </div>}
          
          <div className="text-gray-900 leading-relaxed break-words" data-magicpath-id="13" data-magicpath-path="MessageItem.tsx">
            {renderMessageContent(message.content)}
          </div>
          
          {message.reactions.length > 0 && <div className="flex flex-wrap gap-1 mt-2" data-magicpath-id="14" data-magicpath-path="MessageItem.tsx">
              {message.reactions.map((reaction, index) => <button key={index} onClick={() => onAddReaction(message.id, reaction.emoji)} className="flex items-center space-x-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full text-sm transition-colors" data-magicpath-id="15" data-magicpath-path="MessageItem.tsx">
                  <span data-magicpath-id="16" data-magicpath-path="MessageItem.tsx">{reaction.emoji}</span>
                  <span className="text-blue-600 font-medium" data-magicpath-id="17" data-magicpath-path="MessageItem.tsx">{reaction.count}</span>
                </button>)}
            </div>}
          
          {message.threadCount && message.threadCount > 0 && <button className="flex items-center space-x-2 mt-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors" data-magicpath-id="18" data-magicpath-path="MessageItem.tsx">
              <MessageSquare className="w-4 h-4" data-magicpath-id="19" data-magicpath-path="MessageItem.tsx" />
              <span data-magicpath-id="20" data-magicpath-path="MessageItem.tsx">{message.threadCount} replies</span>
            </button>}
        </div>
      </div>
      
      {isHovered && <div className="absolute top-0 right-4 flex items-center space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1" data-magicpath-id="21" data-magicpath-path="MessageItem.tsx">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Add reaction" data-magicpath-id="22" data-magicpath-path="MessageItem.tsx">
            <Smile className="w-4 h-4" data-magicpath-id="23" data-magicpath-path="MessageItem.tsx" />
          </button>
          
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" data-magicpath-id="24" data-magicpath-path="MessageItem.tsx">
            <Reply className="w-4 h-4" data-magicpath-id="25" data-magicpath-path="MessageItem.tsx" />
          </button>
          
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" data-magicpath-id="26" data-magicpath-path="MessageItem.tsx">
            <MoreHorizontal className="w-4 h-4" data-magicpath-id="27" data-magicpath-path="MessageItem.tsx" />
          </button>
        </div>}
      
      <AnimatePresence data-magicpath-id="28" data-magicpath-path="MessageItem.tsx">
        {showEmojiPicker && <motion.div initial={{
        opacity: 0,
        scale: 0.9,
        y: -10
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.9,
        y: -10
      }} transition={{
        duration: 0.15
      }} className="absolute top-8 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10" data-magicpath-id="29" data-magicpath-path="MessageItem.tsx">
            <div className="grid grid-cols-4 gap-1" data-magicpath-id="30" data-magicpath-path="MessageItem.tsx">
              {COMMON_EMOJIS.map(emoji => <button key={emoji} onClick={() => {
            onAddReaction(message.id, emoji);
            setShowEmojiPicker(false);
          }} className="p-2 hover:bg-gray-100 rounded text-lg transition-colors" data-magicpath-id="31" data-magicpath-path="MessageItem.tsx">
                  {emoji}
                </button>)}
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
};
import React, { useState } from 'react';
import { MoreHorizontal, MessageSquare, Smile, Reply, Pin, Copy, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileAttachment } from './FileAttachment';
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
  files?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    thumbnail?: string;
  }>;
}
interface MessageItemProps {
  message: Message;
  onAddReaction: (messageId: string, emoji: string) => void;
  onOpenThread?: (message: Message) => void;
  showAvatar: boolean;
}
const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '💯'];

// @component: MessageItem
export const MessageItem = ({
  message,
  onAddReaction,
  onOpenThread,
  showAvatar
}: MessageItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  const formatFullTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\*[^*]+\*|_[^_]+_|`[^`]+`|https?:\/\/[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={index} className="font-semibold" data-magicpath-id="0" data-magicpath-path="MessageItem.tsx">{part.slice(1, -1)}</strong>;
      } else if (part.startsWith('_') && part.endsWith('_')) {
        return <em key={index} className="italic" data-magicpath-id="1" data-magicpath-path="MessageItem.tsx">{part.slice(1, -1)}</em>;
      } else if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" data-magicpath-id="2" data-magicpath-path="MessageItem.tsx">
            {part.slice(1, -1)}
          </code>;
      } else if (part.match(/https?:\/\/[^\s]+/)) {
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-slack-accent hover:underline" data-magicpath-id="3" data-magicpath-path="MessageItem.tsx">
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
  }} className={`group relative px-4 py-2 hover:bg-gray-50 transition-colors ${showAvatar ? 'mt-2' : 'mt-0.5'}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => {
    setIsHovered(false);
    setShowEmojiPicker(false);
    setShowMoreMenu(false);
  }} data-magicpath-id="4" data-magicpath-path="MessageItem.tsx">
      <div className="flex space-x-3" data-magicpath-id="5" data-magicpath-path="MessageItem.tsx">
        <div className="flex-shrink-0 w-10" data-magicpath-id="6" data-magicpath-path="MessageItem.tsx">
          {showAvatar ? <img src={message.avatar} alt={message.username} className="w-10 h-10 rounded-full object-cover" data-magicpath-id="7" data-magicpath-path="MessageItem.tsx" /> : <div className="w-10 h-10 flex items-center justify-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" title={formatFullTime(message.timestamp)} data-magicpath-id="8" data-magicpath-path="MessageItem.tsx">
              {formatTime(message.timestamp)}
            </div>}
        </div>
        
        <div className="flex-1 min-w-0" data-magicpath-id="9" data-magicpath-path="MessageItem.tsx">
          {showAvatar && <div className="flex items-center space-x-2 mb-1" data-magicpath-id="10" data-magicpath-path="MessageItem.tsx">
              <span className="font-semibold text-gray-900 hover:underline cursor-pointer" data-magicpath-id="11" data-magicpath-path="MessageItem.tsx">
                {message.username}
              </span>
              <span className="text-xs text-gray-500" title={formatFullTime(message.timestamp)} data-magicpath-id="12" data-magicpath-path="MessageItem.tsx">
                {formatTime(message.timestamp)}
              </span>
            </div>}
          
          <div className="text-gray-900 leading-relaxed break-words whitespace-pre-wrap" data-magicpath-id="13" data-magicpath-path="MessageItem.tsx">
            {renderMessageContent(message.content)}
          </div>

          {/* File Attachments */}
          {message.files && message.files.length > 0 && <div className="mt-2 space-y-2" data-magicpath-id="14" data-magicpath-path="MessageItem.tsx">
              {message.files.map(file => <FileAttachment key={file.id} file={file} data-magicpath-id="15" data-magicpath-path="MessageItem.tsx" />)}
            </div>}
          
          {/* Reactions */}
          {message.reactions.length > 0 && <div className="flex flex-wrap gap-1 mt-2" data-magicpath-id="16" data-magicpath-path="MessageItem.tsx">
              {message.reactions.map((reaction, index) => <button key={index} onClick={() => onAddReaction(message.id, reaction.emoji)} className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-colors border ${reaction.users.includes('current-user') ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`} data-magicpath-id="17" data-magicpath-path="MessageItem.tsx">
                  <span data-magicpath-id="18" data-magicpath-path="MessageItem.tsx">{reaction.emoji}</span>
                  <span className="font-medium text-xs" data-magicpath-id="19" data-magicpath-path="MessageItem.tsx">{reaction.count}</span>
                </button>)}
            </div>}
          
          {/* Thread Reply Button */}
          {message.threadCount && message.threadCount > 0 && <button onClick={() => onOpenThread?.(message)} className="flex items-center space-x-2 mt-2 px-3 py-2 text-sm text-slack-accent hover:bg-blue-50 rounded-md transition-colors" data-magicpath-id="20" data-magicpath-path="MessageItem.tsx">
              <MessageSquare className="w-4 h-4" data-magicpath-id="21" data-magicpath-path="MessageItem.tsx" />
              <span data-magicpath-id="22" data-magicpath-path="MessageItem.tsx">{message.threadCount} {message.threadCount === 1 ? 'reply' : 'replies'}</span>
            </button>}
        </div>
      </div>
      
      {/* Hover Actions */}
      {isHovered && <div className="absolute top-0 right-4 flex items-center space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1" data-magicpath-id="23" data-magicpath-path="MessageItem.tsx">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Add reaction" data-magicpath-id="24" data-magicpath-path="MessageItem.tsx">
            <Smile className="w-4 h-4" data-magicpath-id="25" data-magicpath-path="MessageItem.tsx" />
          </button>
          
          <button onClick={() => onOpenThread?.(message)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Reply in thread" data-magicpath-id="26" data-magicpath-path="MessageItem.tsx">
            <Reply className="w-4 h-4" data-magicpath-id="27" data-magicpath-path="MessageItem.tsx" />
          </button>
          
          <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="More actions" data-magicpath-id="28" data-magicpath-path="MessageItem.tsx">
            <MoreHorizontal className="w-4 h-4" data-magicpath-id="29" data-magicpath-path="MessageItem.tsx" />
          </button>
        </div>}
      
      {/* Emoji Picker */}
      <AnimatePresence data-magicpath-id="30" data-magicpath-path="MessageItem.tsx">
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
      }} className="absolute top-8 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10" data-magicpath-id="31" data-magicpath-path="MessageItem.tsx">
            <div className="grid grid-cols-4 gap-1" data-magicpath-id="32" data-magicpath-path="MessageItem.tsx">
              {COMMON_EMOJIS.map(emoji => <button key={emoji} onClick={() => {
            onAddReaction(message.id, emoji);
            setShowEmojiPicker(false);
          }} className="p-2 hover:bg-gray-100 rounded text-lg transition-colors" data-magicpath-id="33" data-magicpath-path="MessageItem.tsx">
                  {emoji}
                </button>)}
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* More Actions Menu */}
      <AnimatePresence data-magicpath-id="34" data-magicpath-path="MessageItem.tsx">
        {showMoreMenu && <motion.div initial={{
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
      }} className="absolute top-8 right-4 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]" data-magicpath-id="35" data-magicpath-path="MessageItem.tsx">
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors" data-magicpath-id="36" data-magicpath-path="MessageItem.tsx">
              <Copy className="w-4 h-4" data-magicpath-id="37" data-magicpath-path="MessageItem.tsx" />
              <span data-magicpath-id="38" data-magicpath-path="MessageItem.tsx">Copy message</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors" data-magicpath-id="39" data-magicpath-path="MessageItem.tsx">
              <Pin className="w-4 h-4" data-magicpath-id="40" data-magicpath-path="MessageItem.tsx" />
              <span data-magicpath-id="41" data-magicpath-path="MessageItem.tsx">Pin message</span>
            </button>
            {message.userId === 'current-user' && <>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors" data-magicpath-id="42" data-magicpath-path="MessageItem.tsx">
                  <Edit className="w-4 h-4" data-magicpath-id="43" data-magicpath-path="MessageItem.tsx" />
                  <span data-magicpath-id="44" data-magicpath-path="MessageItem.tsx">Edit message</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600" data-magicpath-id="45" data-magicpath-path="MessageItem.tsx">
                  <Trash2 className="w-4 h-4" data-magicpath-id="46" data-magicpath-path="MessageItem.tsx" />
                  <span data-magicpath-id="47" data-magicpath-path="MessageItem.tsx">Delete message</span>
                </button>
              </>}
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
};
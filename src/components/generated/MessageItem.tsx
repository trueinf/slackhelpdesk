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
    // Strip language identifiers from fenced code blocks like ```python, ```bash, etc.
    const codeFenceNormalized = content.replace(/```[a-zA-Z0-9_-]+/g, '```');
    // Remove timestamp header lines like "[9:47 AM] ..." or "[9:47:01 - 9:47:02] ..."
    // Remove leading "slack<Name>:" prefixes from lines
    const cleaned = codeFenceNormalized
      .split('\n')
      .map(line => {
        if (/^\s*\[[^\]]+\]/.test(line)) return '';
        return line.replace(/^\s*slack[^:]{1,80}:\s*/i, '');
      })
      .filter(l => l !== '')
      .join('\n');
    const parts = cleaned.split(/(\*[^*]+\*|_[^_]+_|`[^`]+`|https?:\/\/[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={index} className="font-semibold">{part.slice(1, -1)}</strong>;
      } else if (part.startsWith('_') && part.endsWith('_')) {
        return <em key={index} className="italic">{part.slice(1, -1)}</em>;
      } else if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">
            {part.slice(1, -1)}
          </code>;
      } else if (part.match(/https?:\/\/[^\s]+/)) {
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-slack-accent hover:underline">
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
  }}>
      <div className="flex space-x-3">
        <div className="flex-shrink-0 w-10">
          {showAvatar ? <img src={message.avatar} alt={message.username} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 flex items-center justify-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" title={formatFullTime(message.timestamp)}>
              {formatTime(message.timestamp)}
            </div>}
        </div>
        
        <div className="flex-1 min-w-0">
          {showAvatar && <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-gray-900 hover:underline cursor-pointer">
                {message.username}
              </span>
              <span className="text-xs text-gray-500" title={formatFullTime(message.timestamp)}>
                {formatTime(message.timestamp)}
              </span>
            </div>}
          
          <div className="text-gray-900 leading-relaxed break-words whitespace-pre-wrap">
            {renderMessageContent(message.content)}
          </div>

          {/* File Attachments */}
          {message.files && message.files.length > 0 && <div className="mt-2 space-y-2">
              {message.files.map(file => <FileAttachment key={file.id} file={file} />)}
            </div>}
          
          {/* Reactions */}
          {message.reactions.length > 0 && <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction, index) => <button key={index} onClick={() => onAddReaction(message.id, reaction.emoji)} className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-colors border ${reaction.users.includes('current-user') ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                  <span>{reaction.emoji}</span>
                  <span className="font-medium text-xs">{reaction.count}</span>
                </button>)}
            </div>}
          
          {/* Thread Reply Button */}
          {message.threadCount && message.threadCount > 0 && <button onClick={() => onOpenThread?.(message)} className="flex items-center space-x-2 mt-2 px-3 py-2 text-sm text-slack-accent hover:bg-blue-50 rounded-md transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span>{message.threadCount} {message.threadCount === 1 ? 'reply' : 'replies'}</span>
            </button>}
        </div>
      </div>
      
      {/* Hover Actions */}
      {isHovered && <div className="absolute top-0 right-4 flex items-center space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Add reaction">
            <Smile className="w-4 h-4" />
          </button>
          
          <button onClick={() => onOpenThread?.(message)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="Reply in thread">
            <Reply className="w-4 h-4" />
          </button>
          
          <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors" title="More actions">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>}
      
      {/* Emoji Picker */}
      <AnimatePresence>
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
      }} className="absolute top-8 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
            <div className="grid grid-cols-4 gap-1">
              {COMMON_EMOJIS.map(emoji => <button key={emoji} onClick={() => {
            onAddReaction(message.id, emoji);
            setShowEmojiPicker(false);
          }} className="p-2 hover:bg-gray-100 rounded text-lg transition-colors">
                  {emoji}
                </button>)}
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* More Actions Menu */}
      <AnimatePresence>
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
      }} className="absolute top-8 right-4 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
              <Copy className="w-4 h-4" />
              <span>Copy message</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
              <Pin className="w-4 h-4" />
              <span>Pin message</span>
            </button>
            {message.userId === 'current-user' && <>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Edit message</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete message</span>
                </button>
              </>}
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
};
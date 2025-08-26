"use client";

import React, { useState } from 'react';
import { X, Hash, Users, BookOpen } from 'lucide-react';
import { KB_ARTICLES } from '../../kb/mock-data';
import { relatedKB } from '../../kb/search';
import { KBCard } from '../kb/KBCard';
import { MessageItem } from './MessageItem';
import { MessageInput } from './MessageInput';
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
interface ThreadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  parentMessage: Message | null;
  threadMessages: Message[];
  onSendReply: (content: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
}
const MOCK_THREAD_MESSAGES: Message[] = [{
  id: 'thread1',
  userId: 'user2',
  username: 'Mike Johnson',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  content: 'Great work on the design! I especially like the color scheme.',
  timestamp: new Date(Date.now() - 1200000),
  reactions: [{
    emoji: '👍',
    count: 1,
    users: ['user1']
  }]
}, {
  id: 'thread2',
  userId: 'user1',
  username: 'Sarah Chen',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
  content: 'Thanks! I spent a lot of time getting the gradients just right.',
  timestamp: new Date(Date.now() - 900000),
  reactions: []
}, {
  id: 'thread3',
  userId: 'user4',
  username: 'Alex Thompson',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
  content: 'Should we implement this across all our products?',
  timestamp: new Date(Date.now() - 600000),
  reactions: [{
    emoji: '🤔',
    count: 2,
    users: ['user1', 'user2']
  }]
}];
export const ThreadPanel = ({
  isOpen,
  onClose,
  parentMessage,
  threadMessages = MOCK_THREAD_MESSAGES,
  onSendReply,
  onAddReaction
}: ThreadPanelProps) => {
  if (!isOpen || !parentMessage) return null;
  return <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Thread Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-gray-900">Thread</h2>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Hash className="w-4 h-4" />
            <span>general</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Parent Message */}
      <div className="border-b border-gray-200">
        <MessageItem message={parentMessage} onAddReaction={onAddReaction} showAvatar={true} />
        <div className="px-4 pb-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{threadMessages.length + 1} replies</span>
          </div>
        </div>
      </div>

      {/* Thread Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {threadMessages.map((message, index) => <MessageItem key={message.id} message={message} onAddReaction={onAddReaction} showAvatar={index === 0 || threadMessages[index - 1].userId !== message.userId} />)}
        </div>
      </div>

      {/* Related Knowledge */}
      <div className="border-t border-gray-200">
        <div className="p-3">
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium mb-2">
            <BookOpen className="w-4 h-4" /> <span>Related knowledge</span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {relatedKB(KB_ARTICLES, parentMessage.content, [], 3).map(a => (
              <KBCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </div>

      {/* Thread Input */}
      <div className="border-t border-gray-200">
        <MessageInput onSendMessage={onSendReply} placeholder="Reply to thread..." />
      </div>
    </div>;
};
import React, { useRef, useEffect } from 'react';
import { MessageItem } from './MessageItem';
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
interface MessageListProps {
  messages: Message[];
  onAddReaction: (messageId: string, emoji: string) => void;
  onOpenThread?: (message: Message) => void;
  isTyping: boolean;
  typingUser: string;
}

// @component: MessageList
export const MessageList = ({
  messages,
  onAddReaction,
  onOpenThread,
  isTyping,
  typingUser
}: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const formatDateSeparator = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };
  const shouldShowDateSeparator = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    const currentDate = new Date(currentMessage.timestamp);
    const previousDate = new Date(previousMessage.timestamp);
    return currentDate.toDateString() !== previousDate.toDateString();
  };
  const shouldShowAvatar = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;

    // Show avatar if different user or more than 5 minutes apart
    const timeDiff = currentMessage.timestamp.getTime() - previousMessage.timestamp.getTime();
    const fiveMinutes = 5 * 60 * 1000;
    return previousMessage.userId !== currentMessage.userId || timeDiff > fiveMinutes;
  };

  // @return
  return <div ref={scrollRef} className="flex-1 overflow-y-auto bg-white" style={{
    scrollBehavior: 'smooth'
  }}>
      <div className="px-4 py-4 space-y-1">
        {messages.map((message, index) => <div key={message.id}>
            {shouldShowDateSeparator(message, messages[index - 1]) && <div className="flex items-center justify-center my-6">
                <div className="flex-1 border-t border-gray-200"></div>
                <div className="px-4 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
                  {formatDateSeparator(new Date(message.timestamp))}
                </div>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>}
            
            <MessageItem message={message} onAddReaction={onAddReaction} onOpenThread={onOpenThread} showAvatar={shouldShowAvatar(message, messages[index - 1])} />
          </div>)}

        {/* Typing Indicator */}
        {isTyping && typingUser && <div className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
            animationDelay: '0.1s'
          }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
            animationDelay: '0.2s'
          }}></div>
            </div>
            <span><strong>{typingUser}</strong> is typing...</span>
          </div>}
      </div>
    </div>;
};
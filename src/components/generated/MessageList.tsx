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
}
interface MessageListProps {
  messages: Message[];
  onAddReaction: (messageId: string, emoji: string) => void;
  isTyping: boolean;
  typingUser: string;
}

// @component: MessageList
export const MessageList = ({
  messages,
  onAddReaction,
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

  // @return
  return <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-white" data-magicpath-id="0" data-magicpath-path="MessageList.tsx">
      {messages.map((message, index) => <div key={message.id} data-magicpath-id="1" data-magicpath-path="MessageList.tsx">
          {shouldShowDateSeparator(message, messages[index - 1]) && <div className="flex items-center justify-center my-6" data-magicpath-id="2" data-magicpath-path="MessageList.tsx">
              <div className="flex-1 border-t border-gray-200" data-magicpath-id="3" data-magicpath-path="MessageList.tsx"></div>
              <div className="px-4 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600" data-magicpath-id="4" data-magicpath-path="MessageList.tsx">
                {formatDateSeparator(new Date(message.timestamp))}
              </div>
              <div className="flex-1 border-t border-gray-200" data-magicpath-id="5" data-magicpath-path="MessageList.tsx"></div>
            </div>}
          
          <MessageItem message={message} onAddReaction={onAddReaction} showAvatar={index === 0 || messages[index - 1].userId !== message.userId} data-magicpath-id="6" data-magicpath-path="MessageList.tsx" />
        </div>)}

      {isTyping && typingUser && <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500" data-magicpath-id="7" data-magicpath-path="MessageList.tsx">
          <div className="flex space-x-1" data-magicpath-id="8" data-magicpath-path="MessageList.tsx">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" data-magicpath-id="9" data-magicpath-path="MessageList.tsx"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
          animationDelay: '0.1s'
        }} data-magicpath-id="10" data-magicpath-path="MessageList.tsx"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
          animationDelay: '0.2s'
        }} data-magicpath-id="11" data-magicpath-path="MessageList.tsx"></div>
          </div>
          <span data-magicpath-id="12" data-magicpath-path="MessageList.tsx">{typingUser} is typing...</span>
        </div>}
    </div>;
};
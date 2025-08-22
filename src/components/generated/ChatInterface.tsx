import React, { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
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
}
const MOCK_MESSAGES: Message[] = [{
  id: '1',
  userId: 'user1',
  username: 'Sarah Chen',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
  content: 'Hey everyone! Just wanted to share the latest updates on our project. We\'ve made significant progress this week.',
  timestamp: new Date(Date.now() - 3600000),
  reactions: [{
    emoji: '👍',
    count: 3,
    users: ['user2', 'user3', 'user4']
  }, {
    emoji: '🎉',
    count: 1,
    users: ['user2']
  }]
}, {
  id: '2',
  userId: 'user2',
  username: 'Mike Johnson',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  content: 'That\'s awesome! Can you share more details about the implementation?',
  timestamp: new Date(Date.now() - 3000000),
  reactions: []
}, {
  id: '3',
  userId: 'user3',
  username: 'Emily Rodriguez',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
  content: 'I\'ve been working on the UI components. Here\'s what I have so far:\\n\\nThe design system is looking great!',
  timestamp: new Date(Date.now() - 1800000),
  reactions: [{
    emoji: '🎨',
    count: 2,
    users: ['user1', 'user2']
  }],
  threadCount: 3
}];

// @component: ChatInterface
export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face',
      content,
      timestamp: new Date(),
      reactions: []
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate typing indicator for response
    setIsTyping(true);
    setTypingUser('Bot');
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        userId: 'bot',
        username: 'Assistant',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        content: 'Thanks for your message! I\'m here to help.',
        timestamp: new Date(),
        reactions: []
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      setTypingUser('');
    }, 2000);
  };
  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          // Remove reaction if user already reacted
          if (existingReaction.users.includes('current-user')) {
            return {
              ...message,
              reactions: message.reactions.map(r => r.emoji === emoji ? {
                ...r,
                count: r.count - 1,
                users: r.users.filter(u => u !== 'current-user')
              } : r).filter(r => r.count > 0)
            };
          } else {
            // Add user to existing reaction
            return {
              ...message,
              reactions: message.reactions.map(r => r.emoji === emoji ? {
                ...r,
                count: r.count + 1,
                users: [...r.users, 'current-user']
              } : r)
            };
          }
        } else {
          // Add new reaction
          return {
            ...message,
            reactions: [...message.reactions, {
              emoji,
              count: 1,
              users: ['current-user']
            }]
          };
        }
      }
      return message;
    }));
  };

  // @return
  return <div className="flex flex-col h-screen bg-gray-50" data-magicpath-id="0" data-magicpath-path="ChatInterface.tsx">
      <ChatHeader channelName="general" memberCount={1247} topic="Team discussions and updates" data-magicpath-id="1" data-magicpath-path="ChatInterface.tsx" />
      
      <MessageList messages={messages} onAddReaction={handleAddReaction} isTyping={isTyping} typingUser={typingUser} data-magicpath-id="2" data-magicpath-path="ChatInterface.tsx" />
      
      <MessageInput onSendMessage={handleSendMessage} data-magicpath-id="3" data-magicpath-path="ChatInterface.tsx" />
    </div>;
};
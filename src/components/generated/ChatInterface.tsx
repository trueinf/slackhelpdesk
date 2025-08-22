"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Sidebar } from './Sidebar';
import { ThreadPanel } from './ThreadPanel';
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
  content: 'I\'ve been working on the UI components. Here\'s what I have so far:\n\nThe design system is looking great!',
  timestamp: new Date(Date.now() - 1800000),
  reactions: [{
    emoji: '🎨',
    count: 2,
    users: ['user1', 'user2']
  }],
  threadCount: 3,
  files: [{
    id: 'file1',
    name: 'design-system.png',
    size: 245760,
    type: 'image/png',
    url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&h=150&fit=crop'
  }]
}, {
  id: '4',
  userId: 'user4',
  username: 'Alex Thompson',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
  content: 'Great work team! 🚀 The new features are looking solid.',
  timestamp: new Date(Date.now() - 900000),
  reactions: [{
    emoji: '🚀',
    count: 4,
    users: ['user1', 'user2', 'user3', 'current-user']
  }]
}];
export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [currentChannel, setCurrentChannel] = useState('general');
  const [currentDM, setCurrentDM] = useState<string | null>(null);
  const [threadPanelOpen, setThreadPanelOpen] = useState(false);
  const [selectedThreadMessage, setSelectedThreadMessage] = useState<Message | null>(null);
  const [channels, setChannels] = useState([{
    id: 'general',
    name: 'general',
    type: 'public' as const,
    memberCount: 1247,
    topic: 'Team discussions and updates'
  }, {
    id: 'random',
    name: 'random',
    type: 'public' as const,
    memberCount: 892,
    topic: 'Random conversations and fun stuff'
  }, {
    id: 'dev-team',
    name: 'dev-team',
    type: 'private' as const,
    memberCount: 23,
    topic: 'Development team coordination'
  }, {
    id: 'design',
    name: 'design',
    type: 'public' as const,
    memberCount: 15,
    topic: 'Design discussions and feedback'
  }, {
    id: 'marketing',
    name: 'marketing',
    type: 'private' as const,
    memberCount: 8,
    topic: 'Marketing campaigns and strategies'
  }]);
  const currentUser = {
    username: 'You',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face',
    status: 'online' as const
  };
  const handleSendMessage = (content: string, files?: File[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'You',
      avatar: currentUser.avatar,
      content,
      timestamp: new Date(),
      reactions: [],
      files: files?.map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }))
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate typing indicator for response
    setIsTyping(true);
    setTypingUser('Assistant');
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        userId: 'bot',
        username: 'Assistant',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        content: 'Thanks for your message! I\'m here to help with any questions you have.',
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
  const handleChannelSelect = (channelId: string) => {
    setCurrentChannel(channelId);
    setCurrentDM(null);
    setThreadPanelOpen(false);
  };
  const handleDMSelect = (dmId: string) => {
    setCurrentDM(dmId);
    setCurrentChannel('');
    setThreadPanelOpen(false);
  };
  const handleOpenThread = (message: Message) => {
    setSelectedThreadMessage(message);
    setThreadPanelOpen(true);
  };
  const handleSendThreadReply = (content: string) => {
    // In a real app, this would send a reply to the thread
    console.log('Thread reply:', content);
  };
  const handleChannelCreate = (channelData: {
    name: string;
    description: string;
    type: 'public' | 'private';
  }) => {
    const newChannel = {
      id: `channel-${Date.now()}`,
      name: channelData.name,
      type: channelData.type,
      memberCount: 1,
      // Just the creator initially
      topic: channelData.description || `${channelData.type === 'private' ? 'Private' : 'Public'} channel for ${channelData.name}`
    };
    setChannels(prev => [...prev, newChannel]);

    // Auto-select the new channel
    setCurrentChannel(newChannel.id);
    setCurrentDM(null);
    setThreadPanelOpen(false);

    // Clear messages for the new channel (in a real app, this would fetch channel messages)
    setMessages([]);
  };
  const handleChannelJoin = (channelId: string) => {
    // In a real app, this would make an API call to join the channel
    console.log('Joining channel:', channelId);

    // For demo purposes, we'll add some mock channels that can be joined
    const availableChannels = [{
      id: 'announcements',
      name: 'announcements',
      type: 'public' as const,
      memberCount: 1500,
      topic: 'Important company announcements and news'
    }, {
      id: 'frontend-dev',
      name: 'frontend-dev',
      type: 'public' as const,
      memberCount: 45,
      topic: 'Frontend development discussions, tips, and code reviews'
    }, {
      id: 'backend-dev',
      name: 'backend-dev',
      type: 'public' as const,
      memberCount: 38,
      topic: 'Backend development, APIs, and infrastructure'
    }, {
      id: 'ux-research',
      name: 'ux-research',
      type: 'public' as const,
      memberCount: 22,
      topic: 'User experience research, testing, and insights'
    }, {
      id: 'coffee-chat',
      name: 'coffee-chat',
      type: 'public' as const,
      memberCount: 156,
      topic: 'Casual conversations over virtual coffee ☕'
    }];
    const channelToJoin = availableChannels.find(c => c.id === channelId);
    if (channelToJoin && !channels.find(c => c.id === channelId)) {
      setChannels(prev => [...prev, channelToJoin]);
    }
  };
  const getChannelInfo = () => {
    if (currentDM) {
      return {
        name: 'Direct Message',
        memberCount: 2,
        topic: 'Private conversation'
      };
    }
    const channel = channels.find(c => c.id === currentChannel);
    return channel || channels[0]; // Fallback to first channel
  };
  const channelInfo = getChannelInfo();
  return <div className="flex h-screen bg-gray-50" data-magicpath-id="0" data-magicpath-path="ChatInterface.tsx">
      {/* Sidebar */}
      <Sidebar workspaceName="Acme Corp" currentUser={currentUser} onChannelSelect={handleChannelSelect} onDMSelect={handleDMSelect} onChannelCreate={handleChannelCreate} onChannelJoin={handleChannelJoin} data-magicpath-id="1" data-magicpath-path="ChatInterface.tsx" />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col" data-magicpath-id="2" data-magicpath-path="ChatInterface.tsx">
        <ChatHeader channelName={channelInfo.name} memberCount={channelInfo.memberCount} topic={channelInfo.topic} onOpenThread={() => setThreadPanelOpen(!threadPanelOpen)} data-magicpath-id="3" data-magicpath-path="ChatInterface.tsx" />
        
        <MessageList messages={messages} onAddReaction={handleAddReaction} onOpenThread={handleOpenThread} isTyping={isTyping} typingUser={typingUser} data-magicpath-id="4" data-magicpath-path="ChatInterface.tsx" />
        
        <MessageInput onSendMessage={handleSendMessage} placeholder={`Message #${channelInfo.name}`} data-magicpath-id="5" data-magicpath-path="ChatInterface.tsx" />
      </div>

      {/* Thread Panel */}
      <ThreadPanel isOpen={threadPanelOpen} onClose={() => setThreadPanelOpen(false)} parentMessage={selectedThreadMessage} threadMessages={[]} onSendReply={handleSendThreadReply} onAddReaction={handleAddReaction} data-magicpath-id="6" data-magicpath-path="ChatInterface.tsx" />
    </div>;
};
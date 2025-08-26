"use client";

import React, { useState } from 'react';
import { Hash, Lock, Users, Plus, ChevronDown, ChevronRight, Circle, MessageCircle, Bell, Settings, HelpCircle, Search, Edit3, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChannelCreationModal } from './ChannelCreationModal';
import { ChannelBrowser } from './ChannelBrowser';
import { BookOpen } from 'lucide-react';
interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private';
  unreadCount?: number;
  isActive?: boolean;
}
interface DirectMessage {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  unreadCount?: number;
  isActive?: boolean;
}
interface SidebarProps {
  workspaceName: string;
  currentUser: {
    username: string;
    avatar: string;
    status: 'online' | 'away' | 'offline';
  };
  onChannelSelect: (channelId: string) => void;
  onDMSelect: (dmId: string) => void;
  onChannelCreate?: (channel: {
    name: string;
    description: string;
    type: 'public' | 'private';
  }) => void;
  onChannelJoin?: (channelId: string) => void;
  onOpenKB?: () => void;
}
const MOCK_CHANNELS: Channel[] = [{
  id: 'general',
  name: 'general',
  type: 'public',
  isActive: true
}, {
  id: 'announcements',
  name: 'announcements',
  type: 'public',
  unreadCount: 3
}, {
  id: 'dev-team',
  name: 'dev-team',
  type: 'private',
  unreadCount: 1
}, {
  id: 'design',
  name: 'design',
  type: 'public'
}, {
  id: 'marketing',
  name: 'marketing',
  type: 'private'
}];
const MOCK_DMS: DirectMessage[] = [{
  id: 'dm1',
  username: 'Sarah Chen',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
  status: 'online',
  unreadCount: 2
}, {
  id: 'dm2',
  username: 'Mike Johnson',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  status: 'away'
}, {
  id: 'dm3',
  username: 'Emily Rodriguez',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
  status: 'online'
}, {
  id: 'dm4',
  username: 'Alex Thompson',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
  status: 'offline'
}, {
  id: 'dm5',
  username: 'Helpdesk Agent',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32&h=32&fit=crop&crop=face',
  status: 'online',
  unreadCount: 1
}, {
  id: 'dm6',
  username: 'IT-Helpdesk',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32&h=32&fit=crop&crop=face',
  status: 'online'
}];
export const Sidebar = ({
  workspaceName,
  currentUser,
  onChannelSelect,
  onDMSelect,
  onChannelCreate,
  onChannelJoin,
  onOpenKB
}: SidebarProps) => {
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [dmsExpanded, setDmsExpanded] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showChannelBrowser, setShowChannelBrowser] = useState(false);
  const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Circle className="w-3 h-3 fill-current text-green-500" />;
      case 'away':
        return <Circle className="w-3 h-3 fill-current text-yellow-500" />;
      case 'offline':
        return <Circle className="w-3 h-3 fill-current text-gray-400" />;
      default:
        return <Circle className="w-3 h-3 fill-current text-gray-400" />;
    }
  };
  const handleCreateChannel = (channelData: {
    name: string;
    description: string;
    type: 'public' | 'private';
  }) => {
    const newChannel: Channel = {
      id: `channel-${Date.now()}`,
      name: channelData.name,
      type: channelData.type,
      isActive: false
    };
    setChannels(prev => [...prev, newChannel]);
    onChannelCreate?.(channelData);

    // Auto-select the new channel
    onChannelSelect(newChannel.id);
  };
  return <div className="w-64 bg-slack-sidebar text-white flex flex-col h-full">
      {/* Workspace Header */}
      <div className="p-4 border-b border-slack-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded text-slack-sidebar font-bold flex items-center justify-center text-sm">
              {workspaceName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-bold text-lg truncate">{workspaceName}</h1>
            </div>
          </div>
          <button className="p-1 hover:bg-slack-hover rounded">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Quick Actions */}
        <div className="p-2 space-y-1">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-slack-hover rounded transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>Threads</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-slack-hover rounded transition-colors">
            <Bell className="w-4 h-4" />
            <span>All unreads</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-slack-hover rounded transition-colors">
            <Users className="w-4 h-4" />
            <span>Mentions & reactions</span>
          </button>
          <button onClick={() => setShowChannelBrowser(true)} className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-slack-hover rounded transition-colors">
            <Globe className="w-4 h-4" />
            <span>Browse channels</span>
          </button>
          <button onClick={onOpenKB} className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-slack-hover rounded transition-colors">
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Base</span>
          </button>
        </div>

        <div className="border-t border-slack-border my-2"></div>

        {/* Channels Section */}
        <div className="px-2">
          <button onClick={() => setChannelsExpanded(!channelsExpanded)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-slack-hover rounded transition-colors">
            <div className="flex items-center space-x-2">
              {channelsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span>Channels</span>
            </div>
            <button onClick={e => {
            e.stopPropagation();
            setShowChannelModal(true);
          }} className="p-1 hover:bg-slack-hover rounded">
              <Plus className="w-4 h-4" />
            </button>
          </button>

          <AnimatePresence>
            {channelsExpanded && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} transition={{
            duration: 0.2
          }} className="overflow-hidden">
                <div className="space-y-1 mt-1">
                  {channels.map(channel => <button key={channel.id} onClick={() => onChannelSelect(channel.id)} className={`w-full flex items-center justify-between px-6 py-1.5 text-sm hover:bg-slack-hover rounded transition-colors ${channel.isActive ? 'bg-slack-active text-white' : 'text-slack-text'}`}>
                      <div className="flex items-center space-x-2 min-w-0">
                        {channel.type === 'public' ? <Hash className="w-4 h-4 flex-shrink-0" /> : <Lock className="w-4 h-4 flex-shrink-0" />}
                        <span className="truncate">{channel.name}</span>
                      </div>
                      {channel.unreadCount && <div className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {channel.unreadCount}
                        </div>}
                    </button>)}
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>

        {/* Direct Messages Section */}
        <div className="px-2 mt-4">
          <button onClick={() => setDmsExpanded(!dmsExpanded)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-slack-hover rounded transition-colors">
            <div className="flex items-center space-x-2">
              {dmsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span>Direct messages</span>
            </div>
            <button className="p-1 hover:bg-slack-hover rounded">
              <Plus className="w-4 h-4" />
            </button>
          </button>

          <AnimatePresence>
            {dmsExpanded && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} transition={{
            duration: 0.2
          }} className="overflow-hidden">
                <div className="space-y-1 mt-1">
                  {MOCK_DMS.map(dm => <button key={dm.id} onClick={() => onDMSelect(dm.id)} className={`w-full flex items-center justify-between px-6 py-1.5 text-sm hover:bg-slack-hover rounded transition-colors ${dm.isActive ? 'bg-slack-active text-white' : 'text-slack-text'}`}>
                      <div className="flex items-center space-x-2 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img src={dm.avatar} alt={dm.username} className="w-5 h-5 rounded object-cover" />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slack-sidebar ${getStatusColor(dm.status)}`}></div>
                        </div>
                        <span className="truncate">{dm.username}</span>
                      </div>
                      {dm.unreadCount && <div className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {dm.unreadCount}
                        </div>}
                    </button>)}
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-slack-border">
        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="w-full flex items-center space-x-3 p-2 hover:bg-slack-hover rounded transition-colors">
            <div className="relative">
              <img src={currentUser.avatar} alt={currentUser.username} className="w-8 h-8 rounded object-cover" />
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slack-sidebar ${getStatusColor(currentUser.status)}`}></div>
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">{currentUser.username}</div>
              <div className="text-xs text-slack-text capitalize">{currentUser.status}</div>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: 10
          }} transition={{
            duration: 0.15
          }} className="absolute bottom-full left-0 right-0 mb-2 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Preferences</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  <span>Help</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600">
                  <span>Sign out</span>
                </button>
              </motion.div>}
          </AnimatePresence>
        </div>
      </div>

      {/* Channel Creation Modal */}
      <ChannelCreationModal isOpen={showChannelModal} onClose={() => setShowChannelModal(false)} onCreateChannel={handleCreateChannel} />

      {/* Channel Browser */}
      <ChannelBrowser isOpen={showChannelBrowser} onClose={() => setShowChannelBrowser(false)} onJoinChannel={channelId => {
      onChannelJoin?.(channelId);
      onChannelSelect(channelId);
    }} onCreateChannel={() => {
      setShowChannelBrowser(false);
      setShowChannelModal(true);
    }} currentUserId="current-user" />
    </div>;
};
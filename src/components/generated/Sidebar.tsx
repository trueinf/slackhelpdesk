"use client";

import React, { useState } from 'react';
import { Hash, Lock, Users, Plus, ChevronDown, ChevronRight, Circle, MessageCircle, Bell, Settings, HelpCircle, Search, Edit3, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChannelCreationModal } from './ChannelCreationModal';
import { ChannelBrowser } from './ChannelBrowser';
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
}
const MOCK_CHANNELS: Channel[] = [{
  id: 'general',
  name: 'general',
  type: 'public',
  isActive: true
}, {
  id: 'random',
  name: 'random',
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
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
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
}];
export const Sidebar = ({
  workspaceName,
  currentUser,
  onChannelSelect,
  onDMSelect,
  onChannelCreate,
  onChannelJoin
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
  return <div className="w-64 bg-slack-sidebar text-white flex flex-col h-full" data-magicpath-id="0" data-magicpath-path="Sidebar.tsx">
      {/* Workspace Header */}
      <div className="p-4 border-b border-slack-border" data-magicpath-id="1" data-magicpath-path="Sidebar.tsx">
        <div className="flex items-center justify-between" data-magicpath-id="2" data-magicpath-path="Sidebar.tsx">
          <div className="flex items-center space-x-2" data-magicpath-id="3" data-magicpath-path="Sidebar.tsx">
            <div className="w-8 h-8 bg-white rounded text-slack-sidebar font-bold flex items-center justify-center text-sm" data-magicpath-id="4" data-magicpath-path="Sidebar.tsx">
              {workspaceName.charAt(0).toUpperCase()}
            </div>
            <div data-magicpath-id="5" data-magicpath-path="Sidebar.tsx">
              <h1 className="font-bold text-lg truncate" data-magicpath-id="6" data-magicpath-path="Sidebar.tsx">{workspaceName}</h1>
            </div>
          </div>
          <button className="p-1 hover:bg-slack-hover rounded" data-magicpath-id="7" data-magicpath-path="Sidebar.tsx">
            <Edit3 className="w-4 h-4" data-magicpath-id="8" data-magicpath-path="Sidebar.tsx" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto" data-magicpath-id="9" data-magicpath-path="Sidebar.tsx">
        {/* Quick Actions */}
        <div className="p-2 space-y-1" data-magicpath-id="10" data-magicpath-path="Sidebar.tsx">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-slack-hover rounded transition-colors" data-magicpath-id="11" data-magicpath-path="Sidebar.tsx">
            <MessageCircle className="w-4 h-4" data-magicpath-id="12" data-magicpath-path="Sidebar.tsx" />
            <span data-magicpath-id="13" data-magicpath-path="Sidebar.tsx">Threads</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-slack-hover rounded transition-colors" data-magicpath-id="14" data-magicpath-path="Sidebar.tsx">
            <Bell className="w-4 h-4" data-magicpath-id="15" data-magicpath-path="Sidebar.tsx" />
            <span data-magicpath-id="16" data-magicpath-path="Sidebar.tsx">All unreads</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-slack-hover rounded transition-colors" data-magicpath-id="17" data-magicpath-path="Sidebar.tsx">
            <Users className="w-4 h-4" data-magicpath-id="18" data-magicpath-path="Sidebar.tsx" />
            <span data-magicpath-id="19" data-magicpath-path="Sidebar.tsx">Mentions & reactions</span>
          </button>
          <button onClick={() => setShowChannelBrowser(true)} className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-slack-hover rounded transition-colors" data-magicpath-id="20" data-magicpath-path="Sidebar.tsx">
            <Globe className="w-4 h-4" data-magicpath-id="21" data-magicpath-path="Sidebar.tsx" />
            <span data-magicpath-id="22" data-magicpath-path="Sidebar.tsx">Browse channels</span>
          </button>
        </div>

        <div className="border-t border-slack-border my-2" data-magicpath-id="23" data-magicpath-path="Sidebar.tsx"></div>

        {/* Channels Section */}
        <div className="px-2" data-magicpath-id="24" data-magicpath-path="Sidebar.tsx">
          <button onClick={() => setChannelsExpanded(!channelsExpanded)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-slack-hover rounded transition-colors" data-magicpath-id="25" data-magicpath-path="Sidebar.tsx">
            <div className="flex items-center space-x-2" data-magicpath-id="26" data-magicpath-path="Sidebar.tsx">
              {channelsExpanded ? <ChevronDown className="w-4 h-4" data-magicpath-id="27" data-magicpath-path="Sidebar.tsx" /> : <ChevronRight className="w-4 h-4" data-magicpath-id="28" data-magicpath-path="Sidebar.tsx" />}
              <span data-magicpath-id="29" data-magicpath-path="Sidebar.tsx">Channels</span>
            </div>
            <button onClick={e => {
            e.stopPropagation();
            setShowChannelModal(true);
          }} className="p-1 hover:bg-slack-hover rounded" data-magicpath-id="30" data-magicpath-path="Sidebar.tsx">
              <Plus className="w-4 h-4" data-magicpath-id="31" data-magicpath-path="Sidebar.tsx" />
            </button>
          </button>

          <AnimatePresence data-magicpath-id="32" data-magicpath-path="Sidebar.tsx">
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
          }} className="overflow-hidden" data-magicpath-id="33" data-magicpath-path="Sidebar.tsx">
                <div className="space-y-1 mt-1" data-magicpath-id="34" data-magicpath-path="Sidebar.tsx">
                  {channels.map(channel => <button key={channel.id} onClick={() => onChannelSelect(channel.id)} className={`w-full flex items-center justify-between px-6 py-1.5 text-sm hover:bg-slack-hover rounded transition-colors ${channel.isActive ? 'bg-slack-active text-white' : 'text-slack-text'}`} data-magicpath-id="35" data-magicpath-path="Sidebar.tsx">
                      <div className="flex items-center space-x-2 min-w-0" data-magicpath-id="36" data-magicpath-path="Sidebar.tsx">
                        {channel.type === 'public' ? <Hash className="w-4 h-4 flex-shrink-0" data-magicpath-id="37" data-magicpath-path="Sidebar.tsx" /> : <Lock className="w-4 h-4 flex-shrink-0" data-magicpath-id="38" data-magicpath-path="Sidebar.tsx" />}
                        <span className="truncate" data-magicpath-id="39" data-magicpath-path="Sidebar.tsx">{channel.name}</span>
                      </div>
                      {channel.unreadCount && <div className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center" data-magicpath-id="40" data-magicpath-path="Sidebar.tsx">
                          {channel.unreadCount}
                        </div>}
                    </button>)}
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>

        {/* Direct Messages Section */}
        <div className="px-2 mt-4" data-magicpath-id="41" data-magicpath-path="Sidebar.tsx">
          <button onClick={() => setDmsExpanded(!dmsExpanded)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-slack-hover rounded transition-colors" data-magicpath-id="42" data-magicpath-path="Sidebar.tsx">
            <div className="flex items-center space-x-2" data-magicpath-id="43" data-magicpath-path="Sidebar.tsx">
              {dmsExpanded ? <ChevronDown className="w-4 h-4" data-magicpath-id="44" data-magicpath-path="Sidebar.tsx" /> : <ChevronRight className="w-4 h-4" data-magicpath-id="45" data-magicpath-path="Sidebar.tsx" />}
              <span data-magicpath-id="46" data-magicpath-path="Sidebar.tsx">Direct messages</span>
            </div>
            <button className="p-1 hover:bg-slack-hover rounded" data-magicpath-id="47" data-magicpath-path="Sidebar.tsx">
              <Plus className="w-4 h-4" data-magicpath-id="48" data-magicpath-path="Sidebar.tsx" />
            </button>
          </button>

          <AnimatePresence data-magicpath-id="49" data-magicpath-path="Sidebar.tsx">
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
          }} className="overflow-hidden" data-magicpath-id="50" data-magicpath-path="Sidebar.tsx">
                <div className="space-y-1 mt-1" data-magicpath-id="51" data-magicpath-path="Sidebar.tsx">
                  {MOCK_DMS.map(dm => <button key={dm.id} onClick={() => onDMSelect(dm.id)} className={`w-full flex items-center justify-between px-6 py-1.5 text-sm hover:bg-slack-hover rounded transition-colors ${dm.isActive ? 'bg-slack-active text-white' : 'text-slack-text'}`} data-magicpath-id="52" data-magicpath-path="Sidebar.tsx">
                      <div className="flex items-center space-x-2 min-w-0" data-magicpath-id="53" data-magicpath-path="Sidebar.tsx">
                        <div className="relative flex-shrink-0" data-magicpath-id="54" data-magicpath-path="Sidebar.tsx">
                          <img src={dm.avatar} alt={dm.username} className="w-5 h-5 rounded object-cover" data-magicpath-id="55" data-magicpath-path="Sidebar.tsx" />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slack-sidebar ${getStatusColor(dm.status)}`} data-magicpath-id="56" data-magicpath-path="Sidebar.tsx"></div>
                        </div>
                        <span className="truncate" data-magicpath-id="57" data-magicpath-path="Sidebar.tsx">{dm.username}</span>
                      </div>
                      {dm.unreadCount && <div className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center" data-magicpath-id="58" data-magicpath-path="Sidebar.tsx">
                          {dm.unreadCount}
                        </div>}
                    </button>)}
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-slack-border" data-magicpath-id="59" data-magicpath-path="Sidebar.tsx">
        <div className="relative" data-magicpath-id="60" data-magicpath-path="Sidebar.tsx">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="w-full flex items-center space-x-3 p-2 hover:bg-slack-hover rounded transition-colors" data-magicpath-id="61" data-magicpath-path="Sidebar.tsx">
            <div className="relative" data-magicpath-id="62" data-magicpath-path="Sidebar.tsx">
              <img src={currentUser.avatar} alt={currentUser.username} className="w-8 h-8 rounded object-cover" data-magicpath-id="63" data-magicpath-path="Sidebar.tsx" />
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slack-sidebar ${getStatusColor(currentUser.status)}`} data-magicpath-id="64" data-magicpath-path="Sidebar.tsx"></div>
            </div>
            <div className="flex-1 text-left" data-magicpath-id="65" data-magicpath-path="Sidebar.tsx">
              <div className="font-medium text-sm" data-magicpath-id="66" data-magicpath-path="Sidebar.tsx">{currentUser.username}</div>
              <div className="text-xs text-slack-text capitalize" data-magicpath-id="67" data-magicpath-path="Sidebar.tsx">{currentUser.status}</div>
            </div>
          </button>

          <AnimatePresence data-magicpath-id="68" data-magicpath-path="Sidebar.tsx">
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
          }} className="absolute bottom-full left-0 right-0 mb-2 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 py-2 z-50" data-magicpath-id="69" data-magicpath-path="Sidebar.tsx">
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors" data-magicpath-id="70" data-magicpath-path="Sidebar.tsx">
                  <Settings className="w-4 h-4" data-magicpath-id="71" data-magicpath-path="Sidebar.tsx" />
                  <span data-magicpath-id="72" data-magicpath-path="Sidebar.tsx">Preferences</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors" data-magicpath-id="73" data-magicpath-path="Sidebar.tsx">
                  <HelpCircle className="w-4 h-4" data-magicpath-id="74" data-magicpath-path="Sidebar.tsx" />
                  <span data-magicpath-id="75" data-magicpath-path="Sidebar.tsx">Help</span>
                </button>
                <div className="border-t border-gray-200 my-1" data-magicpath-id="76" data-magicpath-path="Sidebar.tsx"></div>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600" data-magicpath-id="77" data-magicpath-path="Sidebar.tsx">
                  <span data-magicpath-id="78" data-magicpath-path="Sidebar.tsx">Sign out</span>
                </button>
              </motion.div>}
          </AnimatePresence>
        </div>
      </div>

      {/* Channel Creation Modal */}
      <ChannelCreationModal isOpen={showChannelModal} onClose={() => setShowChannelModal(false)} onCreateChannel={handleCreateChannel} data-magicpath-id="79" data-magicpath-path="Sidebar.tsx" />

      {/* Channel Browser */}
      <ChannelBrowser isOpen={showChannelBrowser} onClose={() => setShowChannelBrowser(false)} onJoinChannel={channelId => {
      onChannelJoin?.(channelId);
      onChannelSelect(channelId);
    }} onCreateChannel={() => {
      setShowChannelBrowser(false);
      setShowChannelModal(true);
    }} currentUserId="current-user" data-magicpath-id="80" data-magicpath-path="Sidebar.tsx" />
    </div>;
};
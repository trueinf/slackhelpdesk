"use client";

import React, { useState } from 'react';
import { X, Hash, Lock, Search, Users, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private';
  description: string;
  memberCount: number;
  isJoined: boolean;
  lastActivity?: Date;
  creator: string;
}
interface ChannelBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinChannel: (channelId: string) => void;
  onCreateChannel: () => void;
  currentUserId: string;
}
const MOCK_ALL_CHANNELS: Channel[] = [{
  id: 'general',
  name: 'general',
  type: 'public',
  description: 'Team discussions and updates',
  memberCount: 1247,
  isJoined: true,
  lastActivity: new Date(Date.now() - 3600000),
  creator: 'admin'
}, {
  id: 'random',
  name: 'random',
  type: 'public',
  description: 'Random conversations and fun stuff',
  memberCount: 892,
  isJoined: true,
  lastActivity: new Date(Date.now() - 7200000),
  creator: 'admin'
}, {
  id: 'announcements',
  name: 'announcements',
  type: 'public',
  description: 'Important company announcements and news',
  memberCount: 1500,
  isJoined: false,
  lastActivity: new Date(Date.now() - 86400000),
  creator: 'admin'
}, {
  id: 'frontend-dev',
  name: 'frontend-dev',
  type: 'public',
  description: 'Frontend development discussions, tips, and code reviews',
  memberCount: 45,
  isJoined: false,
  lastActivity: new Date(Date.now() - 1800000),
  creator: 'sarah.chen'
}, {
  id: 'backend-dev',
  name: 'backend-dev',
  type: 'public',
  description: 'Backend development, APIs, and infrastructure',
  memberCount: 38,
  isJoined: false,
  lastActivity: new Date(Date.now() - 3600000),
  creator: 'mike.johnson'
}, {
  id: 'ux-research',
  name: 'ux-research',
  type: 'public',
  description: 'User experience research, testing, and insights',
  memberCount: 22,
  isJoined: false,
  lastActivity: new Date(Date.now() - 14400000),
  creator: 'emily.rodriguez'
}, {
  id: 'coffee-chat',
  name: 'coffee-chat',
  type: 'public',
  description: 'Casual conversations over virtual coffee ☕',
  memberCount: 156,
  isJoined: false,
  lastActivity: new Date(Date.now() - 900000),
  creator: 'alex.thompson'
}, {
  id: 'book-club',
  name: 'book-club',
  type: 'public',
  description: 'Monthly book discussions and recommendations',
  memberCount: 67,
  isJoined: false,
  lastActivity: new Date(Date.now() - 172800000),
  creator: 'lisa.wang'
}, {
  id: 'fitness-challenge',
  name: 'fitness-challenge',
  type: 'public',
  description: 'Team fitness challenges and wellness tips',
  memberCount: 89,
  isJoined: false,
  lastActivity: new Date(Date.now() - 43200000),
  creator: 'david.kim'
}];
export const ChannelBrowser = ({
  isOpen,
  onClose,
  onJoinChannel,
  onCreateChannel,
  currentUserId
}: ChannelBrowserProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'public' | 'joined'>('all');
  const [channels, setChannels] = useState<Channel[]>(MOCK_ALL_CHANNELS);
  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase()) || channel.description.toLowerCase().includes(searchQuery.toLowerCase());
    switch (filter) {
      case 'public':
        return matchesSearch && channel.type === 'public';
      case 'joined':
        return matchesSearch && channel.isJoined;
      default:
        return matchesSearch;
    }
  });
  const handleJoinChannel = (channelId: string) => {
    setChannels(prev => prev.map(channel => channel.id === channelId ? {
      ...channel,
      isJoined: true,
      memberCount: channel.memberCount + 1
    } : channel));
    onJoinChannel(channelId);
  };
  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) {
      return 'Active now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            {/* Modal */}
            <motion.div initial={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} transition={{
          type: "spring",
          duration: 0.3
        }} className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Browse channels
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Discover and join channels in your workspace
                  </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Search and Filters */}
              <div className="p-6 border-b border-gray-200 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search channels..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                      All channels
                    </button>
                    <button onClick={() => setFilter('public')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'public' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                      Public only
                    </button>
                    <button onClick={() => setFilter('joined')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'joined' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                      Joined
                    </button>
                  </div>

                  <button onClick={onCreateChannel} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Plus className="w-4 h-4" />
                    <span>Create channel</span>
                  </button>
                </div>
              </div>

              {/* Channel List */}
              <div className="flex-1 overflow-y-auto p-6">
                {filteredChannels.length === 0 ? <div className="text-center py-12">
                    <Hash className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No channels found
                    </h3>
                    <p className="text-gray-600">
                      {searchQuery ? "Try adjusting your search or filters" : "Create a new channel to get started"}
                    </p>
                  </div> : <div className="space-y-3">
                    {filteredChannels.map(channel => <div key={channel.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-1">
                            {channel.type === 'public' ? <Hash className="w-5 h-5 text-gray-500" /> : <Lock className="w-5 h-5 text-gray-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900 truncate">
                                {channel.name}
                              </h3>
                              {channel.isJoined && <Check className="w-4 h-4 text-green-500 flex-shrink-0" />}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {channel.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{channel.memberCount.toLocaleString()} members</span>
                              </div>
                              <span>•</span>
                              <span>Last activity {formatLastActivity(channel.lastActivity!)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          {channel.isJoined ? <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700">
                              Joined
                            </span> : <button onClick={() => handleJoinChannel(channel.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                              Join
                            </button>}
                        </div>
                      </div>)}
                  </div>}
              </div>
            </motion.div>
          </motion.div>
        </>}
    </AnimatePresence>;
};
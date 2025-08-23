import React from 'react';
import { Hash, Users, Search, Info, Star, Settings, MessageSquare } from 'lucide-react';
interface ChatHeaderProps {
  channelName: string;
  memberCount: number;
  topic?: string;
  onOpenThread?: () => void;
}

// @component: ChatHeader
export const ChatHeader = ({
  channelName,
  memberCount,
  topic,
  onOpenThread
}: ChatHeaderProps) => {
  // @return
  return <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 text-gray-500" />
          <h1 className="text-lg font-bold text-gray-900 truncate">
            {channelName}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>{memberCount.toLocaleString()}</span>
        </div>

        {topic && <div className="hidden md:block">
            <span className="text-sm text-gray-600 border-l border-gray-300 pl-3 truncate max-w-md">
              {topic}
            </span>
          </div>}
      </div>

      <div className="flex items-center space-x-1">
        <button onClick={onOpenThread} className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Show thread panel">
          <MessageSquare className="w-4 h-4 text-gray-500" />
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Star className="w-4 h-4 text-gray-500" />
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Search className="w-4 h-4 text-gray-500" />
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Info className="w-4 h-4 text-gray-500" />
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Settings className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>;
};
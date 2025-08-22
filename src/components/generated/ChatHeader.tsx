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
  return <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm" data-magicpath-id="0" data-magicpath-path="ChatHeader.tsx">
      <div className="flex items-center space-x-3 flex-1 min-w-0" data-magicpath-id="1" data-magicpath-path="ChatHeader.tsx">
        <div className="flex items-center space-x-2" data-magicpath-id="2" data-magicpath-path="ChatHeader.tsx">
          <Hash className="w-5 h-5 text-gray-500" data-magicpath-id="3" data-magicpath-path="ChatHeader.tsx" />
          <h1 className="text-lg font-bold text-gray-900 truncate" data-magicpath-id="4" data-magicpath-path="ChatHeader.tsx">
            {channelName}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500" data-magicpath-id="5" data-magicpath-path="ChatHeader.tsx">
          <Users className="w-4 h-4" data-magicpath-id="6" data-magicpath-path="ChatHeader.tsx" />
          <span data-magicpath-id="7" data-magicpath-path="ChatHeader.tsx">{memberCount.toLocaleString()}</span>
        </div>

        {topic && <div className="hidden md:block" data-magicpath-id="8" data-magicpath-path="ChatHeader.tsx">
            <span className="text-sm text-gray-600 border-l border-gray-300 pl-3 truncate max-w-md" data-magicpath-id="9" data-magicpath-path="ChatHeader.tsx">
              {topic}
            </span>
          </div>}
      </div>

      <div className="flex items-center space-x-1" data-magicpath-id="10" data-magicpath-path="ChatHeader.tsx">
        <button onClick={onOpenThread} className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Show thread panel" data-magicpath-id="11" data-magicpath-path="ChatHeader.tsx">
          <MessageSquare className="w-4 h-4 text-gray-500" data-magicpath-id="12" data-magicpath-path="ChatHeader.tsx" />
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" data-magicpath-id="13" data-magicpath-path="ChatHeader.tsx">
          <Star className="w-4 h-4 text-gray-500" data-magicpath-id="14" data-magicpath-path="ChatHeader.tsx" />
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" data-magicpath-id="15" data-magicpath-path="ChatHeader.tsx">
          <Search className="w-4 h-4 text-gray-500" data-magicpath-id="16" data-magicpath-path="ChatHeader.tsx" />
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" data-magicpath-id="17" data-magicpath-path="ChatHeader.tsx">
          <Info className="w-4 h-4 text-gray-500" data-magicpath-id="18" data-magicpath-path="ChatHeader.tsx" />
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" data-magicpath-id="19" data-magicpath-path="ChatHeader.tsx">
          <Settings className="w-4 h-4 text-gray-500" data-magicpath-id="20" data-magicpath-path="ChatHeader.tsx" />
        </button>
      </div>
    </div>;
};
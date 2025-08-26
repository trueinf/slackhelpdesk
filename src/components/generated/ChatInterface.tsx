"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Sidebar } from './Sidebar';
import { ThreadPanel } from './ThreadPanel';
import { KBBrowser } from '../kb/KBBrowser';
import { KBPalette } from '../kb/KBPalette';
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
// Channel-specific message collections
const CHANNEL_MESSAGES: Record<string, Message[]> = {
  general: [{
  id: '1',
  userId: 'user1',
  username: 'Sarah Chen',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
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
  }],

  announcements: [{
    id: 'ann1',
    userId: 'admin',
    username: 'CEO - Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    content: '🎉 Exciting news! We\'ve just secured our Series B funding round of $50M! This will allow us to expand our team and accelerate product development.',
    timestamp: new Date(Date.now() - 86400000),
    reactions: [{
      emoji: '🎉',
      count: 47,
      users: ['user1', 'user2', 'user3', 'user4']
    }, {
      emoji: '🚀',
      count: 23,
      users: ['user1', 'user3']
    }]
  }, {
    id: 'ann2',
    userId: 'hr',
    username: 'HR - Lisa Wang',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    content: 'Reminder: Our quarterly all-hands meeting is scheduled for Friday at 2 PM. We\'ll be discussing Q4 goals and celebrating our recent achievements!',
    timestamp: new Date(Date.now() - 172800000),
    reactions: [{
      emoji: '📅',
      count: 12,
      users: ['user1', 'user2']
    }]
  }, {
    id: 'ann3',
    userId: 'admin',
    username: 'CTO - Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
    content: 'Security update: Please make sure to update your passwords and enable 2FA by end of this week. IT will be sending detailed instructions shortly.',
    timestamp: new Date(Date.now() - 259200000),
    reactions: [{
      emoji: '🔒',
      count: 8,
      users: ['user2', 'user3']
    }]
  }],

  'dev-team': [{
    id: 'dev1',
    userId: 'tech-lead',
    username: 'Tech Lead - Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    content: 'Morning team! Code review for the new authentication system is ready. Please check PR #247 when you have a moment.',
    timestamp: new Date(Date.now() - 7200000),
    reactions: [{
      emoji: '👀',
      count: 5,
      users: ['user1', 'user2', 'user3']
    }]
  }, {
    id: 'dev2',
    userId: 'user1',
    username: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
    content: 'The API performance improvements are looking great! Response times are down 40% across the board.',
    timestamp: new Date(Date.now() - 10800000),
    reactions: [{
      emoji: '⚡',
      count: 3,
      users: ['user2', 'user3']
    }]
  }, {
    id: 'dev3',
    userId: 'user4',
    username: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    content: 'Deployed the hotfix for the login issue. All systems are stable now. 🛠️',
    timestamp: new Date(Date.now() - 14400000),
    reactions: [{
      emoji: '✅',
      count: 4,
      users: ['user1', 'user2', 'user3']
    }]
  }],

  design: [{
    id: 'des1',
    userId: 'designer',
    username: 'Design Lead - Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    content: 'New mockups for the dashboard redesign are ready! Check out the improved user flow and let me know your thoughts.',
    timestamp: new Date(Date.now() - 5400000),
    reactions: [{
      emoji: '🎨',
      count: 6,
      users: ['user1', 'user2', 'user3']
    }],
    files: [{
      id: 'design1',
      name: 'dashboard-v2-mockups.fig',
      size: 15728640,
      type: 'application/figma',
      url: '#',
      thumbnail: 'https://via.placeholder.com/60x80/4f46e5/ffffff?text=FIG'
    }]
  }, {
    id: 'des2',
    userId: 'user2',
    username: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    content: 'Love the new color palette! The accessibility improvements make a huge difference. Great work Emily! 🌈',
    timestamp: new Date(Date.now() - 9000000),
    reactions: [{
      emoji: '💙',
      count: 4,
      users: ['user1', 'user3', 'designer']
    }]
  }],

  marketing: [{
    id: 'mrk1',
    userId: 'marketing-head',
    username: 'Marketing - Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    content: 'Q4 campaign results are in! We exceeded our targets by 25%. The new social media strategy is really paying off! 📈',
    timestamp: new Date(Date.now() - 3600000),
    reactions: [{
      emoji: '🎯',
      count: 7,
      users: ['user1', 'user2', 'user3']
    }]
  }, {
    id: 'mrk2',
    userId: 'user3',
    username: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    content: 'The product launch event planning is moving along nicely. Venue is booked and we have 200+ RSVPs already! 🎪',
    timestamp: new Date(Date.now() - 7200000),
    reactions: [{
      emoji: '🎉',
      count: 5,
      users: ['user1', 'user2', 'marketing-head']
    }]
  }]
};

// DM-specific message collections
const DM_MESSAGES: Record<string, Message[]> = {
  dm1: [{
    id: 'dm1-1',
    userId: 'user1',
    username: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
    content: 'Hey! Thanks for your help with the design review yesterday. Really appreciated your feedback!',
    timestamp: new Date(Date.now() - 7200000),
    reactions: [{
      emoji: '😊',
      count: 1,
      users: ['current-user']
    }]
  }, {
    id: 'dm1-2',
    userId: 'current-user',
    username: 'You',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face',
    content: 'No problem! The new layout looks great. Let me know if you need any other input.',
    timestamp: new Date(Date.now() - 3600000),
    reactions: []
  }],

  dm2: [{
    id: 'dm2-1',
    userId: 'user2',
    username: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    content: 'Can you look at the API integration when you get a chance? Having some issues with the authentication flow.',
    timestamp: new Date(Date.now() - 14400000),
    reactions: []
  }],

  dm3: [{
    id: 'dm3-1',
    userId: 'user3',
    username: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    content: 'Quick question about the user research findings - do you have a moment to chat?',
    timestamp: new Date(Date.now() - 1800000),
    reactions: []
  }],

  dm4: [{
    id: 'dm4-1',
    userId: 'user4',
    username: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    content: 'The quarterly presentation went really well! Thanks for all your help preparing it.',
    timestamp: new Date(Date.now() - 86400000),
    reactions: [{
      emoji: '🎉',
      count: 1,
      users: ['current-user']
    }]
  }],

  dm5: [{
    id: 'help1',
    userId: 'helpdesk',
    username: 'Helpdesk Agent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32&h=32&fit=crop&crop=face',
    content: 'Hi there! 👋 I\'m here to help you with any technical issues or questions you might have. How can I assist you today?',
    timestamp: new Date(Date.now() - 3600000),
    reactions: []
  }, {
    id: 'help2',
    userId: 'helpdesk',
    username: 'Helpdesk Agent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32&h=32&fit=crop&crop=face',
    content: 'I can help with:\n• Password resets\n• Software installations\n• Network connectivity issues\n• Account permissions\n• Hardware troubleshooting\n\nJust let me know what you need! 🔧',
    timestamp: new Date(Date.now() - 3300000),
    reactions: [{
      emoji: '👍',
      count: 1,
      users: ['current-user']
    }]
  }, {
    id: 'help3',
    userId: 'helpdesk',
    username: 'Helpdesk Agent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32&h=32&fit=crop&crop=face',
    content: '🎤 **NEW:** You can now use our voice assistant! Look for the microphone icon below to start a voice conversation. It\'s perfect for hands-free support when you\'re working on something else.',
    timestamp: new Date(Date.now() - 1800000),
    reactions: [{
      emoji: '🔥',
      count: 1,
      users: ['current-user']
    }]
  }]
  ,
  dm6: [{
    id: 'ith-1',
    userId: 'user1',
    username: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
    content: "[9:47 AM] Sarah's Initial Message\nslackSarah Chen: Hey team, I can't see Figma in my Okta apps. My design team started using it last week and I need access for our campaign reviews. Can someone help? 🙏",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    reactions: []
  }, {
    id: 'ith-2',
    userId: 'it-bot',
    username: 'IT Bot',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:01 AM] IT Bot Response\nslackIT Bot: Hi @Sarah Chen! 👋 I see you're missing the Figma tile in Okta. Let me check this for you right away.\n\n🔍 Checking your current access...",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 1000),
    reactions: []
  }, {
    id: 'ith-3',
    userId: 'system',
    username: 'System',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    content: "🤖 BEHIND THE SCENES - AGENT ORCHESTRATION\n[9:47:01 - 9:47:02] MASTER ORCHESTRATOR ACTIVATION\n```python\n{\n    \"timestamp\": \"9:47:01\",\n    \"trigger\": \"Slack webhook from #it-help\",\n    \"raw_message\": \"I can't see Figma in my Okta apps...\",\n    \"user\": \"sarah.chen@company.com\",\n    \"channel\": \"it-help\",\n    \"thread_ts\": \"1234567890.123456\"\n}\n```\n\n# Master Orchestrator routes to Knowledge & Learning Domain first\n[9:47:02 - 9:47:03] KNOWLEDGE & LEARNING DOMAIN\nKnowledge Capture Sub-Agent\n```python\ncapture_context = {\n    \"user_message\": \"can't see Figma in my Okta apps\",\n    \"extracted_intent\": \"missing_okta_tile\",\n    \"application\": \"Figma\",\n    \"platform\": \"Okta\",\n    \"channel\": \"Slack\",\n    \"historical_patterns\": [\n        \"Similar to 847 previous 'missing tile' requests\",\n        \"Figma requests increased 300% this month\"\n    ]\n}\n```\nPattern Recognition Sub-Agent\n```python\npattern_analysis = {\n    \"pattern_match\": \"OKTA_TILE_VISIBILITY_ISSUE\",\n    \"confidence\": 0.94,\n    \"similar_tickets\": 847,\n    \"resolution_success_rate\": 0.92,\n    \"avg_time_to_resolve\": \"3.2 minutes\",\n    \"recommended_flow\": \"AUTOMATED_PROVISIONING\"\n}\n```",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 2000),
    reactions: []
  }, {
    id: 'ith-4',
    userId: 'system',
    username: 'System',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:03 - 9:47:04] NLP PARSER SUB-AGENT\n```python\nparsed_request = {\n    \"intent\": \"access_request\",\n    \"sub_intent\": \"missing_application\",\n    \"entities\": {\n        \"application\": \"Figma\",\n        \"platform\": \"Okta\", \n        \"user\": \"Sarah Chen\",\n        \"department\": \"Marketing\",\n        \"urgency\": \"normal\",\n        \"business_context\": \"campaign reviews\"\n    },\n    \"sentiment\": \"polite_frustrated\",\n    \"confidence\": 0.94\n}\n```",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 3000),
    reactions: []
  }, {
    id: 'ith-5',
    userId: 'it-bot',
    username: 'IT Bot',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:06 AM] IT Bot Update in Slack\n📊 Quick update @Sarah Chen:\n\n✅ Found your profile\n✅ Verified you're in Marketing team\n⚡ Checking Figma access requirements...",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 6000),
    reactions: []
  }, {
    id: 'ith-6',
    userId: 'system',
    username: 'System',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:04 - 9:47:06] IDENTITY DOMAIN (OKTA) ACTIVATION\n```python\nuser_context = {\n    \"user\": {\n        \"name\": \"Sarah Chen\",\n        \"email\": \"sarah.chen@company.com\",\n        \"department\": \"Marketing\",\n        \"role\": \"Marketing Manager\",\n        \"manager\": \"David Kim\",\n        \"location\": \"San Francisco\",\n        \"start_date\": \"2022-03-15\",\n        \"risk_level\": \"standard\"\n    },\n    \"current_access\": {\n        \"okta_apps\": [\n            \"Slack\", \"Gmail\", \"Salesforce\", \"Box\", \n            \"Zoom\", \"Monday.com\", \"Adobe Creative\"\n        ],\n        \"missing\": [\"Figma\"],\n        \"okta_groups\": [\n            \"marketing-team\",\n            \"managers-global\",\n            \"sf-office\"\n        ]\n    },\n    \"team_access\": {\n        \"design_team_has_figma\": true,\n        \"marketing_typically_has\": false,\n        \"recent_team_additions\": [\"Jake Lee\", \"Monica Patel\"]\n    }\n}\n```",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 7000),
    reactions: []
  }, {
    id: 'ith-7',
    userId: 'system',
    username: 'System',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:06 - 9:47:08] POLICY ENGINE SUB-AGENT CHECK\n```python\npolicy_validation = {\n    \"user\": \"sarah.chen@company.com\",\n    \"requested_app\": \"Figma\",\n    \"checks\": {\n        \"role_eligible\": true,\n        \"department_approved\": true,\n        \"license_available\": true,\n        \"budget_check\": true,\n        \"compliance\": true,\n        \"manager_pre_approval\": true\n    },\n    \"decision\": \"AUTO_APPROVE\",\n    \"license_type\": \"viewer_with_comment\",\n    \"monthly_cost\": \"$0\"\n}\n```",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 9000),
    reactions: []
  }, {
    id: 'ith-8',
    userId: 'system',
    username: 'System',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:08 - 9:47:10] ACCESS CONTROL DOMAIN ACTIVATION\nApplication Provisioning Sub-Agent\n```python\nprovisioning_request = {\n    \"action\": \"provision_figma_access\",\n    \"user\": \"sarah.chen@company.com\",\n    \"steps_executed\": [\n        {\n            \"step\": \"figma_api_call\",\n            \"endpoint\": \"POST /v1/teams/members\",\n            \"payload\": {\n                \"email\": \"sarah.chen@company.com\",\n                \"role\": \"viewer_restricted\",\n                \"team_id\": \"company_marketing\"\n            },\n            \"response\": \"success\",\n            \"figma_user_id\": \"usr_789012\"\n        }\n    ]\n}\n```\nOkta Management Sub-Agent\n```python\nokta_configuration = {\n    \"step_1\": {\n        \"action\": \"assign_application\",\n        \"api_call\": \"PUT /api/v1/apps/0oa1234figma/users\",\n        \"payload\": {\n            \"id\": \"sarah.chen@company.com\",\n            \"scope\": \"USER\",\n            \"credentials\": {\n                \"userName\": \"sarah.chen@company.com\"\n            }\n        },\n        \"result\": \"success\"\n    },\n    \"step_2\": {\n        \"action\": \"configure_saml\",\n        \"attributes\": {\n            \"email\": \"sarah.chen@company.com\",\n            \"firstName\": \"Sarah\",\n            \"lastName\": \"Chen\",\n            \"role\": \"viewer\"\n        },\n        \"result\": \"configured\"\n    },\n    \"step_3\": {\n        \"action\": \"add_to_group\",\n        \"group\": \"figma-marketing-users\",\n        \"result\": \"added\"\n    }\n}\n```",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 11000),
    reactions: []
  }, {
    id: 'ith-9',
    userId: 'it-bot',
    username: 'IT Bot',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:10 AM] IT Bot Progress Update\n🎯 Good news! I'm setting up your Figma access now:\n\n✅ Figma account created\n✅ Adding to Okta dashboard\n⚙️ Configuring single sign-on...",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 12000),
    reactions: []
  }, {
    id: 'ith-10',
    userId: 'system',
    username: 'System',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:10 - 9:47:12] ACCESS VERIFICATION SUB-AGENT\n```python\nverification_steps = {\n    \"sso_test\": {\n        \"action\": \"simulate_login\",\n        \"user\": \"sarah.chen@company.com\",\n        \"flow\": [\n            \"Okta login simulation\",\n            \"SAML assertion generated\",\n            \"Figma accepts assertion\",\n            \"Session created successfully\"\n        ],\n        \"result\": \"PASSED\"\n    },\n    \"tile_visibility\": {\n        \"action\": \"verify_okta_dashboard\",\n        \"check\": \"GET /api/v1/users/sarah.chen/appLinks\",\n        \"figma_visible\": true,\n        \"position\": 12\n    },\n    \"permission_check\": {\n        \"figma_access_level\": \"viewer\",\n        \"can_comment\": true,\n        \"can_edit\": false,\n        \"team_boards_visible\": true\n    }\n}\n```",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 14000),
    reactions: []
  }, {
    id: 'ith-11',
    userId: 'system',
    username: 'System',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:12 - 9:47:13] NOTIFICATION SUB-AGENT\n```python\nnotification_queue = [\n    {\n        \"channel\": \"slack\",\n        \"recipient\": \"sarah.chen\",\n        \"thread\": \"1234567890.123456\"\n    },\n    {\n        \"channel\": \"email\",\n        \"recipient\": \"sarah.chen@company.com\",\n        \"template\": \"app_provisioned\"\n    },\n    {\n        \"channel\": \"okta\",\n        \"action\": \"push_notification\",\n        \"message\": \"New app available: Figma\"\n    }\n]\n```",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 15000),
    reactions: []
  }, {
    id: 'ith-12',
    userId: 'it-bot',
    username: 'IT Bot',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:13 AM] IT Bot Success Message\n✅ All done @Sarah Chen! Your Figma access is ready! 🎉\n\nHere's what I've set up for you:\n📱 **Figma tile** - Now visible in your Okta dashboard\n👤 **Access level** - Viewer with commenting rights\n🔐 **Login method** - Use your Okta SSO (no separate password needed)\n\n**Quick Start:**\n1. Go to https://company.okta.com\n2. You'll see the Figma tile (might need to refresh)\n3. Click it to auto-login to Figma\n4. You'll have access to all Marketing team boards\n\nNeed edit access later? Just let me know! \n\n🎯 *Resolved in: 12 seconds*",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 16000),
    reactions: []
  }, {
    id: 'ith-13',
    userId: 'user1',
    username: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:14 AM] Sarah's Response\nslackSarah Chen: Wow that was fast! I can see it now! Thanks!! 🙌",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 17000),
    reactions: []
  }, {
    id: 'ith-14',
    userId: 'it-bot',
    username: 'IT Bot',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    content: "[9:47:15 AM] IT Bot Follow-up\nAwesome! Happy to help! 😊 \n\nQuick tip: Your design team lead (Jake) can give you edit access to specific boards if needed. Enjoy Figma! \n\n_Ticket #TK-2024-8847 auto-closed_",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 18000),
    reactions: []
  }, {
    id: 'ith-15',
    userId: 'system',
    username: 'System',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    content: "📊 BEHIND THE SCENES - LEARNING & IMPROVEMENT\n[9:47:15 - 9:47:16] KNOWLEDGE & LEARNING DOMAIN - POST RESOLUTION\nKnowledge Capture Sub-Agent\n```python\ncaptured_knowledge = {\n    \"ticket_id\": \"TK-2024-8847\",\n    \"pattern\": \"Marketing manager needs Figma for reviews\",\n    \"resolution_time\": 12,\n    \"success\": true,\n    \"user_satisfaction\": \"positive\",\n    \"new_insight\": \"Marketing managers reviewing design work pattern\",\n    \"automation_worked\": true\n}\n```\nContinuous Learning Sub-Agent\n```python\nmodel_update = {\n    \"pattern_reinforced\": \"marketing_figma_access\",\n    \"confidence_adjustment\": {\n        \"before\": 0.94,\n        \"after\": 0.95\n    },\n    \"new_rule_suggested\": {\n        \"rule\": \"Auto-provision Figma viewer for all Marketing Managers\",\n        \"confidence\": 0.87,\n        \"pending_approval\": true\n    }\n}\n```\nPattern Recognition Update\n```python\ntrend_detected = {\n    \"observation\": \"30% increase in Figma requests from Marketing\",\n    \"hypothesis\": \"New design review process implemented\",\n    \"recommendation\": \"Consider bulk provisioning for Marketing dept\",\n    \"alert_sent_to\": \"IT Manager\"\n}\n```",
    timestamp: new Date(Date.now() - 1000 * 60 * 10 + 19000),
    reactions: []
  }]
};

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(CHANNEL_MESSAGES.general);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [currentChannel, setCurrentChannel] = useState('general');
  const [currentDM, setCurrentDM] = useState<string | null>(null);
  const [threadPanelOpen, setThreadPanelOpen] = useState(false);
  const [selectedThreadMessage, setSelectedThreadMessage] = useState<Message | null>(null);
  const [transcriptWs, setTranscriptWs] = useState<WebSocket | null>(null);
  const [isTranscriptActive, setIsTranscriptActive] = useState(false);
  const [channels, setChannels] = useState([{
    id: 'general',
    name: 'general',
    type: 'public' as const,
    memberCount: 1247,
    topic: 'Team discussions and updates'
  }, {
    id: 'announcements',
    name: 'announcements',
    type: 'public' as const,
    memberCount: 892,
    topic: 'Important company announcements and news'
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
  const [showKB, setShowKB] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  useEffect(() => {
    const openPalette = () => setShowPalette(true);
    window.addEventListener('open-kb-palette', openPalette as any);
    return () => window.removeEventListener('open-kb-palette', openPalette as any);
  }, []);
  const currentUser = {
    username: 'You',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face',
    status: 'online' as const
  };

  // Transcript capture functionality
  const initializeTranscriptCapture = async () => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.warn('ElevenLabs API key not found. Transcript capture disabled.');
      return;
    }

    // Debug API key (show first/last 4 characters for security)
    console.log('API Key loaded:', apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : 'NOT_FOUND');

    // Test API key with a simple request first
    try {
      console.log('Testing API key with user info request...');
      const testResponse = await fetch('https://api.elevenlabs.io/v1/user', {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey
        }
      });
      
      if (testResponse.ok) {
        const userInfo = await testResponse.json();
        console.log('API key valid - User:', userInfo.email || 'Unknown');
      } else {
        console.error('API key validation failed:', testResponse.status, await testResponse.text());
        setIsTranscriptActive(false);
        return;
      }
    } catch (error) {
      console.error('API key validation error:', error);
      setIsTranscriptActive(false);
      return;
    }

    try {
      // First, get a signed URL for the WebSocket connection
      console.log('Getting signed URL for transcript capture...');
      
      const url = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=agent_0701k38wmdtter699jn3f9vx3a2d`;
      console.log('Request URL:', url);
      console.log('Request headers:', { 'xi-api-key': `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` });
      
      const signedUrlResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', signedUrlResponse.status);
      console.log('Response headers:', Object.fromEntries(signedUrlResponse.headers.entries()));

      if (!signedUrlResponse.ok) {
        const errorText = await signedUrlResponse.text();
        console.error('Error response body:', errorText);
        throw new Error(`Failed to get signed URL: ${signedUrlResponse.status} ${signedUrlResponse.statusText}. Body: ${errorText}`);
      }

      const { signed_url } = await signedUrlResponse.json();
      console.log('Signed URL obtained, connecting to WebSocket...');

      // Create WebSocket connection using signed URL
      const ws = new WebSocket(signed_url);
      
      ws.onopen = () => {
        console.log('Transcript capture WebSocket connected');
        setIsTranscriptActive(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received transcript message:', data);
          handleTranscriptMessage(data);
        } catch (error) {
          console.error('Error parsing transcript message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('Transcript WebSocket error:', error);
        setIsTranscriptActive(false);
      };

      ws.onclose = (event) => {
        console.log('Transcript WebSocket closed', event.code, event.reason);
        setIsTranscriptActive(false);
        setTranscriptWs(null);
      };

      setTranscriptWs(ws);
    } catch (error) {
      console.error('Failed to initialize transcript capture:', error);
      setIsTranscriptActive(false);
    }
  };

  const handleTranscriptMessage = (data: any) => {
    console.log('Processing transcript message type:', data.type, data);
    
    // Handle different types of transcript messages
    if (data.type === 'conversation_initiation_metadata') {
      console.log('Transcript conversation started');
    } else if (data.type === 'audio' && data.audio_event) {
      // This is a bot response with audio
      console.log('Audio event received:', data.audio_event);
      if (data.audio_event.transcript) {
        addTranscriptToChat(data.audio_event.transcript, 'assistant');
      }
    } else if (data.type === 'user_transcript' || data.type === 'user_message') {
      // User input transcript
      console.log('User transcript received:', data.transcript || data.message);
      if (data.transcript || data.message) {
        addTranscriptToChat(data.transcript || data.message, 'user');
      }
    } else if (data.type === 'agent_response' && data.transcript) {
      // Agent response transcript
      console.log('Agent response received:', data.transcript);
      addTranscriptToChat(data.transcript, 'assistant');
    } else if (data.type === 'user_input_audio') {
      // User is speaking
      console.log('User input audio detected');
    } else if (data.type === 'agent_output_audio') {
      // Agent is responding with audio
      console.log('Agent output audio detected');
    } else if (data.type === 'conversation_end') {
      // Conversation ended
      console.log('Conversation ended');
    } else {
      console.log('Unknown message type received:', data.type, data);
    }
  };

  const addTranscriptToChat = (transcript: string, speaker: 'user' | 'assistant') => {
    const transcriptMessage: Message = {
      id: `transcript-${Date.now()}-${Math.random()}`,
      userId: speaker === 'user' ? 'current-user' : 'helpdesk-voice',
      username: speaker === 'user' ? 'You (Voice)' : 'Helpdesk Agent (Voice)',
      avatar: speaker === 'user' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32&h=32&fit=crop&crop=face',
      content: `🎤 ${transcript}`,
      timestamp: new Date(),
      reactions: []
    };

    setMessages(prev => [...prev, transcriptMessage]);
    
    // Also save to DM messages
    if (currentDM === 'dm5' && DM_MESSAGES['dm5']) {
      DM_MESSAGES['dm5'].push(transcriptMessage);
    }
  };

  const closeTranscriptCapture = () => {
    if (transcriptWs) {
      transcriptWs.close();
      setTranscriptWs(null);
      setIsTranscriptActive(false);
    }
  };

  // Effect to handle transcript capture when entering/leaving helpdesk DM
  useEffect(() => {
    if (currentDM === 'dm5') {
      // Entered helpdesk DM - start transcript capture
      initializeTranscriptCapture();
    } else {
      // Left helpdesk DM - stop transcript capture
      closeTranscriptCapture();
    }

    // Cleanup on unmount
    return () => {
      closeTranscriptCapture();
    };
  }, [currentDM]);
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
    
    // Update the channel or DM messages collection
    if (currentChannel && CHANNEL_MESSAGES[currentChannel]) {
      CHANNEL_MESSAGES[currentChannel].push(newMessage);
    } else if (currentDM && DM_MESSAGES[currentDM]) {
      DM_MESSAGES[currentDM].push(newMessage);
    }

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
      
      // Update the channel or DM messages collection
      if (currentChannel && CHANNEL_MESSAGES[currentChannel]) {
        CHANNEL_MESSAGES[currentChannel].push(botResponse);
      } else if (currentDM && DM_MESSAGES[currentDM]) {
        DM_MESSAGES[currentDM].push(botResponse);
      }
      
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
    // Load channel-specific messages
    setMessages(CHANNEL_MESSAGES[channelId] || []);
  };
  const handleDMSelect = (dmId: string) => {
    setCurrentDM(dmId);
    setCurrentChannel('');
    setThreadPanelOpen(false);
    // Load DM-specific messages
    setMessages(DM_MESSAGES[dmId] || []);
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

    // Load messages for the new channel (in a real app, this would fetch channel messages)
    setMessages(CHANNEL_MESSAGES[newChannel.id] || []);
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
      // Get the DM user name
      const dmUserMap: Record<string, {name: string, topic: string}> = {
        dm1: { name: 'Sarah Chen', topic: 'Direct message with Sarah Chen' },
        dm2: { name: 'Mike Johnson', topic: 'Direct message with Mike Johnson' },
        dm3: { name: 'Emily Rodriguez', topic: 'Direct message with Emily Rodriguez' },
        dm4: { name: 'Alex Thompson', topic: 'Direct message with Alex Thompson' },
        dm5: { name: 'Helpdesk Agent', topic: 'IT Support and Technical Assistance' },
        dm6: { name: 'IT-Helpdesk', topic: 'Automated IT helpdesk orchestration demo' }
      };
      
      const dmInfo = dmUserMap[currentDM] || { name: 'Direct Message', topic: 'Private conversation' };
      return {
        name: dmInfo.name,
        memberCount: 2,
        topic: dmInfo.topic
      };
    }
    const channel = channels.find(c => c.id === currentChannel);
    return channel || channels[0]; // Fallback to first channel
  };
  const channelInfo = getChannelInfo();
  return <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar workspaceName="Company" currentUser={currentUser} onChannelSelect={handleChannelSelect} onDMSelect={handleDMSelect} onChannelCreate={handleChannelCreate} onChannelJoin={handleChannelJoin} onOpenKB={() => setShowKB(true)} />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader channelName={channelInfo.name} memberCount={channelInfo.memberCount} topic={channelInfo.topic} onOpenThread={() => setThreadPanelOpen(!threadPanelOpen)} />
        
        <MessageList messages={messages} onAddReaction={handleAddReaction} onOpenThread={handleOpenThread} isTyping={isTyping} typingUser={typingUser} />
        
        <MessageInput onSendMessage={handleSendMessage} placeholder={`Message #${channelInfo.name}`} />
        
        {/* Knowledge Base Drawer */}
        {showKB && (
          <div className="fixed inset-0 z-40 flex">
            <div className="flex-1" onClick={() => setShowKB(false)} />
            <div className="w-[420px] bg-white border-l border-gray-200 shadow-xl">
              <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200">
                <div className="font-semibold">Knowledge Base</div>
                <button className="text-sm text-gray-500 hover:text-gray-800" onClick={() => setShowKB(false)}>Close</button>
              </div>
              <KBBrowser />
            </div>
          </div>
        )}

        {/* KB Command Palette */}
        <KBPalette isOpen={showPalette} onClose={() => setShowPalette(false)} />

        {/* ConvAI Widget for Helpdesk */}
        {currentDM === 'dm5' && (
          <div className="p-4 border-t border-gray-200 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Voice Assistant Available</h3>
                  <p className="text-sm text-gray-600">Click the microphone to start a voice conversation with our AI assistant</p>
                </div>
              </div>
              
              {/* Transcript Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isTranscriptActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-600">
                  {isTranscriptActive ? 'Transcript Active' : 'Transcript Offline'}
                </span>
              </div>
            </div>
            
            {!import.meta.env.VITE_ELEVENLABS_API_KEY && (
              <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800">
                ⚠️ Transcript capture disabled: API key not configured
              </div>
            )}
            
            <elevenlabs-convai agent-id="agent_0701k38wmdtter699jn3f9vx3a2d"></elevenlabs-convai>
          </div>
        )}
      </div>

      {/* Thread Panel */}
      <ThreadPanel isOpen={threadPanelOpen} onClose={() => setThreadPanelOpen(false)} parentMessage={selectedThreadMessage} threadMessages={[]} onSendReply={handleSendThreadReply} onAddReaction={handleAddReaction} />
    </div>;
};
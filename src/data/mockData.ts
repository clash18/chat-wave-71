export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup?: boolean;
  lastSeen?: string;
}

export interface MessageData {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isDelivered?: boolean;
  isRead?: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    lastMessage: "Hey! How's the project going?",
    timestamp: "2m",
    unreadCount: 2,
    isOnline: true,
    lastSeen: "2 minutes ago"
  },
  {
    id: "2", 
    name: "Team Alpha",
    lastMessage: "Meeting tomorrow at 10 AM",
    timestamp: "1h",
    unreadCount: 0,
    isOnline: false,
    isGroup: true,
    lastSeen: "1 hour ago"
  },
  {
    id: "3",
    name: "Mike Chen",
    lastMessage: "Thanks for the help with the code review!",
    timestamp: "3h",
    unreadCount: 0,
    isOnline: true,
    lastSeen: "Online"
  },
  {
    id: "4",
    name: "Design Team",
    lastMessage: "New mockups are ready for review",
    timestamp: "5h", 
    unreadCount: 5,
    isOnline: false,
    isGroup: true,
    lastSeen: "5 hours ago"
  },
  {
    id: "5",
    name: "Emma Wilson",
    lastMessage: "Can you send me the files?",
    timestamp: "1d",
    unreadCount: 0,
    isOnline: false,
    lastSeen: "yesterday"
  },
  {
    id: "6",
    name: "Dev Team",
    lastMessage: "Sprint planning session scheduled",
    timestamp: "1d",
    unreadCount: 1,
    isOnline: false,
    isGroup: true,
    lastSeen: "1 day ago"
  }
];

export const mockMessages: Record<string, MessageData[]> = {
  "1": [
    {
      id: "m1",
      text: "Hi Sarah! The project is going well. We're making good progress on the frontend.",
      timestamp: "2:30 PM",
      isSent: true,
      isDelivered: true,
      isRead: true
    },
    {
      id: "m2", 
      text: "That's great to hear! I've been working on the API endpoints.",
      timestamp: "2:32 PM",
      isSent: false,
      senderName: "Sarah Johnson"
    },
    {
      id: "m3",
      text: "Perfect! How's the authentication system coming along?",
      timestamp: "2:35 PM", 
      isSent: true,
      isDelivered: true,
      isRead: false
    },
    {
      id: "m4",
      text: "Hey! How's the project going?",
      timestamp: "3:45 PM",
      isSent: false,
      senderName: "Sarah Johnson"
    }
  ],
  "2": [
    {
      id: "m5",
      text: "Don't forget about our team meeting tomorrow at 10 AM in the conference room.",
      timestamp: "Yesterday",
      isSent: false,
      senderName: "Alice Cooper"
    },
    {
      id: "m6",
      text: "I'll be there! Should I prepare anything specific?",
      timestamp: "Yesterday",
      isSent: true,
      isDelivered: true,
      isRead: true
    },
    {
      id: "m7",
      text: "Just bring your laptop and we'll go over the sprint goals.",
      timestamp: "Yesterday", 
      isSent: false,
      senderName: "Bob Smith"
    },
    {
      id: "m8",
      text: "Meeting tomorrow at 10 AM",
      timestamp: "1h ago",
      isSent: false,
      senderName: "Alice Cooper"
    }
  ],
  "3": [
    {
      id: "m9",
      text: "Hey Mike! I finished reviewing your pull request.",
      timestamp: "4:00 PM",
      isSent: true,
      isDelivered: true,
      isRead: true
    },
    {
      id: "m10",
      text: "Thanks for the help with the code review!",
      timestamp: "4:05 PM",
      isSent: false,
      senderName: "Mike Chen"
    }
  ]
};

export function generateTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateMockMessages(): MessageData[] {
  const messageTexts = [
    "Hey there! How are you doing?",
    "I'm working on a new project, would love to get your thoughts",
    "Did you see the latest news about the tech conference?", 
    "Let's catch up soon over coffee ☕",
    "Thanks for your help yesterday!",
    "The weather is beautiful today 🌞",
    "How was your weekend?",
    "I found this interesting article you might like"
  ];

  return messageTexts.map((text, index) => ({
    id: generateMessageId(),
    text,
    timestamp: generateTimestamp(),
    isSent: index % 3 === 0,
    isDelivered: true,
    isRead: Math.random() > 0.3,
    senderName: index % 3 !== 0 ? "Contact" : undefined
  }));
}
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { MobileLayout } from "@/components/chat/MobileLayout";
import { mockContacts, mockMessages, MessageData, generateTimestamp, generateMessageId } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [selectedContactId, setSelectedContactId] = useState<string>();
  const [messages, setMessages] = useState<Record<string, MessageData[]>>(mockMessages);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const isMobile = useIsMobile();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
  };

  const handleBackToContacts = () => {
    setSelectedContactId(undefined);
  };

  const handleSendMessage = (messageText: string) => {
    if (!selectedContactId) return;

    const newMessage: MessageData = {
      id: generateMessageId(),
      text: messageText,
      timestamp: generateTimestamp(),
      isSent: true,
      isDelivered: true,
      isRead: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage]
    }));

    // Simulate receiving a response after a short delay
    setTimeout(() => {
      const responses = [
        "Thanks for your message!",
        "Got it, I'll get back to you soon.",
        "That sounds great!",
        "Let me think about that.",
        "Interesting point!",
        "I completely agree with you.",
        "Can you tell me more about that?",
        "That's a brilliant idea!",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const selectedContact = mockContacts.find(c => c.id === selectedContactId);
      
      const responseMessage: MessageData = {
        id: generateMessageId(),
        text: randomResponse,
        timestamp: generateTimestamp(),
        isSent: false,
        senderName: selectedContact?.name
      };

      setMessages(prev => ({
        ...prev,
        [selectedContactId]: [...(prev[selectedContactId] || []), responseMessage]
      }));
    }, 1000 + Math.random() * 2000);
  };

  const selectedContact = selectedContactId 
    ? mockContacts.find(c => c.id === selectedContactId)
    : undefined;

  const currentMessages = selectedContactId 
    ? messages[selectedContactId] || []
    : [];

  const sidebar = (
    <Sidebar
      contacts={mockContacts}
      selectedContactId={selectedContactId}
      onContactSelect={handleContactSelect}
      isDark={isDark}
      onThemeToggle={() => setIsDark(!isDark)}
    />
  );

  const chatWindow = (
    <ChatWindow
      contact={selectedContact}
      messages={currentMessages}
      onSendMessage={handleSendMessage}
    />
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <main className="h-screen">
          {selectedContactId ? (
            <MobileLayout
              sidebar={sidebar}
              showBackButton={true}
              onBack={handleBackToContacts}
              contactName={selectedContact?.name}
            >
              {chatWindow}
            </MobileLayout>
          ) : (
            <MobileLayout sidebar={sidebar}>
              <div className="flex-1 flex items-center justify-center bg-chat-background">
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg 
                      className="w-16 h-16 text-muted-foreground" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Welcome to ChatApp</h3>
                  <p className="text-muted-foreground">Select a conversation to start messaging</p>
                </div>
              </div>
            </MobileLayout>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="h-screen flex">
        {sidebar}
        {chatWindow}
      </main>
    </div>
  );
};

export default Index;

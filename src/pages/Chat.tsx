import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { MobileLayout } from "@/components/chat/MobileLayout";
import { Navigation } from "@/components/layout/Navigation";
import { useToast } from "@/hooks/use-toast";
import { mockContacts, generateMockMessages } from "@/data/mockData";
import type { MessageData } from "@/components/chat/Message";

interface Contact {
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

interface ChatContact extends Contact {
  messages?: MessageData[];
}

export default function Chat() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isDark, setIsDark] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | undefined>(id);
  const [contacts, setContacts] = useState<ChatContact[]>(mockContacts);
  const [messages, setMessages] = useState<MessageData[]>([]);

  useEffect(() => {
    if (selectedContactId) {
      // Load messages for the selected contact
      const contact = contacts.find(c => c.id === selectedContactId);
      if (contact) {
        setMessages(contact.messages || generateMockMessages());
      }
    }
  }, [selectedContactId, contacts]);

  useEffect(() => {
    // Update selected contact when URL parameter changes
    if (id && id !== selectedContactId) {
      setSelectedContactId(id);
    }
  }, [id]);

  const selectedContact = contacts.find(contact => contact.id === selectedContactId);

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
    // Update URL without full navigation to maintain state
    window.history.pushState(null, "", `/chat/${contactId}`);
  };

  const handleSendMessage = (messageText: string) => {
    if (!selectedContactId) return;

    const newMessage: MessageData = {
      id: Date.now().toString(),
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      isDelivered: true
    };

    setMessages(prev => [...prev, newMessage]);

    // Update last message in contacts list
    setContacts(prev => prev.map(contact => 
      contact.id === selectedContactId
        ? { 
            ...contact, 
            lastMessage: messageText,
            timestamp: "now",
            messages: [...(contact.messages || []), newMessage]
          }
        : contact
    ));

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "That sounds great!",
        "I agree with you.",
        "Thanks for sharing!",
        "Interesting point of view.",
        "Let me think about that.",
        "Sure, no problem!",
        "I'll get back to you on this.",
        "Sounds like a plan!"
      ];
      
      const responseMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: false,
        isDelivered: true,
        isRead: true,
        senderName: selectedContact?.name,
        senderAvatar: selectedContact?.avatar
      };

      setMessages(prev => [...prev, responseMessage]);

      // Update last message in contacts list
      setContacts(prev => prev.map(contact => 
        contact.id === selectedContactId
          ? { 
              ...contact, 
              lastMessage: responseMessage.text,
              timestamp: "now",
              unreadCount: contact.unreadCount + 1,
              messages: [...(contact.messages || []), responseMessage]
            }
          : contact
      ));
    }, 1000 + Math.random() * 2000);
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
      <Navigation />
      
      <div className="flex-1 flex overflow-hidden">
        <MobileLayout
          sidebar={
            <Sidebar
              contacts={contacts}
              selectedContactId={selectedContactId}
              onContactSelect={handleContactSelect}
              isDark={isDark}
              onThemeToggle={handleThemeToggle}
            />
          }
          showBackButton={!!selectedContactId}
          onBack={() => {
            setSelectedContactId(undefined);
            window.history.pushState(null, "", "/chat");
          }}
          contactName={selectedContact?.name}
        >
          <ChatWindow
            contact={selectedContact}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </MobileLayout>
      </div>
    </div>
  );
}
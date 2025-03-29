import { useState, useMemo } from "react";
import { Send, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const InstructorStudentChat = ({ onBack }) => {
  const [activeContact, setActiveContact] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const contacts = [
    {
      id: 1,
      name: "Dr. Mulugetta Bekele",
      avatar: "MB",
      lastMessage: "When do you plan to submit your assignment?",
      time: "10:45 AM",
      unread: true,
      online: true
    },
    {
      id: 2,
      name: "Prof. Desta Tadesse",
      avatar: "DT",
      lastMessage: "The next lecture will cover advanced topics...",
      time: "Yesterday",
      unread: false,
      online: false
    },
    {
      id: 3,
      name: "Samrawit Yonas",
      avatar: "SY",
      lastMessage: "Great work on your React project!",
      time: "Yesterday",
      unread: false,
      online: true
    },
    {
      id: 4,
      name: "Amanuel Gebremedhin",
      avatar: "AG",
      lastMessage: "Don't forget to check the Python tutorial I shared",
      time: "Monday",
      unread: false,
      online: false
    },
    {
      id: 5,
      name: "TA Support Group",
      avatar: "TS",
      lastMessage: "Amanuel: I'll be available during office hours...",
      time: "Monday",
      unread: false,
      online: false
    }
  ];

  const initialMessages = {
    1: [
      {
        id: 1,
        sender: "instructor",
        text: "Hello John, I wanted to check on your progress with the machine learning assignment. Have you been able to implement the algorithms we discussed?",
        time: "10:30 AM"
      },
      {
        id: 2,
        sender: "student",
        text: "Hi Dr. Bekele, I've implemented the regression and classification algorithms, but I'm having some issues with the neural network part.",
        time: "10:35 AM"
      },
      {
        id: 3,
        sender: "instructor",
        text: "What specific issues are you encountering with the neural network implementation?",
        time: "10:38 AM"
      },
      {
        id: 4,
        sender: "student",
        text: "The backpropagation algorithm isn't converging properly. I think there might be an issue with my gradient calculation.",
        time: "10:40 AM"
      },
      {
        id: 5,
        sender: "instructor",
        text: "That's a common issue. When do you plan to submit your assignment? I can help you troubleshoot the gradient calculation.",
        time: "10:45 AM"
      }
    ],
    2: [
      {
        id: 1,
        sender: "instructor",
        text: "About the next lecture...",
        time: "9:15 AM"
      }
    ]
  };

  const [messages, setMessages] = useState(initialMessages);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  const currentMessages = activeContact ? messages[activeContact] || [] : [];

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && activeContact) {
      const newMessage = {
        id: Date.now(),
        sender: "instructor",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [activeContact]: [...(prev[activeContact] || []), newMessage]
      }));

      setMessage("");
    }
  };

  return (
    <div className="h-full flex flex-col  mt-[500px]">
      {/* Search and Filter */}
      <div className="flex mb-4 gap-4 p-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input
              type="text"
              placeholder="Search messages..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
          Filter
        </Button>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex flex-1 overflow-hidden bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm  ">
        {/* Contacts Sidebar - Always visible */}
        <div className="w-72 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Conversations</h3>
          </div>
          
          {filteredContacts.map((contact) => (
            <div 
              key={contact.id}
              className={cn(
                "p-3 flex items-start hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200",
                activeContact === contact.id ? "bg-slate-50 dark:bg-slate-700" : ""
              )}
              onClick={() => setActiveContact(contact.id)}
            >
              <div className="relative">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                  contact.unread ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400" :
                  "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                )}>
                  {contact.avatar}
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">{contact.name}</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{contact.time}</span>
                </div>
                <p className={cn(
                  "text-xs mt-1 truncate",
                  contact.unread ? "font-medium text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                )}>
                  {contact.lastMessage}
                </p>
              </div>
              {contact.unread && (
                <div className="ml-2 min-w-[18px] h-[18px] rounded-full bg-fidel-500 text-white text-xs flex items-center justify-center">
                  1
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Chat Window - Stable position */}
        <div className="flex-1 flex flex-col w-[840px]   relative">
          {activeContact ? (
            <div className="absolute inset-0 flex flex-col">
              {/* Chat Header */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2 md:hidden"
                  onClick={() => setActiveContact(null)}
                >
                  <ArrowLeft size={16} />
                </Button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-fidel-100 dark:bg-fidel-900/30 flex items-center justify-center text-fidel-600 dark:text-fidel-400 text-sm font-medium">
                    {contacts.find(c => c.id === activeContact)?.avatar}
                  </div>
                  {contacts.find(c => c.id === activeContact)?.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                    {contacts.find(c => c.id === activeContact)?.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {contacts.find(c => c.id === activeContact)?.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${
                      msg.sender === "instructor" ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div 
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[70%]",
                        msg.sender === "instructor" 
                          ? "bg-slate-100 dark:bg-slate-700 rounded-tl-none text-slate-800 dark:text-slate-200"
                          : "bg-fidel-100 dark:bg-fidel-900/30 rounded-tr-none text-fidel-800 dark:text-fidel-300"
                      )}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={cn(
                        "text-xs mt-1 text-right",
                        msg.sender === "instructor" 
                          ? "text-slate-500 dark:text-slate-400"
                          : "text-fidel-600/70 dark:text-fidel-400/70"
                      )}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                <form onSubmit={handleSend} className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      placeholder={`Message ${contacts.find(c => c.id === activeContact)?.name}`}
                      rows={1}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="absolute bottom-2 right-3">
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        disabled={!message}
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex justify-center items-center text-slate-500 dark:text-slate-400">
              <div className="text-center p-6">
                <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                  <Send size={20} className="text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-medium mb-1">No conversation selected</h3>
                <p className="text-sm">Select a contact to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorStudentChat;
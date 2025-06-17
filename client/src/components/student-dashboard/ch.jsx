
import { Search, Send, Paperclip, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

export const MessagesTab = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_URL}/api/chat/conversations/?userId=${user._id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setConversations(response.data);
        if (response.data.length > 0 && !selectedConversation) {
          setSelectedConversation(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `${API_URL}/api/chat/messages/${selectedConversation._id}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || !selectedConversation) return;

    socket.on("newMessage", (message) => {
      if (message.conversationId === selectedConversation._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.emit("joinConversation", selectedConversation._id);

    return () => {
      socket.off("newMessage");
      socket.off("onlineUsers");
      socket.emit("leaveConversation", selectedConversation._id);
    };
  }, [socket, selectedConversation]);

 
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !file) || isSending) return;

    const getFileCategory = (mimeType) => {
      if (mimeType.startsWith("image/")) return "image";
      if (mimeType.startsWith("video/")) return "video";
      if (mimeType.startsWith("audio/")) return "audio";
      if (mimeType === "application/pdf" || mimeType.startsWith("application/"))
        return "document";
      return "other"; // fallback or handle this appropriately in your backend
    };

    try {
      setIsSending(true);

      let fileUrl = null;
      let fileType = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await axios.post(
          `${API_URL}/api/chat/messages`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        fileUrl = uploadResponse.data.url;
        fileType = getFileCategory(file.type); // ✅ Safe to call now
      }

      const messageData = {
        conversationId: selectedConversation._id,
        senderId: user._id,
        text: newMessage,
        fileUrl,
        fileType,
      };

      const response = await axios.post(
        `${API_URL}/api/chat/messages`,
        messageData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
      setFile(null);

      socket.emit("sendMessage", {
        ...response.data,
        conversationId: selectedConversation._id,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };
 

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  const getOtherParticipant = (conversation) =>
    conversation.members.find((member) => member._id !== user._id);

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = getOtherParticipant(conv);
    return otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filter */}
      <div className="flex mb-4 gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
          Filter
        </button>
      </div>

      {/* Main area */}
      <div className="flex h-[calc(100vh-230px)] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Sidebar */}
        <div className="w-72 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Conversations
            </h3>
          </div>

          {isLoading && !conversations.length ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              const lastMessage = conversation.lastMessage;
              const isOnline = isUserOnline(otherUser?._id);
              const isUnread = conversation.unreadCount > 0;

              return (
                <div
                  key={conversation._id}
                  className={cn(
                    "p-3 flex items-start hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200",
                    selectedConversation?._id === conversation._id
                      ? "bg-slate-50 dark:bg-slate-700"
                      : ""
                  )}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="relative">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                        isUnread
                          ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      )}
                    >
                      {otherUser?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {otherUser?.name || "Unknown User"}
                      </h4>
                      {lastMessage && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {new Date(lastMessage.createdAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p
                        className={cn(
                          "text-xs mt-1 truncate",
                          isUnread
                            ? "font-medium text-slate-900 dark:text-white"
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      >
                        {lastMessage.text || "File sent"}
                      </p>
                    )}
                  </div>
                  {isUnread && (
                    <div className="ml-2 min-w-[18px] h-[18px] rounded-full bg-fidel-500 text-white text-xs flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-fidel-100 dark:bg-fidel-900/30 flex items-center justify-center text-fidel-600 dark:text-fidel-400 text-sm font-medium">
                    {getOtherParticipant(selectedConversation)
                      ?.name?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  {isUserOnline(
                    getOtherParticipant(selectedConversation)?._id
                  ) && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                  )}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                    {getOtherParticipant(selectedConversation)?.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isUserOnline(
                      getOtherParticipant(selectedConversation)?._id
                    )
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>

              {/* Updated Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoading && messages.length === 0 ? (
                  <div className="flex justify-center">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={cn(
                          "flex",
                          msg.senderId === user._id
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] px-4 py-2 rounded-lg",
                            msg.senderId === user._id
                              ? "bg-fidel-500 text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                          )}
                        >
                          {msg.text && <p>{msg.text}</p>}
                          {msg.fileUrl &&
                            (msg.fileType === "image" ? (
                              <img
                                src={msg.fileUrl}
                                alt="sent file"
                                className="mt-2 rounded max-w-full h-auto max-h-64"
                              />
                            ) : (
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline mt-2 block"
                              >
                                Download file
                              </a>
                            ))}
                          <p className="text-xs opacity-70 mt-1 text-right">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="text-slate-500 dark:text-slate-300 hover:text-fidel-500 dark:hover:text-fidel-400 transition-colors"
                >
                  <Paperclip />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*, .pdf, .doc, .docx, .txt"
                />
                {file && (
                  <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-xs">
                    {file.name}
                    <button
                      onClick={() => setFile(null)}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                )}
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending}
                  className="text-white bg-fidel-500 hover:bg-fidel-600 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? <Loader2 className="animate-spin" /> : <Send />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Select a conversation to start messaging"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

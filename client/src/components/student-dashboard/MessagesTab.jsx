import { useState, useEffect, useRef } from "react";
import {
  Send,
  Upload,
  FileText,
  Image,
  Download,
  Ban,
  AlertCircle,
  Edit,
  Trash,
  X,
  Check,
} from "lucide-react";

export const MessagesTab = ({ courseId, instructorId, currentUserType }) => {
  const [activeCourse, setActiveCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState("");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const editInputRef = useRef(null);

  const [conversations, setConversations] = useState([
    {
      id: "course1",
      title: "Advanced Machine Learning",
      instructor: {
        id: "instructor1",
        name: "Dr. Mulugetta Bekele",
        avatar: "MB",
        online: true,
      },
      isBlocked: false,
      blockedBy: null,
      lastMessage: "When do you plan to submit your assignment?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
      unreadCount: 1,
    },
    {
      id: "course2",
      title: "Data Structures and Algorithms",
      instructor: {
        id: "instructor2",
        name: "Prof. Desta Tadesse",
        avatar: "DT",
        online: false,
      },
      isBlocked: false,
      blockedBy: null,
      lastMessage: "The next lecture will cover advanced topics...",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      unreadCount: 0,
    },
  ]);

  const mockMessages = {
    course1: [
      {
        id: "1",
        sender: "instructor",
        content:
          "Hello, I wanted to check on your progress with the assignment.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: "text",
      },
      {
        id: "2",
        sender: "student",
        content:
          "Hi Dr. Bekele, I've implemented most of it but I'm having issues.",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        type: "text",
      },
      {
        id: "3",
        sender: "instructor",
        content: "What specific issues are you encountering?",
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        type: "text",
      },
      {
        id: "4",
        sender: "student",
        content: "assignment_progress.pdf",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        type: "file",
        fileInfo: {
          name: "assignment_progress.pdf",
          type: "application/pdf",
          size: 2500000,
          url: "#",
        },
      },
    ],
    course2: [
      {
        id: "1",
        sender: "instructor",
        content: "Have you reviewed the materials for next week?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        type: "text",
      },
      {
        id: "2",
        sender: "student",
        content: "Yes, but I have some questions about the sorting algorithms.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: "text",
      },
    ],
  };

  useEffect(() => {
    const initialCourse = courseId
      ? conversations.find((c) => c.id === courseId)
      : conversations[0];

    if (initialCourse) {
      setActiveCourse(initialCourse);
      setMessages(mockMessages[initialCourse.id] || []);
    }
  }, [courseId, instructorId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, editingMessageId]);

  useEffect(() => {
    if (editingMessageId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingMessageId]);

  const handleSendMessage = () => {
    if (
      (!newMessage.trim() && !file) ||
      !activeCourse ||
      activeCourse.isBlocked
    )
      return;

    const newMsg = {
      id: Date.now().toString(),
      sender: currentUserType === "instructor" ? "instructor" : "student",
      content: newMessage || file?.name || "",
      timestamp: new Date(),
      type: file ? "file" : "text",
      fileInfo: file
        ? {
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file),
          }
        : undefined,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    setFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 10 * 1024 * 1024;

      if (!validTypes.includes(selectedFile.type)) {
        alert("Please select a valid file type (JPEG, PNG, PDF, DOC, DOCX)");
        return;
      }

      if (selectedFile.size > maxSize) {
        alert("File size exceeds 10MB limit");
        return;
      }

      setFile(selectedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleConversationSelect = (conversation) => {
    setActiveCourse(conversation);
    setMessages(mockMessages[conversation.id] || []);
    setEditingMessageId(null);
  };

  const toggleBlockStudent = (courseId) => {
    setConversations(
      conversations.map((course) => {
        if (course.id === courseId) {
          const isBlocked = !course.isBlocked;
          return {
            ...course,
            isBlocked,
            blockedBy: isBlocked ? "instructor" : null,
          };
        }
        return course;
      })
    );

    // Update active course if it's the one being blocked/unblocked
    if (activeCourse?.id === courseId) {
      setActiveCourse((prev) => ({
        ...prev,
        isBlocked: !prev.isBlocked,
        blockedBy: !prev.isBlocked ? "instructor" : null,
      }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <Image size={16} className="mr-2" />;
    if (type === "application/pdf")
      return <FileText size={16} className="mr-2" />;
    return <FileText size={16} className="mr-2" />;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleStartEditing = (message) => {
    if (message.type === "file" || activeCourse.isBlocked) return;
    setEditingMessageId(message.id);
    setEditMessageContent(message.content);
  };

  const handleCancelEditing = () => {
    setEditingMessageId(null);
    setEditMessageContent("");
  };

  const handleSaveEdit = () => {
    if (!editMessageContent.trim()) return;

    setMessages(
      messages.map((msg) =>
        msg.id === editingMessageId
          ? { ...msg, content: editMessageContent }
          : msg
      )
    );
    setEditingMessageId(null);
    setEditMessageContent("");
  };

  const handleDeleteMessage = (messageId) => {
    const messageToDelete = messages.find((msg) => msg.id === messageId);
    if (messageToDelete?.type === "file" && messageToDelete?.fileInfo?.url) {
      URL.revokeObjectURL(messageToDelete.fileInfo.url);
    }

    setMessages(messages.filter((msg) => msg.id !== messageId));
    if (editingMessageId === messageId) {
      setEditingMessageId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex h-[calc(100vh-160px)] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Conversations sidebar */}
        <div className="w-72 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Conversations
            </h3>
          </div>

          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleConversationSelect(conversation)}
              className={`p-3 flex items-start hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200 ${
                activeCourse?.id === conversation.id
                  ? "bg-slate-50 dark:bg-slate-700"
                  : ""
              } ${
                conversation.isBlocked ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    conversation.unreadCount > 0
                      ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {conversation.instructor.avatar}
                </div>
                {conversation.instructor.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {conversation.instructor.name}
                  </h4>
                  {conversation.lastMessageTime && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {conversation.title}
                </p>
                <p
                  className={`text-xs mt-1 truncate ${
                    conversation.unreadCount > 0
                      ? "font-medium text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {conversation.lastMessage}
                </p>
                {conversation.isBlocked && (
                  <div className="flex items-center text-xs text-red-500 dark:text-red-400 mt-1">
                    <Ban size={14} className="mr-1" />
                    <span>Messaging blocked</span>
                  </div>
                )}
              </div>
              {conversation.unreadCount > 0 && !conversation.isBlocked && (
                <div className="ml-2 min-w-[18px] h-[18px] rounded-full bg-fidel-500 text-white text-xs flex items-center justify-center">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {activeCourse ? (
            <>
              <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {activeCourse.instructor.avatar}
                    </div>
                    {activeCourse.instructor.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                      {activeCourse.instructor.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeCourse.title}
                    </p>
                  </div>
                </div>
                {currentUserType === "instructor" && (
                  <button
                    onClick={() => toggleBlockStudent(activeCourse.id)}
                    className={`p-2 rounded-full ${
                      activeCourse.isBlocked
                        ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                        : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    } transition-colors duration-200`}
                    title={
                      activeCourse.isBlocked
                        ? "Unblock student"
                        : "Block student"
                    }
                  >
                    <Ban size={18} />
                  </button>
                )}
                {currentUserType === "student" && activeCourse.isBlocked && (
                  <div className="flex items-center text-sm text-red-500 dark:text-red-400 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
                    <Ban size={16} className="mr-1" />
                    <span>Blocked</span>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "student"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative rounded-lg px-4 py-2 max-w-[70%] ${
                        message.sender === "student"
                          ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-800 dark:text-fidel-300 rounded-tr-none"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none"
                      } ${message.type === "file" ? "w-full max-w-md" : ""}`}
                    >
                      {editingMessageId === message.id ? (
                        <div className="flex flex-col">
                          <textarea
                            ref={editInputRef}
                            value={editMessageContent}
                            onChange={(e) =>
                              setEditMessageContent(e.target.value)
                            }
                            className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded p-2 mb-2 focus:outline-none focus:ring-1 focus:ring-fidel-500"
                            rows={3}
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleCancelEditing}
                              className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600"
                            >
                              <X size={16} />
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="p-1 rounded-full bg-fidel-500 text-white hover:bg-fidel-600"
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {message.type === "text" ? (
                            <p className="text-sm">{message.content}</p>
                          ) : (
                            <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-slate-800/50 rounded">
                              <div className="flex items-center">
                                {getFileIcon(message.fileInfo?.type || "")}
                                <div>
                                  <p className="text-sm font-medium truncate max-w-[180px]">
                                    {message.content}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {formatFileSize(
                                      message.fileInfo?.size || 0
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <a
                                  href={message.fileInfo?.url}
                                  download={message.fileInfo?.name}
                                  className="ml-2 p-1 text-fidel-500 hover:text-fidel-600 dark:hover:text-fidel-400"
                                >
                                  <Download size={16} />
                                </a>
                              </div>
                            </div>
                          )}
                          <div
                            className={`flex items-center justify-end space-x-2 mt-1`}
                          >
                            <p
                              className={`text-xs ${
                                message.sender === "student"
                                  ? "text-fidel-600/70 dark:text-fidel-400/70"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                            {message.sender === "student" && (
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className="p-1 text-slate-400 hover:text-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            )}
                            {message.sender === "student" &&
                              message.type === "text" &&
                              !activeCourse.isBlocked && (
                                <button
                                  onClick={() => handleStartEditing(message)}
                                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                  <Edit size={14} />
                                </button>
                              )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {activeCourse.isBlocked ? (
                <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-red-50 dark:bg-red-900/20">
                  <div className="text-center text-red-500 dark:text-red-400 text-sm">
                    <AlertCircle className="inline mr-2" size={16} />
                    {currentUserType === "instructor"
                      ? "You have blocked this student from messaging"
                      : "You have been blocked from messaging by the instructor"}
                  </div>
                </div>
              ) : (
                <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                  {file && (
                    <div className="flex items-center justify-between mb-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center">
                        {getFileIcon(file.type)}
                        <span className="text-sm truncate max-w-[200px]">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className="flex items-end gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    />
                    <button
                      onClick={triggerFileInput}
                      className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                      title="Attach file"
                    >
                      <Upload size={18} />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        placeholder="Type a message..."
                        rows={1}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && !file}
                      className={`p-2.5 rounded-lg transition-colors duration-200 shadow-sm ${
                        newMessage.trim() || file
                          ? "bg-fidel-500 text-white hover:bg-fidel-600"
                          : "bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                  <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                </div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                  No conversation selected
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CourseProgressCard = ({ course, currentUserType }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Instructor: {course.instructor.name}
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-fidel-500 h-2 rounded-full"
              style={{ width: "65%" }}
            ></div>
          </div>
        </div>
        <a
          href={`/messages?courseId=${course.id}&instructorId=${course.instructor.id}`}
          className={`px-3 py-1 text-sm rounded-lg ${
            course.isBlocked
              ? "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed"
              : "bg-fidel-500 text-white hover:bg-fidel-600"
          }`}
        >
          {course.isBlocked ? "Blocked" : "Message"}
        </a>
      </div>
      {course.isBlocked && currentUserType === "instructor" && (
        <div className="mt-2 text-xs text-red-500 dark:text-red-400 flex items-center">
          <Ban size={12} className="mr-1" />
          <span>You blocked this student</span>
        </div>
      )}
    </div>
  );
};

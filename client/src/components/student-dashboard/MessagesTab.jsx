// // components/student-dashboard/MessagesTab.jsx
// import { Search, Send } from "lucide-react";
// import { cn } from "@/lib/utils";

// export const MessagesTab = () => {
//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex mb-4 gap-4">
//         <div className="flex-1">
//           <div className="relative">
//             <Search
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
//               size={18}
//             />
//             <input
//               type="text"
//               placeholder="Search messages..."
//               className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
//             />
//           </div>
//         </div>
//         <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
//           Filter
//         </button>
//       </div>

//       <div className="flex h-[calc(100vh-230px)] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
//         {/* Contacts sidebar */}
//         <div className="w-72 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
//           <div className="p-3 border-b border-slate-200 dark:border-slate-700">
//             <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
//               Recent Conversations
//             </h3>
//           </div>

//           {[
//             {
//               name: "Dr. Mulugetta Bekele",
//               avatar: "MB",
//               message: "When do you plan to submit your assignment?",
//               time: "10:45 AM",
//               unread: true,
//               online: true,
//             },
//             {
//               name: "Prof. Desta Tadesse",
//               avatar: "DT",
//               message: "The next lecture will cover advanced topics...",
//               time: "Yesterday",
//               unread: false,
//               online: false,
//             },
//             {
//               name: "Samrawit Yonas",
//               avatar: "SY",
//               message: "Great work on your React project!",
//               time: "Yesterday",
//               unread: false,
//               online: true,
//             },
//             {
//               name: "Amanuel Gebremedhin",
//               avatar: "AG",
//               message: "Don't forget to check the Python tutorial I shared",
//               time: "Monday",
//               unread: false,
//               online: false,
//             },
//             {
//               name: "TA Support Group",
//               avatar: "TS",
//               message: "Amanuel: I'll be available during office hours...",
//               time: "Monday",
//               unread: false,
//               online: false,
//             },
//           ].map((contact, i) => (
//             <div
//               key={i}
//               className={cn(
//                 "p-3 flex items-start hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200",
//                 i === 0 ? "bg-slate-50 dark:bg-slate-700" : ""
//               )}
//             >
//               <div className="relative">
//                 <div
//                   className={cn(
//                     "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
//                     contact.unread
//                       ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400"
//                       : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
//                   )}
//                 >
//                   {contact.avatar}
//                 </div>
//                 {contact.online && (
//                   <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
//                 )}
//               </div>
//               <div className="ml-3 flex-1 min-w-0">
//                 <div className="flex justify-between items-baseline">
//                   <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
//                     {contact.name}
//                   </h4>
//                   <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
//                     {contact.time}
//                   </span>
//                 </div>
//                 <p
//                   className={cn(
//                     "text-xs mt-1 truncate",
//                     contact.unread
//                       ? "font-medium text-slate-900 dark:text-white"
//                       : "text-slate-500 dark:text-slate-400"
//                   )}
//                 >
//                   {contact.message}
//                 </p>
//               </div>
//               {contact.unread && (
//                 <div className="ml-2 min-w-[18px] h-[18px] rounded-full bg-fidel-500 text-white text-xs flex items-center justify-center">
//                   1
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Chat area */}
//         <div className="flex-1 flex flex-col">
//           <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center">
//             <div className="relative">
//               <div className="w-10 h-10 rounded-full bg-fidel-100 dark:bg-fidel-900/30 flex items-center justify-center text-fidel-600 dark:text-fidel-400 text-sm font-medium">
//                 MB
//               </div>
//               <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-slate-900 dark:text-white">
//                 Dr. Mulugetta Bekele
//               </h3>
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 Online
//               </p>
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             <div className="flex justify-start">
//               <div className="bg-slate-100 dark:bg-slate-700 rounded-lg rounded-tl-none px-4 py-2 max-w-[70%]">
//                 <p className="text-sm text-slate-800 dark:text-slate-200">
//                   Hello John, I wanted to check on your progress with the
//                   machine learning assignment. Have you been able to implement
//                   the algorithms we discussed?
//                 </p>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
//                   10:30 AM
//                 </p>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <div className="bg-fidel-100 dark:bg-fidel-900/30 text-fidel-800 dark:text-fidel-300 rounded-lg rounded-tr-none px-4 py-2 max-w-[70%]">
//                 <p className="text-sm">
//                   Hi Dr. Bekele, I've implemented the regression and
//                   classification algorithms, but I'm having some issues with the
//                   neural network part.
//                 </p>
//                 <p className="text-xs text-fidel-600/70 dark:text-fidel-400/70 mt-1 text-right">
//                   10:35 AM
//                 </p>
//               </div>
//             </div>

//             <div className="flex justify-start">
//               <div className="bg-slate-100 dark:bg-slate-700 rounded-lg rounded-tl-none px-4 py-2 max-w-[70%]">
//                 <p className="text-sm text-slate-800 dark:text-slate-200">
//                   What specific issues are you encountering with the neural
//                   network implementation?
//                 </p>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
//                   10:38 AM
//                 </p>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <div className="bg-fidel-100 dark:bg-fidel-900/30 text-fidel-800 dark:text-fidel-300 rounded-lg rounded-tr-none px-4 py-2 max-w-[70%]">
//                 <p className="text-sm">
//                   The backpropagation algorithm isn't converging properly. I
//                   think there might be an issue with my gradient calculation.
//                 </p>
//                 <p className="text-xs text-fidel-600/70 dark:text-fidel-400/70 mt-1 text-right">
//                   10:40 AM
//                 </p>
//               </div>
//             </div>

//             <div className="flex justify-start">
//               <div className="bg-slate-100 dark:bg-slate-700 rounded-lg rounded-tl-none px-4 py-2 max-w-[70%]">
//                 <p className="text-sm text-slate-800 dark:text-slate-200">
//                   That's a common issue. When do you plan to submit your
//                   assignment? I can help you troubleshoot the gradient
//                   calculation.
//                 </p>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
//                   10:45 AM
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="p-3 border-t border-slate-200 dark:border-slate-700">
//             <div className="flex items-end gap-3">
//               <div className="flex-1 relative">
//                 <textarea
//                   placeholder="Type a message..."
//                   rows={1}
//                   className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
//                 ></textarea>
//               </div>
//               <button className="p-2.5 rounded-lg bg-fidel-500 text-white hover:bg-fidel-600 transition-colors duration-200 shadow-sm">
//                 <Send size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// import { useState, useEffect, useRef } from "react";
// import {
//   Send,
//   Upload,
//   FileText,
//   Image,
//   Download,
//   Ban,
//   AlertCircle,
//   Edit,
//   Trash,
//   X,
//   Check,
// } from "lucide-react";

// export const MessagesTab = ({ courseId, instructorId, currentUserType }) => {
//   const [activeCourse, setActiveCourse] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [file, setFile] = useState(null);
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [editMessageContent, setEditMessageContent] = useState("");
//   const fileInputRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const editInputRef = useRef(null);

//   const [conversations, setConversations] = useState([
//     {
//       id: "course1",
//       title: "Advanced Machine Learning",
//       instructor: {
//         id: "instructor1",
//         name: "Dr. Mulugetta Bekele",
//         avatar: "MB",
//         online: true,
//       },
//       isBlocked: false,
//       blockedBy: null,
//       lastMessage: "When do you plan to submit your assignment?",
//       lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
//       unreadCount: 1,
//     },
//     {
//       id: "course2",
//       title: "Data Structures and Algorithms",
//       instructor: {
//         id: "instructor2",
//         name: "Prof. Desta Tadesse",
//         avatar: "DT",
//         online: false,
//       },
//       isBlocked: false,
//       blockedBy: null,
//       lastMessage: "The next lecture will cover advanced topics...",
//       lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
//       unreadCount: 0,
//     },
//   ]);

//   const mockMessages = {
//     course1: [
//       {
//         id: "1",
//         sender: "instructor",
//         content:
//           "Hello, I wanted to check on your progress with the assignment.",
//         timestamp: new Date(Date.now() - 1000 * 60 * 30),
//         type: "text",
//       },
//       {
//         id: "2",
//         sender: "student",
//         content:
//           "Hi Dr. Bekele, I've implemented most of it but I'm having issues.",
//         timestamp: new Date(Date.now() - 1000 * 60 * 25),
//         type: "text",
//       },
//       {
//         id: "3",
//         sender: "instructor",
//         content: "What specific issues are you encountering?",
//         timestamp: new Date(Date.now() - 1000 * 60 * 20),
//         type: "text",
//       },
//       {
//         id: "4",
//         sender: "student",
//         content: "assignment_progress.pdf",
//         timestamp: new Date(Date.now() - 1000 * 60 * 15),
//         type: "file",
//         fileInfo: {
//           name: "assignment_progress.pdf",
//           type: "application/pdf",
//           size: 2500000,
//           url: "#",
//         },
//       },
//     ],
//     course2: [
//       {
//         id: "1",
//         sender: "instructor",
//         content: "Have you reviewed the materials for next week?",
//         timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
//         type: "text",
//       },
//       {
//         id: "2",
//         sender: "student",
//         content: "Yes, but I have some questions about the sorting algorithms.",
//         timestamp: new Date(Date.now() - 1000 * 60 * 60),
//         type: "text",
//       },
//     ],
//   };

//   useEffect(() => {
//     const initialCourse = courseId
//       ? conversations.find((c) => c.id === courseId)
//       : conversations[0];

//     if (initialCourse) {
//       setActiveCourse(initialCourse);
//       setMessages(mockMessages[initialCourse.id] || []);
//     }
//   }, [courseId, instructorId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, editingMessageId]);

//   useEffect(() => {
//     if (editingMessageId && editInputRef.current) {
//       editInputRef.current.focus();
//     }
//   }, [editingMessageId]);

//   const handleSendMessage = () => {
//     if (
//       (!newMessage.trim() && !file) ||
//       !activeCourse ||
//       activeCourse.isBlocked
//     )
//       return;

//     const newMsg = {
//       id: Date.now().toString(),
//       sender: currentUserType === "instructor" ? "instructor" : "student",
//       content: newMessage || file?.name || "",
//       timestamp: new Date(),
//       type: file ? "file" : "text",
//       fileInfo: file
//         ? {
//             name: file.name,
//             type: file.type,
//             size: file.size,
//             url: URL.createObjectURL(file),
//           }
//         : undefined,
//     };

//     setMessages([...messages, newMsg]);
//     setNewMessage("");
//     setFile(null);
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0];
//       const validTypes = [
//         "image/jpeg",
//         "image/png",
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ];
//       const maxSize = 10 * 1024 * 1024;

//       if (!validTypes.includes(selectedFile.type)) {
//         alert("Please select a valid file type (JPEG, PNG, PDF, DOC, DOCX)");
//         return;
//       }

//       if (selectedFile.size > maxSize) {
//         alert("File size exceeds 10MB limit");
//         return;
//       }

//       setFile(selectedFile);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const handleConversationSelect = (conversation) => {
//     setActiveCourse(conversation);
//     setMessages(mockMessages[conversation.id] || []);
//     setEditingMessageId(null);
//   };

//   const toggleBlockStudent = (courseId) => {
//     setConversations(
//       conversations.map((course) => {
//         if (course.id === courseId) {
//           const isBlocked = !course.isBlocked;
//           return {
//             ...course,
//             isBlocked,
//             blockedBy: isBlocked ? "instructor" : null,
//           };
//         }
//         return course;
//       })
//     );

//     if (activeCourse?.id === courseId) {
//       setActiveCourse((prev) => ({
//         ...prev,
//         isBlocked: !prev.isBlocked,
//         blockedBy: !prev.isBlocked ? "instructor" : null,
//       }));
//     }
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes < 1024) return `${bytes} B`;
//     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
//     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
//   };

//   const getFileIcon = (type) => {
//     if (type.startsWith("image/")) return <Image size={16} className="mr-2" />;
//     if (type === "application/pdf")
//       return <FileText size={16} className="mr-2" />;
//     return <FileText size={16} className="mr-2" />;
//   };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   const handleStartEditing = (message) => {
//     if (
//       (message.sender === "student" && currentUserType !== "student") ||
//       (message.sender === "instructor" && currentUserType !== "instructor") ||
//       message.type === "file" ||
//       activeCourse.isBlocked
//     ) {
//       return;
//     }

//     setEditingMessageId(message.id);
//     setEditMessageContent(message.content);
//   };

//   const handleCancelEditing = () => {
//     setEditingMessageId(null);
//     setEditMessageContent("");
//   };

//   const handleSaveEdit = () => {
//     if (!editMessageContent.trim()) return;

//     setMessages(
//       messages.map((msg) =>
//         msg.id === editingMessageId
//           ? { ...msg, content: editMessageContent }
//           : msg
//       )
//     );
//     setEditingMessageId(null);
//     setEditMessageContent("");
//   };

//   const handleDeleteMessage = (messageId) => {
//     const messageToDelete = messages.find((msg) => msg.id === messageId);

//     // Check if the message belongs to the current user
//     if (
//       !messageToDelete ||
//       (messageToDelete.sender === "student" && currentUserType !== "student") ||
//       (messageToDelete.sender === "instructor" &&
//         currentUserType !== "instructor")
//     ) {
//       return;
//     }

//     if (messageToDelete?.type === "file" && messageToDelete?.fileInfo?.url) {
//       URL.revokeObjectURL(messageToDelete.fileInfo.url);
//     }

//     setMessages(messages.filter((msg) => msg.id !== messageId));
//     if (editingMessageId === messageId) {
//       setEditingMessageId(null);
//     }
//   };

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex h-[calc(100vh-160px)] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
//         {/* Conversations sidebar */}
//         <div className="w-72 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
//           <div className="p-3 border-b border-slate-200 dark:border-slate-700">
//             <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
//               Recent Conversations
//             </h3>
//           </div>

//           {conversations.map((conversation) => (
//             <div
//               key={conversation.id}
//               onClick={() => handleConversationSelect(conversation)}
//               className={`p-3 flex items-start hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200 ${
//                 activeCourse?.id === conversation.id
//                   ? "bg-slate-50 dark:bg-slate-700"
//                   : ""
//               } ${
//                 conversation.isBlocked ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               <div className="relative">
//                 <div
//                   className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
//                     conversation.unreadCount > 0
//                       ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400"
//                       : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
//                   }`}
//                 >
//                   {conversation.instructor.avatar}
//                 </div>
//                 {conversation.instructor.online && (
//                   <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
//                 )}
//               </div>
//               <div className="ml-3 flex-1 min-w-0">
//                 <div className="flex justify-between items-baseline">
//                   <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
//                     {conversation.instructor.name}
//                   </h4>
//                   {conversation.lastMessageTime && (
//                     <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
//                       {formatTime(conversation.lastMessageTime)}
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
//                   {conversation.title}
//                 </p>
//                 <p
//                   className={`text-xs mt-1 truncate ${
//                     conversation.unreadCount > 0
//                       ? "font-medium text-slate-900 dark:text-white"
//                       : "text-slate-500 dark:text-slate-400"
//                   }`}
//                 >
//                   {conversation.lastMessage}
//                 </p>
//                 {conversation.isBlocked && (
//                   <div className="flex items-center text-xs text-red-500 dark:text-red-400 mt-1">
//                     <Ban size={14} className="mr-1" />
//                     <span>Messaging blocked</span>
//                   </div>
//                 )}
//               </div>
//               {conversation.unreadCount > 0 && !conversation.isBlocked && (
//                 <div className="ml-2 min-w-[18px] h-[18px] rounded-full bg-fidel-500 text-white text-xs flex items-center justify-center">
//                   {conversation.unreadCount}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Chat area */}
//         <div className="flex-1 flex flex-col">
//           {activeCourse ? (
//             <>
//               <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
//                 <div className="flex items-center">
//                   <div className="relative">
//                     <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
//                       {activeCourse.instructor.avatar}
//                     </div>
//                     {activeCourse.instructor.online && (
//                       <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
//                     )}
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium text-slate-900 dark:text-white">
//                       {activeCourse.instructor.name}
//                     </h3>
//                     <p className="text-xs text-slate-500 dark:text-slate-400">
//                       {activeCourse.title}
//                     </p>
//                   </div>
//                 </div>
//                 {currentUserType === "instructor" && (
//                   <button
//                     onClick={() => toggleBlockStudent(activeCourse.id)}
//                     className={`p-2 rounded-full ${
//                       activeCourse.isBlocked
//                         ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
//                         : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
//                     } transition-colors duration-200`}
//                     title={
//                       activeCourse.isBlocked
//                         ? "Unblock student"
//                         : "Block student"
//                     }
//                   >
//                     <Ban size={18} />
//                   </button>
//                 )}
//                 {currentUserType === "student" && activeCourse.isBlocked && (
//                   <div className="flex items-center text-sm text-red-500 dark:text-red-400 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
//                     <Ban size={16} className="mr-1" />
//                     <span>Blocked</span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                 {messages.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`flex ${
//                       (message.sender === "student" &&
//                         currentUserType === "student") ||
//                       (message.sender === "instructor" &&
//                         currentUserType === "instructor")
//                         ? "justify-end"
//                         : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`relative rounded-lg px-4 py-2 max-w-[70%] ${
//                         (message.sender === "student" &&
//                           currentUserType === "student") ||
//                         (message.sender === "instructor" &&
//                           currentUserType === "instructor")
//                           ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-800 dark:text-fidel-300 rounded-tr-none"
//                           : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none"
//                       } ${message.type === "file" ? "w-full max-w-md" : ""}`}
//                     >
//                       {editingMessageId === message.id ? (
//                         <div className="flex flex-col">
//                           <textarea
//                             ref={editInputRef}
//                             value={editMessageContent}
//                             onChange={(e) =>
//                               setEditMessageContent(e.target.value)
//                             }
//                             className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded p-2 mb-2 focus:outline-none focus:ring-1 focus:ring-fidel-500"
//                             rows={3}
//                           />
//                           <div className="flex justify-end space-x-2">
//                             <button
//                               onClick={handleCancelEditing}
//                               className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600"
//                             >
//                               <X size={16} />
//                             </button>
//                             <button
//                               onClick={handleSaveEdit}
//                               className="p-1 rounded-full bg-fidel-500 text-white hover:bg-fidel-600"
//                             >
//                               <Check size={16} />
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <>
//                           {message.type === "text" ? (
//                             <p className="text-sm">{message.content}</p>
//                           ) : (
//                             <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-slate-800/50 rounded">
//                               <div className="flex items-center">
//                                 {getFileIcon(message.fileInfo?.type || "")}
//                                 <div>
//                                   <p className="text-sm font-medium truncate max-w-[180px]">
//                                     {message.content}
//                                   </p>
//                                   <p className="text-xs text-slate-500 dark:text-slate-400">
//                                     {formatFileSize(
//                                       message.fileInfo?.size || 0
//                                     )}
//                                   </p>
//                                 </div>
//                               </div>
//                               <div className="flex items-center">
//                                 <a
//                                   href={message.fileInfo?.url}
//                                   download={message.fileInfo?.name}
//                                   className="ml-2 p-1 text-fidel-500 hover:text-fidel-600 dark:hover:text-fidel-400"
//                                 >
//                                   <Download size={16} />
//                                 </a>
//                               </div>
//                             </div>
//                           )}
//                           <div
//                             className={`flex items-center justify-end space-x-2 mt-1`}
//                           >
//                             <p
//                               className={`text-xs ${
//                                 (message.sender === "student" &&
//                                   currentUserType === "student") ||
//                                 (message.sender === "instructor" &&
//                                   currentUserType === "instructor")
//                                   ? "text-fidel-600/70 dark:text-fidel-400/70"
//                                   : "text-slate-500 dark:text-slate-400"
//                               }`}
//                             >
//                               {formatTime(message.timestamp)}
//                             </p>
//                             {((message.sender === "student" &&
//                               currentUserType === "student") ||
//                               (message.sender === "instructor" &&
//                                 currentUserType === "instructor")) && (
//                               <button
//                                 onClick={() => handleDeleteMessage(message.id)}
//                                 className="p-1 text-slate-400 hover:text-red-500"
//                               >
//                                 <Trash size={14} />
//                               </button>
//                             )}
//                             {((message.sender === "student" &&
//                               currentUserType === "student") ||
//                               (message.sender === "instructor" &&
//                                 currentUserType === "instructor")) &&
//                               message.type === "text" &&
//                               !activeCourse.isBlocked && (
//                                 <button
//                                   onClick={() => handleStartEditing(message)}
//                                   className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
//                                 >
//                                   <Edit size={14} />
//                                 </button>
//                               )}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               {activeCourse.isBlocked ? (
//                 <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-red-50 dark:bg-red-900/20">
//                   <div className="text-center text-red-500 dark:text-red-400 text-sm">
//                     <AlertCircle className="inline mr-2" size={16} />
//                     {currentUserType === "instructor"
//                       ? "You have blocked this student from messaging"
//                       : "You have been blocked from messaging by the instructor"}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="p-3 border-t border-slate-200 dark:border-slate-700">
//                   {file && (
//                     <div className="flex items-center justify-between mb-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
//                       <div className="flex items-center">
//                         {getFileIcon(file.type)}
//                         <span className="text-sm truncate max-w-[200px]">
//                           {file.name}
//                         </span>
//                       </div>
//                       <button
//                         onClick={() => setFile(null)}
//                         className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   )}
//                   <div className="flex items-end gap-3">
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={handleFileChange}
//                       className="hidden"
//                       accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
//                     />
//                     <button
//                       onClick={triggerFileInput}
//                       className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
//                       title="Attach file"
//                     >
//                       <Upload size={18} />
//                     </button>
//                     <div className="flex-1 relative">
//                       <textarea
//                         placeholder="Type a message..."
//                         rows={1}
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter" && !e.shiftKey) {
//                             e.preventDefault();
//                             handleSendMessage();
//                           }
//                         }}
//                         className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
//                       />
//                     </div>
//                     <button
//                       onClick={handleSendMessage}
//                       disabled={!newMessage.trim() && !file}
//                       className={`p-2.5 rounded-lg transition-colors duration-200 shadow-sm ${
//                         newMessage.trim() || file
//                           ? "bg-fidel-500 text-white hover:bg-fidel-600"
//                           : "bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed"
//                       }`}
//                     >
//                       <Send size={18} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center p-6">
//                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
//                   <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
//                 </div>
//                 <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
//                   No conversation selected
//                 </h3>
//                 <p className="text-xs text-slate-500 dark:text-slate-400">
//                   Select a conversation from the list to start messaging
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessagesTab;

// import { useState, useEffect, useRef } from "react";
// import {
//   Send,
//   Upload,
//   FileText,
//   Image,
//   Download,
//   Ban,
//   AlertCircle,
//   Edit,
//   Trash,
//   X,
//   Check,
// } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext";

// export const MessagesTab = ({ courseId, instructorId }) => {
//   const { user } = useAuth();
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [conversations, setConversations] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [file, setFile] = useState(null);
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [editMessageContent, setEditMessageContent] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const fileInputRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const editInputRef = useRef(null);

//   // Helper to get the other participant
//   const getOtherParticipant = (conversation) => {
//     if (!conversation || !conversation.participants || !user) return null;
//     return conversation.participants.find((p) => p._id !== user.id);
//   };

//   // Fetch conversations
//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         setIsLoading(true);
//         const res = await axios.get("/api/conversations", {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         setConversations(res.data);

//         // Set initial active conversation
//         if (courseId) {
//           const initialConv = res.data.find(
//             (c) => c.course._id === courseId || c._id === courseId
//           );
//           if (initialConv) setActiveConversation(initialConv);
//         } else if (res.data.length > 0) {
//           setActiveConversation(res.data[0]);
//         }
//       } catch (err) {
//         console.error("Error fetching conversations:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchConversations();
//   }, [courseId, user.token]);

//   // Fetch messages when active conversation changes
//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!activeConversation) return;

//       try {
//         setIsLoading(true);
//         const res = await axios.get(`/api/messages/${activeConversation._id}`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });

//         // Process messages to include sender identification
//         const processedMessages = res.data.map((message) => ({
//           ...message,
//           isCurrentUser: message.sender._id === user.id,
//         }));

//         setMessages(processedMessages);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMessages();
//   }, [activeConversation, user]); // Added user to dependencies

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, editingMessageId]);

//   // Focus edit input when editing
//   useEffect(() => {
//     if (editingMessageId && editInputRef.current) {
//       editInputRef.current.focus();
//     }
//   }, [editingMessageId]);

//   const handleSendMessage = async () => {
//     if (
//       (!newMessage.trim() && !file) ||
//       !activeConversation ||
//       activeConversation.isBlocked
//     )
//       return;

//     try {
//       setIsLoading(true);

//       const formData = new FormData();
//       formData.append("conversationId", activeConversation._id);
//       if (newMessage.trim()) formData.append("content", newMessage);
//       if (file) formData.append("file", file);

//       const res = await axios.post("/api/messages", formData, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Add isCurrentUser flag to new message
//       const newMsg = {
//         ...res.data,
//         isCurrentUser: true,
//       };

//       setMessages([...messages, newMsg]);
//       setNewMessage("");
//       setFile(null);

//       // Update conversation list
//       setConversations(
//         conversations.map((conv) =>
//           conv._id === activeConversation._id
//             ? { ...conv, lastMessage: newMsg }
//             : conv
//         )
//       );
//     } catch (err) {
//       console.error("Error sending message:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0];
//       const validTypes = [
//         "image/jpeg",
//         "image/png",
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ];
//       const maxSize = 10 * 1024 * 1024; // 10MB

//       if (!validTypes.includes(selectedFile.type)) {
//         alert("Please select a valid file type (JPEG, PNG, PDF, DOC, DOCX)");
//         return;
//       }

//       if (selectedFile.size > maxSize) {
//         alert("File size exceeds 10MB limit");
//         return;
//       }

//       setFile(selectedFile);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const toggleBlockConversation = async () => {
//     if (!activeConversation) return;

//     try {
//       setIsLoading(true);
//       const res = await axios.put(
//         `/api/conversations/${activeConversation._id}/block`,
//         { isBlocked: !activeConversation.isBlocked },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       setActiveConversation(res.data);
//       setConversations(
//         conversations.map((conv) =>
//           conv._id === activeConversation._id ? res.data : conv
//         )
//       );
//     } catch (err) {
//       console.error("Error blocking conversation:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUpdateMessage = async () => {
//     if (!editMessageContent.trim() || !editingMessageId) return;

//     try {
//       setIsLoading(true);
//       const res = await axios.put(
//         `/api/messages/${editingMessageId}`,
//         { content: editMessageContent },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       setMessages(
//         messages.map((msg) =>
//           msg._id === editingMessageId
//             ? { ...res.data, isCurrentUser: msg.isCurrentUser }
//             : msg
//         )
//       );
//       setEditingMessageId(null);
//       setEditMessageContent("");
//     } catch (err) {
//       console.error("Error updating message:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteMessage = async (messageId) => {
//     try {
//       setIsLoading(true);
//       await axios.delete(`/api/messages/${messageId}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });

//       setMessages(messages.filter((msg) => msg._id !== messageId));
//       if (editingMessageId === messageId) {
//         setEditingMessageId(null);
//       }
//     } catch (err) {
//       console.error("Error deleting message:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Helper functions
//   const formatFileSize = (bytes) => {
//     if (bytes < 1024) return `${bytes} B`;
//     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
//     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
//   };

//   const getFileIcon = (type) => {
//     if (type?.startsWith("image/")) return <Image size={16} className="mr-2" />;
//     if (type === "application/pdf")
//       return <FileText size={16} className="mr-2" />;
//     return <FileText size={16} className="mr-2" />;
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex h-[calc(100vh-160px)] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
//         {/* Conversations sidebar */}
//         <div className="w-72 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
//           <div className="p-3 border-b border-slate-200 dark:border-slate-700">
//             <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
//               Recent Conversations
//             </h3>
//           </div>

//           {isLoading && !conversations.length ? (
//             <div className="p-4 text-center">Loading conversations...</div>
//           ) : (
//             conversations.map((conversation) => (
//               <div
//                 key={conversation._id}
//                 onClick={() => setActiveConversation(conversation)}
//                 className={`p-3 flex items-start hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200 ${
//                   activeConversation?._id === conversation._id
//                     ? "bg-slate-50 dark:bg-slate-700"
//                     : ""
//                 } ${
//                   conversation.isBlocked ? "opacity-70 cursor-not-allowed" : ""
//                 }`}
//               >
//                 <div className="relative">
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
//                       conversation.unreadCount > 0
//                         ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400"
//                         : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
//                     }`}
//                   >
//                     {getOtherParticipant(conversation)?.name?.charAt(0) || "U"}
//                   </div>
//                 </div>
//                 <div className="ml-3 flex-1 min-w-0">
//                   <div className="flex justify-between items-baseline">
//                     <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
//                       {getOtherParticipant(conversation)?.name ||
//                         "Unknown User"}
//                     </h4>
//                     {conversation.updatedAt && (
//                       <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
//                         {formatTime(conversation.updatedAt)}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
//                     {conversation.course?.title || "Course"}
//                   </p>
//                   <p
//                     className={`text-xs mt-1 truncate ${
//                       conversation.unreadCount > 0
//                         ? "font-medium text-slate-900 dark:text-white"
//                         : "text-slate-500 dark:text-slate-400"
//                     }`}
//                   >
//                     {conversation.lastMessage?.content || "No messages yet"}
//                   </p>
//                   {conversation.isBlocked && (
//                     <div className="flex items-center text-xs text-red-500 dark:text-red-400 mt-1">
//                       <Ban size={14} className="mr-1" />
//                       <span>Messaging blocked</span>
//                     </div>
//                   )}
//                 </div>
//                 {conversation.unreadCount > 0 && !conversation.isBlocked && (
//                   <div className="ml-2 min-w-[18px] h-[18px] rounded-full bg-fidel-500 text-white text-xs flex items-center justify-center">
//                     {conversation.unreadCount}
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>

//         {/* Chat area */}
//         <div className="flex-1 flex flex-col">
//           {activeConversation ? (
//             <>
//               <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
//                 <div className="flex items-center">
//                   <div className="relative">
//                     <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
//                       {getOtherParticipant(activeConversation)?.name?.charAt(
//                         0
//                       ) || "U"}
//                     </div>
//                     {getOtherParticipant(activeConversation)?.online && (
//                       <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
//                     )}
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium text-slate-900 dark:text-white">
//                       {getOtherParticipant(activeConversation)?.name ||
//                         "Unknown User"}
//                     </h3>
//                     <p className="text-xs text-slate-500 dark:text-slate-400">
//                       {activeConversation.course?.title || "Course"}
//                     </p>
//                   </div>
//                 </div>
//                 {user.type === "instructor" && (
//                   <button
//                     onClick={toggleBlockConversation}
//                     className={`p-2 rounded-full ${
//                       activeConversation.isBlocked
//                         ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
//                         : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
//                     } transition-colors duration-200`}
//                     title={
//                       activeConversation.isBlocked
//                         ? "Unblock student"
//                         : "Block student"
//                     }
//                     disabled={isLoading}
//                   >
//                     <Ban size={18} />
//                   </button>
//                 )}
//                 {user.type === "student" && activeConversation.isBlocked && (
//                   <div className="flex items-center text-sm text-red-500 dark:text-red-400 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
//                     <Ban size={16} className="mr-1" />
//                     <span>Blocked</span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                 {isLoading && !messages.length ? (
//                   <div className="text-center py-4">Loading messages...</div>
//                 ) : messages.length === 0 ? (
//                   <div className="text-center py-4 text-slate-500 dark:text-slate-400">
//                     No messages yet. Start the conversation!
//                   </div>
//                 ) : (
//                   messages.map((message) => (
//                     <div
//                       key={message._id}
//                       className={`flex ${
//                         message.isCurrentUser ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`relative rounded-lg px-4 py-2 max-w-[70%] ${
//                           message.isCurrentUser
//                             ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-800 dark:text-fidel-300 rounded-tr-none"
//                             : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none"
//                         } ${message.type === "file" ? "w-full max-w-md" : ""}`}
//                       >
//                         {editingMessageId === message._id ? (
//                           <div className="flex flex-col">
//                             <textarea
//                               ref={editInputRef}
//                               value={editMessageContent}
//                               onChange={(e) =>
//                                 setEditMessageContent(e.target.value)
//                               }
//                               className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded p-2 mb-2 focus:outline-none focus:ring-1 focus:ring-fidel-500"
//                               rows={3}
//                             />
//                             <div className="flex justify-end space-x-2">
//                               <button
//                                 onClick={() => setEditingMessageId(null)}
//                                 className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600"
//                               >
//                                 <X size={16} />
//                               </button>
//                               <button
//                                 onClick={handleUpdateMessage}
//                                 className="p-1 rounded-full bg-fidel-500 text-white hover:bg-fidel-600"
//                                 disabled={isLoading}
//                               >
//                                 <Check size={16} />
//                               </button>
//                             </div>
//                           </div>
//                         ) : (
//                           <>
//                             {message.type === "text" ? (
//                               <p className="text-sm">{message.content}</p>
//                             ) : (
//                               <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-slate-800/50 rounded">
//                                 <div className="flex items-center">
//                                   {getFileIcon(message.fileInfo?.type)}
//                                   <div>
//                                     <p className="text-sm font-medium truncate max-w-[180px]">
//                                       {message.fileInfo?.name}
//                                     </p>
//                                     <p className="text-xs text-slate-500 dark:text-slate-400">
//                                       {formatFileSize(message.fileInfo?.size)}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center">
//                                   <a
//                                     href={message.fileInfo?.url}
//                                     download={message.fileInfo?.name}
//                                     className="ml-2 p-1 text-fidel-500 hover:text-fidel-600 dark:hover:text-fidel-400"
//                                   >
//                                     <Download size={16} />
//                                   </a>
//                                 </div>
//                               </div>
//                             )}
//                             <div
//                               className={`flex items-center mt-1 ${
//                                 message.isCurrentUser
//                                   ? "justify-end"
//                                   : "justify-start"
//                               } space-x-2`}
//                             >
//                               <p
//                                 className={`text-xs ${
//                                   message.isCurrentUser
//                                     ? "text-fidel-600/70 dark:text-fidel-400/70"
//                                     : "text-slate-500 dark:text-slate-400"
//                                 }`}
//                               >
//                                 {formatTime(message.createdAt)}
//                               </p>
//                               {message.isCurrentUser && (
//                                 <>
//                                   <button
//                                     onClick={() =>
//                                       handleDeleteMessage(message._id)
//                                     }
//                                     className="p-1 text-slate-400 hover:text-red-500"
//                                     disabled={isLoading}
//                                   >
//                                     <Trash size={14} />
//                                   </button>
//                                   {message.type === "text" &&
//                                     !activeConversation.isBlocked && (
//                                       <button
//                                         onClick={() => {
//                                           setEditingMessageId(message._id);
//                                           setEditMessageContent(
//                                             message.content
//                                           );
//                                         }}
//                                         className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
//                                       >
//                                         <Edit size={14} />
//                                       </button>
//                                     )}
//                                 </>
//                               )}
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               {activeConversation.isBlocked ? (
//                 <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-red-50 dark:bg-red-900/20">
//                   <div className="text-center text-red-500 dark:text-red-400 text-sm">
//                     <AlertCircle className="inline mr-2" size={16} />
//                     {user.type === "instructor"
//                       ? "You have blocked this student from messaging"
//                       : "You have been blocked from messaging by the instructor"}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="p-3 border-t border-slate-200 dark:border-slate-700">
//                   {file && (
//                     <div className="flex items-center justify-between mb-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
//                       <div className="flex items-center">
//                         {getFileIcon(file.type)}
//                         <span className="text-sm truncate max-w-[200px]">
//                           {file.name}
//                         </span>
//                       </div>
//                       <button
//                         onClick={() => setFile(null)}
//                         className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   )}
//                   <div className="flex items-end gap-3">
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={handleFileChange}
//                       className="hidden"
//                       accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
//                     />
//                     <button
//                       onClick={triggerFileInput}
//                       className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
//                       title="Attach file"
//                       disabled={isLoading}
//                     >
//                       <Upload size={18} />
//                     </button>
//                     <div className="flex-1 relative">
//                       <textarea
//                         placeholder="Type a message..."
//                         rows={1}
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter" && !e.shiftKey) {
//                             e.preventDefault();
//                             handleSendMessage();
//                           }
//                         }}
//                         className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
//                         disabled={isLoading}
//                       />
//                     </div>
//                     <button
//                       onClick={handleSendMessage}
//                       disabled={(!newMessage.trim() && !file) || isLoading}
//                       className={`p-2.5 rounded-lg transition-colors duration-200 shadow-sm ${
//                         (newMessage.trim() || file) && !isLoading
//                           ? "bg-fidel-500 text-white hover:bg-fidel-600"
//                           : "bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed"
//                       }`}
//                     >
//                       <Send size={18} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center p-6">
//                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
//                   <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
//                 </div>
//                 <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
//                   {conversations.length === 0
//                     ? "No conversations"
//                     : "No conversation selected"}
//                 </h3>
//                 <p className="text-xs text-slate-500 dark:text-slate-400">
//                   {conversations.length === 0
//                     ? "You don't have any conversations yet"
//                     : "Select a conversation from the list to start messaging"}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default MessagesTab;

import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
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
import axios from "axios";

export const MessagesTab = ({ courseId, instructorId, currentUserType }) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [activeCourse, setActiveCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const editInputRef = useRef(null);

  // Safe access to conversation data
  const getInstructorInitial = (conversation) => {
    if (!conversation?.instructor?.name) return "?";
    return conversation.instructor.name.charAt(0).toUpperCase();
  };

  const getInstructorName = (conversation) => {
    return conversation?.instructor?.name || "Unknown Instructor";
  };

  const isInstructorOnline = (conversation) => {
    return conversation?.instructor?.online || false;
  };

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get("/api/conversations", {
          withCredentials: true,
        });
        setConversations(response.data || []);
      } catch (err) {
        setError("Failed to load conversations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when active course changes
  useEffect(() => {
    if (!activeCourse) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${activeCourse.id}`, {
          withCredentials: true,
        });
        setMessages(response.data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    fetchMessages();
  }, [activeCourse]);

  // Socket.io real-time setup
  useEffect(() => {
    if (!socket || !activeCourse) return;

    const roomId = `${activeCourse.id}_${activeCourse.instructor.id}`;
    socket.emit("joinConversation", roomId);

    // Register user with socket
    socket.emit("registerUser", user._id);

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      if (message.conversation === roomId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Listen for typing indicators
    socket.on("userTyping", ({ userId, isTyping }) => {
      if (userId !== user._id) {
        setIsTyping(isTyping);
        setTypingUser(userId);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.emit("leaveConversation", roomId);
    };
  }, [socket, activeCourse, user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus edit input when editing
  useEffect(() => {
    if (editingMessageId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingMessageId]);

  const handleSendMessage = async () => {
    if (
      (!newMessage.trim() && !file) ||
      !activeCourse ||
      activeCourse.isBlocked
    )
      return;

    try {
      let messageData = {
        conversationId: activeCourse.id,
        content: newMessage,
      };

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("conversationId", activeCourse.id);

        const response = await axios.post("/api/messages", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        messageData = response.data;
      } else {
        await axios.post(
          "/api/messages",
          { conversationId: activeCourse.id, content: newMessage },
          { withCredentials: true }
        );
      }

      setNewMessage("");
      setFile(null);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleTyping = () => {
    if (!socket || !activeCourse) return;

    // Emit typing start
    socket.emit("typing", {
      conversationId: `${activeCourse.id}_${activeCourse.instructor.id}`,
      userId: user._id,
      isTyping: true,
    });

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        conversationId: `${activeCourse.id}_${activeCourse.instructor.id}`,
        userId: user._id,
        isTyping: false,
      });
    }, 2000);
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
      const maxSize = 10 * 1024 * 1024; // 10MB

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
    setEditingMessageId(null);
  };

  const toggleBlockStudent = async (courseId) => {
    try {
      await axios.put(
        `/api/conversations/${courseId}/block`,
        {},
        { withCredentials: true }
      );
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === courseId ? { ...conv, isBlocked: !conv.isBlocked } : conv
        )
      );
    } catch (err) {
      console.error("Error toggling block:", err);
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
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStartEditing = (message) => {
    if (
      message.sender._id !== user._id ||
      message.type === "file" ||
      activeCourse.isBlocked
    ) {
      return;
    }

    setEditingMessageId(message._id);
    setEditMessageContent(message.content);
  };

  const handleCancelEditing = () => {
    setEditingMessageId(null);
    setEditMessageContent("");
  };

  const handleSaveEdit = async () => {
    if (!editMessageContent.trim()) return;

    try {
      await axios.put(
        `/api/messages/${editingMessageId}`,
        { content: editMessageContent },
        { withCredentials: true }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === editingMessageId
            ? { ...msg, content: editMessageContent }
            : msg
        )
      );
      setEditingMessageId(null);
    } catch (err) {
      console.error("Error updating message:", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`/api/messages/${messageId}`, {
        withCredentials: true,
      });

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      if (editingMessageId === messageId) {
        setEditingMessageId(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div>Error: {error}</div>;

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

          {loading ? (
            <div className="p-4 text-center">Loading conversations...</div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center">No conversations found</div>
          ) : (
            conversations.map((conversation) => (
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
                    {getInstructorInitial(conversation)}
                  </div>
                  {isInstructorOnline(conversation) && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {getInstructorName(conversation)}
                    </h4>
                    {conversation.lastMessageTime && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {conversation.title || "Untitled Conversation"}
                  </p>
                  <p
                    className={`text-xs mt-1 truncate ${
                      conversation.unreadCount > 0
                        ? "font-medium text-slate-900 dark:text-white"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {conversation.lastMessage || "No messages yet"}
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
            ))
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {activeCourse ? (
            <>
              <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {activeCourse.instructor.name.charAt(0)}
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
                    key={message._id}
                    className={`flex ${
                      message.sender._id === user._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative rounded-lg px-4 py-2 max-w-[70%] ${
                        message.sender._id === user._id
                          ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-800 dark:text-fidel-300 rounded-tr-none"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none"
                      } ${message.type === "file" ? "w-full max-w-md" : ""}`}
                    >
                      {editingMessageId === message._id ? (
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
                                    {message.fileInfo?.name}
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
                          <div className="flex items-center justify-end space-x-2 mt-1">
                            <p
                              className={`text-xs ${
                                message.sender._id === user._id
                                  ? "text-fidel-600/70 dark:text-fidel-400/70"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                            {message.sender._id === user._id && (
                              <button
                                onClick={() => handleDeleteMessage(message._id)}
                                className="p-1 text-slate-400 hover:text-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            )}
                            {message.sender._id === user._id &&
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
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 rounded-tl-none max-w-[70%]">
                      <p className="text-sm italic">Typing...</p>
                    </div>
                  </div>
                )}
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
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
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

export default MessagesTab;

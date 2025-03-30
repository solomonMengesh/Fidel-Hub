// components/student-dashboard/MessagesTab.jsx
import { Search, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export const MessagesTab = () => {
  return (
    <div className="h-full flex flex-col">
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
            />
          </div>
        </div>
        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
          Filter
        </button>
      </div>

      <div className="flex h-[calc(100vh-230px)] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Contacts sidebar */}
        <div className="w-72 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Conversations
            </h3>
          </div>

          {[
            {
              name: "Dr. Mulugetta Bekele",
              avatar: "MB",
              message: "When do you plan to submit your assignment?",
              time: "10:45 AM",
              unread: true,
              online: true,
            },
            {
              name: "Prof. Desta Tadesse",
              avatar: "DT",
              message: "The next lecture will cover advanced topics...",
              time: "Yesterday",
              unread: false,
              online: false,
            },
            {
              name: "Samrawit Yonas",
              avatar: "SY",
              message: "Great work on your React project!",
              time: "Yesterday",
              unread: false,
              online: true,
            },
            {
              name: "Amanuel Gebremedhin",
              avatar: "AG",
              message: "Don't forget to check the Python tutorial I shared",
              time: "Monday",
              unread: false,
              online: false,
            },
            {
              name: "TA Support Group",
              avatar: "TS",
              message: "Amanuel: I'll be available during office hours...",
              time: "Monday",
              unread: false,
              online: false,
            },
          ].map((contact, i) => (
            <div
              key={i}
              className={cn(
                "p-3 flex items-start hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200",
                i === 0 ? "bg-slate-50 dark:bg-slate-700" : ""
              )}
            >
              <div className="relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                    contact.unread
                      ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  )}
                >
                  {contact.avatar}
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {contact.name}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {contact.time}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs mt-1 truncate",
                    contact.unread
                      ? "font-medium text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {contact.message}
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

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-fidel-100 dark:bg-fidel-900/30 flex items-center justify-center text-fidel-600 dark:text-fidel-400 text-sm font-medium">
                MB
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                Dr. Mulugetta Bekele
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Online
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg rounded-tl-none px-4 py-2 max-w-[70%]">
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  Hello John, I wanted to check on your progress with the
                  machine learning assignment. Have you been able to implement
                  the algorithms we discussed?
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                  10:30 AM
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-fidel-100 dark:bg-fidel-900/30 text-fidel-800 dark:text-fidel-300 rounded-lg rounded-tr-none px-4 py-2 max-w-[70%]">
                <p className="text-sm">
                  Hi Dr. Bekele, I've implemented the regression and
                  classification algorithms, but I'm having some issues with the
                  neural network part.
                </p>
                <p className="text-xs text-fidel-600/70 dark:text-fidel-400/70 mt-1 text-right">
                  10:35 AM
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg rounded-tl-none px-4 py-2 max-w-[70%]">
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  What specific issues are you encountering with the neural
                  network implementation?
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                  10:38 AM
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-fidel-100 dark:bg-fidel-900/30 text-fidel-800 dark:text-fidel-300 rounded-lg rounded-tr-none px-4 py-2 max-w-[70%]">
                <p className="text-sm">
                  The backpropagation algorithm isn't converging properly. I
                  think there might be an issue with my gradient calculation.
                </p>
                <p className="text-xs text-fidel-600/70 dark:text-fidel-400/70 mt-1 text-right">
                  10:40 AM
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg rounded-tl-none px-4 py-2 max-w-[70%]">
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  That's a common issue. When do you plan to submit your
                  assignment? I can help you troubleshoot the gradient
                  calculation.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                  10:45 AM
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
                ></textarea>
              </div>
              <button className="p-2.5 rounded-lg bg-fidel-500 text-white hover:bg-fidel-600 transition-colors duration-200 shadow-sm">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

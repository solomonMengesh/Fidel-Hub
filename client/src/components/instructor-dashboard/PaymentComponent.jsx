import { useState } from "react";
import Dashboard from "./Dashboard";
import Withdrawal from "./Withdrawal";
import Transactions from "./Transactions";
import { 
  ArrowRightLeft,
  History,
  PieChart
} from "lucide-react";

const PaymentComponent = ({ user }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Payments</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your earnings, withdrawals, and transactions</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={[
              "flex",
              "items-center",
              "gap-2",
              "px-4",
              "py-3",
              "font-medium",
              "relative",
              activeTab === "dashboard"
                ? "text-fidel-600 dark:text-fidel-400"
                : "text-gray-500 dark:text-gray-400 hover:text-fidel-600 dark:hover:text-teal-400"
            ].join(" ")}
            onClick={() => setActiveTab("dashboard")}
            aria-label="Dashboard"
          >
            <PieChart className="h-4 w-4" />
            Dashboard
            {activeTab === "dashboard" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fidel-600 dark:bg-fidel-400 rounded-t-full" />
            )}
          </button>
          <button
            className={[
              "flex",
              "items-center",
              "gap-2",
              "px-4",
              "py-3",
              "font-medium",
              "relative",
              activeTab === "withdraw"
                ? "text-fidel-600 dark:text-fidel-400"
                : "text-gray-500 dark:text-gray-400 hover:text-fidel-600 dark:hover:text-teal-400"
            ].join(" ")}
            onClick={() => setActiveTab("withdraw")}
            aria-label="Withdraw Funds"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Withdraw Funds
            {activeTab === "withdraw" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fidel-600 dark:bg-fidel-400 rounded-t-full" />
            )}
          </button>
          <button
            className={[
              "flex",
              "items-center",
              "gap-2",
              "px-4",
              "py-3",
              "font-medium",
              "relative",
              activeTab === "history"
                ? "text-teal-600 dark:text-teal-400"
                : "text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
            ].join(" ")}
            onClick={() => setActiveTab("history")}
            aria-label="Transaction History"
          >
            <History className="h-4 w-4" />
            Transaction History
            {activeTab === "history" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fidel-600 dark:bg-fidel-400 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "withdraw" && <Withdrawal user={user} />}
          {activeTab === "history" && <Transactions />}
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
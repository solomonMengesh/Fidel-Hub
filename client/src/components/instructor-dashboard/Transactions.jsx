import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Transactions = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchWithdrawalHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/withdrawals/history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setWithdrawals(response.data.withdrawals || []);
    } catch (error) {
      toast.error("Failed to fetch transaction history");
      console.error("History fetch error:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalHistory();
  }, []);

  const downloadCSV = () => {
    const headers = ["Date", "Amount (ETB)", "Status", "Bank Name", "Account Number", "Reference"];
    const rows = withdrawals.map(w => [
      new Date(w.createdAt).toLocaleString('en-US'),
      w.amount,
      w.status,
      w.bankName,
      w.accountNumber,
      w.reference
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transaction_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Transaction History</h1>
        <p className="text-gray-500 dark:text-gray-400">View your withdrawal history</p>
      </div>

      <Card className="border-none bg-white dark:bg-gray-900 shadow-lg rounded-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            {withdrawals.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-teal-200 dark:border-fidel-700 text-teal-600 dark:text-fidel-400 hover:bg-teal-50 dark:hover:bg-fidel-900/20 transition-all duration-300"
                onClick={downloadCSV}
                aria-label="Download Transaction History as CSV"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : withdrawals.length > 0 ? (
            <div className="space-y-3">
              {withdrawals.map((withdrawal) => (
                <div 
                  key={withdrawal.reference} 
                  className="flex items-center justify-between p-4 border rounded-lg border-gray-200 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors group"
                  role="button"
                  tabIndex={0}
                  aria-label={`Transaction: ${withdrawal.amount} ETB`}
                >
                  <div className="flex items-center gap-4">
                    <div className={[
                      "p-3",
                      "rounded-xl",
                      withdrawal.status === 'success' ? 'bg-teal-100 text-fidel-600 dark:bg-teal-900/30 dark:text-fidel-300' :
                      withdrawal.status === 'failed' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300'
                    ].join(" ")}>
                      {withdrawal.status === 'success' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : withdrawal.status === 'failed' ? (
                        <XCircle className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{withdrawal.amount?.toLocaleString()} ETB</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className="text-xs h-5 px-1.5 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {withdrawal.bankName}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="text-xs h-5 px-1.5 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {withdrawal.accountNumber}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={
                        withdrawal.status === 'success' ? 'success' :
                        withdrawal.status === 'failed' ? 'destructive' :
                        'warning'
                      }
                      className="px-3 py-1"
                    >
                      {withdrawal.status?.charAt(0)?.toUpperCase() + withdrawal.status?.slice(1)}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wallet className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">No transactions yet</h4>
              <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                Your withdrawal history will appear here once you make your first transaction
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
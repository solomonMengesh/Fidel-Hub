import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Wallet,
  Loader2,
  AlertCircle,
  ChevronRight,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const allBanks = [
  { code: "01", name: "Commercial Bank of Ethiopia", group: "ARGY", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDMOEodWobyuf65gHVqsHFyz7EdKPxVQao8g&s" },
  { code: "656", name: "Awash Bank", group: "www.xyz", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Awash_International_Bank.png" },
  { code: "880", name: "Dashen Bank", group: "GTS, YM Dashem Bank", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:0qQQ2sCu-SN4W-NKPGmMcde839Wf-T43QieuPQ&s" },
  { code: "347", name: "Bank of Abyssinia", group: "www.xyz", logoUrl: "https://play-lh.googleusercontent.com/W6pOvwi0XCs8nNjZzcnZ91tXn29CBPUlLu4h8JQ1RCPPNMKyEVxYCPEuc4fCaLtw0A" },
  { code: "979", name: "Nib International Bank", group: "ARGY", logoUrl: "https://cdn.brandfetch.io/nibbanksc.com/fallback/lettermark/theme/dark/h/256/w/256/icon?c=1bfwsmEH20zzEfSNTed" },
  { code: "534", name: "Hibret Bank", group: "ARGY", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:0qQxsLRrbrl2-JJdGvS4dm9guyE7hlvNgE-9aQ&s" },
  { code: "772", name: "Addis International Bank", group: "Aday Bank", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:0qQ5xJk58kpxvdkyvI6uNnoplniLFTdFM9sSKQ&s" },
  { code: "207", name: "Ahadu Bank", group: "Aday Bank", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:0qSbLF5q6ZfOR8yvejolzXyvDvB3k3f7ipsRDw&s" },
  { code: "130", name: "Amhara Bank", group: "www.xyz", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:0qR3Sm4b4lsVcSBvaQY1fnpgAXFHP3Ml23pLmw&s" },
  { code: "571", name: "Berhan Bank", group: "ARGY", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:0qR5SdARCSW4zmnh2PXUIx_8WpwHZ7JaznE5VA&s" },
  { code: "not-available", name: "Bunna Bank", group: "ARGY", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:0qQXqv_9ilMgi74wWlwA3aGMhLEMEr7zzBNqeg&s" },
  { code: "893", name: "Cooperative Bank of Oromia", group: "GTS, YM Dashem Bank", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:0qTZi5mVRxr713DUw1vF-ULNlM1QXiL46r8QVQ&s" },
  { code: "not-available", name: "Enat Bank", group: "ERAT BANK", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:0qT89NAKBpsHuoyXyJtnr9ThPtb4LsBry4yraw&s" },
  { code: "not-available", name: "Gadaa Bank", group: "ERAT BANK", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:0qQBRjvx-6kMckIIeye3IwgLtXpdYKau3yNePw&s" },
  { code: "not-available", name: "Goh Betoch Bank", group: "ERAT BANK", logoUrl: "https://www.ethiopianreporterjobs.com/wp-content/uploads/2022/10/logo1.jpg" },
  { code: "301", name: "Global Bank Ethiopia", group: "GTS, YM Dashem Bank", logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:0qSPvgAeFZN9AQnfDhAJaULz09Yo-WWjTlB6uQ&s" }
];

const bankGroups = [
  { banks: allBanks.filter(bank => bank.group === "Aday Bank") },
  { banks: allBanks.filter(bank => bank.group === "www.xyz") },
  { banks: allBanks.filter(bank => bank.group === "ARGY") },
  { banks: allBanks.filter(bank => bank.group === "GTS, YM Dashem Bank") },
  { banks: allBanks.filter(bank => bank.group === "ERAT BANK") }
];

const Withdrawal = ({ user }) => {
  const [bankDetails, setBankDetails] = useState({
    accountName: user?.bankDetails?.accountName || "",
    accountNumber: user?.bankDetails?.accountNumber || "",
    bankCode: user?.bankDetails?.bankCode || "01",
    bankName: user?.bankDetails?.bankName || "Commercial Bank of Ethiopia",
  });
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBankSelection, setShowBankSelection] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBankGroups = bankGroups.map(group => ({
    ...group,
    banks: group.banks.filter(bank => 
      bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.banks.length > 0);

  const fetchBalance = async () => {
    try {
      setBalanceLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/withdrawals/balance",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBalance(response.data.balance);
    } catch (error) {
      toast.error("Failed to fetch balance");
      console.error("Balance fetch error:", error);
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleBankSelect = (value) => {
    const selectedBank = allBanks.find(bank => bank.code === value);
    setBankDetails(prev => ({ 
      ...prev, 
      bankCode: value,
      bankName: selectedBank?.name || "" 
    }));
    setShowBankSelection(false);
    setError(null);
  };

  const handleWithdraw = async () => {
    setError(null);
    
    if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankCode) {
      toast.error("Please fill all bank details");
      return;
    }

    if (!amount || isNaN(amount)) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) < 100) {
      toast.error("Minimum withdrawal amount is 100 ETB");
      return;
    }

    if (parseFloat(amount) > balance) {
      toast.error("Amount exceeds available balance");
      return;
    }

    setIsLoading(true);
    
    try {
      const payload = {
        account_name: bankDetails.accountName,
        account_number: bankDetails.accountNumber,
        bank_code: bankDetails.bankCode,
        bank_name: bankDetails.bankName,
        amount: parseFloat(amount)
      };

      const response = await axios.post(
        "http://localhost:5000/api/withdrawals/withdraw/test",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
        }
      );
    
      if (response.data && response.data.success === false) {
        const errorMessage = response.data.message || "Withdrawal failed. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      setAmount("");
      await fetchBalance();
      toast.success(`Withdrawal of ${amount} ETB initiated successfully`);
    } catch (error) {
      console.error("Withdrawal error:", error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setError("Withdrawal failed. Please try again.");
        toast.error("Withdrawal failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 classNamenehm4 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Withdraw Funds</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your withdrawals</p>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="bg-gradient-to-br from-fidel-500 to-fidel-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium opacity-80">Available Balance</p>
                {balanceLoading ? (
                  <Skeleton className="h-8 w-32 bg-fidel-400/30 mt-1" />
                ) : (
                  <p className="text-2xl font-bold mt-1">
                    {balance?.toLocaleString('en-US') || 0} ETB
                  </p>
                )}
              </div>
              <Wallet className="h-6 w-6 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {showBankSelection ? (
        <Card className="border-none bg-white dark:bg-gray-900 shadow-lg rounded-xl">
          <CardHeader />
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search banks..."
                className="pl-9 h-11 rounded-lg border-gray-200 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search banks"
              />
            </div>
            
            <div className="space-y-8">
              {filteredBankGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{group.title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {group.banks.map((bank, bankIndex) => (
                      <button
                        key={bankIndex}
                        onClick={() => handleBankSelect(bank.code)}
                        className={[
                          "p-4",
                          "border",
                          "rounded-lg",
                          "text-left",
                          "hover:bg-teal-50",
                          "dark:hover:bg-teal-900/20",
                          "transition-colors",
                          bankDetails.bankCode === bank.code ? "ring-2 ring-teal-500" : "border-gray-200 dark:border-gray-700"
                        ].join(" ")}
                        aria-label={`Select ${bank.name}`}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={bank.logoUrl} 
                            alt={`${bank.name} logo`} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{bank.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {groupIndex < filteredBankGroups.length - 1 && <hr className="my-6 border-gray-200 dark:border-gray-700" />}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full h-11 rounded-lg border-teal-200 dark:border-teal-700 text-fidel-600 dark:text-fidel-400 hover:bg-teal-50 dark:hover:bg-teal-900/20"
              onClick={() => setShowBankSelection(false)}
              aria-label="Back to Withdrawal Form"
            >
              Back to Withdrawal Form
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-none bg-white dark:bg-gray-900 shadow-lg rounded-xl">
          <CardHeader />
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/30 flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="accountName" className="text-gray-700 dark:text-gray-300">Account Name</Label>
                <Input
                  id="accountName"
                  name="accountName"
                  value={bankDetails.accountName}
                  onChange={handleBankDetailsChange}
                  placeholder="John Doe"
                  className="h-12 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                  aria-label="Account Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-gray-700 dark:text-gray-300">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={bankDetails.accountNumber}
                  onChange={handleBankDetailsChange}
                  placeholder="1000234567890"
                  className="h-12 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                  aria-label="Account Number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Bank</Label>
              <button
                onClick={() => setShowBankSelection(true)}
                className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-left hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors flex items-center justify-between"
                aria-label={`Select bank, current: ${bankDetails.bankName}`}
              >
                <span className="text-gray-900 dark:text-gray-100">{bankDetails.bankName}</span>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">Amount (ETB)</Label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 dark:text-gray-400">ETB</span>
                <Input
                  id="amount"
                  type="number"
                  className="h-12 pl-12 pr-16 rounded-lg border-gray-200 dark:border-gray-700 text-lg font-medium focus:ring-2 focus:ring-fidel-500 transition-all duration-300"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="100"
                  max={balance}
                  aria-label="Amount in ETB"
                />
                <button 
                  onClick={() => setAmount(balance)}
                  className="absolute right-4 top-3 text-sm font-medium text-fidel-600 dark:text-fidel-400 hover:text-fidel-700 dark:hover:text-teal-300 transition-colors"
                  aria-label="Set maximum amount"
                >
                  Max
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Available: {balance?.toLocaleString('en-US') || 0} ETB
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-6">
            <Button 
              onClick={handleWithdraw}
              disabled={isLoading || balanceLoading}
              className="w-full h-12 rounded-lg bg-fidel-600 hover:bg-fidel-700 text-white text-lg shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="Initiate Withdrawal"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Withdraw Funds
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 w-full space-y-3 border border-fidel-200 dark:border-fidel-800/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-fidel-600 dark:text-fidel-400" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Please ensure your bank details are correct before proceeding with the withdrawal.    
                  <br />
                  Funds will be transferred to the provided account name and number.
                  <br />
                  If you have any issues, please contact support.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-fidel-600 dark:text-fidel-400" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Minimum withdrawal amount: 100 ETB
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Withdrawal;
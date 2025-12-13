"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { getTransactionHistory, TransactionDetail } from "@/lib/cosmos-client";
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Clock, 
  ExternalLink, 
  Award,
  RefreshCw,
  Copy,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { LUMERA_CONFIG } from "@/lib/lumera-config";

export default function TransactionHistoryViewer() {
  const { address: connectedAddress } = useWallet();
  const [searchAddress, setSearchAddress] = useState("");
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Set connected address as default when wallet is connected
  useEffect(() => {
    if (connectedAddress && !searchAddress) {
      setSearchAddress(connectedAddress);
      loadTransactions(connectedAddress);
    }
  }, [connectedAddress]);

  const loadTransactions = async (address: string) => {
    if (!address || address.trim() === "") {
      setError("Please enter a valid address");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransactions([]);

    try {
      const txs = await getTransactionHistory(address.trim());
      setTransactions(txs);
      if (txs.length === 0) {
        setError("No transactions found for this address");
      }
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Failed to fetch transactions. Please check the address and try again.");
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchAddress.trim()) {
      loadTransactions(searchAddress.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 12)}...${addr.slice(-8)}`;
  };

  const getTypeIcon = (type: string) => {
    if (type.includes("Send") || type.includes("Transfer")) {
      return <ArrowUpRight className="text-orange-400" size={20} />;
    } else if (type.includes("Delegate") && !type.includes("Undelegate")) {
      return <TrendingUp className="text-emerald-400" size={20} />;
    } else if (type.includes("Undelegate")) {
      return <ArrowDownLeft className="text-red-400" size={20} />;
    } else if (type.includes("Reward") || type.includes("Claim")) {
      return <Award className="text-yellow-400" size={20} />;
    }
    return <ArrowDownLeft className="text-violet-400" size={20} />;
  };

  const formatDenom = (denom?: string) => {
    if (!denom) return "LUME";
    if (denom === "ulume") return "LUME";
    return denom.toUpperCase();
  };

  const getTypeColor = (type: string) => {
    if (type.includes("Send")) return "text-orange-400 bg-orange-950/30 border border-orange-500/30";
    if (type.includes("Delegate") && !type.includes("Undelegate")) return "text-emerald-400 bg-emerald-950/30 border border-emerald-500/30";
    if (type.includes("Undelegate")) return "text-red-400 bg-red-950/30 border border-red-500/30";
    if (type.includes("Reward") || type.includes("Claim")) return "text-yellow-400 bg-yellow-950/30 border border-yellow-500/30";
    return "text-violet-400 bg-violet-950/30 border border-violet-500/30";
  };

  const getStatusIcon = (status: string) => {
    if (status === "success") {
      return <CheckCircle className="text-emerald-400" size={16} />;
    } else if (status === "failed") {
      return <XCircle className="text-red-400" size={16} />;
    }
    return <Clock className="text-yellow-400" size={16} />;
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#15151a] to-[#1e1e24] rounded-3xl p-8 border-2 border-violet-500/20 shadow-2xl backdrop-blur-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-xl glow-primary border-2 border-violet-400/40">
              <Search className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                Transaction History Viewer
              </h2>
              <p className="text-sm text-gray-400">
                Enter any wallet address to view its transaction history
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter wallet address (e.g., lumera1...)"
                className="w-full px-6 py-4 bg-[#0d0d12] border-2 border-violet-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 transition-all duration-200 font-mono text-sm"
                style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
              />
              {searchAddress && (
                <button
                  onClick={() => copyToClipboard(searchAddress)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-violet-500/10 rounded-lg transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <CheckCircle className="text-emerald-400" size={18} />
                  ) : (
                    <Copy className="text-gray-400 hover:text-violet-400" size={18} />
                  )}
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchAddress.trim()}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg glow-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Search</span>
                </>
              )}
            </button>
            {connectedAddress && (
              <button
                onClick={() => {
                  setSearchAddress(connectedAddress);
                  loadTransactions(connectedAddress);
                }}
                className="px-6 py-4 bg-violet-500/10 border-2 border-violet-500/30 hover:border-violet-500/50 text-violet-300 rounded-xl transition-all duration-200 font-semibold text-sm hover:bg-violet-500/20"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Use My Wallet
              </button>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-950/50 border-2 border-red-500/30 rounded-xl flex items-start gap-3"
            >
              <XCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Transactions List */}
      {transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#15151a] to-[#1e1e24] rounded-3xl p-8 border-2 border-violet-500/20 shadow-2xl backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Transactions
                </h3>
                <p className="text-sm text-gray-400">
                  {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'} found
                </p>
              </div>
              <button
                onClick={() => searchAddress && loadTransactions(searchAddress)}
                disabled={isLoading}
                className="p-3 hover:bg-violet-500/10 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-110 active:scale-95 border-2 border-violet-400/30"
                title="Refresh transactions"
              >
                <RefreshCw
                  size={20}
                  className={isLoading ? "animate-spin text-violet-400" : "text-violet-400"}
                />
              </button>
            </div>

            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.hash || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-[#0d0d12] rounded-2xl p-6 border-2 border-violet-500/10 hover:border-violet-500/30 transition-all duration-300 hover:scale-[1.01] group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="mt-1">{getTypeIcon(tx.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-bold text-white text-lg" style={{ fontFamily: 'var(--font-poppins)' }}>
                            {tx.type}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getTypeColor(tx.type)}`}>
                            {getStatusIcon(tx.status)}
                            {tx.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                          <Clock size={14} />
                          {tx.timestamp}
                        </p>
                        
                        {tx.to && (
                          <p className="text-xs text-gray-500 mb-1">
                            To: <span className="font-mono text-gray-400">{formatAddress(tx.to)}</span>
                            <button
                              onClick={() => copyToClipboard(tx.to!)}
                              className="ml-2 p-1 hover:bg-violet-500/10 rounded"
                            >
                              <Copy className="text-gray-500 hover:text-violet-400" size={12} />
                            </button>
                          </p>
                        )}
                        {tx.validatorAddress && (
                          <p className="text-xs text-gray-500 mb-1">
                            Validator: <span className="font-mono text-gray-400">{formatAddress(tx.validatorAddress)}</span>
                          </p>
                        )}
                        {tx.memo && (
                          <p className="text-xs text-gray-500 mb-2 italic bg-violet-500/5 px-3 py-2 rounded-lg border border-violet-500/10">
                            "{tx.memo}"
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                          <span>Block: {tx.height}</span>
                          <a
                            href={`${LUMERA_CONFIG.rest}/cosmos/tx/v1beta1/txs/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-violet-400 hover:text-violet-300 hover:underline font-semibold transition-colors"
                          >
                            View on Explorer <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                    {tx.amount && (
                      <div className="text-right ml-3 flex-shrink-0">
                        <p className="font-bold text-white text-lg whitespace-nowrap" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {parseFloat(tx.amount).toFixed(6)} {formatDenom(tx.denom)}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

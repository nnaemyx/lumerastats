"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { getAllBalances, getTransactionHistory, formatTokenAmount } from "@/lib/cosmos-client";
import { 
  Plus, 
  X, 
  Wallet, 
  Copy,
  CheckCircle,
  RefreshCw,
  Loader2,
  Eye,
  EyeOff,
  TrendingUp,
  Activity,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WatchedWallet {
  address: string;
  name?: string;
  balances: Array<{ denom: string; amount: string }>;
  transactionCount: number;
  isLoading: boolean;
  lastUpdated: string;
}

export default function MultiWalletWatchlist() {
  const { address: connectedAddress } = useWallet();
  const [watchedWallets, setWatchedWallets] = useState<WatchedWallet[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load watched wallets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("watched_wallets");
    if (saved) {
      try {
        const wallets = JSON.parse(saved);
        setWatchedWallets(wallets);
        // Refresh all wallets
        refreshAllWallets(wallets);
      } catch (e) {
        console.error("Error loading watched wallets:", e);
      }
    }
  }, []);

  // Auto-add connected wallet if not already in watchlist
  useEffect(() => {
    if (connectedAddress && watchedWallets.length === 0) {
      const isAlreadyWatched = watchedWallets.some(w => w.address === connectedAddress);
      if (!isAlreadyWatched) {
        addWallet(connectedAddress, "My Wallet");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedAddress]);

  const saveToLocalStorage = (wallets: WatchedWallet[]) => {
    localStorage.setItem("watched_wallets", JSON.stringify(wallets));
  };

  const fetchWalletData = async (address: string): Promise<{ balances: Array<{ denom: string; amount: string }>, transactionCount: number }> => {
    try {
      const [balances, transactions] = await Promise.all([
        getAllBalances(address),
        getTransactionHistory(address)
      ]);
      return {
        balances: balances || [],
        transactionCount: transactions.length
      };
    } catch (error) {
      console.error(`Error fetching data for ${address}:`, error);
      return {
        balances: [],
        transactionCount: 0
      };
    }
  };

  const refreshAllWallets = async (wallets: WatchedWallet[] = watchedWallets) => {
    setIsRefreshing(true);
    const updated = await Promise.all(
      wallets.map(async (wallet) => {
        const data = await fetchWalletData(wallet.address);
        return {
          ...wallet,
          ...data,
          isLoading: false,
          lastUpdated: new Date().toISOString()
        };
      })
    );
    setWatchedWallets(updated);
    saveToLocalStorage(updated);
    setIsRefreshing(false);
  };

  const refreshWallet = async (index: number) => {
    const wallet = watchedWallets[index];
    setWatchedWallets(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isLoading: true };
      return updated;
    });

    const data = await fetchWalletData(wallet.address);
    const updated = [...watchedWallets];
    updated[index] = {
      ...wallet,
      ...data,
      isLoading: false,
      lastUpdated: new Date().toISOString()
    };
    setWatchedWallets(updated);
    saveToLocalStorage(updated);
  };

  const addWallet = async (address: string, name?: string) => {
    if (!address || address.trim() === "") return;
    
    const trimmedAddress = address.trim();
    
    // Check if already exists
    if (watchedWallets.some(w => w.address === trimmedAddress)) {
      alert("This wallet is already in your watchlist");
      return;
    }

    setIsAdding(true);
    const data = await fetchWalletData(trimmedAddress);
    
    const newWallet: WatchedWallet = {
      address: trimmedAddress,
      name: name || `Wallet ${watchedWallets.length + 1}`,
      ...data,
      isLoading: false,
      lastUpdated: new Date().toISOString()
    };

    const updated = [...watchedWallets, newWallet];
    setWatchedWallets(updated);
    saveToLocalStorage(updated);
    setNewAddress("");
    setNewName("");
    setIsAdding(false);
  };

  const removeWallet = (index: number) => {
    const updated = watchedWallets.filter((_, i) => i !== index);
    setWatchedWallets(updated);
    saveToLocalStorage(updated);
  };

  const handleAddWallet = () => {
    if (newAddress.trim()) {
      addWallet(newAddress.trim(), newName.trim() || undefined);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddWallet();
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 12)}...${addr.slice(-8)}`;
  };

  const formatDenom = (denom: string) => {
    if (denom === "ulume") return "LUME";
    if (denom.startsWith("u")) {
      return denom.slice(1).toUpperCase();
    }
    return denom.toUpperCase();
  };

  const getTotalValue = (balances: Array<{ denom: string; amount: string }>) => {
    return balances.reduce((sum, balance) => {
      const amount = parseFloat(formatTokenAmount(balance.amount, 6));
      return sum + amount;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Add Wallet Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-3xl p-8 border-2 border-teal-500/20 shadow-2xl backdrop-blur-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl glow-primary border-2 border-teal-400/40">
              <Eye className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                Multi-Wallet Watchlist
              </h2>
              <p className="text-sm text-gray-400">
                Track multiple wallet addresses in one dashboard
              </p>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter wallet address..."
                className="w-full px-6 py-4 bg-[#0a0f1a] border-2 border-teal-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/60 transition-all duration-200 font-mono text-sm mb-3"
                style={{ fontFamily: 'var(--font-fira-code)' }}
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Optional: Wallet name/label"
                className="w-full px-6 py-4 bg-[#0a0f1a] border-2 border-teal-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/60 transition-all duration-200 text-sm"
                style={{ fontFamily: 'var(--font-nunito)' }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddWallet}
                disabled={isAdding || !newAddress.trim()}
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg glow-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Add Wallet</span>
                  </>
                )}
              </button>
              {connectedAddress && (
                <button
                  onClick={() => {
                    setNewAddress(connectedAddress);
                    setNewName("My Wallet");
                  }}
                  className="px-6 py-4 bg-teal-500/10 border-2 border-teal-500/30 hover:border-teal-500/50 text-teal-300 rounded-xl transition-all duration-200 font-semibold text-sm hover:bg-teal-500/20"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Use My Wallet
                </button>
              )}
            </div>
          </div>

          {watchedWallets.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-teal-500/20">
              <p className="text-sm text-gray-400">
                {watchedWallets.length} {watchedWallets.length === 1 ? 'wallet' : 'wallets'} in watchlist
              </p>
              <button
                onClick={() => refreshAllWallets()}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 hover:border-teal-500/50 text-teal-300 rounded-xl transition-all duration-200 text-sm font-semibold disabled:opacity-50"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={16} />
                <span>Refresh All</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Watched Wallets Grid */}
      <AnimatePresence>
        {watchedWallets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-3xl p-12 border-2 border-teal-500/20 text-center"
          >
            <EyeOff className="text-gray-500 mx-auto mb-4" size={48} />
            <p className="text-gray-400 text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
              No wallets in watchlist
            </p>
            <p className="text-gray-500 text-sm">
              Add wallet addresses above to start tracking them
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchedWallets.map((wallet, index) => (
              <motion.div
                key={wallet.address}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-3xl p-6 border-2 border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="text-teal-400" size={20} />
                        <h3 className="text-lg font-bold text-white truncate" style={{ fontFamily: 'var(--font-raleway)' }}>
                          {wallet.name || `Wallet ${index + 1}`}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-400 truncate" style={{ fontFamily: 'var(--font-fira-code)' }}>
                          {formatAddress(wallet.address)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(wallet.address, index)}
                          className="p-1 hover:bg-teal-500/10 rounded transition-colors"
                          title="Copy address"
                        >
                          {copiedIndex === index ? (
                            <CheckCircle className="text-emerald-400" size={14} />
                          ) : (
                            <Copy className="text-gray-400 hover:text-teal-400" size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeWallet(index)}
                      className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-gray-400 hover:text-red-400"
                      title="Remove from watchlist"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Stats */}
                  {wallet.isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="animate-spin text-teal-400" size={24} />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-[#0a0f1a] rounded-xl p-4 border border-teal-500/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Coins className="text-teal-400" size={16} />
                            <span className="text-xs text-gray-400 font-semibold uppercase">Tokens</span>
                          </div>
                          <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                            {wallet.balances.length}
                          </p>
                        </div>
                        <div className="bg-[#0a0f1a] rounded-xl p-4 border border-teal-500/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="text-cyan-400" size={16} />
                            <span className="text-xs text-gray-400 font-semibold uppercase">Transactions</span>
                          </div>
                          <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                            {wallet.transactionCount}
                          </p>
                        </div>
                      </div>

                      {/* Total Value */}
                      <div className="bg-[#0a0f1a] rounded-xl p-4 border border-teal-500/10 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="text-emerald-400" size={16} />
                          <span className="text-xs text-gray-400 font-semibold uppercase">Total Value</span>
                        </div>
                        <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                          {getTotalValue(wallet.balances).toFixed(6)}
                        </p>
                      </div>

                      {/* Top Balances */}
                      {wallet.balances.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Top Balances</p>
                          {wallet.balances.slice(0, 3).map((balance, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm bg-[#0a0f1a] rounded-lg p-2 border border-teal-500/5">
                              <span className="text-gray-300 font-medium">{formatDenom(balance.denom)}</span>
                              <span className="text-white font-semibold">{formatTokenAmount(balance.amount, 6)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Refresh Button */}
                      <button
                        onClick={() => refreshWallet(index)}
                        disabled={wallet.isLoading}
                        className="w-full py-2 bg-teal-500/10 border border-teal-500/30 hover:border-teal-500/50 text-teal-300 rounded-xl transition-all duration-200 text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        <RefreshCw className={wallet.isLoading ? "animate-spin" : ""} size={14} />
                        <span>Refresh</span>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { getLatestBlocks, getBlockByHeight, getLatestBlockHeight, BlockInfo } from "@/lib/cosmos-client";
import { 
  Blocks, 
  Search,
  Copy,
  CheckCircle,
  RefreshCw,
  Loader2,
  Hash,
  Clock,
  FileText,
  ChevronRight,
  ExternalLink,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

export default function BlockExplorer() {
  const [blocks, setBlocks] = useState<BlockInfo[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockInfo | null>(null);
  const [latestHeight, setLatestHeight] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHeight, setSearchHeight] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  // Load initial blocks
  useEffect(() => {
    loadBlocks();
    loadLatestHeight();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadLatestHeight();
      if (!selectedBlock) {
        loadBlocks();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadLatestHeight = async () => {
    try {
      const height = await getLatestBlockHeight();
      setLatestHeight(height);
    } catch (err: any) {
      console.error("Error loading latest height:", err);
    }
  };

  const loadBlocks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const latestBlocks = await getLatestBlocks(20);
      setBlocks(latestBlocks);
      if (latestBlocks.length > 0) {
        setLatestHeight(parseInt(latestBlocks[0].height));
      }
    } catch (err: any) {
      console.error("Error loading blocks:", err);
      setError(err.message || "Failed to load blocks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBlocks = async () => {
    setIsRefreshing(true);
    await loadBlocks();
    setIsRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchHeight || isNaN(parseInt(searchHeight))) {
      setError("Please enter a valid block height");
      return;
    }

    const height = parseInt(searchHeight);
    setIsLoading(true);
    setError(null);
    setSelectedBlock(null);

    try {
      const block = await getBlockByHeight(height);
      if (block) {
        setSelectedBlock(block);
      } else {
        setError(`Block ${height} not found`);
      }
    } catch (err: any) {
      console.error("Error searching block:", err);
      setError(err.message || `Failed to fetch block ${height}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockClick = async (height: string) => {
    const heightNum = parseInt(height);
    setIsLoading(true);
    setError(null);

    try {
      const block = await getBlockByHeight(heightNum);
      if (block) {
        setSelectedBlock(block);
      } else {
        setError(`Block ${height} not found`);
      }
    } catch (err: any) {
      console.error("Error fetching block:", err);
      setError(err.message || `Failed to fetch block ${height}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatHash = (hash: string) => {
    if (!hash) return "N/A";
    return `${hash.slice(0, 12)}...${hash.slice(-8)}`;
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "N/A";
    return `${addr.slice(0, 10)}...${addr.slice(-6)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return `${diffSecs}s ago`;
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1a1a2e] to-[#2a2a3e] rounded-3xl p-8 border-2 border-purple-500/20 shadow-2xl backdrop-blur-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl glow-primary border-2 border-purple-400/40">
                <Blocks className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                  Block Explorer
                </h2>
                <p className="text-sm text-gray-300">
                  Explore the Lumera Testnet blockchain
                </p>
              </div>
            </div>
            <button
              onClick={refreshBlocks}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500/10 border-2 border-purple-500/30 hover:border-purple-500/50 text-purple-300 rounded-xl transition-all duration-200 font-semibold text-sm hover:bg-purple-500/20 disabled:opacity-50"
              style={{ fontFamily: 'var(--font-rajdhani)' }}
            >
              <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={18} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0a0a14] rounded-xl p-4 border border-purple-500/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-purple-400" size={18} />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Latest Height</span>
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                {latestHeight.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#0a0a14] rounded-xl p-4 border border-purple-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Blocks className="text-violet-400" size={18} />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Blocks Loaded</span>
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                {blocks.length}
              </p>
            </div>
            <div className="bg-[#0a0a14] rounded-xl p-4 border border-purple-500/10">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-indigo-400" size={18} />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Total Transactions</span>
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                {blocks.reduce((sum, block) => sum + block.numTxs, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                value={searchHeight}
                onChange={(e) => setSearchHeight(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by block height..."
                className="w-full pl-12 pr-4 py-4 bg-[#0a0a14] border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition-all duration-200 font-mono text-sm"
                style={{ fontFamily: 'var(--font-fira-code)' }}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchHeight}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg glow-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-rajdhani)' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-950/50 border-2 border-red-500/30 rounded-xl flex items-start gap-3"
            >
              <FileText className="text-red-400 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Selected Block Details */}
      {selectedBlock && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a1a2e] to-[#2a2a3e] rounded-3xl p-8 border-2 border-purple-500/20 shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>
              Block #{selectedBlock.height}
            </h3>
            <button
              onClick={() => setSelectedBlock(null)}
              className="p-2 hover:bg-purple-500/10 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <CheckCircle size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#0a0a14] rounded-xl p-4 border border-purple-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="text-purple-400" size={16} />
                <span className="text-xs text-gray-400 uppercase">Block Hash</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono text-white flex-1" style={{ fontFamily: 'var(--font-fira-code)' }}>
                  {formatHash(selectedBlock.hash)}
                </p>
                <button
                  onClick={() => copyToClipboard(selectedBlock.hash, `block-hash-${selectedBlock.height}`)}
                  className="p-1.5 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  {copied === `block-hash-${selectedBlock.height}` ? (
                    <CheckCircle className="text-purple-400" size={14} />
                  ) : (
                    <Copy className="text-gray-400 hover:text-purple-400" size={14} />
                  )}
                </button>
              </div>
            </div>
            <div className="bg-[#0a0a14] rounded-xl p-4 border border-purple-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-violet-400" size={16} />
                <span className="text-xs text-gray-400 uppercase">Timestamp</span>
              </div>
              <p className="text-sm text-white">{formatDate(selectedBlock.time)}</p>
              <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(selectedBlock.time)}</p>
            </div>
            <div className="bg-[#0a0a14] rounded-xl p-4 border border-purple-500/10">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-indigo-400" size={16} />
                <span className="text-xs text-gray-400 uppercase">Transactions</span>
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                {selectedBlock.numTxs}
              </p>
            </div>
            {selectedBlock.proposer && (
              <div className="bg-[#0a0a14] rounded-xl p-4 border border-purple-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="text-purple-400" size={16} />
                  <span className="text-xs text-gray-400 uppercase">Proposer</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-white flex-1" style={{ fontFamily: 'var(--font-fira-code)' }}>
                    {formatAddress(selectedBlock.proposer)}
                  </p>
                  <button
                    onClick={() => copyToClipboard(selectedBlock.proposer!, `proposer-${selectedBlock.height}`)}
                    className="p-1.5 hover:bg-purple-500/10 rounded-lg transition-colors"
                  >
                    {copied === `proposer-${selectedBlock.height}` ? (
                      <CheckCircle className="text-purple-400" size={14} />
                    ) : (
                      <Copy className="text-gray-400 hover:text-purple-400" size={14} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Transactions */}
          {selectedBlock.transactions && selectedBlock.transactions.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                Transactions ({selectedBlock.transactions.length})
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedBlock.transactions.map((tx, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0a0a14] rounded-xl p-4 border border-purple-500/10 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Hash className="text-purple-400" size={14} />
                          <span className="text-xs font-mono text-white" style={{ fontFamily: 'var(--font-fira-code)' }}>
                            {formatHash(tx.hash)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            tx.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                            tx.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(tx.timestamp)}
                          </span>
                          {tx.type && (
                            <span className="text-purple-300 font-semibold">{tx.type}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(tx.hash, `tx-${idx}`)}
                        className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
                      >
                        {copied === `tx-${idx}` ? (
                          <CheckCircle className="text-purple-400" size={16} />
                        ) : (
                          <Copy className="text-gray-400 hover:text-purple-400" size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Latest Blocks List */}
      {!selectedBlock && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a1a2e] to-[#2a2a3e] rounded-3xl p-8 border-2 border-purple-500/20 shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>
              Latest Blocks
            </h3>
            {isLoading && (
              <Loader2 className="animate-spin text-purple-400" size={20} />
            )}
          </div>

          {blocks.length === 0 ? (
            <div className="text-center py-12">
              <Blocks className="text-purple-500/30 mx-auto mb-4" size={64} />
              <p className="text-gray-400">No blocks found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {blocks.map((block) => (
                <motion.div
                  key={block.height}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleBlockClick(block.height)}
                  className="bg-[#0a0a14] rounded-xl p-6 border border-purple-500/10 hover:border-purple-500/30 cursor-pointer transition-all hover:bg-[#0f0f1a] group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-violet-600/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                        <Blocks className="text-purple-400" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                            Block #{block.height}
                          </h4>
                          <span className="text-xs text-gray-400">{formatTimeAgo(block.time)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Hash className="text-purple-400" size={12} />
                            <span className="font-mono" style={{ fontFamily: 'var(--font-fira-code)' }}>
                              {formatHash(block.hash)}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="text-violet-400" size={12} />
                            {block.numTxs} {block.numTxs === 1 ? 'tx' : 'txs'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-purple-400 transition-colors" size={20} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

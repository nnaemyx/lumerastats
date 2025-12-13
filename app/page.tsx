"use client";

import { useWallet } from "@/contexts/WalletContext";
import Header from "@/components/Header";
import TransactionHistoryViewer from "@/components/TransactionHistoryViewer";
import { AlertCircle, FileText, Search, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { isConnected, error, connect, isLoading } = useWallet();

  return (
    <div className="min-h-screen bg-[#0d0d12] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0d0d12] via-[#15151a] to-[#0d0d12] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(167,139,250,0.10),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />
      {/* Animated mesh gradient */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(139,92,246,0.06)_50%,transparent_70%)] pointer-events-none animate-pulse"></div>
      
      <Header />

      <main className="container mx-auto px-4 py-10 relative z-10">
        {/* ERROR ALERT */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-950/50 border-2 border-red-500/30 rounded-2xl flex items-start gap-3 shadow-lg backdrop-blur-sm"
          >
            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-semibold text-red-300" style={{ fontFamily: 'var(--font-poppins)' }}>Connection Error</p>
              <p className="text-sm text-red-400/80 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Main Content - Always show Transaction History Viewer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto"
        >
          <TransactionHistoryViewer />
        </motion.div>

        {/* Info Section */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mt-12"
          >
            <div className="bg-gradient-to-br from-[#15151a] to-[#1e1e24] rounded-3xl p-8 border-2 border-violet-500/20 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-violet-500/10 border-2 border-violet-500/30 rounded-2xl mb-6">
                    <Zap className="text-violet-400" size={20} />
                    <span className="text-violet-300 text-sm font-semibold tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Quick Start Guide
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
                    How to Use TxView
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    View transaction history for any wallet address on the Lumera Testnet. Connect your wallet for quick access or enter any address manually.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { 
                      icon: Search, 
                      title: "Search Address", 
                      desc: "Enter any wallet address to view its complete transaction history",
                      bgColor: "bg-violet-500/5",
                      borderColor: "border-violet-500/20",
                      hoverBorder: "hover:border-violet-500/40",
                      iconBg: "bg-violet-500/20",
                      iconBorder: "border-violet-500/30",
                      iconColor: "text-violet-400"
                    },
                    { 
                      icon: FileText, 
                      title: "View Transactions", 
                      desc: "See all transactions with details including type, amount, and status",
                      bgColor: "bg-purple-500/5",
                      borderColor: "border-purple-500/20",
                      hoverBorder: "hover:border-purple-500/40",
                      iconBg: "bg-purple-500/20",
                      iconBorder: "border-purple-500/30",
                      iconColor: "text-purple-400"
                    },
                    { 
                      icon: Zap, 
                      title: "Quick Access", 
                      desc: "Connect your wallet to instantly view your own transaction history",
                      bgColor: "bg-fuchsia-500/5",
                      borderColor: "border-fuchsia-500/20",
                      hoverBorder: "hover:border-fuchsia-500/40",
                      iconBg: "bg-fuchsia-500/20",
                      iconBorder: "border-fuchsia-500/30",
                      iconColor: "text-fuchsia-400"
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className={`${feature.bgColor} ${feature.borderColor} ${feature.hoverBorder} rounded-2xl p-6 text-center transition-all duration-300`}
                    >
                      <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4 border ${feature.iconBorder}`}>
                        <feature.icon className={feature.iconColor} size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                {!isConnected && (
                  <div className="mt-8 text-center">
                    <motion.button
                      onClick={connect}
                      disabled={isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-semibold text-base shadow-2xl glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      <FileText size={20} />
                      <span>{isLoading ? "Connecting..." : "Connect Wallet for Quick Access"}</span>
                      <ArrowRight size={18} />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useWallet } from "@/contexts/WalletContext";
import Header from "@/components/Header";
import MultiWalletWatchlist from "@/components/MultiWalletWatchlist";
import { AlertCircle, Eye, Plus, RefreshCw, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { isConnected, error, connect, isLoading } = useWallet();

  return (
    <div className="min-h-screen bg-[#0a0f1a] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#111827] to-[#0a0f1a] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.15),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(45,212,191,0.10),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.08),transparent_50%)] pointer-events-none" />
      {/* Animated mesh gradient */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(20,184,166,0.06)_50%,transparent_70%)] pointer-events-none animate-pulse"></div>
      
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
              <p className="font-semibold text-red-300" style={{ fontFamily: 'var(--font-raleway)' }}>Connection Error</p>
              <p className="text-sm text-red-400/80 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Main Content - Always show Multi-Wallet Watchlist */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <MultiWalletWatchlist />
        </motion.div>

        {/* Info Section */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mt-12"
          >
            <div className="bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-3xl p-8 border-2 border-teal-500/20 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-teal-500/10 border-2 border-teal-500/30 rounded-2xl mb-6">
                    <Eye className="text-teal-400" size={20} />
                    <span className="text-teal-300 text-sm font-semibold tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                      How It Works
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Multi-Wallet Watchlist
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Track multiple wallet addresses in one dashboard. Monitor balances, transactions, and activity across all your watched wallets on Lumera Testnet.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { 
                      icon: Plus, 
                      title: "Add Wallets", 
                      desc: "Add multiple wallet addresses to your watchlist. Give them custom names for easy identification",
                      bgColor: "bg-teal-500/5",
                      borderColor: "border-teal-500/20",
                      hoverBorder: "hover:border-teal-500/40",
                      iconBg: "bg-teal-500/20",
                      iconBorder: "border-teal-500/30",
                      iconColor: "text-teal-400"
                    },
                    { 
                      icon: Eye, 
                      title: "Monitor Activity", 
                      desc: "View balances, transaction counts, and total values for all watched wallets in one place",
                      bgColor: "bg-cyan-500/5",
                      borderColor: "border-cyan-500/20",
                      hoverBorder: "hover:border-cyan-500/40",
                      iconBg: "bg-cyan-500/20",
                      iconBorder: "border-cyan-500/30",
                      iconColor: "text-cyan-400"
                    },
                    { 
                      icon: RefreshCw, 
                      title: "Real-Time Updates", 
                      desc: "Refresh individual wallets or all wallets at once to get the latest data and balances",
                      bgColor: "bg-blue-500/5",
                      borderColor: "border-blue-500/20",
                      hoverBorder: "hover:border-blue-500/40",
                      iconBg: "bg-blue-500/20",
                      iconBorder: "border-blue-500/30",
                      iconColor: "text-blue-400"
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className={`${feature.bgColor} ${feature.borderColor} ${feature.hoverBorder} rounded-2xl p-6 text-center transition-all duration-300`}
                    >
                      <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4 border ${feature.iconBorder}`}>
                        <feature.icon className={feature.iconColor} size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
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
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 font-semibold text-base shadow-2xl glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      <Eye size={20} />
                      <span>{isLoading ? "Connecting..." : "Connect Wallet to Auto-Add"}</span>
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

"use client";

import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import Header from "@/components/Header";
import BalanceCard from "@/components/BalanceCard";
import QuickActions from "@/components/QuickActions";
import NetworkInfo from "@/components/NetworkInfo";
import Features from "@/components/Features";
import TransferModal from "@/components/TransferModal";
import StakingModal from "@/components/StakingModal";
import HistoryModal from "@/components/HistoryModal";
import AnalyticsModal from "@/components/AnalyticsModal";
import { AlertCircle, Sparkles, Zap, ArrowRight, Shield, TrendingUp, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { isConnected, error } = useWallet();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(167,139,250,0.10),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />
      {/* Animated mesh gradient */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(139,92,246,0.06)_50%,transparent_70%)] pointer-events-none animate-pulse"></div>
      {/* Grid pattern */}
      <div className="fixed inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>
      
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
              <p className="font-semibold text-red-300">Connection Error</p>
              <p className="text-sm text-red-400/80 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* HERO SECTION - NOVA DESIGN */}
            <div className="mb-20 mt-8">
              <div className="max-w-7xl mx-auto">
                {/* Split-Screen Hero Layout */}
                <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
                  {/* Left Side - Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full">
                      <Sparkles className="text-violet-400" size={16} />
                      <span className="text-violet-300 text-xs font-semibold tracking-wider" style={{ fontFamily: 'var(--font-orbitron)' }}>
                        Next-Gen DeFi Interface
                      </span>
                    </div>

                    <h1 
                      className="text-6xl md:text-7xl font-bold text-white leading-tight"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        NOVA
                      </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg">
                      Illuminate the future of decentralized finance. A cutting-edge platform for staking, governance, and token management on Cosmos.
                    </p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-semibold text-base shadow-2xl glow-primary"
                        style={{ fontFamily: 'var(--font-orbitron)' }}
                      >
                        <AlertCircle size={20} />
                        <span>Connect Wallet</span>
                        <ArrowRight size={18} />
                      </motion.button>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-violet-300">
                          <Zap className="text-violet-400" size={18} />
                          <span>Fast</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-300">
                          <Shield className="text-purple-400" size={18} />
                          <span>Secure</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Right Side - Visual */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="relative h-[500px] bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-3xl border-2 border-violet-500/30 p-12 flex items-center justify-center overflow-hidden">
                      {/* Geometric shapes background */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-violet-400/30 rotate-45"></div>
                        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-purple-400/30 rotate-12"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-indigo-400/30 rounded-full"></div>
                      </div>
                      
                      {/* Central P logo */}
                      <div className="relative z-10">
                        <motion.div
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ 
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 3, repeat: Infinity }
                          }}
                          className="w-48 h-48 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl glow-primary border-4 border-violet-400/50 relative"
                        >
                          <span className="text-white font-bold text-8xl" style={{ fontFamily: 'var(--font-orbitron)' }}>P</span>
                          {/* Corner geometric shapes */}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-violet-400 rotate-45"></div>
                          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-400 rotate-45"></div>
                          <div className="absolute -top-2 -left-2 w-5 h-5 bg-indigo-400 rounded-full"></div>
                          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-violet-400 rounded-full"></div>
                        </motion.div>
                      </div>

                      {/* Floating particles */}
                      <div className="absolute top-20 right-20 w-3 h-3 bg-violet-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                      <div className="absolute top-1/3 right-10 w-4 h-4 bg-indigo-400 rounded-full animate-pulse delay-500"></div>
                    </div>
                  </motion.div>
                </div>

                {/* Feature Grid - 3 Columns */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid md:grid-cols-3 gap-6 mb-16"
                >
                  {[
                    { icon: Shield, title: "Advanced Security", desc: "Multi-layer protection", gradient: "from-violet-500 to-violet-600", delay: 0.6 },
                    { icon: TrendingUp, title: "Smart Staking", desc: "Optimized yields", gradient: "from-purple-500 to-purple-600", delay: 0.7 },
                    { icon: Globe, title: "Cross-Chain", desc: "IBC compatible", gradient: "from-indigo-500 to-indigo-600", delay: 0.8 },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: feature.delay }}
                      className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-2xl p-8 border-2 border-violet-500/20 hover:border-violet-400/40 transition-all duration-300 hover:scale-105 group"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-xl glow-primary group-hover:rotate-6 transition-transform duration-300`}>
                        <feature.icon className="text-white" size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-orbitron)' }}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {feature.desc}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-2xl p-8 border-2 border-violet-500/20 backdrop-blur-md"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: "Network", value: "Lumera", color: "violet" },
                      { label: "Chain ID", value: "Mainnet-1", color: "purple" },
                      { label: "Consensus", value: "CometBFT", color: "indigo" },
                      { label: "Status", value: "Active", color: "violet" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className={`text-${stat.color}-400 text-sm font-semibold mb-2`} style={{ fontFamily: 'var(--font-orbitron)' }}>
                          {stat.label}
                        </p>
                        <p className="text-white text-lg font-bold" style={{ fontFamily: 'var(--font-orbitron)' }}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* INFO CARDS */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <NetworkInfo />
              <Features />
            </div>

            {/* GETTING STARTED */}
            <div className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-3xl p-10 border-2 border-violet-500/20 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-8 tracking-tight" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  Getting Started
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {["Install Keplr Wallet browser extension","Click 'Connect Keplr' in the header","Cosmos network will be added automatically","Start managing, staking & transacting tokens"].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start gap-4 group p-4 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white flex items-center justify-center text-base font-bold shadow-lg glow-primary group-hover:scale-110 transition-transform duration-300 flex-shrink-0" style={{ fontFamily: 'var(--font-orbitron)' }}>
                        {i + 1}
                      </span>
                      <span className="leading-relaxed text-base font-normal pt-3 text-gray-300 group-hover:text-white transition-colors">
                        {i === 0 ? (
                          <>
                            Install <a href="https://www.keplr.app/" target="_blank" rel="noopener noreferrer" className="underline text-violet-400 font-semibold hover:text-purple-400 transition-colors">Keplr Wallet</a> browser extension
                          </>
                        ) : step}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            <BalanceCard />

            <QuickActions
              onTransfer={() => setShowTransferModal(true)}
              onStake={() => setShowStakingModal(true)}
              onHistory={() => setShowHistoryModal(true)}
              onAnalytics={() => setShowAnalyticsModal(true)}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <NetworkInfo />
              <Features />
            </div>
          </motion.div>
        )}
      </main>

      {/* MODALS */}
      <TransferModal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} />
      <StakingModal isOpen={showStakingModal} onClose={() => setShowStakingModal(false)} />
      <HistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />
      <AnalyticsModal isOpen={showAnalyticsModal} onClose={() => setShowAnalyticsModal(false)} />
    </div>
  );
}

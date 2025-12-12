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
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.15),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(251,146,60,0.10),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
      {/* Animated mesh gradient */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(249,115,22,0.06)_50%,transparent_70%)] pointer-events-none animate-pulse"></div>
      {/* Dot pattern */}
      <div className="fixed inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(249,115,22,0.1) 1px, transparent 0)`,
        backgroundSize: '30px 30px'
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
            {/* HERO SECTION - ZENITH DESIGN */}
            <div className="mb-20 mt-8">
              <div className="max-w-7xl mx-auto">
                {/* Centered Floating Cards Layout */}
                <div className="relative min-h-[600px] flex items-center justify-center mb-16">
                  {/* Central Hero Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-2xl mx-auto"
                  >
                    <div className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-3xl p-12 border-2 border-orange-500/30 shadow-2xl backdrop-blur-md relative overflow-hidden">
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(249,115,22,0.2) 1px, transparent 0)`,
                          backgroundSize: '50px 50px'
                        }}></div>
                      </div>
                      
                      <div className="relative z-10 text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full">
                          <Sparkles className="text-orange-400" size={16} />
                          <span className="text-orange-300 text-xs font-semibold tracking-wider" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                            Peak DeFi Performance
                          </span>
                        </div>

                        <h1 
                          className="text-6xl md:text-8xl font-bold text-white leading-tight"
                          style={{ fontFamily: 'var(--font-rajdhani)' }}
                        >
                          <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                            ZENITH
                          </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl mx-auto">
                          Reach the peak of decentralized finance. A powerful platform for staking, governance, and token management on the Cosmos ecosystem.
                        </p>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex flex-wrap items-center justify-center gap-6"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl transition-all duration-300 font-semibold text-base shadow-2xl glow-primary"
                            style={{ fontFamily: 'var(--font-rajdhani)' }}
                          >
                            <AlertCircle size={20} />
                            <span>Connect Wallet</span>
                            <ArrowRight size={18} />
                          </motion.button>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-orange-300">
                              <Zap className="text-orange-400" size={18} />
                              <span>Ultra Fast</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-300">
                              <Shield className="text-amber-400" size={18} />
                              <span>Secure</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Cards Around Center */}
                  {/* Top Card */}
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-2xl p-6 border-2 border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-105 group w-64">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-3 shadow-lg glow-primary group-hover:rotate-6 transition-transform duration-300 mx-auto">
                        <Shield className="text-white" size={20} />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1 text-center" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                        Security
                      </h3>
                      <p className="text-xs text-gray-400 text-center">
                        Enterprise-grade
                      </p>
                    </div>
                  </motion.div>

                  {/* Right Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2"
                  >
                    <div className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-2xl p-6 border-2 border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 hover:scale-105 group w-64">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-3 shadow-lg glow-primary group-hover:rotate-6 transition-transform duration-300 mx-auto">
                        <TrendingUp className="text-white" size={20} />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1 text-center" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                        Staking
                      </h3>
                      <p className="text-xs text-gray-400 text-center">
                        Optimized yields
                      </p>
                    </div>
                  </motion.div>

                  {/* Bottom Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
                  >
                    <div className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-2xl p-6 border-2 border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 hover:scale-105 group w-64">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-3 shadow-lg glow-primary group-hover:rotate-6 transition-transform duration-300 mx-auto">
                        <Globe className="text-white" size={20} />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1 text-center" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                        Cross-Chain
                      </h3>
                      <p className="text-xs text-gray-400 text-center">
                        IBC compatible
                      </p>
                    </div>
                  </motion.div>

                  {/* Left Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                  >
                    <div className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-2xl p-8 border-2 border-orange-500/30 flex items-center justify-center w-32 h-32 overflow-hidden relative">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 3, repeat: Infinity }
                        }}
                        className="w-24 h-24 bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-2xl glow-primary border-4 border-orange-400/50 relative z-10"
                      >
                        <span className="text-white font-bold text-4xl" style={{ fontFamily: 'var(--font-rajdhani)' }}>Z</span>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-300"></div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Feature Grid - 3 Columns */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="grid md:grid-cols-3 gap-6 mb-16"
                >
                  {[
                    { icon: Shield, title: "Advanced Security", desc: "Multi-layer protection", gradient: "from-orange-500 to-orange-600", delay: 1.0 },
                    { icon: TrendingUp, title: "Smart Staking", desc: "Maximize returns", gradient: "from-amber-500 to-amber-600", delay: 1.1 },
                    { icon: Globe, title: "Cross-Chain", desc: "IBC compatible", gradient: "from-yellow-500 to-yellow-600", delay: 1.2 },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: feature.delay }}
                      className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-2xl p-8 border-2 border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-105 group text-center"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg glow-primary group-hover:rotate-12 transition-transform duration-300`}>
                        <feature.icon className="text-white" size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {feature.desc}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* INFO CARDS */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <NetworkInfo />
              <Features />
            </div>

            {/* GETTING STARTED */}
            <div className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-3xl p-10 border-2 border-orange-500/20 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-8 tracking-tight" style={{ fontFamily: 'var(--font-rajdhani)' }}>
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
                      <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-base font-bold shadow-lg glow-primary group-hover:scale-110 transition-transform duration-300 flex-shrink-0" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                        {i + 1}
                      </span>
                      <span className="leading-relaxed text-base font-normal pt-3 text-gray-300 group-hover:text-white transition-colors">
                        {i === 0 ? (
                          <>
                            Install <a href="https://www.keplr.app/" target="_blank" rel="noopener noreferrer" className="underline text-orange-400 font-semibold hover:text-amber-400 transition-colors">Keplr Wallet</a> browser extension
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

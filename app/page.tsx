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
import { AlertCircle, Sparkles, Zap } from "lucide-react";
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
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.08),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(251,146,60,0.05),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.03),transparent_50%)] pointer-events-none" />
      
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
            {/* HERO SECTION */}
            <div className="mb-16 mt-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Side - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-4">
                    <Sparkles className="text-orange-400" size={18} />
                    <span className="text-orange-300 text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                      Decentralized Finance
                    </span>
                  </div>

                  <h1 
                    className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                      Welcome to Apex
                    </span>
                    <br />
                    <span className="text-white">Your DeFi</span>
                    <br />
                    <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      Command Center
                    </span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light max-w-xl">
                    Experience the future of decentralized finance. Manage, stake, and track your tokens with a powerful dashboard built on Cosmos blockchain technology.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border-2 border-orange-400/40 rounded-2xl text-orange-300 backdrop-blur-md shadow-xl hover:border-orange-400/60 transition-all duration-300"
                    >
                      <AlertCircle size={20} className="text-orange-400" />
                      <span className="font-semibold" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Connect Keplr Wallet</span>
                    </motion.div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Zap className="text-amber-400" size={18} />
                        <span>Fast Transactions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-orange-400" size={18} />
                        <span>Secure Staking</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Side - Image/Visual */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative"
                >
                  <div className="relative w-full h-[500px] md:h-[600px]">
                    {/* Decorative gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-orange-600/20 rounded-3xl blur-3xl"></div>
                    
                    {/* Main visual container */}
                    <div className="relative h-full bg-gradient-to-br from-[#1a1a24] to-[#0f0f15] rounded-3xl border-2 border-orange-500/30 p-8 flex items-center justify-center overflow-hidden">
                      {/* Animated grid pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)`,
                          backgroundSize: '50px 50px'
                        }}></div>
                      </div>
                      
                      {/* Central logo/icon */}
                      <div className="relative z-10 text-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                          className="inline-flex items-center justify-center w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-3xl shadow-2xl glow-primary border-2 border-orange-400/50 mb-6 relative"
                        >
                          <span className="text-white font-black text-8xl md:text-9xl tracking-tighter" style={{ fontFamily: 'var(--font-space-grotesk)' }}>A</span>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full animate-pulse glow-primary"></div>
                          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-400 rounded-full animate-pulse delay-300"></div>
                        </motion.div>
                        
                        {/* Floating particles */}
                        <div className="absolute top-10 left-10 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                        <div className="absolute top-20 right-16 w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-500"></div>
                        <div className="absolute bottom-16 left-16 w-4 h-4 bg-orange-500 rounded-full animate-pulse delay-700"></div>
                        <div className="absolute bottom-10 right-10 w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-1000"></div>
                      </div>
                    </div>
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
            <div className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-3xl p-10 border-2 border-orange-500/20 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white mb-8 tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  Getting Started
                </h3>
                <ol className="space-y-5">
                  {["Install Keplr Wallet browser extension","Click 'Connect Keplr' in the header","Cosmos network will be added automatically","Start managing, staking & transacting tokens"].map((step, i) => (
                    <li key={i} className="flex items-start gap-5 group">
                      <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-base font-black shadow-lg glow-primary group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                        {i + 1}
                      </span>
                      <span className="leading-relaxed text-lg font-normal pt-3 text-gray-200 group-hover:text-white transition-colors">
                        {i === 0 ? (
                          <>
                            Install <a href="https://www.keplr.app/" target="_blank" rel="noopener noreferrer" className="underline text-orange-400 font-semibold hover:text-amber-400 transition-colors">Keplr Wallet</a> browser extension
                          </>
                        ) : step}
                      </span>
                    </li>
                  ))}
                </ol>
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

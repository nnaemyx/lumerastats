"use client";

import { Activity, Zap, Shield } from "lucide-react";

export default function NetworkInfo() {
  return (
    <div className="bg-gradient-to-br from-[#111118] to-[#0f0f15] rounded-3xl p-7 border-2 border-orange-500/20 shadow-xl backdrop-blur-md">
      <h3 className="text-2xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: 'var(--font-rajdhani)' }}>
        Network Status
      </h3>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center border-2 border-orange-400/40 shadow-lg">
              <Activity className="text-orange-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                Network
              </p>
              <p className="text-sm text-gray-300 font-medium mt-1">
                Lumera Mainnet
              </p>
            </div>
          </div>
          <span className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold border-2 border-orange-400/40 shadow-lg" style={{ fontFamily: 'var(--font-rajdhani)' }}>
            Active
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center border-2 border-amber-400/40 shadow-lg">
              <Zap className="text-amber-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                Chain ID
              </p>
              <p className="text-sm text-gray-300 font-medium mt-1 font-mono">
                lumera-mainnet-1
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center border-2 border-yellow-400/40 shadow-lg">
              <Shield className="text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                Consensus
              </p>
              <p className="text-sm text-gray-300 font-medium mt-1">
                CometBFT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


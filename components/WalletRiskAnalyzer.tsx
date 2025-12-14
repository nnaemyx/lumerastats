"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { getTransactionHistory, TransactionDetail } from "@/lib/cosmos-client";
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Copy,
  RefreshCw,
  Loader2,
  Activity,
  Lock,
  Unlock
} from "lucide-react";
import { motion } from "framer-motion";

interface RiskScore {
  overall: number; // 0-100, lower is safer
  grade: "A" | "B" | "C" | "D" | "F";
  factors: {
    transactionFrequency: { score: number; label: string; risk: "low" | "medium" | "high" };
    failedTransactions: { score: number; label: string; risk: "low" | "medium" | "high" };
    transactionDiversity: { score: number; label: string; risk: "low" | "medium" | "high" };
    accountAge: { score: number; label: string; risk: "low" | "medium" | "high" };
    suspiciousPatterns: { score: number; label: string; risk: "low" | "medium" | "high" };
  };
  recommendations: string[];
}

export default function WalletRiskAnalyzer() {
  const { address: connectedAddress } = useWallet();
  const [searchAddress, setSearchAddress] = useState("");
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Set connected address as default when wallet is connected
  useEffect(() => {
    if (connectedAddress && !searchAddress) {
      setSearchAddress(connectedAddress);
      analyzeWallet(connectedAddress);
    }
  }, [connectedAddress]);

  const analyzeWallet = async (address: string) => {
    if (!address || address.trim() === "") {
      setError("Please enter a valid address");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransactions([]);
    setRiskScore(null);

    try {
      const txs = await getTransactionHistory(address.trim());
      setTransactions(txs);
      
      if (txs.length === 0) {
        setError("No transactions found. Cannot analyze risk for an empty wallet.");
        return;
      }

      // Perform risk analysis
      const risk = calculateRiskScore(txs);
      setRiskScore(risk);
    } catch (err: any) {
      console.error("Error analyzing wallet:", err);
      setError(err.message || "Failed to analyze wallet. Please check the address and try again.");
      setRiskScore(null);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRiskScore = (txs: TransactionDetail[]): RiskScore => {
    const totalTxs = txs.length;
    const failedTxs = txs.filter(tx => tx.status === "failed").length;
    const successTxs = txs.filter(tx => tx.status === "success").length;
    
    // Factor 1: Transaction Frequency (too many or too few is risky)
    const avgTimeBetweenTxs = calculateAverageTimeBetweenTransactions(txs);
    const frequencyScore = calculateFrequencyRisk(totalTxs, avgTimeBetweenTxs);
    
    // Factor 2: Failed Transactions Ratio
    const failedRatio = totalTxs > 0 ? (failedTxs / totalTxs) * 100 : 0;
    const failedScore = failedRatio > 20 ? 80 : failedRatio > 10 ? 50 : failedRatio > 5 ? 30 : 10;
    
    // Factor 3: Transaction Diversity (different types)
    const uniqueTypes = new Set(txs.map(tx => tx.type)).size;
    const diversityScore = totalTxs > 0 ? Math.max(0, 100 - (uniqueTypes / totalTxs) * 200) : 50;
    
    // Factor 4: Account Age (older is generally safer)
    const accountAge = calculateAccountAge(txs);
    const ageScore = accountAge < 7 ? 60 : accountAge < 30 ? 40 : accountAge < 90 ? 20 : 10;
    
    // Factor 5: Suspicious Patterns
    const suspiciousScore = detectSuspiciousPatterns(txs);
    
    // Calculate overall score (weighted average)
    const overall = Math.round(
      frequencyScore * 0.25 +
      failedScore * 0.25 +
      diversityScore * 0.15 +
      ageScore * 0.15 +
      suspiciousScore * 0.20
    );

    // Determine grade
    let grade: "A" | "B" | "C" | "D" | "F";
    if (overall <= 20) grade = "A";
    else if (overall <= 40) grade = "B";
    else if (overall <= 60) grade = "C";
    else if (overall <= 80) grade = "D";
    else grade = "F";

    // Generate recommendations
    const recommendations: string[] = [];
    if (failedRatio > 10) recommendations.push("High number of failed transactions detected. Review transaction patterns.");
    if (uniqueTypes < 2 && totalTxs > 5) recommendations.push("Limited transaction diversity. Consider diversifying activity.");
    if (accountAge < 30) recommendations.push("New account detected. Exercise caution with large transactions.");
    if (suspiciousScore > 60) recommendations.push("Unusual transaction patterns detected. Verify wallet legitimacy.");
    if (frequencyScore > 70) recommendations.push("Unusual transaction frequency. Monitor for suspicious activity.");
    if (recommendations.length === 0) recommendations.push("Wallet shows healthy transaction patterns. Continue monitoring.");

    return {
      overall,
      grade,
      factors: {
        transactionFrequency: {
          score: frequencyScore,
          label: getFrequencyLabel(frequencyScore),
          risk: frequencyScore > 60 ? "high" : frequencyScore > 30 ? "medium" : "low"
        },
        failedTransactions: {
          score: failedScore,
          label: `${failedTxs} failed out of ${totalTxs} (${failedRatio.toFixed(1)}%)`,
          risk: failedRatio > 20 ? "high" : failedRatio > 10 ? "medium" : "low"
        },
        transactionDiversity: {
          score: diversityScore,
          label: `${uniqueTypes} unique transaction types`,
          risk: diversityScore > 60 ? "high" : diversityScore > 30 ? "medium" : "low"
        },
        accountAge: {
          score: ageScore,
          label: accountAge < 30 ? `${accountAge} days old` : `${Math.floor(accountAge / 30)} months old`,
          risk: ageScore > 50 ? "high" : ageScore > 30 ? "medium" : "low"
        },
        suspiciousPatterns: {
          score: suspiciousScore,
          label: suspiciousScore > 60 ? "Multiple patterns detected" : suspiciousScore > 30 ? "Some patterns detected" : "No patterns detected",
          risk: suspiciousScore > 60 ? "high" : suspiciousScore > 30 ? "medium" : "low"
        }
      },
      recommendations
    };
  };

  const calculateAverageTimeBetweenTransactions = (txs: TransactionDetail[]): number => {
    if (txs.length < 2) return 0;
    const sorted = [...txs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    let totalDiff = 0;
    for (let i = 1; i < sorted.length; i++) {
      const diff = new Date(sorted[i].timestamp).getTime() - new Date(sorted[i - 1].timestamp).getTime();
      totalDiff += diff;
    }
    return totalDiff / (sorted.length - 1) / (1000 * 60 * 60 * 24); // Convert to days
  };

  const calculateFrequencyRisk = (totalTxs: number, avgDays: number): number => {
    // Too many transactions in short time = risky
    if (totalTxs > 100 && avgDays < 0.1) return 90;
    if (totalTxs > 50 && avgDays < 0.5) return 70;
    if (totalTxs > 20 && avgDays < 1) return 50;
    // Too few transactions = also risky (inactive account)
    if (totalTxs < 3) return 40;
    // Normal pattern
    return 20;
  };

  const calculateAccountAge = (txs: TransactionDetail[]): number => {
    if (txs.length === 0) return 0;
    const sorted = [...txs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const firstTx = new Date(sorted[0].timestamp);
    const now = new Date();
    return Math.floor((now.getTime() - firstTx.getTime()) / (1000 * 60 * 60 * 24));
  };

  const detectSuspiciousPatterns = (txs: TransactionDetail[]): number => {
    let suspiciousCount = 0;
    
    // Pattern 1: Many transactions to same address
    const recipientCounts = new Map<string, number>();
    txs.forEach(tx => {
      if (tx.to) {
        recipientCounts.set(tx.to, (recipientCounts.get(tx.to) || 0) + 1);
      }
    });
    const maxRecipientCount = Math.max(...Array.from(recipientCounts.values()));
    if (maxRecipientCount > txs.length * 0.5) suspiciousCount += 30;
    
    // Pattern 2: Very large amounts
    const largeAmounts = txs.filter(tx => {
      if (!tx.amount) return false;
      const amount = parseFloat(tx.amount);
      return amount > 1000000; // Arbitrary large amount
    }).length;
    if (largeAmounts > txs.length * 0.3) suspiciousCount += 25;
    
    // Pattern 3: Rapid transactions (many in short time)
    const rapidTxs = txs.filter((tx, idx) => {
      if (idx === 0) return false;
      const prevTx = txs[idx - 1];
      const timeDiff = new Date(tx.timestamp).getTime() - new Date(prevTx.timestamp).getTime();
      return timeDiff < 60000; // Less than 1 minute
    }).length;
    if (rapidTxs > txs.length * 0.2) suspiciousCount += 25;
    
    // Pattern 4: Only one type of transaction
    const uniqueTypes = new Set(txs.map(tx => tx.type)).size;
    if (uniqueTypes === 1 && txs.length > 10) suspiciousCount += 20;
    
    return Math.min(100, suspiciousCount);
  };

  const getFrequencyLabel = (score: number): string => {
    if (score > 70) return "Very High Frequency";
    if (score > 50) return "High Frequency";
    if (score > 30) return "Moderate Frequency";
    return "Normal Frequency";
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-emerald-400 bg-emerald-950/30 border-emerald-500/30";
      case "B": return "text-green-400 bg-green-950/30 border-green-500/30";
      case "C": return "text-yellow-400 bg-yellow-950/30 border-yellow-500/30";
      case "D": return "text-orange-400 bg-orange-950/30 border-orange-500/30";
      case "F": return "text-red-400 bg-red-950/30 border-red-500/30";
      default: return "text-gray-400 bg-gray-950/30 border-gray-500/30";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-emerald-400";
      case "medium": return "text-yellow-400";
      case "high": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const handleSearch = () => {
    if (searchAddress.trim()) {
      analyzeWallet(searchAddress.trim());
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

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1a1a1f] to-[#242429] rounded-3xl p-8 border-2 border-amber-500/20 shadow-2xl backdrop-blur-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-xl glow-primary border-2 border-amber-400/40">
              <Shield className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                Wallet Risk Analyzer
              </h2>
              <p className="text-sm text-gray-400">
                Analyze wallet safety based on transaction patterns
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
                placeholder="Enter wallet address to analyze..."
                className="w-full px-6 py-4 bg-[#0f0f14] border-2 border-amber-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-all duration-200 font-mono text-sm"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              />
              {searchAddress && (
                <button
                  onClick={() => copyToClipboard(searchAddress)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-amber-500/10 rounded-lg transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <CheckCircle className="text-emerald-400" size={18} />
                  ) : (
                    <Copy className="text-gray-400 hover:text-amber-400" size={18} />
                  )}
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchAddress.trim()}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg glow-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>Analyze Risk</span>
                </>
              )}
            </button>
            {connectedAddress && (
              <button
                onClick={() => {
                  setSearchAddress(connectedAddress);
                  analyzeWallet(connectedAddress);
                }}
                className="px-6 py-4 bg-amber-500/10 border-2 border-amber-500/30 hover:border-amber-500/50 text-amber-300 rounded-xl transition-all duration-200 font-semibold text-sm hover:bg-amber-500/20"
                style={{ fontFamily: 'var(--font-montserrat)' }}
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

      {/* Risk Score Display */}
      {riskScore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#1a1a1f] to-[#242429] rounded-3xl p-8 border-2 border-amber-500/20 shadow-2xl backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${getGradeColor(riskScore.grade)} ${riskScore.grade === "A" || riskScore.grade === "B" ? "glow-success" : riskScore.grade === "F" ? "glow-danger" : "glow-primary"}`}>
                  <span className="text-5xl font-bold" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    {riskScore.grade}
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Risk Score: {riskScore.overall}/100
                  </h3>
                  <p className="text-gray-400">
                    {riskScore.overall <= 20 ? "Very Safe" : riskScore.overall <= 40 ? "Safe" : riskScore.overall <= 60 ? "Moderate Risk" : riskScore.overall <= 80 ? "High Risk" : "Very High Risk"}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {Object.entries(riskScore.factors).map(([key, factor]) => (
                <div
                  key={key}
                  className="bg-[#0f0f14] rounded-2xl p-5 border-2 border-amber-500/10 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-lg font-bold ${getRiskColor(factor.risk)}`}>
                      {factor.risk === "low" ? "✓" : factor.risk === "medium" ? "⚠" : "✗"}
                    </span>
                  </div>
                  <p className="text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    {factor.label}
                  </p>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        factor.risk === "low" ? "bg-emerald-500" : factor.risk === "medium" ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${factor.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Score: {factor.score}/100</p>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="bg-[#0f0f14] rounded-2xl p-6 border-2 border-amber-500/10">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                <AlertTriangle className="text-amber-400" size={20} />
                Recommendations
              </h4>
              <ul className="space-y-2">
                {riskScore.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

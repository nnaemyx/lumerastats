import type { Metadata } from "next";
import {  Poppins, Work_Sans, JetBrains_Mono, Rajdhani, Exo_2, Fira_Code } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const exo2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BlockScan",
  description:
    "Explore the Lumera Testnet blockchain. View latest blocks, block details, and transactions in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rajdhani.variable} ${exo2.variable} ${firaCode.variable} antialiased`}
      >
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Raleway, Nunito, Fira_Code } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WalletWatch - Multi-Wallet Watchlist",
  description:
    "Track multiple wallet addresses in one dashboard. Monitor balances, transactions, and activity across all your watched wallets on Lumera Testnet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${nunito.variable} ${firaCode.variable} antialiased`}
      >
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}

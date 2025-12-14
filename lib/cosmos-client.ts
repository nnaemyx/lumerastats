import { SigningStargateClient, StargateClient, GasPrice } from "@cosmjs/stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { LUMERA_CONFIG, GAS_PRICE } from "./lumera-config";
import { QueryClient, setupStakingExtension } from "@cosmjs/stargate";

export const createQueryClient = async () => {
  try {
    return await StargateClient.connect(LUMERA_CONFIG.rpc);
  } catch (error: any) {
    console.error("Failed to connect to RPC:", error);
    if (error.message?.includes("fetch") || error.message?.includes("network")) {
      throw new Error("Network error: Unable to connect to Lumera Testnet. Please check your internet connection and try again.");
    }
    throw new Error(`Failed to connect to Lumera Testnet: ${error.message || "Unknown error"}`);
  }
};

export const createSigningClient = async (signer: OfflineSigner) => {
  return await SigningStargateClient.connectWithSigner(
    LUMERA_CONFIG.rpc,
    signer,
    {
      gasPrice: GasPrice.fromString(GAS_PRICE),
    }
  );
};

export const getBalance = async (address: string) => {
  try {
    const client = await createQueryClient();
    const balance = await client.getBalance(
      address,
      LUMERA_CONFIG.stakeCurrency.coinMinimalDenom
    );
    return balance;
  } catch (error: any) {
    console.error("Error fetching balance:", error);
    // Return zero balance if there's an error (wallet might be new)
    return {
      denom: LUMERA_CONFIG.stakeCurrency.coinMinimalDenom,
      amount: "0",
    };
  }
};

export const getAllBalances = async (address: string) => {
  try {
    const client = await createQueryClient();
    const balances = await client.getAllBalances(address);
    return balances;
  } catch (error: any) {
    console.error("Error fetching all balances:", error);
    // Return empty array if there's an error
    return [];
  }
};

export const sendTokens = async (
  signer: OfflineSigner,
  fromAddress: string,
  toAddress: string,
  amount: string,
  memo = ""
) => {
  const client = await createSigningClient(signer);

  const amountInMicroDenom = Math.floor(parseFloat(amount) * 1_000_000);

  const result = await client.sendTokens(
    fromAddress,
    toAddress,
    [
      {
        denom: LUMERA_CONFIG.stakeCurrency.coinMinimalDenom,
        amount: amountInMicroDenom.toString(),
      },
    ],
    {
      amount: [
        {
          denom: LUMERA_CONFIG.stakeCurrency.coinMinimalDenom,
          amount: "5000",
        },
      ],
      gas: "200000",
    },
    memo
  );

  return result;
};

export const getValidators = async () => {
  try {
    // Method 1: Try primary REST API endpoint
    console.log("Fetching validators from Lumera REST API...");
    const response = await fetch(
      `${LUMERA_CONFIG.rest}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=100`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.validators && data.validators.length > 0) {
        console.log(`✅ Found ${data.validators.length} real validators from Lumera blockchain`);
        return data.validators;
      }
    } else {
      console.warn(`REST API returned status: ${response.status}`);
    }
    
    // Method 2: Try alternative REST endpoint format
    console.log("Trying alternative endpoint...");
    const altResponse = await fetch(
      `${LUMERA_CONFIG.rest}/staking/validators`
    );
    
    if (altResponse.ok) {
      const altData = await altResponse.json();
      if (altData.result && altData.result.length > 0) {
        console.log(`✅ Found ${altData.result.length} validators from alternative endpoint`);
        return altData.result;
      }
      if (altData.validators && altData.validators.length > 0) {
        console.log(`✅ Found ${altData.validators.length} validators`);
        return altData.validators;
      }
    }
    
    // Method 3: Try RPC endpoint
    console.log("Trying RPC endpoint...");
    const rpcResponse = await fetch(
      `${LUMERA_CONFIG.rpc}/validators`
    );
    
    if (rpcResponse.ok) {
      const rpcData = await rpcResponse.json();
      if (rpcData.result?.validators && rpcData.result.validators.length > 0) {
        console.log(`✅ Found ${rpcData.result.validators.length} validators from RPC`);
        return rpcData.result.validators;
      }
    }
    
    console.error("❌ No validators found from any endpoint");
    throw new Error("No validators found on Lumera network. The network may not have active validators yet, or the endpoints may be unavailable. Please try again later.");
    
  } catch (error: any) {
    console.error("❌ Error fetching validators:", error);
    if (error.message.includes("No validators found")) {
      throw error;
    }
    throw new Error("Failed to connect to Lumera network. Please check your internet connection and try again.");
  }
};

export const getDelegations = async (delegatorAddress: string) => {
  try {
    const response = await fetch(
      `${LUMERA_CONFIG.rest}/cosmos/staking/v1beta1/delegations/${delegatorAddress}`
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.delegation_responses || [];
  } catch (error) {
    console.error("Error fetching delegations:", error);
    return [];
  }
};

export const delegate = async (
  signer: OfflineSigner,
  delegatorAddress: string,
  validatorAddress: string,
  amount: string
) => {
  const client = await createSigningClient(signer);

  const amountInMicroDenom = Math.floor(parseFloat(amount) * 1_000_000);

  const result = await client.delegateTokens(
    delegatorAddress,
    validatorAddress,
    {
      denom: LUMERA_CONFIG.stakeCurrency.coinMinimalDenom,
      amount: amountInMicroDenom.toString(),
    },
    {
      amount: [
        {
          denom: LUMERA_CONFIG.stakeCurrency.coinMinimalDenom,
          amount: "5000",
        },
      ],
      gas: "250000",
    }
  );

  return result;
};

export const undelegate = async (
  signer: OfflineSigner,
  delegatorAddress: string,
  validatorAddress: string,
  amount: string
) => {
  const client = await createSigningClient(signer);

  const amountInMicroDenom = Math.floor(parseFloat(amount) * 1_000_000);

  const result = await client.undelegateTokens(
    delegatorAddress,
    validatorAddress,
    {
      denom: LUMERA_CONFIG.stakeCurrency.coinMinimalDenom,
      amount: amountInMicroDenom.toString(),
    },
    {
      amount: [
        {
          denom: LUMERA_CONFIG.stakeCurrency.coinMinimalDenom,
          amount: "5000",
        },
      ],
      gas: "250000",
    }
  );

  return result;
};

export const formatTokenAmount = (
  amount: string | number,
  decimals = 6
): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return (numAmount / Math.pow(10, decimals)).toFixed(decimals);
};

export interface TransactionDetail {
  hash: string;
  height: string;
  type: string;
  timestamp: string;
  amount?: string;
  denom?: string;
  from?: string;
  to?: string;
  validatorAddress?: string;
  status: "success" | "pending" | "failed";
  rawLog?: string;
  memo?: string;
}

export const getTransactionHistory = async (address: string): Promise<TransactionDetail[]> => {
  try {
    // Helper function to fetch with timeout
    const fetchWithTimeout = async (url: string, timeout = 10000): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error("Request timeout: Network request took too long");
        }
        throw error;
      }
    };

    // Fetch sent and received transactions in parallel
    const [sentResponse, receivedResponse] = await Promise.allSettled([
      fetchWithTimeout(
        `${LUMERA_CONFIG.rest}/cosmos/tx/v1beta1/txs?events=message.sender='${address}'&order_by=ORDER_BY_DESC&pagination.limit=50`
      ),
      fetchWithTimeout(
        `${LUMERA_CONFIG.rest}/cosmos/tx/v1beta1/txs?events=transfer.recipient='${address}'&order_by=ORDER_BY_DESC&pagination.limit=50`
      ),
    ]);

    const transactions: TransactionDetail[] = [];
    
    // Parse sent transactions
    if (sentResponse.status === 'fulfilled' && sentResponse.value.ok) {
      try {
        const sentData = await sentResponse.value.json();
        if (sentData.txs && sentData.txs.length > 0) {
          const parsedSent = sentData.txs.map((tx: any) => parseTransaction(tx, address));
          transactions.push(...parsedSent);
        }
      } catch (parseError) {
        console.error("Error parsing sent transactions:", parseError);
      }
    }
    
    // Parse received transactions
    if (receivedResponse.status === 'fulfilled' && receivedResponse.value.ok) {
      try {
        const receivedData = await receivedResponse.value.json();
        if (receivedData.txs && receivedData.txs.length > 0) {
          const parsedReceived = receivedData.txs.map((tx: any) => parseTransaction(tx, address));
          transactions.push(...parsedReceived);
        }
      } catch (parseError) {
        console.error("Error parsing received transactions:", parseError);
      }
    }

    // Remove duplicates and sort by height (descending)
    const uniqueTransactions = Array.from(
      new Map(transactions.map(tx => [tx.hash, tx])).values()
    );
    
    return uniqueTransactions.sort((a, b) => parseInt(b.height) - parseInt(a.height));
  } catch (error: any) {
    console.error("Error fetching transaction history:", error);
    // Return empty array on error (wallet might be new or network issue)
    return [];
  }
};

const parseTransaction = (tx: any, userAddress: string): TransactionDetail => {
  const txResponse = tx.tx_response || tx;
  const messages = tx.tx?.body?.messages || tx.body?.messages || [];
  const firstMessage = messages[0] || {};
  
  // Extract transaction type
  const msgType = firstMessage["@type"] || "";
  let type = msgType.split(".").pop() || "Unknown";
  
  // Simplify common types
  if (type === "MsgSend") type = "Send";
  if (type === "MsgDelegate") type = "Delegate";
  if (type === "MsgUndelegate") type = "Undelegate";
  if (type === "MsgWithdrawDelegatorReward") type = "Claim Rewards";
  if (type === "MsgBeginRedelegate") type = "Redelegate";
  
  // Extract amount and addresses based on message type
  let amount: string | undefined;
  let denom: string | undefined;
  let from: string | undefined;
  let to: string | undefined;
  let validatorAddress: string | undefined;
  
  if (msgType.includes("MsgSend")) {
    from = firstMessage.from_address;
    to = firstMessage.to_address;
    if (firstMessage.amount && firstMessage.amount.length > 0) {
      const coin = firstMessage.amount[0];
      amount = formatTokenAmount(coin.amount, 6);
      denom = coin.denom;
    }
  } else if (msgType.includes("MsgDelegate") || msgType.includes("MsgUndelegate")) {
    from = firstMessage.delegator_address;
    validatorAddress = firstMessage.validator_address;
    if (firstMessage.amount) {
      amount = formatTokenAmount(firstMessage.amount.amount, 6);
      denom = firstMessage.amount.denom;
    }
  } else if (msgType.includes("MsgWithdrawDelegatorReward")) {
    from = firstMessage.delegator_address;
    validatorAddress = firstMessage.validator_address;
    // Try to extract reward amount from logs
    try {
      const logs = JSON.parse(txResponse.raw_log || "[]");
      if (logs[0]?.events) {
        const withdrawEvent = logs[0].events.find((e: any) => e.type === "withdraw_rewards");
        if (withdrawEvent) {
          const amountAttr = withdrawEvent.attributes.find((a: any) => a.key === "amount");
          if (amountAttr && amountAttr.value) {
            const match = amountAttr.value.match(/(\d+)(\w+)/);
            if (match) {
              amount = formatTokenAmount(match[1], 6);
              denom = match[2];
            }
          }
        }
      }
    } catch (e) {
      console.error("Error parsing reward amount:", e);
    }
  }
  
  // Determine status
  let status: "success" | "pending" | "failed" = "success";
  if (txResponse.code && txResponse.code !== 0) {
    status = "failed";
  }
  
  // Parse timestamp
  let timestamp = new Date().toLocaleString();
  if (txResponse.timestamp) {
    timestamp = new Date(txResponse.timestamp).toLocaleString();
  }
  
  return {
    hash: txResponse.txhash || tx.hash || "unknown",
    height: txResponse.height?.toString() || "0",
    type,
    timestamp,
    amount,
    denom,
    from,
    to,
    validatorAddress,
    status,
    rawLog: txResponse.raw_log,
    memo: tx.tx?.body?.memo || tx.body?.memo,
  };
};

export interface BlockInfo {
  height: string;
  hash: string;
  time: string;
  numTxs: number;
  proposer?: string;
  transactions?: TransactionDetail[];
}

export const getLatestBlocks = async (limit: number = 20): Promise<BlockInfo[]> => {
  try {
    const client = await createQueryClient();
    const latestHeight = await client.getHeight();
    
    const blocks: BlockInfo[] = [];
    const startHeight = Math.max(1, latestHeight - limit + 1);
    
    for (let height = latestHeight; height >= startHeight && height > 0; height--) {
      try {
        const block = await client.getBlock(height);
        if (block) {
          blocks.push({
            height: height.toString(),
            hash: block.id || "",
            time: block.header.time ? new Date(block.header.time).toISOString() : new Date().toISOString(),
            numTxs: block.txs.length,
            proposer: undefined, // Proposer address not available in BlockHeader type
            transactions: block.txs.map((tx, idx) => {
              // Try to parse transaction
              try {
                const txHash = Buffer.from(tx).toString('hex').slice(0, 64);
                return {
                  hash: txHash,
                  height: height.toString(),
                  type: "Unknown",
                  timestamp: block.header.time ? new Date(block.header.time).toISOString() : new Date().toISOString(),
                  status: "success" as const,
                };
              } catch {
                return {
                  hash: `tx-${height}-${idx}`,
                  height: height.toString(),
                  type: "Unknown",
                  timestamp: block.header.time ? new Date(block.header.time).toISOString() : new Date().toISOString(),
                  status: "success" as const,
                };
              }
            }),
          });
        }
      } catch (err) {
        console.error(`Error fetching block ${height}:`, err);
        // Continue with next block
      }
    }
    
    return blocks;
  } catch (error: any) {
    console.error("Error fetching latest blocks:", error);
    // Try REST API as fallback
    try {
      const response = await fetch(`${LUMERA_CONFIG.rest}/cosmos/base/tendermint/v1beta1/blocks/latest`);
      if (response.ok) {
        const data = await response.json();
        const block = data.block;
        return [{
          height: block.header.height || "0",
          hash: block.header.last_commit_hash || "",
          time: block.header.time || new Date().toISOString(),
          numTxs: block.data?.txs?.length || 0,
          proposer: block.header.proposer_address,
        }];
      }
    } catch (restError) {
      console.error("REST API fallback also failed:", restError);
    }
    return [];
  }
};

export const getBlockByHeight = async (height: number): Promise<BlockInfo | null> => {
  try {
    const client = await createQueryClient();
    const block = await client.getBlock(height);
    
    if (!block) {
      return null;
    }
    
    return {
      height: height.toString(),
      hash: block.id || "",
      time: block.header.time ? new Date(block.header.time).toISOString() : new Date().toISOString(),
      numTxs: block.txs.length,
      proposer: undefined, // Proposer address not available in BlockHeader type
      transactions: block.txs.map((tx, idx) => {
        try {
          const txHash = Buffer.from(tx).toString('hex').slice(0, 64);
          return {
            hash: txHash,
            height: height.toString(),
            type: "Unknown",
            timestamp: block.header.time ? new Date(block.header.time).toISOString() : new Date().toISOString(),
            status: "success" as const,
          };
        } catch {
          return {
            hash: `tx-${height}-${idx}`,
            height: height.toString(),
            type: "Unknown",
            timestamp: block.header.time ? new Date(block.header.time).toISOString() : new Date().toISOString(),
            status: "success" as const,
          };
        }
      }),
    };
  } catch (error: any) {
    console.error(`Error fetching block ${height}:`, error);
    // Try REST API as fallback
    try {
      const response = await fetch(`${LUMERA_CONFIG.rest}/cosmos/base/tendermint/v1beta1/blocks/${height}`);
      if (response.ok) {
        const data = await response.json();
        const block = data.block;
        return {
          height: block.header.height || height.toString(),
          hash: block.header.last_commit_hash || "",
          time: block.header.time || new Date().toISOString(),
          numTxs: block.data?.txs?.length || 0,
          proposer: block.header.proposer_address,
        };
      }
    } catch (restError) {
      console.error("REST API fallback also failed:", restError);
    }
    return null;
  }
};

export const getLatestBlockHeight = async (): Promise<number> => {
  try {
    const client = await createQueryClient();
    return await client.getHeight();
  } catch (error: any) {
    console.error("Error fetching latest block height:", error);
    // Try REST API as fallback
    try {
      const response = await fetch(`${LUMERA_CONFIG.rest}/cosmos/base/tendermint/v1beta1/blocks/latest`);
      if (response.ok) {
        const data = await response.json();
        return parseInt(data.block.header.height || "0");
      }
    } catch (restError) {
      console.error("REST API fallback also failed:", restError);
    }
    return 0;
  }
};


import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

export const useWallet = () => {
  const { publicKey, connected, disconnect, connect, wallet } = useSolanaWallet();
  
  return {
    publicKey,
    connected,
    disconnect,
    connect,
    wallet,
    address: publicKey?.toString() || ''
  };
};

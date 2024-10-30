// client/src/components/WalletConnectButton.tsx

import React, { useState, useEffect, useRef } from "react";
import "./styles/WalletConnectButton.css";

declare global {
  interface Window {
    solana?: any;
  }
}

const WalletConnectButton: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);

  const connectWallet = async () => {
    if (window.solana) {
      try {
        const response = await window.solana.connect();
        console.log(
          "Connected with Public Key:",
          response.publicKey.toString()
        );
        setWalletAddress(response.publicKey.toString());
        setConnectionStatus("Wallet connected successfully.");

        // Verify the wallet is unlocked and functional
        await verifyWallet();
      } catch (err: any) {
        if (err.code === 4001) {
          console.error("User rejected the connection request.");
          setConnectionStatus("Connection request rejected by the user.");
        } else {
          console.error("Error connecting to wallet:", err);
          setConnectionStatus(
            "An error occurred while connecting to the wallet."
          );
        }
      }
    } else {
      alert("Solana object not found! Get a Phantom Wallet 👻");
    }
  };

  const disconnectWallet = async () => {
    if (window.solana) {
      try {
        await window.solana.disconnect();
        setWalletAddress("");
        setMenuOpen(false);
        setConnectionStatus("Wallet disconnected.");
        console.log("Wallet disconnected");
      } catch (err) {
        console.error("Error disconnecting wallet:", err);
        setConnectionStatus(
          "An error occurred while disconnecting the wallet."
        );
      }
    }
  };

  const verifyWallet = async () => {
    try {
      const message = "Verify Wallet Connection";
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await window.solana.signMessage(
        encodedMessage,
        "utf8"
      );
      console.log("Wallet verified.");
      setConnectionStatus("Wallet verified and connected.");
    } catch (err) {
      console.error("Error verifying wallet:", err);
      setConnectionStatus("Wallet is locked. Please unlock and try again.");
      // Disconnect the wallet since it's not usable
      await disconnectWallet();
    }
  };

  // Remove the useEffect that auto-connects on load

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="wallet-connect-container" ref={menuRef}>
      {walletAddress ? (
        <div>
          <button
            className="wallet-button connected"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </button>
          {menuOpen && (
            <div className="wallet-menu">
              <ul>
                <li onClick={disconnectWallet}>Disconnect</li>
                <li onClick={connectWallet}>Change Wallet</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button className="wallet-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      {/* Display connection status message */}
      {connectionStatus && (
        <div className="connection-status">{connectionStatus}</div>
      )}
    </div>
  );
};

export default WalletConnectButton;

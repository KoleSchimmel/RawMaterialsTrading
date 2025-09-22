# Raw Materials Trading Platform

A privacy-preserving marketplace for confidential raw materials trading powered by Fully Homomorphic Encryption (FHE) technology.

## Core Concepts

### FHE Smart Contracts
This platform leverages **Fully Homomorphic Encryption (FHE)** smart contracts to enable completely private trading operations. All sensitive data including material quantities, prices, and availability status are encrypted on-chain, ensuring that trade information remains confidential while still allowing for trustless verification and execution.

### Confidential Raw Materials Trading
Our **privacy-preserving raw materials marketplace** allows suppliers and buyers to engage in secure transactions without revealing sensitive business information such as:
- Material quantities and inventory levels
- Pricing strategies and cost structures
- Supply availability and demand patterns
- Trading relationships and volumes

### Privacy Raw Materials Market
The platform creates a **private trading environment** where:
- Suppliers can list materials with encrypted details
- Buyers can place orders without exposing purchase patterns
- All transactions maintain confidentiality while ensuring transparency
- Smart contracts enforce trade rules without revealing private data

## Contract Information

**Smart Contract Address:** `0x34D5b24b0EC1E5Ac1Cce7754e7cDe433E360988D`

**Network:** Ethereum Sepolia Testnet

## Demo Videos & Transaction Screenshots

### Register as Supplier
![Register as Supplier Transaction](./assets/register-supplier-tx.png)
*On-chain transaction screenshot showing supplier registration process*

### List New Material
![List Material Transaction](./assets/list-material-tx.png)
*On-chain transaction screenshot demonstrating encrypted material listing*

### Demo Video
Watch our platform demonstration showcasing the complete trading workflow from supplier registration to order fulfillment, all while maintaining complete privacy of sensitive trading data.

## Key Features

- **Encrypted Trading Data**: All material quantities, prices, and availability encrypted using FHE
- **Role-Based Access**: Separate supplier and buyer registration and permissions
- **Private Order Management**: Confidential order placement and approval system
- **Real-time Updates**: Live tracking of materials and orders while preserving privacy
- **MetaMask Integration**: Seamless wallet connection and transaction signing
- **Demo Mode**: Fallback functionality for testing without wallet connection

## Technology Stack

- **Blockchain**: Ethereum Sepolia Testnet
- **Encryption**: Zama FHEVM (Fully Homomorphic Encryption Virtual Machine)
- **Smart Contracts**: Solidity 0.8.24 with FHE libraries
- **Frontend**: Vanilla JavaScript with ethers.js v6
- **Wallet**: MetaMask integration

## Privacy Guarantees

The platform ensures complete confidentiality through:
- **Encrypted Storage**: All sensitive data encrypted on-chain using FHE
- **Private Computations**: Calculations performed on encrypted data without decryption
- **Selective Disclosure**: Only authorized parties can decrypt relevant information
- **Zero Knowledge**: Verification without revealing underlying data

## Trading Workflow

1. **Registration**: Users register as suppliers or buyers
2. **Material Listing**: Suppliers list materials with encrypted details
3. **Order Placement**: Buyers place orders for required materials
4. **Private Negotiation**: Order approval process maintains confidentiality
5. **Secure Settlement**: Transaction completion with privacy preservation

## Links

- **GitHub Repository**: https://github.com/KoleSchimmel/RawMaterialsTrading
- **Live Platform**: https://raw-materials-trading.vercel.app/

## About

This platform represents the future of B2B raw materials trading, where businesses can engage in commerce while protecting their most sensitive operational data. By combining blockchain transparency with advanced encryption, we enable a new paradigm of confidential yet trustless trading.
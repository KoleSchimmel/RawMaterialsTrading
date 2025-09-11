# Confidential Raw Materials Trading Platform

A privacy-preserving marketplace for raw materials trading powered by Fully Homomorphic Encryption (FHE) on Ethereum blockchain.

## 🔒 Core Concept

This platform revolutionizes raw materials trading by implementing **Fully Homomorphic Encryption (FHE)** to protect sensitive business information while maintaining the transparency and security of blockchain technology.

### Privacy-First Raw Materials Market

Traditional raw materials trading exposes critical business data including:
- Exact quantities being traded
- Precise pricing information
- Minimum order requirements
- Trading volumes and patterns

Our FHE-powered solution encrypts this sensitive data on-chain while still enabling automated matching, verification, and settlement of trades.

## 🛡️ FHE Smart Contract Architecture

The platform utilizes Zama's FHE technology to create a confidential trading environment:

- **Encrypted Quantities**: Material quantities remain hidden while enabling comparison operations
- **Private Pricing**: Price negotiations occur without revealing exact amounts to competitors
- **Confidential Orders**: Buyer requirements stay encrypted until matched with suppliers
- **Secure Matching**: Automated trade matching using encrypted comparison operations

## 🏭 Raw Materials Categories

The platform supports trading across multiple categories:

- **Metals**: Steel, aluminum, copper, and precious metals
- **Chemicals**: Industrial chemicals, polymers, and specialty compounds
- **Energy**: Oil, gas, renewable energy certificates
- **Agricultural**: Grains, livestock feed, agricultural commodities
- **Textiles**: Cotton, wool, synthetic fibers, and fabric materials
- **Minerals**: Rare earth elements, construction materials, mining products

## 📋 Key Features

### For Suppliers
- **List Materials Confidentially**: Add inventory with encrypted quantities and pricing
- **Quality Grading**: Specify material grade and delivery timeframes
- **Automated Matching**: Receive match notifications without exposing sensitive data
- **Inventory Management**: Track materials and update availability

### For Buyers
- **Browse Materials**: Search by category with privacy-preserved details
- **Confidential Orders**: Submit orders with encrypted quantity and price limits
- **Delivery Specifications**: Set location and special requirements
- **Order Tracking**: Monitor order status and trade completion

### For Administrators
- **Verification System**: Verify suppliers and buyers to maintain market integrity
- **Platform Oversight**: Manage user permissions and platform governance

## 🔗 Smart Contract Details

**Contract Address**: `0x57190DE0E0bF65eF2356a7BFa0bE0A05b0c48827`

**Network**: Sepolia Testnet (ChainID: 11155111)

**Technology Stack**:
- Solidity ^0.8.24
- Zama FHEVM Library
- Ethers.js Frontend Integration
- MetaMask Wallet Support

## 🌐 Live Application

**Website**: [https://raw-materials-trading.vercel.app/](https://raw-materials-trading.vercel.app/)

**Repository**: [https://github.com/KoleSchimmel/RawMaterialsTrading](https://github.com/KoleSchimmel/RawMaterialsTrading)

## 📺 Demo & Screenshots

### Demo Video
A comprehensive demonstration video showcasing the platform's features, FHE implementation, and trading workflows is available in the repository.
RawMaterialsTrading.mp4

### On-Chain Transaction Examples
The platform includes real transaction screenshots demonstrating:
- Material listing with encrypted parameters
- Order placement with confidential requirements
- Trade matching and completion
- Verification transactions
- Real gas costs and transaction confirmations

## 🔐 Privacy Guarantees

### What Remains Private
- Exact quantities of materials
- Precise pricing information
- Minimum order amounts
- Buyer maximum price limits
- Special order requirements

### What Stays Public
- Material categories and names
- Supplier and buyer addresses
- Quality grades and delivery timeframes
- Order status and completion
- Trade matching events

## 🚀 Getting Started

### Prerequisites
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH for gas fees
- Verification as supplier or buyer (contact admin)

### Quick Start Guide

1. **Connect Wallet**: Link your MetaMask to Sepolia testnet
2. **Get Verified**: Request verification from platform administrator
3. **For Suppliers**: List materials with encrypted details
4. **For Buyers**: Browse materials and place confidential orders
5. **Trade Execution**: Automated matching and settlement

## 🏗️ Technical Architecture

### Smart Contract Structure
```
ConfidentialRawMaterialsTrading.sol
├── Material Management (FHE encrypted)
├── Order Processing (Private matching)
├── Trade Execution (Automated settlement)
├── Verification System (Access control)
└── Event Logging (Transparent tracking)
```

### FHE Implementation Details
- **euint32**: Encrypted 32-bit integers for quantities
- **euint64**: Encrypted 64-bit integers for pricing
- **ebool**: Encrypted boolean operations for comparisons
- **Async Decryption**: Secure revelation of trade results

## 🌍 Market Impact

This platform addresses critical challenges in global raw materials trading:

- **Price Discovery**: Confidential price signals without information leakage
- **Supply Chain Privacy**: Protect strategic sourcing information
- **Competitive Advantage**: Maintain trading edge through data privacy
- **Market Efficiency**: Automated matching reduces friction and costs
- **Trust Building**: Cryptographic guarantees replace institutional trust

## 🔧 Integration Capabilities

The platform supports integration with:
- **ERP Systems**: Import/export material data
- **Supply Chain Tools**: Connect with logistics providers
- **Financial Systems**: Integrate with payment and settlement
- **Analytics Platforms**: Privacy-preserving market insights

## 📊 Market Statistics

The platform tracks (publicly visible) metrics:
- Total number of materials listed
- Active suppliers and buyers
- Completed trades volume
- Category-wise market activity
- Platform utilization trends

## 🛠️ Developer Resources

### Contract ABI
Complete ABI available in the repository for integration.

### Event Monitoring
Subscribe to contract events for real-time updates:
- `MaterialListed`: New materials added
- `OrderPlaced`: New orders submitted
- `TradeMatched`: Successful matches
- `TradeCompleted`: Finalized transactions

### Testing Environment
Full Sepolia testnet deployment for development and testing.

---

*Built with privacy at its core, powered by cutting-edge FHE technology.*
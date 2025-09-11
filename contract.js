// Contract configuration
const CONTRACT_ADDRESS = '0x57190DE0E0bF65eF2356a7BFa0bE0A05b0c48827';
const NETWORK_ID = 11155111; // Sepolia testnet

const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "BuyerVerified",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "materialId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "supplier",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum ConfidentialRawMaterialsTrading.MaterialCategory",
                "name": "category",
                "type": "uint8"
            }
        ],
        "name": "MaterialListed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "materialId",
                "type": "uint256"
            }
        ],
        "name": "OrderPlaced",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "supplier",
                "type": "address"
            }
        ],
        "name": "SupplierVerified",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "materialId",
                "type": "uint256"
            }
        ],
        "name": "TradeCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "materialId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "supplier",
                "type": "address"
            }
        ],
        "name": "TradeMatched",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_orderId",
                "type": "uint256"
            }
        ],
        "name": "cancelOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_orderId",
                "type": "uint256"
            }
        ],
        "name": "confirmTrade",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_materialId",
                "type": "uint256"
            }
        ],
        "name": "deactivateMaterial",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "getBuyerOrders",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_materialId",
                "type": "uint256"
            }
        ],
        "name": "getMaterialInfo",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "enum ConfidentialRawMaterialsTrading.MaterialCategory",
                "name": "category",
                "type": "uint8"
            },
            {
                "internalType": "address",
                "name": "supplier",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "qualityGrade",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "deliveryTimeframe",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum ConfidentialRawMaterialsTrading.MaterialCategory",
                "name": "category",
                "type": "uint8"
            }
        ],
        "name": "getMaterialsByCategory",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "activeMaterials",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_orderId",
                "type": "uint256"
            }
        ],
        "name": "getOrderInfo",
        "outputs": [
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "materialId",
                "type": "uint256"
            },
            {
                "internalType": "enum ConfidentialRawMaterialsTrading.OrderStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "matchedAt",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "matchedSupplier",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "deliveryLocation",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "supplier",
                "type": "address"
            }
        ],
        "name": "getSupplierMaterials",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_orderId",
                "type": "uint256"
            }
        ],
        "name": "getTradeMatch",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "materialId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "supplier",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isConfirmed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "enum ConfidentialRawMaterialsTrading.MaterialCategory",
                "name": "_category",
                "type": "uint8"
            },
            {
                "internalType": "uint32",
                "name": "_quantity",
                "type": "uint32"
            },
            {
                "internalType": "uint64",
                "name": "_pricePerUnit",
                "type": "uint64"
            },
            {
                "internalType": "uint32",
                "name": "_minOrder",
                "type": "uint32"
            },
            {
                "internalType": "string",
                "name": "_qualityGrade",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_deliveryTimeframe",
                "type": "uint256"
            }
        ],
        "name": "listMaterial",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_orderId",
                "type": "uint256"
            }
        ],
        "name": "matchTrade",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextMaterialId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextOrderId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_materialId",
                "type": "uint256"
            },
            {
                "internalType": "uint32",
                "name": "_quantity",
                "type": "uint32"
            },
            {
                "internalType": "uint64",
                "name": "_maxPrice",
                "type": "uint64"
            },
            {
                "internalType": "string",
                "name": "_deliveryLocation",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "_encryptedSpecialRequirements",
                "type": "bytes32"
            }
        ],
        "name": "placeOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "verifyBuyer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "supplier",
                "type": "address"
            }
        ],
        "name": "verifySupplier",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "verifiedBuyers",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "verifiedSuppliers",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Material categories mapping
const MATERIAL_CATEGORIES = {
    0: 'Metals',
    1: 'Chemicals',
    2: 'Energy',
    3: 'Agricultural',
    4: 'Textiles',
    5: 'Minerals'
};

// Order status mapping
const ORDER_STATUS = {
    0: 'Pending',
    1: 'Matched',
    2: 'Completed',
    3: 'Cancelled'
};

// Contract interaction functions
class ContractService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.userAddress = null;
    }

    async init(provider, signer) {
        this.provider = provider;
        this.signer = signer;
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        this.userAddress = await signer.getAddress();
    }

    async getMaterialInfo(materialId) {
        try {
            const result = await this.contract.getMaterialInfo(materialId);
            return {
                name: result.name,
                category: parseInt(result.category),
                supplier: result.supplier,
                isActive: result.isActive,
                createdAt: result.createdAt,
                qualityGrade: result.qualityGrade,
                deliveryTimeframe: result.deliveryTimeframe
            };
        } catch (error) {
            console.error('Error getting material info:', error);
            throw error;
        }
    }

    async getMaterialsByCategory(category) {
        try {
            return await this.contract.getMaterialsByCategory(category);
        } catch (error) {
            console.error('Error getting materials by category:', error);
            throw error;
        }
    }

    async listMaterial(name, category, quantity, pricePerUnit, minOrder, qualityGrade, deliveryTimeframe) {
        try {
            const tx = await this.contract.listMaterial(
                name,
                category,
                quantity,
                pricePerUnit,
                minOrder,
                qualityGrade,
                deliveryTimeframe
            );
            return await tx.wait();
        } catch (error) {
            console.error('Error listing material:', error);
            throw error;
        }
    }

    async placeOrder(materialId, quantity, maxPrice, deliveryLocation, specialRequirements) {
        try {
            const encryptedRequirements = ethers.utils.formatBytes32String(specialRequirements.substring(0, 31));
            const tx = await this.contract.placeOrder(
                materialId,
                quantity,
                maxPrice,
                deliveryLocation,
                encryptedRequirements
            );
            return await tx.wait();
        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        }
    }

    async matchTrade(orderId) {
        try {
            const tx = await this.contract.matchTrade(orderId);
            return await tx.wait();
        } catch (error) {
            console.error('Error matching trade:', error);
            throw error;
        }
    }

    async confirmTrade(orderId) {
        try {
            const tx = await this.contract.confirmTrade(orderId);
            return await tx.wait();
        } catch (error) {
            console.error('Error confirming trade:', error);
            throw error;
        }
    }

    async cancelOrder(orderId) {
        try {
            const tx = await this.contract.cancelOrder(orderId);
            return await tx.wait();
        } catch (error) {
            console.error('Error cancelling order:', error);
            throw error;
        }
    }

    async getBuyerOrders(address) {
        try {
            return await this.contract.getBuyerOrders(address || this.userAddress);
        } catch (error) {
            console.error('Error getting buyer orders:', error);
            throw error;
        }
    }

    async getSupplierMaterials(address) {
        try {
            return await this.contract.getSupplierMaterials(address || this.userAddress);
        } catch (error) {
            console.error('Error getting supplier materials:', error);
            throw error;
        }
    }

    async getOrderInfo(orderId) {
        try {
            const result = await this.contract.getOrderInfo(orderId);
            return {
                buyer: result.buyer,
                materialId: result.materialId,
                status: parseInt(result.status),
                createdAt: result.createdAt,
                matchedAt: result.matchedAt,
                matchedSupplier: result.matchedSupplier,
                deliveryLocation: result.deliveryLocation
            };
        } catch (error) {
            console.error('Error getting order info:', error);
            throw error;
        }
    }

    async verifySupplier(address) {
        try {
            const tx = await this.contract.verifySupplier(address);
            return await tx.wait();
        } catch (error) {
            console.error('Error verifying supplier:', error);
            throw error;
        }
    }

    async verifyBuyer(address) {
        try {
            const tx = await this.contract.verifyBuyer(address);
            return await tx.wait();
        } catch (error) {
            console.error('Error verifying buyer:', error);
            throw error;
        }
    }

    async isVerifiedSupplier(address) {
        try {
            return await this.contract.verifiedSuppliers(address || this.userAddress);
        } catch (error) {
            console.error('Error checking supplier verification:', error);
            return false;
        }
    }

    async isVerifiedBuyer(address) {
        try {
            return await this.contract.verifiedBuyers(address || this.userAddress);
        } catch (error) {
            console.error('Error checking buyer verification:', error);
            return false;
        }
    }

    async getNextMaterialId() {
        try {
            return await this.contract.nextMaterialId();
        } catch (error) {
            console.error('Error getting next material ID:', error);
            return 1;
        }
    }

    async getNextOrderId() {
        try {
            return await this.contract.nextOrderId();
        } catch (error) {
            console.error('Error getting next order ID:', error);
            return 1;
        }
    }

    async isOwner() {
        try {
            const owner = await this.contract.owner();
            return owner.toLowerCase() === this.userAddress.toLowerCase();
        } catch (error) {
            console.error('Error checking owner:', error);
            return false;
        }
    }
}

// Global contract service instance
let contractService = new ContractService();
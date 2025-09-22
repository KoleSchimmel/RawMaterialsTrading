const { ethers } = require("ethers");
const fs = require("fs");

// Contract source code for the simplified version
const contractSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RawMaterialsTrading {
    struct Material {
        string name;
        uint32 quantity;
        uint32 price;
        bool available;
        address supplier;
        uint256 timestamp;
    }

    struct Order {
        uint256 materialId;
        uint32 quantity;
        bool approved;
        address buyer;
        uint256 timestamp;
    }

    Material[] public materials;
    Order[] public orders;

    mapping(address => bool) public suppliers;
    mapping(address => bool) public buyers;
    mapping(uint256 => uint256[]) public materialOrders;

    event MaterialListed(uint256 indexed materialId, string name, address supplier);
    event OrderPlaced(uint256 indexed orderId, uint256 materialId, address buyer);
    event OrderApproved(uint256 indexed orderId, bool approved);
    event RoleAssigned(address indexed user, string role);

    modifier onlySupplier() {
        require(suppliers[msg.sender], "Only suppliers can perform this action");
        _;
    }

    modifier onlyBuyer() {
        require(buyers[msg.sender], "Only buyers can perform this action");
        _;
    }

    constructor() {
        suppliers[msg.sender] = true;
        buyers[msg.sender] = true;
    }

    function registerAsSupplier() external {
        suppliers[msg.sender] = true;
        emit RoleAssigned(msg.sender, "supplier");
    }

    function registerAsBuyer() external {
        buyers[msg.sender] = true;
        emit RoleAssigned(msg.sender, "buyer");
    }

    function listMaterial(
        string calldata _name,
        uint32 _quantity,
        uint32 _price,
        bool _available
    ) external onlySupplier {
        materials.push(Material({
            name: _name,
            quantity: _quantity,
            price: _price,
            available: _available,
            supplier: msg.sender,
            timestamp: block.timestamp
        }));

        emit MaterialListed(materials.length - 1, _name, msg.sender);
    }

    function placeOrder(
        uint256 _materialId,
        uint32 _quantity
    ) external onlyBuyer {
        require(_materialId < materials.length, "Material does not exist");

        orders.push(Order({
            materialId: _materialId,
            quantity: _quantity,
            approved: false,
            buyer: msg.sender,
            timestamp: block.timestamp
        }));

        materialOrders[_materialId].push(orders.length - 1);
        emit OrderPlaced(orders.length - 1, _materialId, msg.sender);
    }

    function approveOrder(uint256 _orderId, bool _approved) external {
        require(_orderId < orders.length, "Order does not exist");
        Order storage order = orders[_orderId];
        Material storage material = materials[order.materialId];

        require(material.supplier == msg.sender, "Only material supplier can approve");

        order.approved = _approved;
        emit OrderApproved(_orderId, _approved);
    }

    function updateMaterialAvailability(uint256 _materialId, bool _available) external {
        require(_materialId < materials.length, "Material does not exist");
        require(materials[_materialId].supplier == msg.sender, "Only supplier can update");

        materials[_materialId].available = _available;
    }

    function getMaterialCount() external view returns (uint256) {
        return materials.length;
    }

    function getOrderCount() external view returns (uint256) {
        return orders.length;
    }

    function getMaterialOrders(uint256 _materialId) external view returns (uint256[] memory) {
        return materialOrders[_materialId];
    }
}
`;

async function main() {
    console.log("Starting contract deployment...");

    console.log("✅ Contract deployment instructions:");
    console.log("1. Copy the contract source code from contracts/RawMaterialsTrading_Simple.sol");
    console.log("2. Go to https://remix.ethereum.org");
    console.log("3. Create a new file and paste the contract code");
    console.log("4. Compile with Solidity 0.8.24");
    console.log("5. Deploy to Sepolia testnet using MetaMask");
    console.log("6. Copy the deployed contract address");
    console.log("7. Update the CONTRACT_ADDRESS in index.html");

    console.log("\n📋 Contract source ready in: contracts/RawMaterialsTrading_Simple.sol");
}

main().catch(console.error);
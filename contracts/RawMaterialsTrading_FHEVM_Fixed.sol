
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract RawMaterialsTrading is SepoliaConfig {
    using FHE for euint32;
    using FHE for ebool;

    struct Material {
        string name;
        euint32 encryptedQuantity;
        euint32 encryptedPrice;
        ebool encryptedAvailable;
        address supplier;
        uint256 timestamp;
    }

    struct Order {
        uint256 materialId;
        euint32 encryptedQuantity;
        ebool encryptedApproved;
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
        // SepoliaConfig constructor automatically sets up FHEVM infrastructure:
        // - FHE.setCoprocessor(ZamaConfig.getSepoliaConfig());
        // - FHE.setDecryptionOracle(ZamaConfig.getSepoliaOracleAddress());

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
        euint32 encryptedQuantity = FHE.asEuint32(_quantity);
        euint32 encryptedPrice = FHE.asEuint32(_price);
        ebool encryptedAvailable = FHE.asEbool(_available);

        // Set permissions for the encrypted values
        FHE.allowThis(encryptedQuantity);
        FHE.allowThis(encryptedPrice);
        FHE.allowThis(encryptedAvailable);

        FHE.allow(encryptedQuantity, msg.sender);
        FHE.allow(encryptedPrice, msg.sender);
        FHE.allow(encryptedAvailable, msg.sender);

        materials.push(Material({
            name: _name,
            encryptedQuantity: encryptedQuantity,
            encryptedPrice: encryptedPrice,
            encryptedAvailable: encryptedAvailable,
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

        euint32 encryptedQuantity = FHE.asEuint32(_quantity);
        ebool encryptedApproved = FHE.asEbool(false);

        // Set permissions for the encrypted values
        FHE.allowThis(encryptedQuantity);
        FHE.allowThis(encryptedApproved);

        FHE.allow(encryptedQuantity, msg.sender);
        FHE.allow(encryptedApproved, msg.sender);
        FHE.allow(encryptedApproved, materials[_materialId].supplier);

        orders.push(Order({
            materialId: _materialId,
            encryptedQuantity: encryptedQuantity,
            encryptedApproved: encryptedApproved,
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

        order.encryptedApproved = FHE.asEbool(_approved);
        FHE.allowThis(order.encryptedApproved);
        FHE.allow(order.encryptedApproved, msg.sender);
        FHE.allow(order.encryptedApproved, order.buyer);

        emit OrderApproved(_orderId, _approved);
    }

    function updateMaterialAvailability(uint256 _materialId, bool _available) external {
        require(_materialId < materials.length, "Material does not exist");
        require(materials[_materialId].supplier == msg.sender, "Only supplier can update");

        materials[_materialId].encryptedAvailable = FHE.asEbool(_available);
        FHE.allowThis(materials[_materialId].encryptedAvailable);
        FHE.allow(materials[_materialId].encryptedAvailable, msg.sender);
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

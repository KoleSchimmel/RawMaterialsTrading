// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, ebool, euint64 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialRawMaterialsTrading is SepoliaConfig {

    address public owner;
    uint256 public nextMaterialId;
    uint256 public nextOrderId;

    enum MaterialCategory {
        METALS,
        CHEMICALS,
        ENERGY,
        AGRICULTURAL,
        TEXTILES,
        MINERALS
    }

    enum OrderStatus {
        PENDING,
        MATCHED,
        COMPLETED,
        CANCELLED
    }

    struct RawMaterial {
        string name;
        MaterialCategory category;
        address supplier;
        euint32 encryptedQuantity;
        euint64 encryptedPricePerUnit;
        euint32 encryptedMinOrder;
        bool isActive;
        uint256 createdAt;
        string qualityGrade;
        uint256 deliveryTimeframe;
    }

    struct Order {
        address buyer;
        uint256 materialId;
        euint32 encryptedQuantity;
        euint64 encryptedMaxPrice;
        OrderStatus status;
        uint256 createdAt;
        uint256 matchedAt;
        address matchedSupplier;
        euint64 encryptedFinalPrice;
        string deliveryLocation;
        bytes32 encryptedSpecialRequirements;
    }

    struct TradeMatch {
        uint256 orderId;
        uint256 materialId;
        address buyer;
        address supplier;
        euint32 encryptedQuantity;
        euint64 encryptedPrice;
        uint256 timestamp;
        bool isConfirmed;
    }

    mapping(uint256 => RawMaterial) public materials;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => TradeMatch) public matches;
    mapping(address => uint256[]) public supplierMaterials;
    mapping(address => uint256[]) public buyerOrders;
    mapping(address => bool) public verifiedSuppliers;
    mapping(address => bool) public verifiedBuyers;

    event MaterialListed(uint256 indexed materialId, address indexed supplier, MaterialCategory category);
    event OrderPlaced(uint256 indexed orderId, address indexed buyer, uint256 indexed materialId);
    event TradeMatched(uint256 indexed orderId, uint256 indexed materialId, address indexed buyer, address supplier);
    event TradeCompleted(uint256 indexed orderId, uint256 indexed materialId);
    event SupplierVerified(address indexed supplier);
    event BuyerVerified(address indexed buyer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyVerifiedSupplier() {
        require(verifiedSuppliers[msg.sender], "Not verified supplier");
        _;
    }

    modifier onlyVerifiedBuyer() {
        require(verifiedBuyers[msg.sender], "Not verified buyer");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextMaterialId = 1;
        nextOrderId = 1;
    }

    function verifySupplier(address supplier) external onlyOwner {
        verifiedSuppliers[supplier] = true;
        emit SupplierVerified(supplier);
    }

    function verifyBuyer(address buyer) external onlyOwner {
        verifiedBuyers[buyer] = true;
        emit BuyerVerified(buyer);
    }

    function listMaterial(
        string memory _name,
        MaterialCategory _category,
        uint32 _quantity,
        uint64 _pricePerUnit,
        uint32 _minOrder,
        string memory _qualityGrade,
        uint256 _deliveryTimeframe
    ) external onlyVerifiedSupplier {
        require(_quantity > 0, "Invalid quantity");
        require(_pricePerUnit > 0, "Invalid price");
        require(_minOrder > 0, "Invalid minimum order");

        euint32 encryptedQuantity = FHE.asEuint32(_quantity);
        euint64 encryptedPricePerUnit = FHE.asEuint64(_pricePerUnit);
        euint32 encryptedMinOrder = FHE.asEuint32(_minOrder);

        materials[nextMaterialId] = RawMaterial({
            name: _name,
            category: _category,
            supplier: msg.sender,
            encryptedQuantity: encryptedQuantity,
            encryptedPricePerUnit: encryptedPricePerUnit,
            encryptedMinOrder: encryptedMinOrder,
            isActive: true,
            createdAt: block.timestamp,
            qualityGrade: _qualityGrade,
            deliveryTimeframe: _deliveryTimeframe
        });

        supplierMaterials[msg.sender].push(nextMaterialId);

        FHE.allowThis(encryptedQuantity);
        FHE.allowThis(encryptedPricePerUnit);
        FHE.allowThis(encryptedMinOrder);
        FHE.allow(encryptedQuantity, msg.sender);
        FHE.allow(encryptedPricePerUnit, msg.sender);
        FHE.allow(encryptedMinOrder, msg.sender);

        emit MaterialListed(nextMaterialId, msg.sender, _category);
        nextMaterialId++;
    }

    function placeOrder(
        uint256 _materialId,
        uint32 _quantity,
        uint64 _maxPrice,
        string memory _deliveryLocation,
        bytes32 _encryptedSpecialRequirements
    ) external onlyVerifiedBuyer {
        require(materials[_materialId].isActive, "Material not available");
        require(_quantity > 0, "Invalid quantity");
        require(_maxPrice > 0, "Invalid max price");

        euint32 encryptedQuantity = FHE.asEuint32(_quantity);
        euint64 encryptedMaxPrice = FHE.asEuint64(_maxPrice);

        orders[nextOrderId] = Order({
            buyer: msg.sender,
            materialId: _materialId,
            encryptedQuantity: encryptedQuantity,
            encryptedMaxPrice: encryptedMaxPrice,
            status: OrderStatus.PENDING,
            createdAt: block.timestamp,
            matchedAt: 0,
            matchedSupplier: address(0),
            encryptedFinalPrice: FHE.asEuint64(0),
            deliveryLocation: _deliveryLocation,
            encryptedSpecialRequirements: _encryptedSpecialRequirements
        });

        buyerOrders[msg.sender].push(nextOrderId);

        FHE.allowThis(encryptedQuantity);
        FHE.allowThis(encryptedMaxPrice);
        FHE.allow(encryptedQuantity, msg.sender);
        FHE.allow(encryptedMaxPrice, msg.sender);

        emit OrderPlaced(nextOrderId, msg.sender, _materialId);
        nextOrderId++;
    }

    function matchTrade(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.PENDING, "Order not pending");

        RawMaterial storage material = materials[order.materialId];
        require(material.supplier == msg.sender, "Not material supplier");
        require(material.isActive, "Material not active");

        order.status = OrderStatus.MATCHED;
        order.matchedAt = block.timestamp;
        order.matchedSupplier = msg.sender;
        order.encryptedFinalPrice = material.encryptedPricePerUnit;

        // Update material quantity (encrypted subtraction)
        euint32 remainingQuantity = FHE.sub(material.encryptedQuantity, order.encryptedQuantity);
        material.encryptedQuantity = remainingQuantity;

        matches[_orderId] = TradeMatch({
            orderId: _orderId,
            materialId: order.materialId,
            buyer: order.buyer,
            supplier: msg.sender,
            encryptedQuantity: order.encryptedQuantity,
            encryptedPrice: material.encryptedPricePerUnit,
            timestamp: block.timestamp,
            isConfirmed: false
        });

        FHE.allowThis(remainingQuantity);
        FHE.allowThis(order.encryptedFinalPrice);
        FHE.allow(order.encryptedFinalPrice, order.buyer);
        FHE.allow(order.encryptedFinalPrice, msg.sender);

        emit TradeMatched(_orderId, order.materialId, order.buyer, msg.sender);
    }


    function confirmTrade(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        TradeMatch storage tradeMatch = matches[_orderId];

        require(order.status == OrderStatus.MATCHED, "Order not matched");
        require(msg.sender == order.buyer || msg.sender == order.matchedSupplier, "Not authorized");
        require(!tradeMatch.isConfirmed, "Already confirmed");

        tradeMatch.isConfirmed = true;
        order.status = OrderStatus.COMPLETED;

        emit TradeCompleted(_orderId, order.materialId);
    }

    function cancelOrder(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(order.buyer == msg.sender, "Not order owner");
        require(order.status == OrderStatus.PENDING, "Cannot cancel");

        order.status = OrderStatus.CANCELLED;
    }

    function deactivateMaterial(uint256 _materialId) external {
        RawMaterial storage material = materials[_materialId];
        require(material.supplier == msg.sender, "Not material owner");

        material.isActive = false;
    }

    function getMaterialInfo(uint256 _materialId) external view returns (
        string memory name,
        MaterialCategory category,
        address supplier,
        bool isActive,
        uint256 createdAt,
        string memory qualityGrade,
        uint256 deliveryTimeframe
    ) {
        RawMaterial storage material = materials[_materialId];
        return (
            material.name,
            material.category,
            material.supplier,
            material.isActive,
            material.createdAt,
            material.qualityGrade,
            material.deliveryTimeframe
        );
    }

    function getOrderInfo(uint256 _orderId) external view returns (
        address buyer,
        uint256 materialId,
        OrderStatus status,
        uint256 createdAt,
        uint256 matchedAt,
        address matchedSupplier,
        string memory deliveryLocation
    ) {
        Order storage order = orders[_orderId];
        return (
            order.buyer,
            order.materialId,
            order.status,
            order.createdAt,
            order.matchedAt,
            order.matchedSupplier,
            order.deliveryLocation
        );
    }

    function getSupplierMaterials(address supplier) external view returns (uint256[] memory) {
        return supplierMaterials[supplier];
    }

    function getBuyerOrders(address buyer) external view returns (uint256[] memory) {
        return buyerOrders[buyer];
    }

    function getMaterialsByCategory(MaterialCategory category) external view returns (uint256[] memory activeMaterials) {
        uint256 count = 0;

        for (uint256 i = 1; i < nextMaterialId; i++) {
            if (materials[i].category == category && materials[i].isActive) {
                count++;
            }
        }

        activeMaterials = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 1; i < nextMaterialId; i++) {
            if (materials[i].category == category && materials[i].isActive) {
                activeMaterials[index] = i;
                index++;
            }
        }

        return activeMaterials;
    }

    function getTradeMatch(uint256 _orderId) external view returns (
        uint256 materialId,
        address buyer,
        address supplier,
        uint256 timestamp,
        bool isConfirmed
    ) {
        TradeMatch storage tradeMatch = matches[_orderId];
        return (
            tradeMatch.materialId,
            tradeMatch.buyer,
            tradeMatch.supplier,
            tradeMatch.timestamp,
            tradeMatch.isConfirmed
        );
    }
}
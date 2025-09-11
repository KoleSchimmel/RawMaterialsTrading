// Application state
let currentAccount = null;
let provider = null;
let currentTab = 'materials';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkWalletConnection();
});

async function initializeApp() {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
        showToast('Please install MetaMask to use this application', 'error');
        return;
    }

    // Setup provider
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // Listen for account changes
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
}

function setupEventListeners() {
    // Wallet connection
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('disconnectWallet').addEventListener('click', disconnectWallet);

    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });

    // Forms
    document.getElementById('listMaterialForm').addEventListener('submit', handleListMaterial);
    document.getElementById('placeOrderForm').addEventListener('submit', handlePlaceOrder);

    // Admin functions
    document.getElementById('verifySupplierBtn').addEventListener('click', verifySupplier);
    document.getElementById('verifyBuyerBtn').addEventListener('click', verifyBuyer);

    // Material refresh
    document.getElementById('refreshMaterials').addEventListener('click', loadMaterials);

    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', loadMaterials);

    // Modal
    const modal = document.getElementById('orderModal');
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

async function checkWalletConnection() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await connectWallet();
        }
    } catch (error) {
        console.error('Error checking wallet connection:', error);
    }
}

async function connectWallet() {
    try {
        showLoading(true);

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Check network
        const network = await provider.getNetwork();
        if (network.chainId !== NETWORK_ID) {
            await switchNetwork();
        }

        currentAccount = accounts[0];
        const signer = provider.getSigner();

        // Initialize contract service
        await contractService.init(provider, signer);

        // Update UI
        updateWalletUI();
        await loadUserData();

        showToast('Wallet connected successfully', 'success');

    } catch (error) {
        console.error('Error connecting wallet:', error);
        showToast('Failed to connect wallet: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function disconnectWallet() {
    currentAccount = null;
    contractService = new ContractService();
    updateWalletUI();
    clearUserData();
    showToast('Wallet disconnected', 'success');
}

async function switchNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + NETWORK_ID.toString(16) }],
        });
    } catch (error) {
        if (error.code === 4902) {
            // Network not added to MetaMask
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x' + NETWORK_ID.toString(16),
                    chainName: 'Sepolia Testnet',
                    nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18
                    },
                    rpcUrls: ['https://rpc.sepolia.org'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io']
                }]
            });
        } else {
            throw error;
        }
    }
}

function updateWalletUI() {
    const connectButton = document.getElementById('connectWallet');
    const walletInfo = document.getElementById('walletInfo');
    const walletAddress = document.getElementById('walletAddress');

    if (currentAccount) {
        connectButton.classList.add('hidden');
        walletInfo.classList.remove('hidden');
        walletAddress.textContent = formatAddress(currentAccount);
    } else {
        connectButton.classList.remove('hidden');
        walletInfo.classList.add('hidden');
    }
}

async function loadUserData() {
    if (!currentAccount) return;

    try {
        // Load materials
        await loadMaterials();

        // Load user orders
        await loadUserOrders();

        // Check verification status
        await checkVerificationStatus();

        // Load supplier materials
        await loadSupplierMaterials();

        // Check admin status
        const isOwner = await contractService.isOwner();
        if (isOwner) {
            document.querySelector('[data-tab="admin"]').style.display = 'block';
        }

    } catch (error) {
        console.error('Error loading user data:', error);
        showToast('Error loading data: ' + error.message, 'error');
    }
}

async function checkVerificationStatus() {
    try {
        const isSupplier = await contractService.isVerifiedSupplier(currentAccount);
        const isBuyer = await contractService.isVerifiedBuyer(currentAccount);

        // Update supplier panel visibility
        const supplierPanel = document.getElementById('supplier');
        const supplierForm = supplierPanel.querySelector('#listMaterialForm');

        if (!isSupplier) {
            // Show verification notice for supplier
            const notice = document.createElement('div');
            notice.className = 'verification-notice';
            notice.innerHTML = `
                <div class="alert alert-warning">
                    <h4>Supplier Verification Required</h4>
                    <p>You need to be verified as a supplier to list materials.</p>
                    <p><strong>Your Address:</strong>
                        <code class="address-code">${currentAccount}</code>
                        <button class="btn btn-secondary btn-sm" onclick="copyAddress('${currentAccount}')">Copy</button>
                    </p>
                    <p>Use the Admin Panel to verify this address as a supplier, or ask an administrator to verify it.</p>
                </div>
            `;
            supplierForm.style.display = 'none';
            supplierPanel.insertBefore(notice, supplierForm);
        } else {
            // Remove any existing notice
            const existingNotice = supplierPanel.querySelector('.verification-notice');
            if (existingNotice) {
                existingNotice.remove();
            }
            supplierForm.style.display = 'block';
        }

        // Show status in toast
        if (isSupplier && isBuyer) {
            showToast('✓ Verified as both Supplier and Buyer', 'success');
        } else if (isSupplier) {
            showToast('✓ Verified as Supplier', 'success');
        } else if (isBuyer) {
            showToast('✓ Verified as Buyer', 'success');
        } else {
            showToast('⚠ Not verified as Supplier or Buyer', 'warning');
        }

    } catch (error) {
        console.error('Error checking verification status:', error);
    }
}

function clearUserData() {
    document.getElementById('materialsList').innerHTML = '';
    document.getElementById('ordersList').innerHTML = '';
    document.getElementById('myMaterialsList').innerHTML = '';
}

async function loadMaterials() {
    try {
        if (!contractService.contract) return;

        showLoading(true);

        const categoryFilter = document.getElementById('categoryFilter').value;
        const materialsList = document.getElementById('materialsList');

        let materialIds = [];

        if (categoryFilter === '') {
            // Load all materials - get from all categories
            for (let i = 0; i < 6; i++) {
                const categoryMaterials = await contractService.getMaterialsByCategory(i);
                materialIds = materialIds.concat(categoryMaterials.map(id => id.toString()));
            }
        } else {
            const categoryMaterials = await contractService.getMaterialsByCategory(parseInt(categoryFilter));
            materialIds = categoryMaterials.map(id => id.toString());
        }

        materialsList.innerHTML = '';

        if (materialIds.length === 0) {
            materialsList.innerHTML = '<p class="text-center">No materials found.</p>';
            return;
        }

        for (const materialId of materialIds) {
            try {
                const materialInfo = await contractService.getMaterialInfo(materialId);
                if (materialInfo.isActive) {
                    const materialCard = createMaterialCard(materialId, materialInfo);
                    materialsList.appendChild(materialCard);
                }
            } catch (error) {
                console.warn(`Error loading material ${materialId}:`, error);
            }
        }

    } catch (error) {
        console.error('Error loading materials:', error);
        showToast('Error loading materials: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function createMaterialCard(materialId, materialInfo) {
    const card = document.createElement('div');
    card.className = 'material-card';

    const categoryName = MATERIAL_CATEGORIES[materialInfo.category] || 'Unknown';
    const createdDate = new Date(materialInfo.createdAt * 1000).toLocaleDateString();

    card.innerHTML = `
        <div class="material-header">
            <div class="material-name">${materialInfo.name}</div>
            <div class="material-category">${categoryName}</div>
        </div>
        <div class="material-details">
            <div class="material-detail">
                <span>Supplier:</span>
                <span>${formatAddress(materialInfo.supplier)}</span>
            </div>
            <div class="material-detail">
                <span>Quality Grade:</span>
                <span>${materialInfo.qualityGrade}</span>
            </div>
            <div class="material-detail">
                <span>Delivery:</span>
                <span>${materialInfo.deliveryTimeframe} days</span>
            </div>
            <div class="material-detail">
                <span>Listed:</span>
                <span>${createdDate}</span>
            </div>
        </div>
        <div class="material-actions">
            <button class="btn btn-primary" onclick="openOrderModal('${materialId}', '${materialInfo.name}')">
                Place Order
            </button>
        </div>
    `;

    return card;
}

async function loadUserOrders() {
    try {
        if (!contractService.contract || !currentAccount) return;

        const orderIds = await contractService.getBuyerOrders(currentAccount);
        const ordersList = document.getElementById('ordersList');

        ordersList.innerHTML = '';

        if (orderIds.length === 0) {
            ordersList.innerHTML = '<p class="text-center">No orders found.</p>';
            return;
        }

        for (const orderId of orderIds) {
            try {
                const orderInfo = await contractService.getOrderInfo(orderId);
                const materialInfo = await contractService.getMaterialInfo(orderInfo.materialId);
                const orderCard = createOrderCard(orderId, orderInfo, materialInfo);
                ordersList.appendChild(orderCard);
            } catch (error) {
                console.warn(`Error loading order ${orderId}:`, error);
            }
        }

    } catch (error) {
        console.error('Error loading user orders:', error);
        showToast('Error loading orders: ' + error.message, 'error');
    }
}

function createOrderCard(orderId, orderInfo, materialInfo) {
    const card = document.createElement('div');
    card.className = 'order-card';

    const statusName = ORDER_STATUS[orderInfo.status] || 'Unknown';
    const createdDate = new Date(orderInfo.createdAt * 1000).toLocaleDateString();
    const matchedDate = orderInfo.matchedAt > 0 ? new Date(orderInfo.matchedAt * 1000).toLocaleDateString() : 'N/A';

    card.innerHTML = `
        <div class="order-header">
            <h4>Order #${orderId}</h4>
            <span class="order-status status-${statusName.toLowerCase()}">${statusName}</span>
        </div>
        <div class="order-details">
            <div class="material-detail">
                <span><strong>Material:</strong></span>
                <span>${materialInfo.name}</span>
            </div>
            <div class="material-detail">
                <span><strong>Delivery Location:</strong></span>
                <span>${orderInfo.deliveryLocation}</span>
            </div>
            <div class="material-detail">
                <span><strong>Order Date:</strong></span>
                <span>${createdDate}</span>
            </div>
            <div class="material-detail">
                <span><strong>Matched Date:</strong></span>
                <span>${matchedDate}</span>
            </div>
            ${orderInfo.matchedSupplier !== ethers.constants.AddressZero ? `
                <div class="material-detail">
                    <span><strong>Matched Supplier:</strong></span>
                    <span>${formatAddress(orderInfo.matchedSupplier)}</span>
                </div>
            ` : ''}
        </div>
        <div class="material-actions">
            ${orderInfo.status === 0 ? `
                <button class="btn btn-danger" onclick="cancelOrder('${orderId}')">Cancel Order</button>
            ` : ''}
            ${orderInfo.status === 1 ? `
                <button class="btn btn-primary" onclick="confirmTrade('${orderId}')">Confirm Trade</button>
            ` : ''}
        </div>
    `;

    return card;
}

async function loadSupplierMaterials() {
    try {
        if (!contractService.contract || !currentAccount) return;

        const isSupplier = await contractService.isVerifiedSupplier(currentAccount);
        if (!isSupplier) return;

        const materialIds = await contractService.getSupplierMaterials(currentAccount);
        const materialsList = document.getElementById('myMaterialsList');

        materialsList.innerHTML = '';

        if (materialIds.length === 0) {
            materialsList.innerHTML = '<p class="text-center">No materials listed.</p>';
            return;
        }

        for (const materialId of materialIds) {
            try {
                const materialInfo = await contractService.getMaterialInfo(materialId);
                const materialCard = createSupplierMaterialCard(materialId, materialInfo);
                materialsList.appendChild(materialCard);
            } catch (error) {
                console.warn(`Error loading supplier material ${materialId}:`, error);
            }
        }

    } catch (error) {
        console.error('Error loading supplier materials:', error);
        showToast('Error loading supplier materials: ' + error.message, 'error');
    }
}

function createSupplierMaterialCard(materialId, materialInfo) {
    const card = document.createElement('div');
    card.className = 'material-card';

    const categoryName = MATERIAL_CATEGORIES[materialInfo.category] || 'Unknown';
    const createdDate = new Date(materialInfo.createdAt * 1000).toLocaleDateString();
    const statusText = materialInfo.isActive ? 'Active' : 'Inactive';

    card.innerHTML = `
        <div class="material-header">
            <div class="material-name">${materialInfo.name}</div>
            <div class="material-category">${categoryName}</div>
        </div>
        <div class="material-details">
            <div class="material-detail">
                <span>Status:</span>
                <span>${statusText}</span>
            </div>
            <div class="material-detail">
                <span>Quality Grade:</span>
                <span>${materialInfo.qualityGrade}</span>
            </div>
            <div class="material-detail">
                <span>Delivery:</span>
                <span>${materialInfo.deliveryTimeframe} days</span>
            </div>
            <div class="material-detail">
                <span>Listed:</span>
                <span>${createdDate}</span>
            </div>
        </div>
        <div class="material-actions">
            ${materialInfo.isActive ? `
                <button class="btn btn-danger" onclick="deactivateMaterial('${materialId}')">
                    Deactivate
                </button>
            ` : ''}
        </div>
    `;

    return card;
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    currentTab = tabName;

    // Load data for the current tab
    if (tabName === 'materials') {
        loadMaterials();
    } else if (tabName === 'orders') {
        loadUserOrders();
    } else if (tabName === 'supplier') {
        loadSupplierMaterials();
    }
}

function openOrderModal(materialId, materialName) {
    if (!currentAccount) {
        showToast('Please connect your wallet first', 'error');
        return;
    }

    document.getElementById('orderMaterialId').value = materialId;
    document.querySelector('#orderModal h3').textContent = `Place Order - ${materialName}`;
    document.getElementById('orderModal').style.display = 'block';
}

async function handleListMaterial(event) {
    event.preventDefault();

    if (!currentAccount) {
        showToast('Please connect your wallet first', 'error');
        return;
    }

    try {
        showLoading(true);

        const formData = new FormData(event.target);

        // Get form values and ensure they are not null/empty
        const materialName = formData.get('materialName') || '';
        const materialCategory = parseInt(formData.get('materialCategory')) || 0;
        const quantity = parseInt(formData.get('quantity')) || 1;
        const pricePerUnit = formData.get('pricePerUnit') || '1';
        const minOrder = parseInt(formData.get('minOrder')) || 1;
        const qualityGrade = formData.get('qualityGrade') || '';
        const deliveryTimeframe = parseInt(formData.get('deliveryTimeframe')) || 1;

        // Validate required fields
        if (!materialName.trim()) {
            showToast('Material name is required', 'error');
            return;
        }
        if (!qualityGrade.trim()) {
            showToast('Quality grade is required', 'error');
            return;
        }

        const tx = await contractService.listMaterial(
            materialName,
            materialCategory,
            quantity,
            pricePerUnit,
            minOrder,
            qualityGrade,
            deliveryTimeframe
        );

        showToast('Material listing transaction submitted', 'success');

        // Reset form
        event.target.reset();

        // Reload supplier materials
        setTimeout(() => {
            loadSupplierMaterials();
        }, 5000);

    } catch (error) {
        console.error('Error listing material:', error);
        showToast('Error listing material: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function handlePlaceOrder(event) {
    event.preventDefault();

    if (!currentAccount) {
        showToast('Please connect your wallet first', 'error');
        return;
    }

    try {
        showLoading(true);

        const formData = new FormData(event.target);
        const materialId = document.getElementById('orderMaterialId').value;

        // Get form values and ensure they are not null/empty
        const orderQuantity = parseInt(formData.get('orderQuantity')) || 1;
        const maxPrice = formData.get('maxPrice') || '1';
        const deliveryLocation = formData.get('deliveryLocation') || '';
        const specialRequirements = formData.get('specialRequirements') || '';

        // Validate required fields
        if (!materialId) {
            showToast('Material ID is required', 'error');
            return;
        }
        if (!deliveryLocation.trim()) {
            showToast('Delivery location is required', 'error');
            return;
        }

        const tx = await contractService.placeOrder(
            materialId,
            orderQuantity,
            maxPrice,
            deliveryLocation,
            specialRequirements
        );

        showToast('Order placement transaction submitted', 'success');

        // Close modal and reset form
        document.getElementById('orderModal').style.display = 'none';
        event.target.reset();

        // Reload user orders
        setTimeout(() => {
            loadUserOrders();
        }, 5000);

    } catch (error) {
        console.error('Error placing order:', error);
        showToast('Error placing order: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
        showLoading(true);

        const tx = await contractService.cancelOrder(orderId);
        showToast('Order cancellation transaction submitted', 'success');

        setTimeout(() => {
            loadUserOrders();
        }, 5000);

    } catch (error) {
        console.error('Error cancelling order:', error);
        showToast('Error cancelling order: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function confirmTrade(orderId) {
    if (!confirm('Are you sure you want to confirm this trade?')) return;

    try {
        showLoading(true);

        const tx = await contractService.confirmTrade(orderId);
        showToast('Trade confirmation transaction submitted', 'success');

        setTimeout(() => {
            loadUserOrders();
        }, 5000);

    } catch (error) {
        console.error('Error confirming trade:', error);
        showToast('Error confirming trade: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function matchTradeWithOrder(orderId) {
    if (!confirm('Are you sure you want to match this trade?')) return;

    try {
        showLoading(true);

        const tx = await contractService.matchTrade(orderId);
        showToast('Trade matching transaction submitted', 'success');

        setTimeout(() => {
            loadSupplierMaterials();
        }, 5000);

    } catch (error) {
        console.error('Error matching trade:', error);
        showToast('Error matching trade: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function deactivateMaterial(materialId) {
    if (!confirm('Are you sure you want to deactivate this material?')) return;

    try {
        showLoading(true);

        const tx = await contractService.deactivateMaterial(materialId);
        showToast('Material deactivation transaction submitted', 'success');

        setTimeout(() => {
            loadSupplierMaterials();
        }, 5000);

    } catch (error) {
        console.error('Error deactivating material:', error);
        showToast('Error deactivating material: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function verifySupplier() {
    const address = document.getElementById('verifySupplierAddress').value;
    if (!address || !ethers.utils.isAddress(address)) {
        showToast('Please enter a valid address', 'error');
        return;
    }

    try {
        showLoading(true);

        const tx = await contractService.verifySupplier(address);
        showToast('Supplier verification transaction submitted', 'success');

        document.getElementById('verifySupplierAddress').value = '';

        // If verifying current user, reload verification status
        if (address.toLowerCase() === currentAccount.toLowerCase()) {
            setTimeout(async () => {
                await checkVerificationStatus();
                showToast('Your supplier verification is now active!', 'success');
            }, 3000);
        }

    } catch (error) {
        console.error('Error verifying supplier:', error);
        showToast('Error verifying supplier: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function verifyBuyer() {
    const address = document.getElementById('verifyBuyerAddress').value;
    if (!address || !ethers.utils.isAddress(address)) {
        showToast('Please enter a valid address', 'error');
        return;
    }

    try {
        showLoading(true);

        const tx = await contractService.verifyBuyer(address);
        showToast('Buyer verification transaction submitted', 'success');

        document.getElementById('verifyBuyerAddress').value = '';

        // If verifying current user, reload verification status
        if (address.toLowerCase() === currentAccount.toLowerCase()) {
            setTimeout(async () => {
                await checkVerificationStatus();
                showToast('Your buyer verification is now active!', 'success');
            }, 3000);
        }

    } catch (error) {
        console.error('Error verifying buyer:', error);
        showToast('Error verifying buyer: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Event handlers
async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        await disconnectWallet();
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        updateWalletUI();
        await loadUserData();
        showToast('Account changed', 'success');
    }
}

async function handleChainChanged() {
    // Reload the page to reset state
    window.location.reload();
}

// Utility functions
function formatAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Form validation helpers
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            input.style.borderColor = '#e9ecef';
        }
    });

    return isValid;
}

// Copy address function
function copyAddress(address) {
    navigator.clipboard.writeText(address).then(function() {
        showToast('Address copied to clipboard', 'success');
    }).catch(function(err) {
        console.error('Could not copy address: ', err);
        showToast('Failed to copy address', 'error');
    });
}

// Add form validation to all forms
document.addEventListener('submit', function(event) {
    if (!validateForm(event.target)) {
        event.preventDefault();
        showToast('Please fill in all required fields', 'error');
    }
});
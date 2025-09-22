// Enhanced transaction functions with MetaMask popup support

async function registerSupplier() {
    try {
        if (!contract) {
            alert('Please connect your wallet first');
            return;
        }

        console.log('🔄 Initiating supplier registration transaction...');

        // Estimate gas before sending transaction
        try {
            const gasEstimate = await contract.registerAsSupplier.estimateGas();
            console.log('Gas estimate:', gasEstimate.toString());
        } catch (gasError) {
            console.warn('Could not estimate gas:', gasError.message);
        }

        // Call contract method - this will trigger MetaMask popup
        const tx = await contract.registerAsSupplier();

        // Transaction sent, show hash
        console.log('✅ Transaction sent:', tx.hash);
        updateStatusTemporary('warning', `Registration transaction sent: ${tx.hash.substring(0, 10)}... Please wait for confirmation...`);

        // Wait for transaction to be mined
        const receipt = await tx.wait();
        console.log('✅ Transaction confirmed in block:', receipt.blockNumber);

        isSupplier = true;
        updateStatus();
        alert('🎉 Successfully registered as supplier! Transaction confirmed.');

    } catch (error) {
        console.error('❌ Error registering supplier:', error);

        if (error.code === 4001) {
            alert('❌ Transaction rejected by user');
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            alert('❌ Insufficient funds for gas fee');
        } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
            alert('❌ Cannot estimate gas. Check contract interaction.');
        } else {
            alert('❌ Failed to register as supplier: ' + error.message);
        }
        updateStatus();
    }
}

async function registerBuyer() {
    try {
        if (!contract) {
            alert('Please connect your wallet first');
            return;
        }

        console.log('🔄 Initiating buyer registration transaction...');

        // Estimate gas before sending transaction
        try {
            const gasEstimate = await contract.registerAsBuyer.estimateGas();
            console.log('Gas estimate:', gasEstimate.toString());
        } catch (gasError) {
            console.warn('Could not estimate gas:', gasError.message);
        }

        // Call contract method - this will trigger MetaMask popup
        const tx = await contract.registerAsBuyer();

        // Transaction sent, show hash
        console.log('✅ Transaction sent:', tx.hash);
        updateStatusTemporary('warning', `Registration transaction sent: ${tx.hash.substring(0, 10)}... Please wait for confirmation...`);

        // Wait for transaction to be mined
        const receipt = await tx.wait();
        console.log('✅ Transaction confirmed in block:', receipt.blockNumber);

        isBuyer = true;
        updateStatus();
        alert('🎉 Successfully registered as buyer! Transaction confirmed.');

    } catch (error) {
        console.error('❌ Error registering buyer:', error);

        if (error.code === 4001) {
            alert('❌ Transaction rejected by user');
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            alert('❌ Insufficient funds for gas fee');
        } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
            alert('❌ Cannot estimate gas. Check contract interaction.');
        } else {
            alert('❌ Failed to register as buyer: ' + error.message);
        }
        updateStatus();
    }
}

async function listMaterial() {
    try {
        if (!contract) {
            alert('Please connect your wallet first');
            return;
        }

        if (!isSupplier) {
            alert('You must be registered as a supplier to list materials');
            return;
        }

        const name = document.getElementById('materialName').value;
        const quantity = document.getElementById('quantity').value;
        const price = document.getElementById('price').value;
        const available = document.getElementById('available').value === 'true';

        if (!name || !quantity || !price) {
            alert('Please fill in all fields');
            return;
        }

        console.log('🔄 Initiating material listing transaction...');

        // Estimate gas before sending transaction
        try {
            const gasEstimate = await contract.listMaterial.estimateGas(name, parseInt(quantity), parseInt(price), available);
            console.log('Gas estimate:', gasEstimate.toString());
        } catch (gasError) {
            console.warn('Could not estimate gas:', gasError.message);
        }

        // Call contract method - this will trigger MetaMask popup
        const tx = await contract.listMaterial(name, parseInt(quantity), parseInt(price), available);

        // Transaction sent, show hash
        console.log('✅ Transaction sent:', tx.hash);
        updateStatusTemporary('warning', `Material listing transaction sent: ${tx.hash.substring(0, 10)}... Please wait for confirmation...`);

        // Wait for transaction to be mined
        const receipt = await tx.wait();
        console.log('✅ Transaction confirmed in block:', receipt.blockNumber);

        alert('🎉 Material listed successfully! Transaction confirmed.');

        // Clear form
        document.getElementById('materialName').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';
        document.getElementById('available').value = 'true';

        // Refresh materials list
        if (!document.getElementById('materials-tab').classList.contains('hidden')) {
            loadMaterials();
        }

    } catch (error) {
        console.error('❌ Error listing material:', error);

        if (error.code === 4001) {
            alert('❌ Transaction rejected by user');
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            alert('❌ Insufficient funds for gas fee');
        } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
            alert('❌ Cannot estimate gas. Check contract interaction.');
        } else {
            alert('❌ Failed to list material: ' + error.message);
        }
        updateStatus();
    }
}

async function placeOrder(materialId) {
    try {
        if (!contract) {
            alert('Please connect your wallet first');
            return;
        }

        if (!isBuyer) {
            alert('You must be registered as a buyer to place orders');
            return;
        }

        const quantityInput = document.getElementById(`order-quantity-${materialId}`);
        const quantity = quantityInput.value;

        if (!quantity || quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        console.log('🔄 Initiating order placement transaction...');

        // Estimate gas before sending transaction
        try {
            const gasEstimate = await contract.placeOrder.estimateGas(materialId, parseInt(quantity));
            console.log('Gas estimate:', gasEstimate.toString());
        } catch (gasError) {
            console.warn('Could not estimate gas:', gasError.message);
        }

        // Call contract method - this will trigger MetaMask popup
        const tx = await contract.placeOrder(materialId, parseInt(quantity));

        // Transaction sent, show hash
        console.log('✅ Transaction sent:', tx.hash);
        updateStatusTemporary('warning', `Order placement transaction sent: ${tx.hash.substring(0, 10)}... Please wait for confirmation...`);

        // Wait for transaction to be mined
        const receipt = await tx.wait();
        console.log('✅ Transaction confirmed in block:', receipt.blockNumber);

        alert('🎉 Order placed successfully! Transaction confirmed.');
        quantityInput.value = '';

    } catch (error) {
        console.error('❌ Error placing order:', error);

        if (error.code === 4001) {
            alert('❌ Transaction rejected by user');
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            alert('❌ Insufficient funds for gas fee');
        } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
            alert('❌ Cannot estimate gas. Check contract interaction.');
        } else {
            alert('❌ Failed to place order: ' + error.message);
        }
        updateStatus();
    }
}

// Helper function to temporarily update status
function updateStatusTemporary(className, message) {
    const statusDiv = document.getElementById('status');
    statusDiv.className = `status ${className}`;
    statusDiv.innerHTML = message;
}
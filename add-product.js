document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-product-form');
    const messageContainer = document.getElementById('message-container');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        // 1. Prevent default form submission
        e.preventDefault();
        
        // Hide previous messages
        messageContainer.className = 'message-container';
        messageContainer.textContent = '';

        // 2. Collect all form field values
        const name = document.getElementById('name').value.trim();
        const price = document.getElementById('price').value.trim();
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value.trim();

        // 3. Basic client-side validation
        if (!name || !price || !category || !description) {
            showMessage('Please fill out all required fields.', 'error');
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            showMessage('Price must be a valid positive number.', 'error');
            return;
        }

        // Prepare data payload
        const productData = {
            name: name,
            price: priceNum,
            category: category,
            description: description
        };

        try {
            // Provide visual feedback while processing
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Processing...</span>';
            submitBtn.disabled = true;

            // 4. Send POST request via fetch()
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            // Restore button state
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;

            if (response.status === 201) {
                // 5. Successful creation (201)
                showMessage('Product added successfully!', 'success');
                form.reset();
            } else if (response.status === 400) {
                // 6. Validation error from server (400)
                const data = await response.json();
                showMessage(`Error: ${data.error}`, 'error');
            } else {
                // Other unexpected server errors
                throw new Error(`Unexpected server response: ${response.status}`);
            }

        } catch (error) {
            console.error('Failed to add product:', error);
            showMessage('Failed to connect to the server. Is it running?', 'error');
            
            // Ensure button is restored in case of a network error
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Add Product</span>';
        }
    });

    // Helper function to display messages
    function showMessage(msg, type) {
        messageContainer.textContent = msg;
        messageContainer.className = `message-container ${type}`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

async function fetchProducts() {
    const container = document.getElementById('products-container');
    
    // The loading spinner is already in the HTML container, so it shows by default.

    try {
        const response = await fetch('http://localhost:5000/api/products');
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const products = await response.json();
        
        // Clear the container (removes the loading spinner)
        container.textContent = ''; 
        
        if (products.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'empty-message';
            emptyMsg.textContent = 'No products available at the moment.';
            container.appendChild(emptyMsg);
            return;
        }

        // Loop through and create a card for each product dynamically
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            const categoryBadge = document.createElement('span');
            categoryBadge.className = 'product-category';
            categoryBadge.textContent = product.category;
            card.appendChild(categoryBadge);

            const name = document.createElement('h3');
            name.className = 'product-name';
            name.textContent = product.name;
            card.appendChild(name);

            const price = document.createElement('div');
            price.className = 'product-price';
            price.textContent = `₹${parseFloat(product.price).toFixed(2)}`;
            card.appendChild(price);

            const description = document.createElement('p');
            description.className = 'product-description';
            description.textContent = product.description;
            card.appendChild(description);

            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Failed to fetch products:', error);
        
        // Clear the container
        container.textContent = ''; 
        
        // Show a friendly error message
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        
        const errorText = document.createElement('h3');
        errorText.textContent = 'Oops! Something went wrong.';
        errorContainer.appendChild(errorText);

        const errorSubtext = document.createElement('p');
        errorSubtext.textContent = 'We could not load the products. Please ensure the backend server is running and try again.';
        errorContainer.appendChild(errorSubtext);
        
        container.appendChild(errorContainer);
    }
}

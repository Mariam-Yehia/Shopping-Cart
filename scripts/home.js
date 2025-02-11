// Sample product data
const products = [
  {
    name: "Espresso",
    description: "A rich and bold shot of espresso, perfect for coffee lovers.",
    price: 3.5,
    image: "images/esspresso.png",
  },
  {
    name: "Cappuccino",
    description: "A creamy blend of espresso, steamed milk, and foam.",
    price: 4.0,
    image: "images/Capp.png",
  },
  {
    name: "Latte",
    description: "Smooth and velvety, our latte is a perfect blend of espresso and milk.",
    price: 4.5,
    image: "images/Latte.png",
  },
  {
    name: "Mocha",
    description: "A delicious mix of espresso, chocolate, and steamed milk.",
    price: 5.0,
    image: "images/Mocha.png",
  },
  {
    name: "Americano",
    description: "A classic espresso diluted with hot water for a smooth taste.",
    price: 3.0,
    image: "images/Americano.png",
  },
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to display products
function displayProducts(filteredProducts) {
  const productContainer = document.getElementById("product-container");
  if (productContainer) {
    productContainer.innerHTML = filteredProducts
      .map(
        (product) => `
        <div class="col">
          <div class="card product-card">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h3 class="card-title">${product.name}</h3>
              <p class="card-text">${product.description}</p>
              <p class="price">$${product.price.toFixed(2)}</p>
              <button class="btn btn-custom w-100" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }
}

// Function to filter products based on search query
function filterProducts(query) {
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
  displayProducts(filteredProducts);
}

// Add to Cart Functionality
function addToCart(productName, productPrice, productImage) {
  const existingProduct = cart.find((item) => item.name === productName);

  if (existingProduct) {

    existingProduct.quantity += 1;
  } else {

    cart.push({
      name: productName,
      price: parseFloat(productPrice),
      quantity: 1,
      image: productImage, 
    });
  }

  // Save the updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
  showNotification([`${productName} added to cart!`], "success");
}

// Update Cart Counter
function updateCartCounter() {
  const cartCounter = document.getElementById("cartCounter");
  if (cartCounter) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounter.textContent = totalItems;
  }
}

// Show Notification Function
function showNotification(messages, type = "success") {
  const notification = document.createElement("div");
  notification.className = `position-fixed top-0 end-0 mt-3 me-3 p-3 rounded-lg shadow-lg text-white ${
    type === "success" ? "bg-success" : "bg-danger"
  }`;
  notification.style.zIndex = "1050";
  notification.style.maxWidth = "300px";
  notification.innerHTML = messages.join("<br>");
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function renderCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");

  if (cartItemsContainer && cartTotalElement) {
    cartItemsContainer.innerHTML = ""; 
    let total = 0;

    cart.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.className = "card mb-3 p-3 d-flex flex-row align-items-center";
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img me-3" style="width: 100px; height: 100px; object-fit: cover;">
        <div>
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">$${item.price.toFixed(2)}</p>
          <div class="d-flex align-items-center">
            <button class="btn btn-secondary btn-sm" onclick="decreaseQuantity(${index})">-</button>
            <span class="mx-2">${item.quantity}</span>
            <button class="btn btn-secondary btn-sm" onclick="increaseQuantity(${index})">+</button>
          </div>
          <button class="btn btn-danger mt-2" onclick="removeFromCart(${index})">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
      total += item.price * item.quantity;
    });

    cartTotalElement.textContent = total.toFixed(2);
    updateCartCounter();
  }
}


// Increase quantity of an item
function increaseQuantity(index) {
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Decrease quantity of an item
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Function to show the checkout modal
function checkout() {

  if (cart.length === 0) {
    showNotification(["Your cart is empty! Please add items to your cart before checking out."], "error");
    return;
  }

  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutMessage = document.getElementById("checkoutMessage");
  checkoutMessage.textContent = "Thank you for your purchase!"; 
  checkoutModal.style.display = "flex"; 
  
  setTimeout(() => {
    localStorage.removeItem("cart");
    cart = []; 
    renderCart(); 
    window.location.href = "home.html"; 
  }, 2000);
}

// Function to close the checkout modal
function closeCheckoutModal() {
  const checkoutModal = document.getElementById("checkoutModal");
  checkoutModal.style.display = "none"; 
}




// User Session Management
function updateUserUI(name) {
  const userNameDisplay = document.getElementById("userNameDisplay");
  if (userNameDisplay) {
    userNameDisplay.textContent = name;
  }

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.style.display = name === "Guest" ? "none" : "block";
  }
}

// Logout Functionality
function logout() {
  // Redirect to the logout page
  window.location.href = "logout.html"; 
}


document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      filterProducts(e.target.value);
    });
    displayProducts(products); 
  }

  cart = JSON.parse(localStorage.getItem("cart")) || [];  
  renderCart();  
  updateCartCounter();  

  const user = JSON.parse(localStorage.getItem("loggedInUser")) || { name: "Guest" };
  updateUserUI(user.name);
});

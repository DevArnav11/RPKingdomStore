const products = {
  arcaneRelics: [
    { 
      id: 'gravebreaker', 
      name: 'Gravebreaker Mace', 
      price: 49,
      description: 'Legendary mace with Density VII - Unleash devastating blows!'
    },
    { 
      id: 'celestialshell', 
      name: 'Celestial Shell Armor', 
      price: 38,
      description: 'Netherite set with Protection V, Unbreaking VI - Become invincible!'
    },
    { 
      id: 'astralcleaver', 
      name: 'Astral Cleaver', 
      price: 49,
      description: 'Netherite sword with Sharpness VI, Knockback V - Dominate the battlefield!'
    },
    { 
      id: 'eternal-sixteen', 
      name: 'Eternal Sixteen', 
      price: 30,
      description: 'Stack of 16 totems in one slot - Never fear death again!'
    }
  ],
  crateKeys: [
    { id: 'party', name: 'Party – 10 Key', price: 19 },
    { id: 'supreme', name: 'Supreme – 10 Key', price: 29 },
    { id: 'glory', name: 'Glory – 10 Key', price: 39 },
    { id: 'titan', name: 'Titan – 10 Key', price: 59 }
  ],
  ranks: [
    { id: 'elite', name: 'Elite Rank', price: 29 },
    { id: 'captain', name: 'Captain Rank', price: 39 },
    { id: 'mastermind', name: 'Mastermind Rank', price: 79 },
    { id: 'alpha', name: 'Alpha Rank', price: 99 },
    { id: 'star', name: 'Star Rank', price: 119, discount: true },
    { id: 'vip', name: 'Vip Rank', price: 139, discount: true },
    { id: 'legend', name: 'Legend Rank', price: 159, discount: true }
  ]
};

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const price = product.discount ? 
    Math.round(product.price * 0.8) : 
    product.price;

  card.innerHTML = `
    <h3>${product.name}</h3>
    ${product.description ? `<p class="description">${product.description}</p>` : ''}
    <div class="price">₹${price}</div>
    ${product.discount ? '<div class="discount">20% Off!</div>' : ''}
    <label>
      <input type="checkbox" data-id="${product.id}" data-price="${price}">
      Add to Cart
    </label>
  `;
  return card;
}

function renderProducts() {
  const crateKeysGrid = document.querySelector('#crate-keys .products-grid');
  const ranksGrid = document.querySelector('#ranks .products-grid');
  const relicsGrid = document.querySelector('#arcane-relics .products-grid');

  products.crateKeys.forEach(product => {
    crateKeysGrid.appendChild(createProductCard(product));
  });

  products.ranks.forEach(product => {
    ranksGrid.appendChild(createProductCard(product));
  });

  products.arcaneRelics.forEach(product => {
    relicsGrid.appendChild(createProductCard(product));
  });
}

function updateCart() {
  const selectedItems = document.querySelectorAll('input[type="checkbox"]:checked');
  const selectedItemsContainer = document.getElementById('selected-items');
  const totalAmount = document.getElementById('total-amount');

  let total = 0;
  selectedItemsContainer.innerHTML = '';

  selectedItems.forEach(item => {
    const price = Number(item.dataset.price);
    total += price;
    selectedItemsContainer.innerHTML += `<div>${item.parentElement.parentElement.querySelector('h3').textContent} - ₹${price}</div>`;
  });

  totalAmount.textContent = total;
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();

  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateCart);
  });

  document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('minecraft-username').value;
    const selectedItems = document.querySelectorAll('input[type="checkbox"]:checked');

    if (selectedItems.length === 0) {
      showNotification('Please select at least one item');
      return;
    }

    const items = Array.from(selectedItems).map(item => {
      const name = item.parentElement.parentElement.querySelector('h3').textContent;
      const price = item.dataset.price;
      return `${name} (₹${price})`;
    });

    const total = Array.from(selectedItems)
      .reduce((sum, item) => sum + Number(item.dataset.price), 0);

    const webhookUrl = 'https://discordapp.com/api/webhooks/1371362029323026432/3ng2UN3UxOrl9tabNBj0oflHXezw6WrRbCt3BxxSzcbuci4uwixsunf-intX55_uO4Sc';

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `🎮 New Order Received from RPKingdom Store!\n\n👤 Minecraft Username: ${username}\n\n🛒 Items Ordered:\n${items.map(item => `- ${item}`).join('\n')}\n\n⏰ Time: ${new Date().toLocaleString('en-US', { 
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}`
        })
      });

      showNotification('Order placed successfully!');
      document.getElementById('checkout-form').reset();
      document.querySelectorAll('input[type="checkbox"]:checked')
        .forEach(checkbox => checkbox.checked = false);
      updateCart();
    } catch (error) {
      showNotification('Error placing order. Please try again.');
    }
  });
});
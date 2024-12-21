const apiEndpoint = "https://api.sampleapis.com/coffee/iced"; 
const jsonData = [];
const cart = [];

document.addEventListener("DOMContentLoaded", () => {

  const navbar = document.createElement("div");
  navbar.className = "navbar";
  navbar.innerHTML = `
    <div class="nav-title">Cafezinho da manha</div>
    <div class="nav-links">
      <a href="#section1" id="link-products">Cafés</a>
      <a href="#section2" id="link-cart">Carrinho</a>
    </div>
  `;
  document.body.prepend(navbar);


  const productsSection = document.createElement("div");
  productsSection.id = "section1";
  productsSection.className = "products-section";
  document.body.appendChild(productsSection);

  const cartSection = document.createElement("div");
  cartSection.id = "section2";
  cartSection.className = "cart-section";
  cartSection.style.display = "none";
  document.body.appendChild(cartSection);

  const cartContainer = document.createElement("div");
  cartContainer.className = "cart-container";
  cartSection.appendChild(cartContainer);

  
  document.getElementById("link-products").addEventListener("click", (event) => {
    event.preventDefault();
    productsSection.style.display = "block";
    cartSection.style.display = "none";
  });

  document.getElementById("link-cart").addEventListener("click", (event) => {
    event.preventDefault();
    productsSection.style.display = "none";
    cartSection.style.display = "block";
    updateCart(cartContainer, cart);
  });

 
  async function fetchData(apiUrl) {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      return [];
    }
  }

  
  function createCard(data) {
    const card = document.createElement("div");
    card.className = "card-style";

    const image = document.createElement("img");
    image.src = data.image || "https://via.placeholder.com/150";
    image.alt = data.title;
    image.className = "image-style";
    card.appendChild(image);

    const title = document.createElement("h1");
    title.textContent = data.title;
    title.className = "title-style";
    card.appendChild(title);

    const description = document.createElement("p");
    description.textContent = data.description || "Descrição indisponível";
    description.className = "description-style";
    card.appendChild(description);

   
    const ingredientsTitle = document.createElement("h4");
      ingredientsTitle.textContent = "Ingredients:";
      ingredientsTitle.className = "ingredients-title-style";
      card.appendChild(ingredientsTitle);
  
      const ingredientsList = document.createElement("ul");
      ingredientsList.className = "ingredients-list-style";
    if (data.ingredients && data.ingredients.length > 0) {  
      data.ingredients.forEach((ingredient) => {
        const ingredientItem = document.createElement("li");
        ingredientItem.textContent = ingredient;
        ingredientItem.className = "ingredient-item-style";
        ingredientsList.appendChild(ingredientItem);
      });
    }

    const button = document.createElement("button");
    button.className = "button-style";
    button.textContent = "Adicionar ao Carrinho";
    button.onclick = () => {
      const existingItem = cart.find((item) => item.name === data.title);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ name: data.title, price: 10, quantity: 1 });
      }
      updateCart(cartContainer, cart);
    };
    card.appendChild(ingredientsList);
    card.appendChild(button);

    productsSection.appendChild(card);
  }

 
  function updateCart(cartContainer, cart) {
    cartContainer.innerHTML = ""; 

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>O carrinho está vazio!</p>";
      return;
    }

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      cartItem.innerHTML = `
        <span>${item.name}</span>
        <span>R$${item.price.toFixed(2)}</span>
        <span>Qtd: ${item.quantity}</span>
      `;

      const decreaseButton = document.createElement("button");
      decreaseButton.textContent = "-";
      decreaseButton.onclick = () => {
        item.quantity--;
        if (item.quantity === 0) cart.splice(index, 1);
        updateCart(cartContainer, cart);
      };

      const increaseButton = document.createElement("button");
      increaseButton.textContent = "+";
      increaseButton.onclick = () => {
        item.quantity++;
        updateCart(cartContainer, cart);
      };

      cartItem.appendChild(decreaseButton);
      cartItem.appendChild(increaseButton);
      cartContainer.appendChild(cartItem);
    });

    const finalizeButton = document.createElement("button");
    finalizeButton.className = "finalize-button";
    finalizeButton.textContent = "Finalizar Compra";
    finalizeButton.onclick = () => showPaymentScreen();
    cartContainer.appendChild(finalizeButton);
  }


function showPaymentScreen() {
  const cartContainer = document.querySelector(".cart-container");
  
  
  cartContainer.innerHTML = "";

 
  const paymentForm = document.createElement("div");
  paymentForm.className = "payment-form";
  
  const cartItems = cart; 
  const cartItemsList = document.createElement("ul");
  
  if (cartItems.length > 0) {
    cartItems.forEach(item => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.name} - R$${item.price.toFixed(2)} x ${item.quantity}`;
      cartItemsList.appendChild(listItem);
    });
  } else {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "Carrinho vazio!";
    cartItemsList.appendChild(emptyMessage);
  }
  
  paymentForm.appendChild(cartItemsList);

 
  const addressInput = document.createElement("input");
  addressInput.type = "text";
  addressInput.placeholder = "Digite o endereço";
  addressInput.className = "address-input";
  paymentForm.appendChild(addressInput);

 
  const paymentSelect = document.createElement("select");
  paymentSelect.className = "payment-select";
  const paymentOption = document.createElement("option");
  paymentOption.value = "";
  paymentOption.textContent = "Selecione uma forma de pagamento";
  paymentSelect.appendChild(paymentOption);

  
  const option1 = document.createElement("option");
  option1.value = "cartao";
  option1.textContent = "Cartão de Crédito";
  paymentSelect.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = "boleto";
  option2.textContent = "Boleto";
  paymentSelect.appendChild(option2);

  const option3 = document.createElement("option");
  option3.value = "pix";
  option3.textContent = "Pix";
  paymentSelect.appendChild(option3);
  
  paymentForm.appendChild(paymentSelect);

 
  const finalizeButton = document.createElement("button");
  finalizeButton.className = "finalize-button";
  finalizeButton.textContent = "Finalizar Compra";
  finalizeButton.onclick = () => validatePayment(addressInput.value, paymentSelect.value, cartItems);

  paymentForm.appendChild(finalizeButton);

 
  cartContainer.appendChild(paymentForm);
}


function validatePayment(address, paymentMethod, cartItems) {
 
  const addressRegex = /^[A-Za-z\s]+$/;
  if (!address || !addressRegex.test(address)) {
    alert("Por favor, insira um endereço válido (apenas letras).");
    return;
  }

  
  if (!paymentMethod) {
    alert("Por favor, selecione uma forma de pagamento.");
    return;
  }


  alert("Compra finalizada com sucesso!");
  
 
  clearCart();

}


function clearCart() {
  cart.length=0;
 
}

  
  fetchData(apiEndpoint)
    .then((data) => {
      data.forEach((item) => {
        jsonData.push({
          id: item.id,
          title: item.title,
          ingredients: item.ingredients,
          description: item.description,
          image: item.image,
        });
      });

      jsonData.forEach((cardData) => createCard(cardData));
    })
    .catch((error) => console.error("Erro ao obter os dados:", error));
});

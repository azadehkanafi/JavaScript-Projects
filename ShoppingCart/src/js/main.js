import { productsData } from "../../products.js";

const cartBtn = document.querySelector("#cart-btn");
const cartModal = document.querySelector("#cart");
const backDrop = document.querySelector("#backdrop");
const closeModal = document.querySelector("#cart-item-confirm");

const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartContent = document.querySelector("#cart-content");
const productsDOM = document.querySelector("#products-center");
const clearCartBtn = document.querySelector("#clear-cart");

let cart = [];

let buttonsDOM = [];
// get products
class Products {
  getProducts() {
    return productsData;
  }
}

// dispaly products :
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += 
      `<div id="product" class="py-10 flex flex-col items-center justify-center">
        <div id="img-container">
          <img src=${product.imageUrl} id="product-img" class="block w-full min-h-[12rem] rounded-t-lg" />
        </div>
        <div id="product-desc" class="mt-2 w-full flex flex-row justify-between pb-4 border-b border-gray-200">
          <p id="product-price" class="text-violet-500 font-bold">${product.price} $</p>
          <p id="product-title" class="font-bold text-base">${product.title}</p>
        </div>
        <button id="add-to-cart" class="bg-gray-200 border-none outline-none px-4 py-2 text-violet-500 font-bold my-4 mt-5 rounded-lg cursor-pointer" data-id=${product.id}>
          add to cart
        </button>
      </div>`;
    });
    productsDOM.innerHTML = result;
  }
  getCartBtns() {
    const addToCartBtns = [...document.querySelectorAll("#add-to-cart")];
    buttonsDOM = addToCartBtns;
    addToCartBtns.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((item) => item.id === id);
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // 1. get product from products
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };

        // 2. add product to cart
        cart = [...cart, addedProduct];
        // 3. save cart in local sotrage
        Storage.saveCart(cart);
        // 4. set cart values
        this.setCartValue(cart);
        // 5. dispaly cart item
        this.addCartItem(addedProduct);
      });
    });
  }

  setCartValue(cart) {
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return curr.quantity * curr.price + acc;
    }, 0);
    cartTotal.innerText = `total price : ${parseFloat(totalPrice).toFixed(
      2
    )} $`;
    cartItems.innerText = tempCartItems;
  }
  addCartItem(cart) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = 
    ` <div class="flex flex-row">
        <div>
          <img class="w-24 h-auto rounded-md mr-3" src=${cart.imageUrl} />
        </div>
        <div class="flex flex-col justify-between h-full">
          <h4 class="text-gray-700 text-left">${cart.title}</h4>
          <h5 class="mt-2 text-gray-300 text-left">$ ${cart.price}</h5>
        </div>
      </div>
      <div class="flex flex-row items-center">
        <div class="flex flex-col justify-between items-center mr-4">
          <i class="cursor-pointer text-violet-500 font-bold fas fa-chevron-up" data-id=${cart.id}></i>
          <p class="item-quantity">${cart.quantity}</p>
          <i class="cursor-pointer text-red-500 font-bold fas fa-chevron-down" data-id=${cart.id}></i>
        </div>
        <i class="fas fa-trash remove-item cursor-pointer" data-id=${cart.id}></i>
      </div>
   `;
    cartContent.appendChild(div);
  }

  setupApp() {
    cart = Storage.getCart();
    this.setCartValue(cart);
    this.populateCart(cart);
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  cartLogic() {
    // clear cart button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // cart functionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        const removeItem = event.target;
        const id = removeItem.dataset.id;
        console.log(id);
        // remove from DOM :
        // console.log(removeItem.parentElement);
        cartContent.removeChild(removeItem.parentElement);

        // remove item from cart not DOM !
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        const addQuantity = event.target;
        const id = addQuantity.dataset.id;
        const addedItem = cart.find((c) => c.id == id);
        addedItem.quantity++;
        // update storage
        Storage.saveCart(cart);
        // update total price
        this.setCartValue(cart);
        // update item quantity :
        // console.log(addQuantity.nextElementSibling);
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        const subQuantity = event.target;
        const id = subQuantity.dataset.id;
        const substractedItem = cart.find((c) => c.id == id);

        if (substractedItem.quantity === 1) {
          this.removeItem(id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
          return;
        }

        substractedItem.quantity--;
        // update storage
        Storage.saveCart(cart);
        // update total price
        this.setCartValue(cart);
        // update item quantity :
        // console.log(subQuantity.nextElementSibling);
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  }

  clearCart() {
    // loop on all the item and tigger remove for each one
    cart.forEach((item) => this.removeItem(item.id));
    // console.log(cartContent.children[0]);
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }

  removeItem(id) {
    // resuable method for signle remove and clear all
    cart = cart.filter((cartItem) => cartItem.id != id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    const button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `add to cart`;
  }
  getSingleButton(id) {
    // should be parseInt to get correct result
    return buttonsDOM.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
  }
}

// storage :
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id == id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  // set up already added cart items
  ui.setupApp();
  const products = new Products();
  //   get all products :
  const productsData = products.getProducts();
  ui.displayProducts(productsData);
  ui.getCartBtns();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);

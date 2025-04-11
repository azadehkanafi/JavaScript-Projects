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

class Products {
  getProducts() {
    return productsData;
  }
}

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += 
      `<div class="py-10 flex flex-col items-center justify-center">
        <div>
          <img src=${product.imageUrl} class="block w-full min-h-[12rem] rounded-t-lg" />
        </div>
        <div class="mt-2 w-full flex flex-row justify-between pb-4 border-b border-gray-200">
          <p class="text-violet-500 font-bold">${product.price} $</p>
          <p class="font-bold text-base">${product.title}</p>
        </div>
        <button class="bg-gray-200 border-none outline-none px-4 py-2 text-violet-500 font-bold my-4 mt-5 rounded-lg cursor-pointer add-to-cart" data-id=${product.id}>
          <i class="fas fa-shopping-cart"></i>
          add to cart
        </button>
      </div>`;
    });
    productsDOM.innerHTML = result;
  }

  getCartBtns() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
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

        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };
        cart = [...cart, addedProduct];
        Storage.saveCart(cart);
        this.setCartValue(cart);
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
    cartTotal.innerText = `total price : ${parseFloat(totalPrice).toFixed(2)} $`;
    cartItems.innerText = tempCartItems;
  }

  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = 
    `<div class="flex flex-row">
        <div>
          <img class="w-24 h-auto rounded-md mr-3" src=${cartItem.imageUrl} />
        </div>
        <div class="flex flex-col justify-between h-full">
          <h4 class="text-gray-700 text-left">${cartItem.title}</h4>
          <h5 class="mt-2 text-gray-300 text-left">$ ${cartItem.price}</h5>
        </div>
      </div>
      <div class="flex flex-row items-center">
        <div class="flex flex-col justify-between items-center mr-4">
          <i class="cursor-pointer text-violet-500 font-bold fas fa-chevron-up" data-id=${cartItem.id}></i>
          <p class="item-quantity">${cartItem.quantity}</p>
          <i class="cursor-pointer text-red-500 font-bold fas fa-chevron-down" data-id=${cartItem.id}></i>
        </div>
        <i class="fas fa-trash remove-item cursor-pointer" data-id=${cartItem.id}></i>
      </div>`;
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
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    cartContent.addEventListener("click", (event) => {
      const target = event.target;

      if (target.classList.contains("remove-item")) {
        const id = target.dataset.id;
        const cartItemElement = target.closest(".cart-item");
        if (cartItemElement) cartContent.removeChild(cartItemElement);
        this.removeItem(id);

      } else if (target.classList.contains("fa-chevron-up")) {
        const id = target.dataset.id;
        const item = cart.find((c) => c.id == id);
        item.quantity++;
        Storage.saveCart(cart);
        this.setCartValue(cart);
        target.nextElementSibling.innerText = item.quantity;

      } else if (target.classList.contains("fa-chevron-down")) {
        const id = target.dataset.id;
        const item = cart.find((c) => c.id == id);
        if (item.quantity === 1) {
          this.removeItem(id);
          const cartItemElement = target.closest(".cart-item");
          if (cartItemElement) cartContent.removeChild(cartItemElement);
        } else {
          item.quantity--;
          Storage.saveCart(cart);
          this.setCartValue(cart);
          target.previousElementSibling.innerText = item.quantity;
        }
      }
    });
  }

  clearCart() {
    cart.forEach((item) => this.removeItem(item.id));
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id != id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    const button = this.getSingleButton(id);
    if (button) {
      button.disabled = false;
      button.innerHTML = `<i class="fas fa-shopping-cart"></i> add to cart`;
    }
  }

  getSingleButton(id) {
    return buttonsDOM.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
  }
}

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
  ui.setupApp();
  const products = new Products();
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

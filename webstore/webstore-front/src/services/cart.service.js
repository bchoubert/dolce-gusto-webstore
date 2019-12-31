
import NetworkService from './network.service';

// Default values
// LocalStorage key
const CART_KEY = "cart";
// Cart default value
const EMPTY_CART = {};

/**
 * CartService
 * 
 * Service to manage localStorage stored cart
 */
const CartService = {
  // Pattern observer : store the observer list here
  observers: [],

  // Utils function
  isCartExist: () => !!localStorage.getItem(CART_KEY),
  hasProductType: productTypeId => !!CartService.getCart()[productTypeId],
  getCart: () => CartService.isCartExist() ? JSON.parse(localStorage.getItem(CART_KEY)) : EMPTY_CART,
  __setCart: cart => {localStorage.setItem(CART_KEY, JSON.stringify(cart)); CartService.notifyObservers();},
  __emptyCart: () => CartService.__setCart(EMPTY_CART),

  // Get the cart along with its products (calling the Back-End)
  // Beware this funciton returns a Promise (due to its async call to the Back-End)
  getLoadedCart: () => {
    let cart = CartService.getCart();
    return new Promise((resolve, reject) => {
      NetworkService.getProductTypes(Object.keys(cart))
        .then(res => {
          Object.keys(res).forEach(key => res[key].quantity = cart[key]);
          resolve(res);
        })
        .catch(reject)
    });
  },

  // Add a product to the cart
  addItem: productTypeId => {
    let cart = CartService.getCart();
    // If the cart has already the product, then add +1 to the quantity
    if (CartService.hasProductType(productTypeId)) {
      cart[productTypeId]++;
    }
    else {
      // Else add it
      cart[productTypeId] = 1;
    }
    CartService.__setCart(cart);
  },
  // MNodify quantity of an item in the cart
  modifyQuantity: (productTypeId, quantity) => {
    let cart = CartService.getCart();
    if (CartService.hasProductType(productTypeId)) {
      if(quantity >= 1) {
        cart[productTypeId] = quantity;
        CartService.__setCart(cart);
      }
      else {
        // If quantity falls below 1 item, then delete the line
        CartService.deleteProduct(productTypeId);
      }
    }
  },
  // Delete a product from the cart
  deleteProduct: productTypeId => {
    let cart = CartService.getCart();
    if (CartService.hasProductType(productTypeId)) {
      delete cart[productTypeId];
      CartService.__setCart(cart);
    }
  },

  // Patter observer : notify all observer in the observers[] list when the cart gets updated
  notifyObservers: () => CartService.observers.forEach(observer => observer(CartService.getCart())),
  // Add an observer to the list
  addObserver: observer => CartService.observers.push(observer),
  // Remove an observer from the list
  removeObserver: observer => CartService.observers.splice(CartService.observers.indexOf(observer), 1)
};

export default CartService;

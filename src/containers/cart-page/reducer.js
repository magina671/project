import {
  PRODUCT_COUNT_TOGGLE,
  PRODUCT_FINALLY_REMOVED_FROM_CART,
  SELECT_PRODUCT_TO_BUY,
  COUNT_TOTAL_VALUE,
  SHOW_MODAL_ORDER,
  SHOW_MODAL_THANKS,
  SHOW_ALERT_ON_EMPTY_CART,
  HIDE_MODAL_ORDER,
  CHANGE_ITEM_DATA_IN_CART_PAGE,
  TOGGLE_ITEM_VALUE_OF_CART
} from "./actions";
import FUNCS from '../../helpfulFuncs/helpful-functions';

let initialItems = JSON.parse(localStorage.getItem("products"));
if (initialItems === null) {
  localStorage.setItem("products", JSON.stringify([]));
  initialItems = 0;
}

const initialState = {
  purchasedProducts: initialItems || [],
  cartCount: initialItems.length,
  total: 0,
  showModalOrderValue: false,
  showModalThanksValue: false,
  showAlertOnEmptyCartValue: false
};

const IncDecCounter = (id, products, value) => {
  products = products.map(item => {
    if (item.id === id) {
      item.quantity += value;
    }
    return item;
  });
};

const cartReducer = (state = initialState, action) => {
  let products = JSON.parse(localStorage.getItem("products"));
  switch (action.type) {
    case PRODUCT_COUNT_TOGGLE:
      IncDecCounter(action.payload, products, action.value);
      let toggledProducts = products.filter(item => item.is_purchased);
      let Total = toggledProducts.reduce((total, item) => {
        if (action.value === 1 && action.payload === item.id) {
          total += +item.price;
        } else if (action.value === -1 && action.payload === item.id) {
          total -= item.price;
        }
        return total;
      }, state.total);
      localStorage.setItem("products", JSON.stringify(products));
      return {
        ...state,
        purchasedProducts: products,
        total: Total
      };

    case PRODUCT_FINALLY_REMOVED_FROM_CART:
      let removeProducts = products.filter(item => item.is_purchased);
      let removeTotal = removeProducts.reduce((total, item) => {
        if (item.id === action.payload) {
          total -= item.price * item.quantity;
        }
        return total;
      }, state.total);

      let newItems = products.filter(item => action.payload !== item.id);

      localStorage.setItem("products", JSON.stringify(newItems));

      //next code for changing isCartItem in favorite page
      let favoritesProducts = JSON.parse(localStorage.getItem('favorites'));
      let finalFavProducts = favoritesProducts.map(item => {
        if (item.id === action.payload) {
          item.isCartItem = false;  
        }
        return item;
      });
      localStorage.setItem('favorites',JSON.stringify(finalFavProducts))

      return {
        ...state,
        purchasedProducts: newItems,
        total: removeTotal,
        cartCount: newItems.length
      };

    case SELECT_PRODUCT_TO_BUY:
      products = products.map(item => {
        if (item.id === action.payload) {
          item.is_purchased = !item.is_purchased;
        }
        return item;
      });
      let selectedProducts = products.filter(item => item.is_purchased);
      let selectTotal = selectedProducts.reduce((total, item) => {
        let sum = 0;
        if (item.is_purchased) {
          sum += item.price * item.quantity;
        } else {
          sum -= item.price * item.quantity;
        }
        total += sum;
        return total;
      }, 0);

      localStorage.setItem("products", JSON.stringify(products));
      return {
        ...state,
        purchasedProducts: products,
        total: selectTotal
      };

    case COUNT_TOTAL_VALUE:
      let finalTotalForCount = products.reduce((total,item)=>{
        total += item.price * item.quantity;
        return total
      },0);
      return {
        ...state,
        total: finalTotalForCount
      };

    case CHANGE_ITEM_DATA_IN_CART_PAGE:
      let newObject = action.payload;
      let finalProducts = state.purchasedProducts.map(item => {
        if (item.id === newObject.id) {
          item.isFavoriteItem = !item.isFavoriteItem;
        }
        return item;
      });
      localStorage.setItem('products',JSON.stringify(finalProducts))
      return {
        ...state,
        purchasedProducts: finalProducts,
        cartCount: finalProducts.length
      };
    
    case TOGGLE_ITEM_VALUE_OF_CART:
    products = FUNCS.setPurchaseToCart(products, action.payload.id);
      localStorage.setItem("products", JSON.stringify(products))
      
      return {
        ...state,
        purchasedProducts: products,
        cartCount: products.length
      };

    case SHOW_MODAL_ORDER:
      return {
        ...state,
        showModalOrderValue: true
      };

    case SHOW_MODAL_THANKS:
      return {
        ...state,
        showModalThanksValue: true
      };
    case SHOW_ALERT_ON_EMPTY_CART:
      return {
        ...state,
        showAlertOnEmptyCartValue: true
      }
    case HIDE_MODAL_ORDER:
      return {
        ...state,
        showModalOrderValue: false,
        showModalThanksValue: false,
        showAlertOnEmptyCartValue: false
      };

    default:
      return state;
  }
};

export default cartReducer;

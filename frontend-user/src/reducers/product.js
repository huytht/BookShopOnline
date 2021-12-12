import {
  GET_ALL_PRODUCT,
  GET_ALL_PRODUCT_BEST,
  GET_ALL_PRODUCT_NEW,
  GET_PRODUCT_DETAIL,
  GET_NUMBER_CART,
  ADD_CART,
  DECREASE_QUANTITY,
  INCREASE_QUANTITY,
  DELETE_CART,
  DELETE_ALL_CART,
  GET_ALL_CATEGORY,
  GET_ALL_PRODUCT_BY_CATEGORY,
  GET_ALL_PRODUCT_BY_KEYWORD,
  GET_ORDER_LIST,
} from "../actions/types";
import { loadState } from "../localStorage";

const persistedState = loadState();
let numberCart = 0;
let Carts = [];
if (persistedState !== undefined) {
  Carts = persistedState.Carts;
  Object.keys(Carts).forEach(function (item) {
    numberCart += Carts[item].quantity;
  });
}

const initProduct = {
  numberCart: numberCart,
  Carts: Carts,
  _products: [],
  _product: {},
  _productBestList: [],
  _productNewList: [],
  _categories: [],
  _orderList: [],
};

export const product = (state = initProduct, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCT:
      return {
        ...state,
        _products: action.payload,
      };
    case GET_ALL_PRODUCT_BEST:
      return {
        ...state,
        _productBestList: action.payload,
      };
    case GET_ALL_PRODUCT_NEW:
      return {
        ...state,
        _productNewList: action.payload,
      };
    case GET_ORDER_LIST:
      return {
        ...state,
        _orderList: action.payload,
      };
    case GET_ALL_CATEGORY:
      return {
        ...state,
        _categories: action.payload,
      };
    case GET_ALL_PRODUCT_BY_CATEGORY:
      return {
        ...state,
        _products: action.payload,
      };
    case GET_ALL_PRODUCT_BY_KEYWORD:
      return {
        ...state,
        _products: action.payload,
      };
    case GET_PRODUCT_DETAIL:
      return {
        ...state,
        _product: action.payload,
      };
    case GET_NUMBER_CART:
      return {
        ...state,
      };
    case ADD_CART:
      if (state.numberCart === 0) {
        let cart = {
          _id: action.payload._id,
          quantity: 1,
          title: action.payload.title,
          image: action.payload.image,
          price: action.payload.price,
        };
        state.Carts.push(cart);
      } else {
        let check = false;
        state.Carts.map((item, key) => {
          if (item._id === action.payload._id) {
            state.Carts[key].quantity++;
            check = true;
          }
        });
        if (!check) {
          let _cart = {
            _id: action.payload._id,
            quantity: 1,
            title: action.payload.title,
            image: action.payload.image,
            price: action.payload.price,
          };
          state.Carts.push(_cart);
        }
      }
      return {
        ...state,
        numberCart: state.numberCart + 1,
      };
    case INCREASE_QUANTITY:
      state.numberCart++;
      state.Carts[action.payload].quantity++;

      return {
        ...state,
      };
    case DECREASE_QUANTITY:
      let quantity = state.Carts[action.payload].quantity;
      if (quantity > 1) {
        state.numberCart--;
        state.Carts[action.payload].quantity--;
      }

      return {
        ...state,
      };
    case DELETE_CART:
      if (
        state.Carts[action.payload].quantity === numberCart ||
        state.Carts[action.payload].quantity === undefined
      )
        return {
          ...state,
          numberCart: 0,
          Carts: [],
        };
      else {
        let quantity_ = state.Carts[action.payload].quantity;
        return {
          ...state,
          numberCart: state.numberCart - quantity_,
          Carts: state.Carts.filter((item) => {
            return item._id !== state.Carts[action.payload]._id;
          }),
        };
      }

    case DELETE_ALL_CART:
      return {
        ...state,
        numberCart: 0,
        Carts: [],
      };
    default:
      return state;
  }
};

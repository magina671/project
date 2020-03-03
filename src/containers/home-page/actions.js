import API from "../../API";

export const GET_PRODUCT_REQUEST = "[HOME_PAGE] GET_PRODUCT_REQUEST";
export const GET_PRODUCT_SUCCESS = "[HOME-PAGE] GET_PRODUCT_SUCCESS";
export const GET_SALES_SUCCESS = "[HOME-PAGE] GET_SALES_SUCCESS";
export const GET_HITS_SUCCESS = "[HOME-PAGE] GET_HITS_SUCCESS";
export const GET_CATEGORIES_SUCCESS = "[HOME-PAGE] GET_CATEGORIES_SUCCESS";
export const GET_BRANDS_SUCCESS = "[HOME-PAGE] GET_BRANDS_SUCCESS";
export const GET_PRODUCT_ERROR = "[HOME_PAGE] GET_PRODUCT_ERROR";
export const ADD_PRODUCT = "[HOME_PAGE] ADD_PRODUCT ";

export const addProduct = productId => ({
  type: ADD_PRODUCT,
  payload: productId
});
export const getProductsRequest = () => ({ type: GET_PRODUCT_REQUEST });

export const getProductsSuccess = data => ({
  type: GET_PRODUCT_SUCCESS,
  payload: data
});

export const getSalesSuccess = data => ({
  type: GET_SALES_SUCCESS,
  payload: data
});

export const getHitsSuccess = data => ({
  type: GET_HITS_SUCCESS,
  payload: data
});

export const getCategoriesSuccess = data => ({
  type: GET_CATEGORIES_SUCCESS,
  payload: data
});

export const getBrandsSuccess = data => ({
  type: GET_BRANDS_SUCCESS,
  payload: data
});

export const getProductsError = () => ({ type: GET_PRODUCT_ERROR });

export const addProductToFavoritesThunk = data => dispatch => {
  let favoriteItemsInLocalStorage;
  if (localStorage.getItem("favorites") === null) {
    favoriteItemsInLocalStorage = [];
  } else {
    favoriteItemsInLocalStorage = JSON.parse(localStorage.getItem("favorites"));
    favoriteItemsInLocalStorage = favoriteItemsInLocalStorage.filter(
      productItem => productItem.id !== data.id
    ); //чтобы item не повторялись
  }
  favoriteItemsInLocalStorage.unshift(data);
  localStorage.setItem(
    "favorites",
    JSON.stringify(favoriteItemsInLocalStorage)
  );
};

export const addProductThunk = data => dispatch => {
  let a;
  if (localStorage.getItem("products") === null) {
    a = [];
  } else {
    a = JSON.parse(localStorage.getItem("products"));
    a = a.filter(productItem => productItem.id !== data.id);
  }
  a.unshift(data);
  dispatch(addProduct(a));
  localStorage.setItem("products", JSON.stringify(a));
};

export const getProductsRequestThunk = () => dispatch => {
  dispatch(getProductsRequest());
  return API.getProducts()
    .then(res => {
      let trueData = res.data.results.map(item => ({
        ...item,
        is_purchased: false,
        quantity: 1
      }));

      dispatch(getProductsSuccess(trueData));
    })
    .catch(err => {
      console.log(err, "ERROR FROM GET Products");
      dispatch(getProductsError());
    });
};

export const getSalesRequestThunk = () => dispatch => {
  dispatch(getProductsRequest());
  return API.getSales()
    .then(res => {
      // console.log("res data results -->",res.data.results);
      let arr = [];
      res.data.results.forEach((item, i) => {
        item.products.forEach(elem => {
          let newPrice = elem.new_price.toFixed();
          let subArr = {
            ...elem.product,
            is_purchased: false,
            quantity: 1,
            price: newPrice,
            isSaleProduct: true,
            old_price: elem.old_price
          };
          arr.push(subArr);
        });
      });

      dispatch(getSalesSuccess(arr));
    })
    .catch(err => {
      console.log(err, "ERROR FROM GET Products");
      dispatch(getProductsError());
    });
};

export const getHitsRequestThunk = () => dispatch => {
  dispatch(getProductsRequest());
  return API.getHits()
    .then(res => {
      let trueData = res.data.results.map(item => ({
        ...item,
        is_purchased: false,
        quantity: 1
      }));

      dispatch(getHitsSuccess(trueData));
    })
    .catch(err => {
      console.log(err, "ERROR FROM GET Products");
      dispatch(getProductsError());
    });
};

export const getCategoriesRequestThunk = () => dispatch => {
  return API.getCategories()
    .then(res => {
      let categories = res.data;
      dispatch(getCategoriesSuccess(categories));
    })
    .catch(err => {
      console.log(err, "ERROR FROM GET CATEGORIES");
      dispatch(getProductsError());
    });
};

export const getBrandsRequestThunk = () => dispatch => {
  return API.getBrands()
    .then(res => {
      let brands = res.data;
      dispatch(getBrandsSuccess(brands));
    })
    .catch(err => {
      console.log(err, "ERROR FROM GET BRANDS");
      dispatch(getProductsError());
    });
};

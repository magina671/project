import React, { useEffect } from "react";
import styles from "./product-info.module.css";
import HeaderMain from "../../components/header-main";
import Navbar from "../../components//navbar/";
import Footer from "../../components/footer";
import { connect, useDispatch } from "react-redux";
import { getProductRequestThunk } from "./actions";
import ModalOrder from "../cart-page/modal-order";
import ModalThanks from "../cart-page/modal-thanks/";
import {
  showModalOrder,
  showModalThanks,
  hideModalOrder,
  registrOrder
} from "../cart-page/actions";
import { addProductToCartThunk } from "../cart-page/actions";
import { addProductToFavoritesThunk } from "../favorite-page/actions";
import API from "../../API";

const ProductInfoPage = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    let productId = props.match.params.productId;
    dispatch(getProductRequestThunk(productId));
  }, []);

  const handleShow = id => {
    API.getProduct(id).then(res => {
      let productToBuy =res.data;
      localStorage.setItem("productToBuy", JSON.stringify(productToBuy));
      props.showModalOrder();
    });
  };
  const showThanks = () => {
    props.showModalThanks();
  };
  const handleHide = () => {
    props.hideModalOrder();
  };
  const submit = values => {
    let products = [JSON.parse(localStorage.getItem("productToBuy"))];
    let pushProducts = products.map(item => {
      return (item = {
        product: item.id,
        count: 1
      });
    });
    let pushData = {
      contacts: [values],
      products: pushProducts
    };
    props.registrOrder(pushData);
  };

  const { image, name, description, price, id } = props.product;

  return (
    <div>
      <HeaderMain />
      <Navbar />
      <div>
        <div className={styles.title_wrapper}>
          <p className="favorite__title">Товар </p>
        </div>

        <div className={styles.content_wrapper}>
          <div className={styles.content}>
            <div>
              <img src={image} alt="product" className={styles.image} />
            </div>
            <div className={styles.description_wrapper}>
              <p className={styles.name}>{name}</p>
              <div className={styles.buttons}>
                <button
                  onClick={() => props.addProductToFavorites(props.product)}
                  className={styles.favorite}
                >
                  Добавить в избранное
                </button>
                <button
                  onClick={() => props.addProductToCart(props.product)}
                  className={styles.cart}
                >
                  Добавить в корзину
                </button>
                <button onClick={() => handleShow(id)} className={styles.buy}>
                  Купить
                </button>
              </div>
              <p className={styles.description}>{description}</p>
              <p className={styles.price}>{price} сом</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ModalOrder
        show={props.showModalOrderValue}
        handleClose={handleHide}
        onSubmit={submit}
        handleThanks={showThanks}
      />
      <ModalThanks show={props.showModalThanksValue} handleClose={handleHide} />
    </div>
  );
};

const mapStateToProps = state => ({
  product: state.product.product,
  allProducts: state.home.products,
  showModalOrderValue: state.cart.showModalOrderValue,
  showModalThanksValue: state.cart.showModalThanksValue
});

const mapDispatchToProps = dispatch => {
  return {
    addProductToFavorites: product =>
      dispatch(addProductToFavoritesThunk(product)),
    addProductToCart: product => dispatch(addProductToCartThunk(product)),
    showModalOrder: () => {
      dispatch(showModalOrder());
    },
    showModalThanks: () => {
      dispatch(showModalThanks());
    },
    hideModalOrder: () => {
      dispatch(hideModalOrder());
    },
    registrOrder: data => {
      dispatch(registrOrder(data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductInfoPage);

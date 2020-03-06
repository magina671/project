import React, { Fragment } from "react";
import "./filter-list.css";
import Item from "../../home-page/item";
import styles from "./filter-list.module.css";

const FilterList = props => {
  console.log("props", props);
  const {
    allProducts,
    filteredProducts,
    currentPage,
    pageSize,
    totalProducts
  } = props;

  let pagesCount = Math.ceil(totalProducts / pageSize);
  let pages = [];
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i);
  }

  return (
    <Fragment>
      <div className="filter_list_paginator">
        {pages.map(page => {
          return (
            <div>
              <span
                className={currentPage + 1 === page && styles.selectedPage}
                onClick={() => {
                  props.setCurrentPage(page - 1);
                }}
              >
                {page}
              </span>
            </div>
          );
        })}
      </div>
      <div className="filter_list_wrapper">
        <div className="filter_list__item_container">
          {filteredProducts && filteredProducts.length ? (
            filteredProducts.map(item => {
              return (
                <Item
                  key={item.id}
                  products={item}
                  {...props}
                  handleShow={props.handleShow}
                />
              );
            })
          ) : (
            <p>Empty</p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default FilterList;

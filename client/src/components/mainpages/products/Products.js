import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import Productitem from "../ultis/productitem/Productitem";
import Loading from "../ultis/loading/Loading";
import axios from "axios";
import Filter from "./Filter";
import Loadmore from "./Loadmore";

const Products = () => {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
      setProducts([...products]);
    });
  };
  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
      setProducts([...products]);
      setIsCheck(!isCheck);
    });
  };
  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };
  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = axios.post(
        "/api/destroy",
        { public_id },
        {
          headers: { Authorization: token },
        }
      );
      const destroyProduct = axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });
      await destroyImg;
      await destroyProduct;
      setCallback(!callback);
      setLoading(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  if (loading) return <Loading />;
  return (
    <>
      <Filter />
      {isAdmin && (
        <div className="delete-all">
          <span>Select all</span>
          <input
            type="checkbox"
            name=""
            id=""
            checked={isCheck}
            onChange={checkAll}
          />
          <button onClick={deleteAll}>Delete All</button>
        </div>
      )}
      <div className="products">
        {products?.map((product) => {
          return (
            <Productitem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>
      <Loadmore />
      {products?.length === 0 && <Loading />}
    </>
  );
};

export default Products;

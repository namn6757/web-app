import React from "react";
import BtnRender from "./BtnRender";

const Productitem = ({ product, isAdmin, deleteProduct, handleCheck }) => {
  return (
    <div className="product-card">
      {isAdmin && (
        <input
          type="checkbox"
          checked={product.checked}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <img src={product.images.url} alt="" />

      <div className="product_box">
        <h2 title={product.tittle}>{product.tittle}</h2>
        <span>${product.price}</span>
        <p>{product.description}</p>
      </div>

      <BtnRender product={product} deleteProduct={deleteProduct} />
    </div>
  );
};

export default Productitem;

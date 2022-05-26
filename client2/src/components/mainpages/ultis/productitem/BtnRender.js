import Button from "@mui/material/Button";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";

const BtnRender = ({ product, deleteProduct }) => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;
  const addCart = state.userAPI.addCart;

  return (
    <div className="row_btn">
      {isAdmin ? (
        <>
          <Button
            sx={{ margin: "5px" }}
            variant="contained"
            color="success"
            id="btn_view"
            href={`/edit_product/${product._id}`}
          >
            Edit
          </Button>
          <Button
            sx={{ margin: "5px" }}
            variant="outlined"
            color="error"
            id="btn_buy"
            to="#!"
            onClick={() => deleteProduct(product._id, product.images.public_id)}
          >
            <p style={{ color: "crimson" }}>Delete</p>
          </Button>
        </>
      ) : (
        <>
          <Button
            sx={{ margin: "5px" }}
            variant="contained"
            color="primary"
            id="btn_buy"
            href="#!"
            onClick={() => addCart(product)}
          >
            buy
          </Button>
          <Button
            sx={{ margin: "5px" }}
            variant="outlined"
            color="info"
            id="btn_view"
            href={`/detail/${product._id}`}
          >
            <p style={{ color: "DodgerBlue" }}>view</p>
          </Button>
        </>
      )}
    </div>
  );
};

export default BtnRender;

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const initialState = {
  product_id: "",
  tittle: "",
  price: 0,
  description: "Liên hệ nhà cung cấp để viết thêm chi tiết",
  content: "sản phẩm ưa chuộng",
  category: "",
  id: "",
};

const CreateProduct = () => {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.CategoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const history = useHistory();
  const param = useParams();
  const [products, setProducts] = state.productsAPI.products;
  const [oneEdit, setOneEdit] = useState(false);
  const [callback, setCallback] = state.productsAPI.callback;

  useEffect(() => {
    if (param.id) {
      setOneEdit(true);
      products.forEach((product) => {
        if (product._id === param.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOneEdit(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [param.id, products]);
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("you're not an admin");
      const file = e.target.files[0];
      if (!file) return alert("file not exist");

      if (file.size > 1024 * 1024)
        //1mb
        return alert("file to large");
      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("file format is not correct");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImages(res.data);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  const handleDestroy = async (e) => {
    try {
      if (!isAdmin) return alert("you're not an admin");
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isAdmin) return alert("you're not an admin");
      if (!images) return alert("no image upload");

      if (oneEdit) {
        await axios.put(
          `/api/products/${product._id}`,
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
      } else {
        await axios.post(
          "/api/products",
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
      }

      setCallback(!callback);
      history.push("/");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  const styleUpload = {
    display: images ? "block" : "none",
  };
  return (
    <div className="create_product">
      <div className="upload">
        <input type="file" name="file" id="file_up" onChange={handleUpload} />
        {loading ? (
          <div id="file_img">
            <CircularProgress
              size="10rem"
              style={{ position: "absolute", top: "30%", left: "35%" }}
            />
          </div>
        ) : (
          <div id="file_img" style={styleUpload}>
            <img src={images ? images.url : ""} alt="" />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <TextField
            required
            id="product_id"
            label="Product ID"
            name="product_id"
            defaultValue=""
            variant="standard"
            disabled={product.id}
            value={product.product_id}
            onChange={handleChangeInput}
            fullWidth="true"
          />
        </div>
        <div className="row">
          <TextField
            required
            id="Tittle"
            label="Tittle"
            name="tittle"
            defaultValue=""
            variant="standard"
            value={product.tittle}
            onChange={handleChangeInput}
            fullWidth="true"
          />
        </div>
        <div className="row">
          <TextField
            required
            id="price"
            label="Price"
            name="price"
            defaultValue=""
            variant="standard"
            value={product.price}
            onChange={handleChangeInput}
            fullWidth="true"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </div>
        <div className="row">
          <TextField
            name="description"
            fullWidth="true"
            id="description"
            label="Description"
            multiline
            rows={2}
            defaultValue="Description"
            variant="standard"
            value={product.description}
            onChange={handleChangeInput}
          />
        </div>
        <div className="row">
          <TextField
            id="content"
            label="Content"
            name="content"
            defaultValue=""
            variant="standard"
            value={product.content}
            onChange={handleChangeInput}
            fullWidth="true"
          />
        </div>
        <div className="row">
          <TextField
            id=""
            select
            label="category"
            name="category"
            value={product.category}
            onChange={handleChangeInput}
            helperText="Please select your category"
          >
            {categories &&
              categories.length > 0 &&
              categories?.map((category) => (
                <MenuItem value={category._id} key={category._id}>
                  {category.name}
                </MenuItem>
              ))}
          </TextField>
        </div>
        <Button type="submit" variant="contained">
          {oneEdit ? "Update" : "Create"}
        </Button>
        {/* <button type="submit">{oneEdit ? "Update" : "Create"}</button>  */}
      </form>
    </div>
  );
};

export default CreateProduct;

import React, { useEffect, useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import Loading from "../ultis/loading/Loading";
import { useHistory, useParams } from "react-router-dom";

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
            <Loading />
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
          <label htmlFor="product_id"> Product ID</label>
          <input
            disabled={product.id}
            type="text"
            name="product_id"
            id="product_id"
            required
            value={product.product_id}
            onChange={handleChangeInput}
          />
        </div>
        <div className="row">
          <label htmlFor="tittle"> Tittle</label>
          <input
            type="text"
            name="tittle"
            id="tittle"
            required
            value={product.tittle}
            onChange={handleChangeInput}
          />
        </div>
        <div className="row">
          <label htmlFor="price"> Price</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={product.price}
            onChange={handleChangeInput}
          />
        </div>
        <div className="row">
          <label htmlFor="description"> Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            required
            rows={5}
            value={product.description}
            onChange={handleChangeInput}
          />
        </div>
        <div className="row">
          <label htmlFor="content"> Content</label>
          <input
            type="text"
            name="content"
            id="content"
            required
            value={product.content}
            onChange={handleChangeInput}
          />
        </div>
        <div className="row">
          <label htmlFor="Categories"> Categories:</label>
          <select
            name="category"
            value={product.category}
            id=""
            onChange={handleChangeInput}
          >
            <option value="">Please select a category</option>
            {categories &&
              categories.length > 0 &&
              categories?.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <button type="submit">{oneEdit ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default CreateProduct;

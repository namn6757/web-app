import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";

const Categories = () => {
  const state = useContext(GlobalState);
  const [categories] = state.CategoriesAPI.categories;
  const [category, setCategory] = useState("");
  const [token] = state.token;
  const [callback, setCallback] = state.CategoriesAPI.callback;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState("");

  const createCategory = async (e) => {
    e.preventDefault();
    if (onEdit) {
      const res = await axios.put(
        `/api/category/${id}`,
        { name: category },
        {
          headers: { Authorization: token },
        }
      );
      setOnEdit(false);
      alert(res.data.msg);
      setCategory("");
      setCallback(!callback);
    } else {
      try {
        const res = await axios.post(
          "/api/category",
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        setOnEdit(false);
        alert(res.data.msg);
        setCategory("");
        setCallback(!callback);
      } catch (error) {
        alert(error.response.data.msg);
      }
    }
  };

  const editCategory = async (id, name) => {
    setId(id);
    setCategory(name);
    setOnEdit(true);
  };

  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      alert(res.data.msg);
      setCallback(!callback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  return (
    <div className="categories">
      <form action="" onSubmit={createCategory}>
        <label htmlFor="category">Category</label>
        <input
          type="text"
          name="category"
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type="submit">{onEdit ? "Update" : "Create"}</button>
      </form>

      <div className="col">
        {categories &&
          categories.length > 0 &&
          categories?.map((categories) => (
            <div className="row" key={category._id}>
              <p>{categories.name}</p>
              <div>
                <button
                  onClick={() => editCategory(categories._id, categories.name)}
                >
                  Edit
                </button>
                <button onClick={() => deleteCategory(categories._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Categories;

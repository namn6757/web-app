import React, { useState, useEffect } from "react";
import axios from "axios";

const UserAPI = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);

  const addCart = async (product) => {
    if (!isLogged) return alert("please login to cotinue buying");

    const check = cart.every((item) => {
      return item._id !== product._id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await axios.patch(
        "/user/addcart",
        { cart: [...cart, { ...product, quantity: 1 }] },
        {
          headers: { Authorization: token },
        }
      );
    } else {
      alert("this product has been added to cart");
    }
  };

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get("/user/infor", {
            headers: { Authorization: token },
          });

          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

          setCart(res.data.cart);
        } catch (error) {
          alert(error.response.data.msg);
        }
      };
      getUser();
    }
  }, [token]);
  return {
    isAdmin: [isAdmin, setIsAdmin],
    isLogged: [isLogged, setIsLogged],
    cart: [cart, setCart],
    addCart: addCart,
    history: [history, setHistory],
  };
};

export default UserAPI;

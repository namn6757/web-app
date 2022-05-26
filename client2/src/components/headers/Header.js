import React, { useState, useContext } from "react";
import { GlobalState } from "../../GlobalState";
import Menu from "./icon/bars-solid.svg";
import Closed from "./icon/circle-xmark-solid.svg";
import Cart from "./icon/cart-arrow-down-solid.svg";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const [menu, setMenu] = useState(false);

  const loggoutUser = async () => {
    await axios.get("/user/logout");
    localStorage.removeItem("firstLogin");
    window.location.href = "/";
  };
  const adminRouter = () => {
    return (
      <>
        <li>
          <Link to="/create_product">Create Products</Link>
        </li>
        <li>
          <Link to="/category">Categories</Link>
        </li>
      </>
    );
  };
  const loggedRouter = () => {
    return (
      <>
        <li>
          <Link to="/history">History</Link>
        </li>
        <li>
          <Link to="/" onClick={loggoutUser}>
            Logout
          </Link>
        </li>
      </>
    );
  };
  const toggleMenu = () => setMenu(!menu);
  let styleMenu = {
    left: menu ? 0 : "-100%",
  };
  return (
    <header>
      <div className="menu" onClick={() => setMenu(!menu)}>
        <img src={Menu} alt="menu" width={30} />
      </div>

      <div className="logo">
        <h1>
          <Link to="/">{isAdmin ? "Admin" : "Dev Shop"}</Link>
        </h1>
      </div>

      <ul style={styleMenu}>
        <li>
          <Link to="/">{isAdmin ? "Product" : " Shop"}</Link>
        </li>

        {isAdmin && adminRouter()}
        {isLogged ? (
          loggedRouter()
        ) : (
          <li>
            {" "}
            <Link to="/login">Login ※ register</Link>
          </li>
        )}

        <li className="closed">
          <img
            src={Closed}
            alt="closed"
            onClick={() => setMenu(!menu)}
            width={30}
          />
        </li>
      </ul>

      {isAdmin ? (
        ""
      ) : (
        <div className="cart-icon">
          <span>{cart.length}</span>
          <Link to="/cart">
            <img src={Cart} alt="Cart" width={30} />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;

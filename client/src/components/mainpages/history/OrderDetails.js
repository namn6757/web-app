import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";

const OrderDetails = () => {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;

  const [orderDetails, setOrderDetails] = useState([]);

  const param = useParams();

  useEffect(() => {
    if (param.id) {
      history.forEach((item) => {
        if (item._id === param.id) setOrderDetails(item);
      });
    }
  }, [param.id, history]);
  if (orderDetails.length === 0) return null;
  return (
    <div>
      <div className="history-page">
        <table style={{ margin: "40px 0px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Addresss</th>
              <th>Postal Code</th>
              <th>Country Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{orderDetails.address.recipient_name}</td>
              <td>
                {orderDetails.address.line1 + " - " + orderDetails.address.city}
              </td>
              <td>{orderDetails.address.postal_code}</td>
              <td>{orderDetails.address.country_code}</td>
            </tr>
          </tbody>
        </table>

        <table style={{ margin: "40px 0px" }}>
          <thead>
            <tr>
              <th></th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.cart?.map((item) => (
              <tr key={item._id}>
                <td>
                  <img src={item.images.url} alt="" />
                </td>
                <td>{item.tittle}</td>
                <td>{item.quantity}</td>
                <td>${item.quantity * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;

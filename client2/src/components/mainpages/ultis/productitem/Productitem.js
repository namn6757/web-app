import React from "react";
import BtnRender from "./BtnRender";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const Productitem = ({ product, isAdmin, deleteProduct, handleCheck }) => {
  return (
    <>
      <div className="product-card">
        {isAdmin && (
          <input
            type="checkbox"
            checked={product.checked}
            onChange={() => handleCheck(product._id)}
          />
        )}
        <Card sx={{ height: 500 }}>
          <CardMedia
            component="img"
            height="100"
            image={product.images.url}
            alt={product.tittle}
          />
          <CardContent
            sx={{ paddingRight: 2, paddingLeft: 2, paddingBottom: 0 }}
          >
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              noWrap="true"
              margin={0}
              sx={{ textTransform: "capitalize", fontWeight: 600 }}
            >
              {product.tittle}
            </Typography>
            <Typography
              gutterBottom
              variant="body2"
              component="div"
              color="red"
            >
              ${product.price}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                height: 60,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product.description}
            </Typography>
          </CardContent>
          <CardActions>
            <BtnRender product={product} deleteProduct={deleteProduct} />
          </CardActions>
        </Card>
      </div>
    </>
  );
};

export default Productitem;

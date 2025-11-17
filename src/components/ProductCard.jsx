import React from "react";

const ProductCard = ({ product }) => {
  const {
    title = "",
    img = "",
    price = "0",
    rating = 4.5,
    reviews = 0,
    color = "#ddd",
  } = product;
  const priceText = typeof price === "string" ? price : `${price} сум`;
  const displayPrice = priceText.split("/")[0]?.trim() || priceText;

  return (
    <div className="pm-card">
      <div className="pm-image-wrap">
        <img src={img} alt={title} className="pm-image" />
        <div className="pm-price-badge">{displayPrice}</div>
      </div>
      <div className="pm-card-body">
        <h3 className="pm-title">{title}</h3>
        <div className="pm-prices-section">
          <span className="pm-new-price">{displayPrice}</span>
        </div>
        <div className="pm-rating-section">
          <span className="pm-stars"> {rating}</span>
          <span className="pm-reviews">({reviews})</span>
        </div>
        <button className="pm-btn"> Завтра</button>
      </div>
    </div>
  );
};

export default ProductCard;

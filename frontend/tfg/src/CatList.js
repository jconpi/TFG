// CatList.js
import React from "react";
import CatCard from "./CatCard";
import "./components/CatList.css";

const CatList = ({ cats }) => {
  return (
    <div className="cat-list">
      {cats.map((cat) => (
        <CatCard key={cat.id} cat={cat} />
      ))}
    </div>
  );
};

export default CatList;

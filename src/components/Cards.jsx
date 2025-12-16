import React from "react";
import Card_Slider from "./Card_Slider";

const Cards = ({ meals = [], isAdmin, onDelete, onUpdatePrice }) => {
  return (
    <div className="Cards">
      {meals.map((meal) => (
        <Card_Slider
          key={meal.id}
          Id={meal.id}
          Title={meal.name}
          TitleEng={meal.englishName}
          Img={meal.image_url}
          PriceDisplay={`ل.س ${meal.price}`}
          PriceNumber={meal.price}
          isAdmin={isAdmin}
          onDelete={onDelete}
          onUpdatePrice={onUpdatePrice}
        />
      ))}
    </div>
  );
};

export default Cards;


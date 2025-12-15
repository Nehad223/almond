import React from "react";
import Card_Slider from "./Card_Slider";

const Cards = ({ meals }) => {
  return (
    <div className="Cards">
      {meals.map((meal) => (
        <Card_Slider
          key={meal.id}
          Title={meal.name}
          TitleEng={meal.englishName}
          Img={meal.image_url}
          Price={`ل.س ${meal.price}`}
        />
      ))}
    </div>
  );
};

export default Cards;


import React, { useState } from "react";

const Card_Slider = ({ Img, Title, Price, TitleEng }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="Card_Slider">
      <div className={`img-wrapper ${loaded ? "loaded" : "loading"}`}>
        <img src={Img} loading="lazy" onLoad={() => setLoaded(true)} />
      </div>

      <div className="info">
        <h1>{Title}</h1>
        <h1>{TitleEng}</h1>
        <h1>{Price}</h1>
      </div>
    </div>
  );
};

export default Card_Slider;


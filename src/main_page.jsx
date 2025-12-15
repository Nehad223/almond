import React, { useEffect, useState } from "react";
import Logo from "./components/Logo";
import Navbar from "./components/Navbar";
import Cards from "./components/Cards";
import Loader from './components/Loader.jsx';
const Main_page = () => {
  const [data, setData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://snackalmond1.pythonanywhere.com/home/")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader/>;

  return (
    <div>
      <Logo />
      <Navbar
        categories={data}
        active={activeCategory}
        setActive={setActiveCategory}
      />
      <Cards meals={data[activeCategory].meals} />
    </div>
  );
};

export default Main_page;

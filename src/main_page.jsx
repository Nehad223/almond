import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Logo from "./components/Logo";
import Navbar from "./components/Navbar";
import Cards from "./components/Cards";
import Loader from "./components/Loader.jsx";
import Delivery_To_Home from "./components/Delivery_To_Home.jsx";

const Main_page = ({
  isAdmin = false,
  onDelete,
  onUpdate,
}) => {
  const [data, setData] = useState([]);
const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://snackalmond.duckdns.org/home/")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setActiveCategory(0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

useEffect(() => {
  const container = document.querySelector(".Cards");
  if (!container) return;

  const cards = container.children;
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: document.querySelector(".main-scroll"),
      threshold: 0.2,
    }
  );

  Array.from(cards).forEach(card => observer.observe(card));

  return () => observer.disconnect();
}, [activeCategory]);

useEffect(() => {
  const scrollContainer = document.querySelector(".main-scroll");
  if (scrollContainer) {
    scrollContainer.scrollTo({
      top: 0,
      behavior: "instant", 
    });
  }
}, [activeCategory]);



const handleDelete = async (mealId) => {
  const confirm = await new Promise((resolve) => {
    toast(
      ({ closeToast }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span>هل أنت متأكد من حذف الوجبة؟</span>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "6px" }}>
            <button
              onClick={() => { resolve(true); closeToast(); }}
              style={{
                padding: "5px 12px",
                backgroundColor: "#E74C3C",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              نعم
            </button>
            <button
              onClick={() => { resolve(false); closeToast(); }}
              style={{
                padding: "5px 12px",
                backgroundColor: "#95A5A6",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              لا
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  });
  if (!confirm) return; 
  try {
    await onDelete(mealId);
    setData((prev) =>
      prev.map((cat) => ({
        ...cat,
        meals: cat.meals.filter((meal) => meal.id !== mealId),
      }))
    );

  } catch {}
};


  /* ================= تعديل فوري ================= */
  const handleUpdate = async (mealId, updatedData) => {
    try {
      await onUpdate(mealId, updatedData);

      setData((prev) =>
        prev.map((cat) => ({
          ...cat,
          meals: cat.meals.map((meal) =>
            meal.id === mealId
              ? { ...meal, ...updatedData }
              : meal
          ),
        }))
      );

    } catch {
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          {!isAdmin &&  <Delivery_To_Home/>}
         
          
          <Navbar
            categories={data}
            active={activeCategory}
            setActive={setActiveCategory}
          />
        </div>
      </header>

      <main className="main-scroll">
        <div className="content-wrap">
          {activeCategory !== null && data[activeCategory] && (
          <Cards
            meals={data[activeCategory].meals}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onUpdateProduct={handleUpdate}
            Categories={data}
          />
        )}
        </div>
      </main>

    </div>
  );
};

export default Main_page;



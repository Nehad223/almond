import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Logo from "./components/Logo";
import Navbar from "./components/Navbar";
import Cards from "./components/Cards";
import Loader from "./components/Loader.jsx";

const Main_page = ({
  isAdmin = false,
  onDelete,
  onUpdate,
}) => {
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
      .catch(() => setLoading(false));
  }, []);

  /* ================= حذف فوري ================= */
  const handleDelete = async (mealId) => {
    if (!window.confirm("متأكد من الحذف؟")) return;

    try {
      await onDelete(mealId);

      setData((prev) =>
        prev.map((cat) => ({
          ...cat,
          meals: cat.meals.filter(
            (meal) => meal.id !== mealId
          ),
        }))
      );

      toast.success("تم حذف الوجبة");
    } catch {
      toast.error("فشل الحذف");
    }
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

      toast.success("تم تحديث الوجبة");
    } catch {
      toast.error("فشل التحديث");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="app">
      {/* Header ثابت */}
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <Navbar
            categories={data}
            active={activeCategory}
            setActive={setActiveCategory}
          />
        </div>
      </header>

      {/* سكرول فقط للكاردس */}
      <main className="main-scroll">
        {data[activeCategory] && (
          <Cards
            meals={data[activeCategory].meals}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onUpdateProduct={handleUpdate}
            Categories={data}
          />
        )}
      </main>
    </div>
  );
};

export default Main_page;

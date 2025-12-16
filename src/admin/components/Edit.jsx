import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import Cards from "../../components/Cards";
import Logo from "../../components/Logo";

const EditPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]); 
  const [activeCategory, setActiveCategory] = useState(0);
  const [loading, setLoading] = useState(true);
  const adminToken = sessionStorage.getItem("token");
  const isAdmin = Boolean(adminToken);

  useEffect(() => {
    if (!adminToken) {
      navigate("/"); 
    }
  }, [adminToken, navigate]);
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${adminToken}`,
});
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

  const deleteMeal = async (mealId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الوجبة؟")) return;

    const previous = JSON.parse(JSON.stringify(data));

    setData((prev) =>
      prev.map((cat) => ({
        ...cat,
        meals: cat.meals.filter((m) => m.id !== mealId),
      }))
    );

    try {
      const res = await fetch(
        `https://snackalmond1.pythonanywhere.com/editmeal/${mealId}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      console.error(err);
      setData(previous);
      alert("فشل الحذف، حاول مرة أخرى");
    }
  };


  const updateMealPrice = async (mealId, newPrice) => {
    const previous = JSON.parse(JSON.stringify(data));

    setData((prev) =>
      prev.map((cat) => ({
        ...cat,
        meals: cat.meals.map((m) =>
          m.id === mealId ? { ...m, price: newPrice } : m
        ),
      }))
    );

    try {
      const res = await fetch(
        `https://snackalmond1.pythonanywhere.com/editmeal/${mealId}/`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ price: newPrice }),
        }
      );

      if (!res.ok) throw new Error("Update failed");
    } catch (err) {
      console.error(err);
      setData(previous);
      alert("فشل تحديث السعر، حاول مرة أخرى");
    }
  };

  if (loading) return <Loader />;

  const activeMeals =
    data?.[activeCategory]?.meals ?? [];

  return (
    <div>
      <Logo />
      <Navbar
        categories={data}
        active={activeCategory}
        setActive={setActiveCategory}
      />

      <Cards
        meals={activeMeals}
        isAdmin={isAdmin}
        onDelete={deleteMeal}
        onUpdatePrice={updateMealPrice}
      />
    </div>
  );
};

export default EditPage;


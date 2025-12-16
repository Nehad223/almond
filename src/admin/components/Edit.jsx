import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    if (!adminToken) navigate("/");
  }, [adminToken, navigate]);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  });

  /* ================== Fetch ================== */
  useEffect(() => {
    fetch("https://snackalmond1.pythonanywhere.com/home/")
      .then((res) => res.json())
      .then(setData)
      .catch(() => toast.error("فشل تحميل البيانات"))
      .finally(() => setLoading(false));
  }, []);

  /* ================== Delete Meal ================== */
  const deleteMeal = (mealId) => {
    const toastId = toast(
      () => (
        <div style={{ textAlign: "center" }}>
          <p>هل أنت متأكد من حذف هذه الوجبة؟</p>

          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={() => toast.dismiss(toastId)}>إلغاء</button>

            <button
              onClick={async () => {
                toast.dismiss(toastId);

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

                  if (!res.ok) throw new Error();
                  toast.success("تم حذف الوجبة بنجاح");
                } catch {
                  setData(previous);
                  toast.error("فشل الحذف");
                }
              }}
            >
              تأكيد
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  /* ================== Update Price ================== */
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

      if (!res.ok) throw new Error();
      toast.success("تم تحديث السعر");
    } catch {
      setData(previous);
      toast.error("فشل تحديث السعر");
    }
  };

  if (loading) return <Loader />;

  const activeMeals = data?.[activeCategory]?.meals ?? [];

  return (
    <>
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

      <ToastContainer
        position="bottom-center"
        autoClose={2500}
        hideProgressBar
        theme="dark"
      />
    </>
  );
};

export default EditPage;

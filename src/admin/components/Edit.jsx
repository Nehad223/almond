// AdminPage.jsx
import React, { useEffect, useState } from "react";

const API_BASE = "https://snackalmond1.pythonanywhere.com";

const AdminPage = () => {
  const [data, setData] = useState([]); // جميع الأصناف
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/home/`)
      .then((res) => res.json())
      .then((json) => {
        // جمع كل الأصناف من كل فئة في مصفوفة واحدة
        const allMeals = json.flatMap(category => category.meals);
        setData(allMeals);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const deleteMeal = async (mealId) => {
    const previous = [...data];
    setData(d => d.filter(m => m.id !== mealId));

    try {
      const res = await fetch(`${API_BASE}/editmeal/${mealId}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      console.error(err);
      setData(previous);
      alert("فشل الحذف، حاول مرة أخرى");
    }
  };

  const updateMealPrice = async (mealId, newPrice) => {
    const previous = [...data];
    setData(d => d.map(m => m.id === mealId ? { ...m, price: newPrice } : m));

    try {
      const res = await fetch(`${API_BASE}/editmeal/${mealId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: newPrice }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch (err) {
      console.error(err);
      setData(previous);
      alert("فشل تحديث السعر، حاول مرة أخرى");
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>صفحة الأدمن</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {data.map(meal => (
          <AdminCard
            key={meal.id}
            meal={meal}
            onDelete={deleteMeal}
            onUpdatePrice={updateMealPrice}
          />
        ))}
      </div>
    </div>
  );
};

const AdminCard = ({ meal, onDelete, onUpdatePrice }) => {
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(meal.price);

  const formatPrice = p => `ل.س ${p}`;

  const handleSave = () => {
    const parsed = parseFloat(editPrice);
    if (isNaN(parsed) || parsed < 0) {
      alert("أدخل سعر صالح");
      return;
    }
    setEditing(false);
    onUpdatePrice(meal.id, parsed);
  };

  const handleDelete = () => {
    if (!window.confirm("هل تريد حذف هذا المنتج؟")) return;
    onDelete(meal.id);
  };

  return (
    <div
      style={{
        position: "relative",
        width: 220,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        background: "#fff",
        direction: "rtl",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setEditing(false); setEditPrice(meal.price); }}
    >
      <div style={{ height: 150, background: "#f5f5f5" }}>
        <img
          src={meal.image_url}
          alt={meal.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ padding: 12 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>{meal.name}</h3>
        <div style={{ fontSize: 13, opacity: 0.8 }}>{meal.englishName}</div>
        {!editing ? (
          <div style={{ marginTop: 8, fontWeight: "700" }}>{formatPrice(meal.price)}</div>
        ) : (
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <input
              value={editPrice}
              onChange={e => setEditPrice(e.target.value)}
              inputMode="decimal"
              style={{ padding: 6, width: 100 }}
            />
            <button onClick={handleSave} style={{ padding: "6px 8px" }}>حفظ</button>
            <button onClick={() => { setEditing(false); setEditPrice(meal.price); }} style={{ padding: "6px 8px" }}>إلغاء</button>
          </div>
        )}
      </div>

      {hover && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: 10,
            background: "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.08))",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: "none",
                background: "#ffffffcc",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              تعديل السعر
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: "none",
                background: "#ffdddd",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              حذف
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

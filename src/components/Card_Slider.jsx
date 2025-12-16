import React, { useState } from "react";

const Card_Slider = ({
  Img,
  Title,
  PriceDisplay,
  PriceNumber,
  TitleEng,
  Id,
  isAdmin,
  onDelete,
  onUpdatePrice,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPrice, setNewPrice] = useState(PriceNumber ?? "");
  const [saving, setSaving] = useState(false);

  const handleOpenEdit = () => {
    setNewPrice(PriceNumber ?? "");
    setShowModal(true);
  };

  const handleSavePrice = async () => {
    const parsed = Number(newPrice);
    if (Number.isNaN(parsed) || parsed < 0) {
      alert("أدخل سعر صالح (رقم).");
      return;
    }
    setSaving(true);
    try {
      await onUpdatePrice(Id, parsed);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="Card_Slider card" >
        <div className={`img-wrapper ${loaded ? "loaded" : "loading"}`}>
          <img src={Img} loading="lazy" onLoad={() => setLoaded(true)} alt={Title}  />
        </div>

        <div className="info">
          <h3 >{Title}</h3>
          <div >{TitleEng}</div>
          <div>{PriceDisplay}</div>
        </div>

    
        {isAdmin && (
          <div className="actions" style={{
            position: "absolute",
            top: 8,
            right: 8,
              zIndex: 10

          }}>
            <button
              className="btn-edit"
              onClick={handleOpenEdit}
              style={{ marginRight: 8, padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer", background: "#ffd166" }}
            >
              تعديل السعر
            </button>
            <button
              className="btn-delete"
              onClick={() => {
                if (window.confirm("هل أنت متأكد من حذف هذه الوجبة؟")) onDelete(Id);
              }}
              style={{ padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer", background: "#ef476f", color: "#fff" }}
            >
              حذف
            </button>
          </div>
        )}
      </div>

     {showModal && (
  <div className="price-modal-overlay">
    <div className="price-modal" role="dialog" aria-modal="true">
      <h3 className="price-modal-title">تعديل السعر</h3>

      <div className="price-modal-field">
        <label>السعر (ل.س)</label>
        <input
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          step="0.01"
        />
      </div>

      <div className="price-modal-actions">
        <button
          className="btn-cancel"
          onClick={() => setShowModal(false)}
        >
          إلغاء
        </button>

        <button
          className="btn-save"
          onClick={handleSavePrice}
          disabled={saving}
        >
          {saving ? "جاري الحفظ..." : "حفظ التعديل"}
        </button>
      </div>
    </div>
  </div>
)}


    </>
  );
};

export default Card_Slider;


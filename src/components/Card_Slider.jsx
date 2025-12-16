import React, { useState } from "react";
import { toast } from "react-toastify";

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

  /* ================== Edit Price ================== */
  const handleOpenEdit = () => {
    setNewPrice(PriceNumber ?? "");
    setShowModal(true);
  };

  const handleSavePrice = async () => {
    const parsed = Number(newPrice);

    if (Number.isNaN(parsed) || parsed < 0) {
      toast.error("أدخل سعر صالح");
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
      <div className="Card_Slider card">
        <div className={`img-wrapper ${loaded ? "loaded" : "loading"}`}>
          <img
            src={Img}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            alt={Title}
          />
        </div>

        <div className="info">
          <h1>{Title}</h1>
          <h1 className="en">{TitleEng}</h1>
          <h1>{PriceDisplay}</h1>
        </div>

        {isAdmin && (
          <div
            className="actions"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
            }}
          >
            <button
              onClick={handleOpenEdit}
              style={{
                marginRight: 8,
                padding: "6px 8px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: "#ffd166",
              }}
            >
              تعديل السعر
            </button>

            <button
              onClick={() => onDelete(Id)}
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: "#ef476f",
                color: "#fff",
              }}
            >
              حذف
            </button>
          </div>
        )}
      </div>

      {/* ================== Price Modal ================== */}
      {showModal && (
        <div className="price-modal-overlay">
          <div className="price-modal" role="dialog" aria-modal="true">
            <h3>تعديل السعر</h3>

            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />

            <div className="price-modal-actions">
              <button onClick={() => setShowModal(false)} disabled={saving}>
                إلغاء
              </button>

              <button onClick={handleSavePrice} disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card_Slider;


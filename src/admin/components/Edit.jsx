import { useEffect, useState, useRef } from "react";
import React from "react";
import Card_Slider from "./../../components/Card_Slider";
import "./../admin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Edit = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleteCatOpen, setIsDeleteCatOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [editData, setEditData] = useState({
    id: null,
    name: "",
    imageUrl: "",
    price: "",
  });

  const widgetRef = useRef(null);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);


  useEffect(() => {
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: "import.meta.env.VITE_CLOUDINARY_CLOUD_NAME",
        uploadPreset: "unsigned_products",
        multiple: false,
        folder: "products",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          setEditData(prev => ({
            ...prev,
            imageUrl: result.info.secure_url,
          }));
          toast.success("تم رفع الصورة بنجاح");
        }
      }
    );
  }, []);

  const openEditModal = (product) => {
    setEditData({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
    });
    setIsModalOpen(true);
  };

  const saveChanges = async () => {
    try {
      const res = await fetch(`/api/products/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("حصل خطأ أثناء حفظ التعديل");

      setIsModalOpen(false);

      fetch("/api/categories")
        .then(res => res.json())
        .then(data => {
          setCategories(data);
          toast.success("تم حفظ التعديلات بنجاح");
        });
    } catch (err) {
      console.error(err);
      toast.error("فشل حفظ التعديلات — حاول مرة ثانية");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("حصل خطأ أثناء حذف المنتج");

      fetch("/api/categories")
        .then(res => res.json())
        .then(data => {
          setCategories(data);
          toast.success("تم حذف المنتج");
        });
    } catch (err) {
      console.error(err);
      toast.error("فشل حذف المنتج");
    }
  };

  const openDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setIsDeleteCatOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const id = categoryToDelete.id;

    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });

      setCategories(prev => prev.filter(c => c.id !== id));
      setIsDeleteCatOpen(false);
      setCategoryToDelete(null);
      toast.success("تم حذف الفئة بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("ما قدرنا نحذف الكاتيجوري. جرّب لاحقاً.");
    }
  };

  return (
    <div className="Edit">

      {categories.map(category => (
        <div key={category.id} className="category-block">
          <div className="category-header">

            <div className="category-actions">
              <button
                className="cat-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteCategory(category);
                }}
                title="حذف الكاتيجوري"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 11v6M14 11v6M9 6l1-3h4l1 3"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <h1 className="category-title">{category.name}</h1>
          </div>

          <div className="Grid_items">
            {category.products.map(product => (
              <div key={product.id} className="admin-card-container">

                <Card_Slider
                  Img={product.imageUrl}
                  Text={product.name}
                  Price={product.price}
                />

                <div className="admin-overlay">
                  <button className="edit-btn" onClick={() => openEditModal(product)}>
                    تعديل
                  </button>
                  <button className="del-btn" onClick={() => deleteProduct(product.id)}>
                    حذف
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      ))}

      {isModalOpen && (
        <div className="modal-back">
          <div className="modal-box">
            <h2>تعديل المنتج</h2>

            <label>اسم المنتج:</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <label>الصورة:</label>
            <button
              type="button"
              className="upload-btn"
              onClick={() => widgetRef.current.open()}
            >
              رفع صورة جديدة
            </button>

            {editData.imageUrl && (
              <img
                src={editData.imageUrl}
                alt="preview"
                className="w-24 mt-2 rounded"
              />
            )}

            <label>السعر:</label>
            <input
              type="number"
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={saveChanges}>
                حفظ
              </button>
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteCatOpen && categoryToDelete && (
        <div className="modal-back">
          <div className="confirm-box">
            <div className="confirm-icon">⚠️</div>
            <h3>تأكيد حذف الفئة</h3>

            <p className="confirm-text">
              هل تريد حذف الفئة <strong>{categoryToDelete.name}</strong>؟
              {categoryToDelete.products?.length > 0 && (
                <>
                  <br />
                  تحتوي على <strong>{categoryToDelete.products.length}</strong> منتج
                </>
              )}
            </p>

            <div className="confirm-actions">
              <button
                className="confirm-btn cancel"
                onClick={() => {
                  setIsDeleteCatOpen(false);
                  setCategoryToDelete(null);
                }}
              >
                إلغاء
              </button>

              <button
                className="confirm-btn danger"
                onClick={confirmDeleteCategory}
              >
                حذف نهائي
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Edit;

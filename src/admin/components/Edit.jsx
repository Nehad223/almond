import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Main_page from "../../main_page";

const EditPage = () => {
  const navigate = useNavigate();
  const adminToken = sessionStorage.getItem("token");
  const isAdmin = Boolean(adminToken);

  useEffect(() => {
    if (!adminToken) navigate("/");
  }, [adminToken, navigate]);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  });

  // حذف
  const deleteMeal = async (mealId) => {
    try {
      const res = await fetch(
        `https://snackalmond1.pythonanywhere.com/editmeal/${mealId}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error();
      toast.success("تم حذف الوجبة");
    } catch {
      toast.error("فشل الحذف");
    }
  };

  // تعديل
  const updateMeal = async (mealId, updatedData) => {
    try {
      const res = await fetch(
        `https://snackalmond1.pythonanywhere.com/editmeal/${mealId}/`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedData),
        }
      );
      if (!res.ok) throw new Error();
      toast.success("تم التحديث");
    } catch {
      toast.error("فشل التحديث");
    }
  };

  return (
    <>
      <Main_page
        isAdmin={isAdmin}
        onDelete={deleteMeal}
        onUpdate={updateMeal}
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

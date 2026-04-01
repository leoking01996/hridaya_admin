import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


interface ProductType {
  id: string;
  typename: string;
  description: string;
}

const ProductTypeEditForm: React.FC = () => {
  const [formData, setFormData] = useState<ProductType>({
    id: "",
    typename: "",
    description: "",
  });
const nav = useNavigate();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost/backend_php_hridaya/hridaya-admin-backend/edit_product_type.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      alert(data.message);
   if (data.success) {
      nav("/http://localhost:5173/dashboard"); 
    }

    } catch (err) {
      console.error("Error updating product type:", err);
    }
  };

  return (
   <form onSubmit={handleSubmit} className="p-3 border rounded">
  <h5>Edit Product Type</h5>

  <div className="mb-3">
    <label className="form-label">Id</label>
    <input
      type="text"
      name="id"
      value={formData.id}
      className="form-control"
      onChange={handleChange}

      required
      
    />
  </div>

  <div className="mb-3">
    <label className="form-label">Product Type Name</label>
    <input
      type="text"
      name="typename"
      value={formData.typename}
      onChange={handleChange}
      className="form-control"
      required
    />
  </div>

  <div className="mb-3">
    <label className="form-label">Description</label>
    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      className="form-control"
      rows={3}
    />
  </div>

  <button type="submit" className="btn btn-primary">
    Update
  </button>
</form>
  );
};

export default ProductTypeEditForm;
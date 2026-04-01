import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  type: string;
  short_description: string;
  price: string;
  image: string;
   created_at: string;
}

interface Variant {
  id: string;
  product_id: string;
  variant_name: string;
  long_description: string;
  price: number;
  size: string;
  color: string;
  fragrance: string;
  shape: string;
  weight: number;
  burn_time: number;
  stock: number;
  sku: number;
  images: string;
}

export default function ProductDetail() {
  const location = useLocation();
  const product: Product = location.state;

  const [variants, setVariants] = useState<Variant[]>([]);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editedVariant, setEditedVariant] = useState<Variant | null>(null);
  const [variantImageFiles, setVariantImageFiles] = useState<File[]>([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product>({ ...product });


  const [newVariant, setNewVariant] = useState({
    variant_name: "",
    long_description: "",
    price: 0,
    images: [] as string[],
    size: "",
    color: "",
    fragrance: "",
    shape: "",
    weight: 0,
    burn_time: 0,
    stock: 0,
    sku: 0
  });
  const [newVariantImages, setNewVariantImages] = useState<File[]>([]);

  /* FETCH VARIANTS */
  useEffect(() => {
    fetch("http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/get_verient.php")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((v: Variant) => v.product_id === product.id);
        setVariants(filtered);
      });
  }, [product.id]);
/* START EDIT */
  const startEdit = (variant: Variant) => {
    setEditingVariantId(variant.id);
    setEditedVariant({ ...variant });
  };

  /* SAVE VARIANT */
  const handleSaveVariant = async () => {
    if (!editedVariant) return;

    const formData = new FormData();

    // Convert numbers to strings for FormData
    Object.entries(editedVariant).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    variantImageFiles.forEach((file) => {
      formData.append("images[]", file);
    });

    const res = await fetch(
      "http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/update_variant.php",
      { method: "POST", body: formData }
    );
    const data = await res.json();

    if (data.success) {
      const existingImages = editedVariant.images ? JSON.parse(editedVariant.images) : [];
      const updatedImages = [...existingImages, ...(data.uploaded_images || [])];
      const updatedVariant = {
        ...editedVariant,
        images: JSON.stringify(updatedImages)
      };
      alert(data.message)
      setVariants((prev) =>
        prev.map((v) => (v.id === editedVariant.id ? updatedVariant : v))
      );
      setEditingVariantId(null);
      setVariantImageFiles([]);
    }
  };

  /* ADD VARIANT */
 const handleAddVariant = async () => {
  const formData = new FormData();
console.log(product.id)
  // Include product id
  formData.append("product_id", product.id);

  // Build the variant object
  const variantToSend = {
    variant_name: newVariant.variant_name,
    long_description: newVariant.long_description,
    price: newVariant.price,
    size: newVariant.size,
    color: newVariant.color,
    fragrance: newVariant.fragrance,
    shape: newVariant.shape,
    weight: newVariant.weight,
    burn_time: newVariant.burn_time,
    stock: newVariant.stock,
    sku: newVariant.sku,
    images: newVariantImages.map((file) => file.name), // Send filenames in JSON
  };

  // Append variants as JSON array
  formData.append("variants", JSON.stringify([variantToSend]));

  // Append actual image files separately
  newVariantImages.forEach((file) => {
    formData.append("variant_images_0[]", file); // 0 = index of variant
  });

  // Send to backend
  const res = await fetch(
    "http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/edit_add_varient.php",
    { method: "POST", body: formData }
  );

  const data = await res.json();

  if (data.success) {
    const addedVariant = {
      ...newVariant,
      id: data.variant_id,
      product_id: product.id,
      images: JSON.stringify(data.uploaded_images || [])
    };
    alert(data.message);
    setVariants([...variants, addedVariant as Variant]);
    setShowAddVariant(false);

    // Reset form
    setNewVariant({
      variant_name: "",
      long_description: "",
      price: 0,
      images: [],
      size: "",
      color: "",
      fragrance: "",
      shape: "",
      weight: 0,
      burn_time: 0,
      stock: 0,
      sku: 0
    });
    setNewVariantImages([]);
  }
};
  const handleSaveProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("id", editedProduct.id);
      formData.append("name", editedProduct.name);
      formData.append("type", editedProduct.type);
      formData.append("short_description", editedProduct.short_description);
      formData.append("price", editedProduct.price);

      if (productImageFile) formData.append("image", productImageFile);

      const res = await fetch(
        "http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/update_product.php",
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (data.success) {
        alert("Product updated successfully!");
        setIsEditingProduct(false);
      } else {
        alert("Failed to update product: " + data.message);
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };
  return (
    <div className="container mt-4">
      {/* PRODUCT INFO */}
      {/* Product Section */}
      <div className="card mb-3 p-2">
        <div className="d-flex align-items-start">
          <div className="me-3">
            {isEditingProduct ? (
              <input
                type="file"
                className="form-control mb-1"
                onChange={(e) => {
                  if (e.target.files) setProductImageFile(e.target.files[0]);
                }}
              />
            ) : (
              product.image && (
                <img
                  src={`http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/uploads/${product.image}`}
                  className="img-thumbnail"
                  style={{ width: 100, height: 200, objectFit: "cover" }}
                  alt={product.name}
                />
              )
            )}
          </div>
          <div className="flex-grow-1">
            {isEditingProduct ? (
              <>
                <input
                  type="text"
                  className="form-control mb-1"
                  value={editedProduct.name}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="form-control mb-1"
                  value={editedProduct.type}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, type: e.target.value })
                  }
                />
                <textarea
                  className="form-control mb-1"
                  value={editedProduct.short_description}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      short_description: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  className="form-control mb-1"
                  value={editedProduct.price}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, price: e.target.value })
                  }
                />
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={handleSaveProduct}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsEditingProduct(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h4>{product.name}</h4>
                <p>
                  <strong>Type:</strong> {product.type || "N/A"}
                </p>
                <p>
                  <strong>Description:</strong> {product.short_description || "N/A"}
                </p>
                 <p>
                  <strong>Description:</strong> {product.short_description || "N/A"}
                </p>
                 <p>
                  <strong>Description:</strong> {product.short_description || "N/A"}
                </p>
                <p>
                  <strong>Price:</strong> ${product.price || "0"}
                </p>
                <p className="text-muted">
                  <small>Created: {product.created_at || "N/A"}</small>
                </p>
                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={() => setIsEditingProduct(true)}
                >
                  Edit Product
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* ADD VARIANT BUTTON */}
      <button className="btn btn-success mb-3" onClick={() => setShowAddVariant(!showAddVariant)}>
        Add Variant
      </button>

      {/* ADD VARIANT FORM */}
      {showAddVariant && (
        <div className="border p-3 mb-3">
          <h5>Add Variant</h5>
          <input
            className="form-control mb-2"
            placeholder="Variant Name"
            value={newVariant.variant_name}
            onChange={(e) => setNewVariant({ ...newVariant, variant_name: e.target.value })}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={newVariant.long_description}
            onChange={(e) => setNewVariant({ ...newVariant, long_description: e.target.value })}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Price"
            value={newVariant.price}
            onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
          />
          <input
            className="form-control mb-2"
            placeholder="Size"
            value={newVariant.size}
            onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Color"
            value={newVariant.color}
            onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
          />
             <input
            className="form-control mb-2"
            placeholder="Fragrance"
            value={newVariant.fragrance}
            onChange={(e) => setNewVariant({ ...newVariant, fragrance: e.target.value })}
          />
             <input
            className="form-control mb-2"
            placeholder="Shape"
            value={newVariant.shape}
            onChange={(e) => setNewVariant({ ...newVariant, shape: e.target.value })}
          />
                  <input
            className="form-control mb-2"
            placeholder="weight"
            value={newVariant.weight}
            onChange={(e) => setNewVariant({ ...newVariant, weight: parseInt(e.target.value) })}
          />
                   <input
            className="form-control mb-2"
            placeholder="burn time"
            value={newVariant.burn_time}
            onChange={(e) => setNewVariant({ ...newVariant, burn_time: parseInt(e.target.value) })}
          />
          <input
            className="form-control mb-2"
            placeholder="SKU"
            value={newVariant.sku}
            onChange={(e) => setNewVariant({ ...newVariant, sku: parseInt(e.target.value) })}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Stock"
            value={newVariant.stock}
            onChange={(e) => setNewVariant({ ...newVariant, stock: Number(e.target.value) })}
          />
          <input
            type="file"
            multiple
            className="form-control mb-2"
            onChange={(e) => {
              if (e.target.files) setNewVariantImages(Array.from(e.target.files));
            }}
          />

        <h6>Images</h6>
{newVariantImages.map((file, imgIndex) => (
  <div key={imgIndex} className="d-flex align-items-center mb-2">
    <label className="w-100">
      Upload Image
      <input
        type="file"
        className="form-control mt-1"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const updatedImages = [...newVariantImages];
            updatedImages[imgIndex] = e.target.files[0]; // Replace the file
            setNewVariantImages(updatedImages);
          }
        }}
      />
    </label>
    <button
      type="button"
      className="btn btn-danger ms-2"
      onClick={() => {
        const updatedImages = newVariantImages.filter((_, idx) => idx !== imgIndex);
        setNewVariantImages(updatedImages);
      }}
    >
      Remove
    </button>
    {file && (
      <img
        src={URL.createObjectURL(file)}
        alt={`new-variant-img-${imgIndex}`}
        width={80}
        height={80}
        style={{ objectFit: "cover", marginLeft: "8px" }}
      />
    )}
  </div>
))}

<button
  type="button"
  className="btn btn-secondary "
  onClick={() => setNewVariantImages([...newVariantImages, new File([], "")])}
>
  Add Another Image
</button>

          <button className="btn m4-2 btn-primary " onClick={handleAddVariant}>
            Create Variant
          </button>
        </div>
        
      )}

      {/* VARIANT LIST */}
      {variants.map((variant) => {
        const isEditing = editingVariantId === variant.id;
        return (
          <div key={variant.id} className="border p-3 mb-3">
            {!isEditing ? (
              <>
                <h5>{variant.variant_name}</h5>
                <p>{variant.long_description}</p>
                <p>
                  <b>Price:</b> ${variant.price}
                </p>
                <p>
                  <b>Stock:</b> {variant.stock}
                </p>
                   <p>
                  <b>size:</b> {variant.size}
                </p>
                   <p>
                  <b>color:</b> {variant.color}
                </p>
                   <p>
                  <b>fragrance:</b> {variant.fragrance}
                </p>
                   <p>
                  <b>shape:</b> {variant.shape}
                </p>
                   <p>
                  <b>weight:</b> {variant.weight}
                </p>
                   <p>
                  <b>burn_time:</b> {variant.burn_time}
                </p>
                   <p>
                  <b>sku:</b> {variant.sku}
                </p>
 
                <div className="d-flex gap-2 flex-wrap">
                  {variant.images &&
                    JSON.parse(variant.images).map((img: string, i: number) => (
                      <img
                        key={i}
                        src={`http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/uploads/${img}`}
                        width="80"
                        height="80"
                        style={{ objectFit: "cover" }}
                      />
                    ))}
                </div>

                <button className="btn btn-primary btn-sm mt-2" onClick={() => startEdit(variant)}>
                  Edit
                </button>
              </>
            ) : editedVariant ? (
              <>
                  <input
      className="form-control mb-2"
      placeholder="Variant Name"
      value={editedVariant.variant_name}
      onChange={(e) =>
        setEditedVariant({ ...editedVariant, variant_name: e.target.value })
      }
    />

    <textarea
      className="form-control mb-2"
      placeholder="Description"
      value={editedVariant.long_description}
      onChange={(e) =>
        setEditedVariant({ ...editedVariant, long_description: e.target.value })
      }
    />

    <input
      type="number"
      className="form-control mb-2"
      placeholder="Price"
      value={editedVariant.price}
      onChange={(e) =>
        setEditedVariant({ ...editedVariant, price: Number(e.target.value) })
      }
    />

    <input
      className="form-control mb-2"
      placeholder="Size"
      value={editedVariant.size}
      onChange={(e) => setEditedVariant({ ...editedVariant, size: e.target.value })}
    />

    <input
      className="form-control mb-2"
      placeholder="Color"
      value={editedVariant.color}
      onChange={(e) => setEditedVariant({ ...editedVariant, color: e.target.value })}
    />

    <input
      className="form-control mb-2"
      placeholder="Fragrance"
      value={editedVariant.fragrance}
      onChange={(e) =>
        setEditedVariant({ ...editedVariant, fragrance: e.target.value })
      }
    />

    <input
      className="form-control mb-2"
      placeholder="Shape"
      value={editedVariant.shape}
      onChange={(e) => setEditedVariant({ ...editedVariant, shape: e.target.value })}
    />

    <input
      type="number"
      className="form-control mb-2"
      placeholder="Weight"
      value={editedVariant.weight}
      onChange={(e) =>
        setEditedVariant({ ...editedVariant, weight: Number(e.target.value) })
      }
    />

    <input
      type="number"
      className="form-control mb-2"
      placeholder="Burn Time"
      value={editedVariant.burn_time}
      onChange={(e) =>
        setEditedVariant({ ...editedVariant, burn_time: Number(e.target.value) })
      }
    />

    <input
      type="number"
      className="form-control mb-2"
      placeholder="Stock"
      value={editedVariant.stock}
      onChange={(e) =>
        setEditedVariant({ ...editedVariant, stock: Number(e.target.value) })
      }
    />

    <input
      className="form-control mb-2"
      placeholder="SKU"
      value={editedVariant.sku}
      onChange={(e) => setEditedVariant({ ...editedVariant, sku: parseInt(e.target.value) })}
    />

    {/* Upload images */}
    <input
      type="file"
      multiple
      className="form-control mb-2"
      onChange={(e) => {
        if (e.target.files) setVariantImageFiles(Array.from(e.target.files));
      }}
    />

    {/* Image previews */}
    <div className="d-flex gap-2 flex-wrap">
      {editedVariant.images &&
        JSON.parse(editedVariant.images).map((img: string, i: number) => (
          <img
            key={i}
            src={`http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/uploads/${img}`}
            width="80"
            height="80"
            style={{ objectFit: "cover" }}
          />
        ))}

      {variantImageFiles.map((file, i) => (
        <img
          key={i}
          src={URL.createObjectURL(file)}
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
        />
      ))}
    </div>


  
                <button className="btn btn-success btn-sm" onClick={handleSaveVariant}>
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm ms-2"
                  onClick={() => setEditingVariantId(null)}
                >
                  Cancel
                </button>
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
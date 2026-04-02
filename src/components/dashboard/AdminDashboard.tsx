import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ----- Types -----
interface Admin {
  id: number;
  full_name: string;
  email: string;
  role: string;
}
interface Merchant{
id:number;
full_name:string;
email:string;
phone:string;
national_id_number:string;
national_id_image:string;
  status: "pending" | "approved" | "rejected";
}
type CurrentUser = {
  id: number;
  role: "admin" | "super-admin" | "editor" | "merchant";
};
interface Variant {
  variant_name: string;
  long_description: string;
  price: number;
  size:string;
  color:string;
  fragrance:string,
shape:string,
weight:number,
burn_time:number,
stock:number,
sku:number,
  images: File[];
}

interface Product {
  name: string;
  type: string;
  short_description: string;
  price: number;
  image: File|null;
  variants: Variant[];
}
interface ProductType{
  id:number
  typename:string,
  description:string
}
interface ProductList {
  id: string;
  name: string;
  type: string;
  short_description: string;
  price: string;
  image: string;
  created_at: string;
}
interface DashboardProps {
  admin: Admin;
  onLogout: () => void;
}

// ----- Component -----
const AdminDashboard: React.FC<DashboardProps> = ({ admin, onLogout }) => {
  // Admins state
  const [admins, setAdmins] = useState<Admin[]>([]);
const [productLists, setProducts] = useState<ProductList[]>([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAddMerchant, setShowAddMrerchant] = useState(false);
  const [showEditMerchant, setShowEditMrerchant] = useState(false);
const [productTypeList, setProductTypeList] = useState<ProductType[]>([]);
const [merchants,setMerchants] = useState<Merchant[]>([]);
const [newMerchant,setNewMerchant] = useState({
full_name:"",
email:"",
password:"",
phone:"",
national_id_number:"",
national_id_image:null as File | null
});
  const [activeTabs, setActiveTabs] = useState<"product"|"type"|"">("");
  const [newAdmin, setNewAdmin] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "admin",
  });
const navigate = useNavigate();
  // Product state
  const [productType, setProductType] = useState<"type" | "details" | "">("");
  const [product, setProduct] = useState<Product>({
    name: "",
    type: "",
    short_description: "",
    price: 0,
    image: null,
    variants: [{
      variant_name: "", long_description: "", price: 0, images: [],
      size: "",
      color: "",
      fragrance: "",
      shape: "",
      weight: 0,
      burn_time: 0,
      stock: 0,
      sku: 0
    }],
  });

  // Active Tab
  // const [activeTab, setActiveTab] = useState<"admin" | "product" | "profile"|"">("admin");
  const [activeTab, setActiveTab] = useState<"admin" | "product" | "profile"|"merchant"|"">(() => {
  return (localStorage.getItem("activeTab") as "admin" | "product" | "profile") || "";
});
const  [productNameType,setProductNameType]=useState<ProductType>({
  id:0,
  typename:'',
  description:''
})
  // Admin from session
  const [adminData] = useState<Admin | null>(() => {
    const stored = sessionStorage.getItem("admin");
    return stored ? JSON.parse(stored) : null;
  });

  // ----- Fetch Admins -----
  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost/backend_php_hridaya/get_admins.php");
      const data = await res.json();
      if (data.success) setAdmins(data.admins);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    }
  };
const handleTabChange = (tab: "admin" | "product" | "profile"|"merchant") => {
  if(tab==='merchant'){
    setShowAddMrerchant(true);
  }
  setActiveTab(tab);
  localStorage.setItem("activeTab", tab);
};
useEffect(() => {
    console.log('adminData45444',adminData)

  const fetchAdminsAsync = async () => {
    try {
      const res = await fetch("http://localhost/backend_php_hridaya/hridaya-admin-backend/get_admins.php");
      const data = await res.json();
      if (data.success) setAdmins(data.admins); 
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

const fetchProductsAsync = async () => {
  try {
    const res = await fetch(
      "http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/get_product.php"
    );
    const data: ProductList[] = await res.json();
    console.log("Fetched data:", data); // ✅ this will log full array

    setProducts(data); // store array directly
  } catch (err) {
    console.error("Error fetching products:", err);
  }
};

const fetchProductsTypesAsync = async () => {
  try {
    const res = await fetch(
      "http://localhost/backend_php_hridaya/hridaya-admin-backend/get_create_product_type.php"
    );
    const response = await res.json();

    if (response.success) {
      setProductTypeList(response.data); 
      console.log("Fetched product types:", response.data);
    } else {
      console.error("Failed to fetch:", response);
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  }
};
  fetchAdminsAsync();
  fetchProductsAsync();
  fetchProductsTypesAsync();
      fetchMerchants();

}, []);
  // ----- Admin CRUD -----
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/backend_php_hridaya/hridaya-admin-backend/register_admin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });
    alert()

      const data = await res.json();
      alert(data.message);
      if (data.success) {
        setShowAddAdmin(false);
        setNewAdmin({ full_name: "", email: "", password: "", role: "admin" });
        fetchAdmins();
      }
    } catch (err) {
      // console.error(err);
    }
  };

const handleAddMerchant = async (e: React.FormEvent) => {

  e.preventDefault()

  const formData = new FormData()

  formData.append("full_name", newMerchant.full_name)
  formData.append("email", newMerchant.email)
  formData.append("password", newMerchant.password)
  formData.append("phone", newMerchant.phone)
  formData.append("national_id_number", newMerchant.national_id_number)

  if (newMerchant.national_id_image) {
    formData.append("national_id_image", newMerchant.national_id_image)
  }

  try {

    const res = await fetch(
      "http://localhost/backend_php_hridaya/merchant-backend/create_merchant.php",
      {
        method: "POST",
        body: formData
      }
    )

    const data = await res.json()

    alert(data.message)

    if (data.success) {
      setShowAddMrerchant(false)

      setNewMerchant({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        national_id_number: "",
        national_id_image: null
      })

      fetchMerchants()
    }

  } catch (err) {
    console.error(err)
  }

}

  const productTypeEdit = (data:ProductType)=>{
  navigate("/Edit_profileDetail", { state: data });
  }
const productEdit = (data:ProductList)=>{


     navigate("/profileDetail", { state: data });
  console.log(data,'654654654654654')
  //   const productverientList = async () => {    try {
  //   const res = await fetch(
  //     "http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/get_verient.php"
  //   );
  //   const data: ProductList[] = await res.json();
  //   console.log("Fetched data4444:", data); 

  //    // store array directly
  // } catch (err) {
  //   console.error("Error fetching products:", err);
  // }}
  // productverientList();
setActiveTab('')

}
const fetchMerchants = async () => {
  try {
    const res = await fetch(
      "http://localhost/backend_php_hridaya/merchant-backend/get_merchants.php"
    )

    const data = await res.json()

    if (data.success) {
      setMerchants(data.merchants)
    }

  } catch (err) {
    console.error(err)
  }
}
const productDelete= async (id:string)=>{
   try {
      const res = await fetch("http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/delete_product.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) fetchAdmins();
    } catch (err) {
      console.error(err);
    }
}
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch("http://localhost/backend_php_hridaya/hridaya-admin-backend/delete_admin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) fetchAdmins();
      setActiveTab('')
    } catch (err) {
      console.error(err);
    }
  };

 const productTypeDelete = async (id:number)=>{
try{
const res= await fetch("http://localhost/backend_php_hridaya/hridaya-admin-backend/delete_product_type.php",{
   method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
})
  const data = await res.json();
      alert(data.message);
      setActiveTab('')

}catch{

}
}
const product_type_handel = async (e: { preventDefault: () => void; }) => {
  e.preventDefault(); // prevent form refresh

  try {
    const res = await fetch(
      "http://localhost/backend_php_hridaya/hridaya-admin-backend/create_product_type.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          typename: productNameType.typename,
          description: productNameType.description,
        }),
      }
    );

    const data = await res.json();
    alert(data.message);
    setActiveTab('')
  } catch (err) {
    console.log(err);
  }
};

  // ----- Product Handlers -----
  const productControl = (data: "type" | "details") => {
    setProductType(prev => (prev === data ? "" : data));
  };

  const handleVariantChange = <K extends keyof Variant>(
    index: number,
    field: K,
    value: Variant[K]
  ) => {
    const newVariants = [...product.variants];
    newVariants[index][field] = value;
    setProduct({ ...product, variants: newVariants });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [...product.variants, {
        variant_name: "", long_description: "", price: 0, images: [],
        size: "",
        color: "",
        fragrance: "",
        shape: "",
        weight: 0,
        burn_time: 0,
        stock: 0,
        sku: 0
      }],
    });
  };

  const removeVariant = (index: number) => {
    const newVariants = product.variants.filter((_, i) => i !== index);
    setProduct({ ...product, variants: newVariants });
  };

  // const handleSubmitAddProduct = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch("http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/add_product_with_variants.php", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(product),
  //     });
  //     const data = await res.json();
  //     alert(data.message);
  //     if (data.success) {
  //       setProduct({
  //         name: "",
  //         type: "",
  //         short_description: "",
  //         price: 0,
  //         image: "",
  //         variants: [{ variant_name: "", long_description: "", price: 0, images: [""] }],
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error adding product");
  //   }
  // };
const handleSubmitAddProduct = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();

  // Text fields
  formData.append("name", product.name);
  formData.append("type", product.type);
  formData.append("short_description", product.short_description);
  formData.append("price", product.price.toString());

  // Main image
  if (product.image) {
    formData.append("image", product.image);
  }

  // Variants
  formData.append("variants", JSON.stringify(product.variants));

  // Variant images
  product.variants.forEach((variant, index) => {
    variant.images.forEach(file => {
      formData.append(`variant_images_${index}[]`, file);
    });
  });

  const res = await fetch(
    "http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/add_product_with_variants.php",
    {
      method: "POST",
      body: formData, // do NOT set Content-Type!
    }
  );

  const data = await res.json();
  alert(data.message);
  setActiveTab('');
};

const handleDeleteMerchant = async (id:number) => {

if(!confirm("Delete this merchant?")) return;

try{

const res = await fetch(
"http://localhost/backend_php_hridaya/merchant-backend/delete_merchant.php",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({id})
}
);

const data = await res.json();

if(data.success){
alert("Merchant deleted");
fetchMerchants();
}

}catch(err){
console.log(err);
}

};
const editMerchantStatus = (id:number)=>{
  setShowEditMrerchant(true);
}

const closeEditMerchantForm=()=>{
  setShowEditMrerchant(false);
}



// Function to handle merchant status change
const editMerchantStatusChange = (newStatus: string, merchantId: number) => {
  console.log(`Merchant ID ${merchantId} status changed to: ${newStatus}`);

if(newStatus){
    // Example: send update to backend
  fetch("http://localhost/backend_php_hridaya/merchant-backend/update_merchant_status.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: merchantId, status: newStatus }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Status updated successfully");
        fetchMerchants(); // refresh table
      } else {
        alert(data.message);
      }
    })
    .catch((err) => {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    });
}
};
const handleCancelMerchant=()=>{
  setShowAddMrerchant(false);
}
  // ----- Render -----
  return (
    <div className=" min-vh-100 bg-light">
{adminData?.role=='admin' ||adminData?.role=='super-admin' &&(

<>
  <div >
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4 rounded">
          <div className="container-fluid">
            <span className="navbar-brand">Admin Dashboard</span>
            <div className="d-flex">
              <button className={`btn btn-${activeTab === "admin" ? "dark" : "primary"} me-2`} onClick={() => handleTabChange("admin")}>Admins</button>
              <button className={`btn btn-${activeTab === "merchant" ? "dark" : "primary"} me-2`} onClick={() => handleTabChange("merchant")}>Merchant</button>
              <button className={`btn btn-${activeTab === "product" ? "dark" : "primary"} me-2`} onClick={() => handleTabChange("product")}>Products</button>
              <button className={`btn btn-${activeTab === "profile" ? "dark" : "primary"} me-2`} onClick={() => handleTabChange("profile")}>Profile</button>
              <button className="btn btn-danger" onClick={onLogout}>Logout</button>
            </div>
          </div>
        </nav>

        {/* Admin Info */}
        {adminData && (
          <div className="border border-white p-3 mb-4 rounded bg-white shadow-sm text-center">
            <p className="fw-bold mb-1">Admin Name: {adminData.full_name}</p>
            <p className="mb-0">Role: {adminData.role}</p>
          </div>
        )}

        {/* Admin Tab */}
        {activeTab === "admin" && adminData?.role === "super-admin" && (
          <>
            <div className="mb-3 text-center">
              <button className="btn btn-success" onClick={() => setShowAddAdmin(!showAddAdmin)}>
                {showAddAdmin ? "Cancel" : "Add Admin"}
              </button>
            </div>

            {showAddAdmin && (
              <form onSubmit={handleAddAdmin} className="bg-white p-3 rounded shadow mb-4">
                <input className="form-control mb-2" placeholder="Full Name" value={newAdmin.full_name} onChange={e => setNewAdmin({ ...newAdmin, full_name: e.target.value })} required />
                <input className="form-control mb-2" placeholder="Email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                <input className="form-control mb-2" placeholder="Password" type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
                <select className="form-select mb-2" value={newAdmin.role} onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })}>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
               
                </select>
                <div className="text-center">
                  <button className="btn btn-primary">Add Admin</button>
                </div>
              </form>
            )}

            {/* Admin List */}
            <div className="table-responsive bg-white rounded shadow">
              <h5 className="text-center mt-4">Admin List</h5>
              <table className="table table-bordered mb-0 text-center">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(a => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.full_name}</td>
                      <td>{a.email}</td>
                      <td>{a.role}</td>
                      <td>
                        {a.id !== admin.id && (
                          <div>
                            <button className="btn btn-danger btn-sm m-1" onClick={() => handleDelete(a.id)}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
          {/* Merchant Tab */}
        {activeTab === "merchant" && adminData?.role === "super-admin" && (
          <>
            <div className="mb-3 text-center">
              <button className="btn btn-success" onClick={() => setShowAddMrerchant(!showAddAdmin)}>
                {showAddMerchant ? "Cancel" : "Add Merchant"}
              </button>
            </div>

{showAddMerchant&&(
  <>
          <form onSubmit={handleAddMerchant} className="bg-white p-3 rounded shadow">

<input
className="form-control mb-2"
placeholder="Full Name"
value={newMerchant.full_name}
onChange={(e)=>setNewMerchant({...newMerchant,full_name:e.target.value})}
/>

<input
className="form-control mb-2"
placeholder="Email"
value={newMerchant.email}
onChange={(e)=>setNewMerchant({...newMerchant,email:e.target.value})}
/>

<input
type="password"
className="form-control mb-2"
placeholder="Password"
value={newMerchant.password}
onChange={(e)=>setNewMerchant({...newMerchant,password:e.target.value})}
/>

<input
className="form-control mb-2"
placeholder="Phone"
value={newMerchant.phone}
onChange={(e)=>setNewMerchant({...newMerchant,phone:e.target.value})}
/>

<input
className="form-control mb-2"
placeholder="National ID Number"
value={newMerchant.national_id_number}
onChange={(e)=>setNewMerchant({...newMerchant,national_id_number:e.target.value})}
/>

<input
type="file"
className="form-control mb-2"
onChange={(e)=>{
if(e.target.files){
setNewMerchant({...newMerchant,national_id_image:e.target.files[0]})
}
}}
/>

<button onClick={handleAddMerchant} className="btn  btn-primary m-1">Add Merchant</button>
<button onClick={handleCancelMerchant} className="btn  btn-primary m-1">Cancle</button>

</form>
  </>
)}
            {/* Merchant List */}
            {!showEditMerchant&&(
 <div className="table-responsive bg-white rounded shadow">
              <h5 className="text-center mt-4">Merchant List</h5>
  <table className="table table-bordered text-center">

<thead>
<tr>
<th>ID</th>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>National ID</th>
<th>ID Image</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{merchants.map((m) => (
<tr key={m.id}>

<td>{m.id}</td>
<td>{m.full_name}</td>
<td>{m.email}</td>
<td>{m.phone}</td>
<td>{m.national_id_number}</td>

<td>
<img
src={`http://localhost/backend_php_hridaya/merchant-backend/uploads/${m.national_id_image}`}
width="80"
/>
</td>

<td>

<button onClick={()=>editMerchantStatus(m.id)}
className="btn btn-warning btn-sm me-2"

>
Edit
</button>

<button
className="btn btn-danger btn-sm"
onClick={() => handleDeleteMerchant(m.id)}
>
Delete
</button>

</td>

</tr>
))}

</tbody>
</table>
            </div>
            )}
           {showEditMerchant &&(
<>
<div className="mt-5">
      <h5 className="text-center mt-4">Edit Merchant List</h5>
  <table className="table table-hover align-middle text-center shadow-sm rounded">
  <thead className="table-dark">
    <tr>
      <th>ID</th>
      <th>Full Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>National ID</th>
      <th>ID Image</th>
      <th>Status / Actions</th>
      <th
  

>

<button onClick={closeEditMerchantForm} className="btn  btn-danger m-1 bg-red-500 hover:bg-red-700 text-white font-bold px-4 py-2 cursor-pointer">Close</button>

</th>
    </tr>
  </thead>
  <tbody>
    {merchants.map((m) => (
      <tr key={m.id}>
        <td className="fw-bold">{m.id}</td>
        <td>{m.full_name}</td>
        <td>{m.email}</td>
        <td>{m.phone}</td>
        <td>{m.national_id_number}</td>
        <td>
          <img
            src={`http://localhost/backend_php_hridaya/merchant-backend/uploads/${m.national_id_image}`}
            width="60"
            height="60"
            className="rounded-circle border shadow-sm"
            alt="National ID"
          />
        </td>
        <td>
          {showEditMerchant && ["admin", "super-admin"].includes(adminData?.role || "") ? (
            <select
              className={`form-select form-select-sm mb-2 ${
                m.status === "approved"
                  ? "bg-success text-white"
                  : m.status === "rejected"
                  ? "bg-danger text-white"
                  : "bg-warning text-dark"
              }`}
              value={m.status} // default to "pending"
   onChange={(e) => editMerchantStatusChange(e.target.value, m.id)}
            >
              {/* <option value="pending">Pending</option> */}
              <option value='' >Select status</option>
              <option value="approved" >Approved</option>
              <option value="rejected" >Rejected</option>
            </select>
          ) : (
            <span
              className={`badge ${
                m.status === "approved"
                  ? "bg-success"
                  : m.status === "rejected"
                  ? "bg-danger"
                  : "bg-warning text-dark"
              }`}
            >
              {(m.status || "pending").toUpperCase()}
            </span>
          )}

          {/* <button
            className="btn btn-outline-danger btn-sm ms-2"
            onClick={() => handleDeleteMerchant(m.id)}
            title="Delete Merchant"
          >
            Remove
          </button> */}
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
</>
           )}
          </>
        )} 

        {/* Product Tab */}
        {activeTab === "product" && (
          <div className="bg-white p-3 rounded shadow text-center">
            <h5>Products Section</h5>

            {/* Product Type / Details Buttons */}
            <div className="mb-2">
              <button className={`btn mb-2 m-1 ${productType === "type" ? "btn-success" : "btn-outline-success"}`} onClick={() => productControl("type")}>Add Product Type</button>
              <button className={`btn mb-2 m-1 ${productType === "details" ? "btn-success" : "btn-outline-success"}`} onClick={() => productControl("details")}>Add Product</button>
            </div>

            {/* Add Product Type */}
            {productType === "type" && (

              <form onSubmit={product_type_handel}>
  <input
    className="form-control mb-2"
    value={productNameType.typename}
    onChange={(e) =>
      setProductNameType({
        ...productNameType,
        typename: e.target.value,
      })
    }
    placeholder="Product Type Name"
  />

  <input
    className="form-control mb-2"
    value={productNameType.description}
    onChange={(e) =>
      setProductNameType({
        ...productNameType,
        description: e.target.value,
      })
    }
    placeholder="Description"
  />

  <button className="btn btn-primary">Add Product Type</button>
</form>
           
              
            )}

            {/* Add Product Details */}
            {productType === "details" && (
               <form onSubmit={handleSubmitAddProduct} className="bg-light p-4 rounded shadow">
      <div className="mb-2">
        <label>Product Name</label>
        <input
          className="form-control"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
        />
      </div>

      <div className="mb-2">
        <label>Product Type</label>
        <select
          className="form-control"
          value={product.type}
          onChange={(e) =>
            setProduct({ ...product, type: e.target.value as Product["type"] })
          }
          required
        >
          <option value="">Select Product Type</option>
          <option value="soy">Soy</option>
          <option value="paraffin">Paraffin</option>
          <option value="eatable">Eatable</option>
          <option value="gel">Gel</option>
          <option value="special">Special</option>
        </select>
      </div>

      <div className="mb-2">
        <label>Short Description</label>
        <textarea
          className="form-control"
          placeholder="Short Description"
          value={product.short_description}
          onChange={(e) =>
            setProduct({ ...product, short_description: e.target.value })
          }
          required
        />
      </div>

      <div className="mb-2">
        <label>Price</label>
        <input
          className="form-control"
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: parseInt(e.target.value) })
          }
          required
        />
      </div>

      <div className="mb-2">
        <label>Product Image</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setProduct({ ...product, image: e.target.files[0] });
            }
          }}
        />
      </div>

      <hr />
      <h5>Product Variants</h5>
      {product.variants.map((v, i) => (
        <div key={i} className="border p-3 mb-3 rounded bg-white">
          <div className="mb-2">
            <label>Variant Name</label>
            <input
              className="form-control"
              placeholder="Variant Name"
              value={v.variant_name}
              onChange={(e) =>
                handleVariantChange(i, "variant_name", e.target.value)
              }
              required
            />
          </div>

          <div className="mb-2">
            <label>Long Description</label>
            <textarea
              className="form-control"
              placeholder="Long Description"
              value={v.long_description}
              onChange={(e) =>
                handleVariantChange(i, "long_description", e.target.value)
              }
              required
            />
          </div>

          <div className="mb-2">
            <label>Price</label>
            <input
              className="form-control"
              type="number"
              placeholder="Price"
              value={v.price}
              onChange={(e) =>
                handleVariantChange(i, "price", parseInt(e.target.value))
              }
              required
            />
          </div>

          <div className="mb-2">
            <label>Size</label>
            <input
              className="form-control"
              placeholder="Size"
              value={v.size}
              onChange={(e) => handleVariantChange(i, "size", e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label>Color</label>
            <input
              className="form-control"
              placeholder="Color"
              value={v.color}
              onChange={(e) => handleVariantChange(i, "color", e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label>Fragrance</label>
            <input
              className="form-control"
              placeholder="Fragrance"
              value={v.fragrance}
              onChange={(e) =>
                handleVariantChange(i, "fragrance", e.target.value)
              }
              required
            />
          </div>

          <div className="mb-2">
            <label>Shape</label>
            <input
              className="form-control"
              placeholder="Shape"
              value={v.shape}
              onChange={(e) => handleVariantChange(i, "shape", e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label>Weight (grams)</label>
            <input
              className="form-control"
              type="number"
              placeholder="Weight"
              value={v.weight}
              onChange={(e) =>
                handleVariantChange(i, "weight", parseInt(e.target.value))
              }
              required
            />
          </div>

          <div className="mb-2">
            <label>Burn Time (hours)</label>
            <input
              className="form-control"
              type="number"
              placeholder="Burn Time"
              value={v.burn_time}
              onChange={(e) =>
                handleVariantChange(i, "burn_time", parseInt(e.target.value))
              }
              required
            />
          </div>

          <div className="mb-2">
            <label>Stock</label>
            <input
              className="form-control"
              type="number"
              placeholder="Stock"
              value={v.stock}
              onChange={(e) =>
                handleVariantChange(i, "stock", parseInt(e.target.value))
              }
              required
            />
          </div>

          <div className="mb-2">
            <label>SKU</label>
            <input
              className="form-control"
              placeholder="SKU"
              value={v.sku}
              onChange={(e) => handleVariantChange(i, "sku", parseInt(e.target.value))}
              required
            />
          </div>

          <h6>Images</h6>
          {v.images.map((img, imgIndex) => (
            <div key={imgIndex} className="d-flex align-items-center mb-2">
              <label className="w-100">
                Upload Image
                <input
                  type="file"
                  className="form-control mt-1"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const newImages = [...v.images];
                      newImages[imgIndex] = e.target.files[0];
                      handleVariantChange(i, "images", newImages);
                    }
                  }}
                />
              </label>
              <button
                type="button"
                className="btn btn-danger ms-2"
                onClick={() => {
                  const newImages = v.images.filter((_, idx) => idx !== imgIndex);
                  handleVariantChange(i, "images", newImages);
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary mb-2"
            onClick={() =>
              handleVariantChange(i, "images", [...v.images, new File([], "")])
            }
          >
            Add Another Image
          </button>

          {product.variants.length > 1 && (
            <button
              type="button"
              className="btn btn-danger mb-2"
              onClick={() => removeVariant(i)}
            >
              Remove Variant
            </button>
          )}

          <div className="d-flex flex-wrap mb-2">
            {v.images.map((img, idx) =>
              img ? (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  alt={`variant-${i}-img-${idx}`}
                  className="me-2 mb-2"
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
              ) : null
            )}
          </div>
        </div>
      ))}

      <button type="button" className="btn btn-secondary mb-2" onClick={addVariant}>
        Add Another Variant
      </button>

      <div className="text-center">
        <button type="submit" className="btn btn-primary">
          Save Product
        </button>
      </div>
    </form>
            )}

<div className="mt-5">

<div className="mb-3 me-2 justify-content-center d-flex bg-body-secondary p-3">
<div className="m-2">
    <strong
    className={`${activeTabs === "type" ? "text-primary" : "text-secondary"}`}
    style={{ cursor: "pointer" }}
    onClick={() => setActiveTabs("type")}
  >
    Product Type list
  </strong>
</div>
<div className="m-2">
  <strong
    className={`me-3 ${activeTabs === "product" ? "text-primary" : "text-secondary"}`}
    style={{ cursor: "pointer" }}
    onClick={() => setActiveTabs("product")}
  >
    Product list
  </strong>
</div>



</div>
{activeTabs === "product" && (
  <div>
     <table className="table table-bordered text-center m-1">

        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {productLists.length > 0 ? (
            productLists.map((p) => (
              <tr key={p.id} >
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.type || "-"}</td>
                <td>{p.short_description}</td>
                <td>{p.price}</td>
                <td>
                  {p.image ? (
                    <img
                      src={`http://localhost/backend_php_hridaya/hridaya-admin-backend/product-backend/uploads/${p.image}`}
                      alt={p.name}
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>{p.created_at}</td>
            <td>
                  <button className="m-1" onClick={()=>productEdit(p)}>edit</button>
                <button className="m-1" onClick={()=>productDelete(p.id)}>Delete</button>
            </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No products available</td>
            </tr>
          )}
        </tbody>
      </table>
  </div>
)}
{activeTabs === "type" && (
  <div>
    <table className="table table-bordered text-center m-1">
       <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Product Name Type</th>
            <th>Description</th>
            <th>Action</th>
            
          </tr>
        </thead>
            <tbody>
          {productTypeList.length > 0 ? (
            productTypeList.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.typename}</td>
                <td>{p.description || "-"}</td>
           <td>     <button className="m-1" onClick={()=>productTypeEdit(p)}>edit</button>
                <button className="m-1" onClick={()=>productTypeDelete(p.id)}>Delete</button></td>
           
          
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No products available</td>
            </tr>
          )}
        </tbody>
    </table>
  </div>
)}
  
</div>

          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white p-3 rounded shadow text-center">
            <p><strong>Full Name:</strong> {admin.full_name}</p>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Role:</strong> {admin.role}</p>
          </div>
        )}
      </div>
</>
)}
{adminData?.role=='merchant'&&(
  <>
  <div>
    <h1>
      merchant welcome
    </h1>
  </div>
  </>
)}
    
    </div>
  );
};

export default AdminDashboard;
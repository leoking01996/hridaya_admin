import React, { useEffect, useState } from "react";

interface Merchant {
  id: number;
  full_name: string;
  email: string;
  role: string;
}
interface transactionHistory{
  color:string;
created_at:string;
fragrance:string;
id:number;
name:string;
payment_method:string;
price:number;
product_id:number;
qty:number;
size:number;
status:string;
total_price:number;
user_id:number;
}
interface Transaction {
  id: string;
  status: "pending" | "delivered" | "cancelled";

}
const MerchantDashboard: React.FC = () => {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
const [paymentHistory,setPaymentHistory]=useState<transactionHistory[]>([]);
  useEffect(() => {
    // Get merchant info from sessionStorage
    const stored = sessionStorage.getItem("merchant");
    if (stored) {
        console.log('44654',stored);
      setMerchant(JSON.parse(stored));
    } else {
      // If not logged in, redirect to login
      window.location.href = "/login";
    }
transaction_history();

  }, []);
  const [status, setStatus] = useState<Transaction["status"]>();


const transaction_history =async ()=>{
               const req = await fetch('http://localhost/backend_php_hridaya/transaction_history.php');
                const data = await req.json(); 
                const transaction_list =  data.data;
               console.log(data.data,"asdasdsadsad")
      setPaymentHistory(transaction_list);

}
  const handleLogout = () => {
    sessionStorage.removeItem("merchant");
    window.location.href = "/login";
  };

  const handleChange =async (id:number,data:string,user_id:number,) => {
 console.log(id,data,'id and data');
 console.log(merchant?.id,'merchant')
 console.log(user_id,'user_id')
try{
const res = await fetch('http://localhost/backend_php_hridaya/merchant-backend/update_merchant_status.php',{
method:'POST',
      headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
          id: id,
          user_id:user_id,
merchant_id:merchant?.id,
          status: data,
        }),
})

const datas = await res.json();
console.log(datas,'445544');
alert(datas.message)
transaction_history();
}catch{

}


  };
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
      <div className="bg-white shadow rounded p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Merchant Dashboard</h2>

        {merchant && (
          <div>
            <p><strong>Name:</strong> {merchant.full_name}</p>
            <p><strong>Email:</strong> {merchant.email}</p>
            <p><strong>Role:</strong> {merchant.role}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
       <div className="p-4 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Product</th>
              <th className="py-2 px-4 border">Qty</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Size</th>
              <th className="py-2 px-4 border">Color</th>
              <th className="py-2 px-4 border">Fragrance</th>
              <th className="py-2 px-4 border">Payment</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Action</th>

            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((txn) => (
              <tr key={txn.id} className="text-center border-t">
                <td className="py-2 px-4 border">{txn.id}</td>
                <td className="py-2 px-4 border">{txn.name}</td>
                <td className="py-2 px-4 border">{txn.qty}</td>
                <td className="py-2 px-4 border">{txn.price}</td>
                <td className="py-2 px-4 border">{txn.total_price}</td>
                <td className="py-2 px-4 border">{txn.size || "-"}</td>
                <td className="py-2 px-4 border">{txn.color || "-"}</td>
                <td className="py-2 px-4 border">{txn.fragrance || "-"}</td>
                <td className="py-2 px-4 border">{txn.payment_method}</td>
                <td className="py-2 px-4 border">{txn.created_at}</td>
<td className="py-2 px-4 border">
      
     <select
  value={txn.status || "pending"}
  onChange={(e) =>
    handleChange(
      txn.id,
      e.target.value as Transaction["status"],
      txn.user_id
    )
  }
  className="border px-2 py-1 rounded"
>
  <option value="pending">Pending</option>
  <option value="delivered">Delivered</option>
  <option value="cancelled">Cancelled</option>
</select>
    
      </td>
                <td >  <button className="btn  m-1 border-1  border-black">view</button></td>

              </tr>
            ))}
            {paymentHistory.length === 0 && (
              <tr>
                <td colSpan={11} className="py-4">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default MerchantDashboard;
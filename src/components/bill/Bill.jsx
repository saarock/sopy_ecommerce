import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Bill.css";
import {
  deleteAllFromCart,
  deleteFromCart,
} from "../../features/product/productSlice";
import productService from "../../services/productService";
import { toast } from "react-toastify";
import protectedApi from "../../instance/axiosProtectedInstance";

const Bill = ({ handelRefresh }) => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const handleDelete = (productId) => {
    dispatch(deleteFromCart({ productId }));
  };

  // Calculate total price
  const totalPrice = products
    ?.reduce((sum, product) => sum + (product.totalPrice || 0), 0)
    .toFixed(2);

  // const proceedToCheckOut = async () => {

  //   console.log(products)

  //   try {
  //     const data = await productService.buyProducts(products);
  //     handelRefresh();
  //     dispatch(deleteAllFromCart());
  //     toast.success(data.message);

  //     console.log(data);
  //   } catch(error) {
  //     toast.error(error.message)
  //   }
  // }

  const proceedToCheckOut = async () => {
    try {
      const total_amount = products
        .reduce((sum, p) => sum + (p.totalPrice || 0), 0)
        .toFixed(2);

      const res = await protectedApi.post("/create-esewa-payment", {
        total_amount,
      });

      console.log(res.data);

      // return;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"; 

      Object.keys(res.data).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = res.data[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };


    const proceedToCheckOutWithCash = async () => {
    
    console.log(products)

    try {
      const data = await productService.buyProducts(products);
      handelRefresh();
      dispatch(deleteAllFromCart());
      toast.success(data.message);

      console.log(data);
    } catch(error) {
      toast.error(error.message)
    }
  }




  return (
    <>
      {products?.length > 0 ? (
        <div className="bill-container">
          <h2 className="bill-title">Your Bill</h2>
          <div className="product-list-container">
            {products?.length === 0 ? (
              <p className="empty-message">No products in the bill</p>
            ) : (
              <div className="product-list">
                {products?.map((product) => (
                  <div key={product.productId} className="product-card">
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="product-image"
                    />
                    <div className="product-details">
                      <h3 className="product-name">{product.productName}</h3>
                      <p className="product-info">
                        <strong>Items:</strong> {product.totalItem}
                      </p>
                      <p className="product-info">
                        <strong>Price:</strong> RS:{" "}
                        {product.totalPrice?.toFixed(2)}
                      </p>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(product.productId)}
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {products?.length > 0 && (
            <div className="bill-summary">
              <p className="total-price">
                <strong>Total:</strong> RS: {totalPrice}
              </p>
             <div className="flex flex-col gap-2">
               <button
                className="border border-green-700 hover:text-green-700 p-2 rounded-2xl cursor-pointer flex justify-center items-center"
                onClick={proceedToCheckOut}
              >
                ✓ Proceed to Checkout via eSewa
                <img
                  src="https://p7.hiclipart.com/preview/261/608/1001/esewa-zone-office-bayalbas-google-play-iphone-iphone.jpg"
                  alt="esewa"
                  width={30}
                  height={30}
                />
              </button>
               <button
                className="border border-green-700 hover:text-green-700 p-2 rounded-2xl cursor-pointer flex justify-center items-center"
                onClick={proceedToCheckOutWithCash}
              >
                ✓ Proceed to Checkout as Cash
              </button>
             </div>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Bill;

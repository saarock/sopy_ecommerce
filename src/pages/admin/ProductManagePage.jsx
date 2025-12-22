// ProductManagePage.jsx
import React, { useState } from 'react';

import "./AdminPages.css";

import ProductManageNav from '../../components/adminDashComponents/productManageNav';
import ShowAndManageProductComponent from '../../components/adminDashComponents/ShowAndManageProductComponent';

const ProductManagePage = () => {
  const [userWant, setWhatUserWant] = useState("2");


  return (
    <>
      <div className='manage-container'>
      <ProductManageNav setWhatUserWant={setWhatUserWant} userWant={userWant} />
        <ShowAndManageProductComponent adminWant={userWant} />
      </div>
    </>

  )
};

export default ProductManagePage;


// show disabled products
// make product disabled or unable 

// manage user like restricate user;


// after this things move to the user level dashboard
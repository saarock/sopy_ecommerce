import React, { useState } from 'react'
import "./Product.css";

import ShowAndManageProductComponent from '../../components/adminDashComponents/ShowAndManageProductComponent';
import Bill from '../../components/bill/Bill';


const Products = () => {

  const [refresh, setRefresh] = useState(false);

  const handelRefresh = () => {
    setRefresh(!refresh);
  }
  return (
    <div className='product'>
      <ShowAndManageProductComponent refresh={refresh} />
      <div className='add-to-card-container'>
        <Bill handelRefresh={handelRefresh} />

      </div>
    </div>
  )
}

export default Products
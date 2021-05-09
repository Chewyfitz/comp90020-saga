import React, { Component } from "react";

export default function PopUp(props) {
  
  console.log(props.rows);
  const handleClick = () => {
    props.toggle();
  };
  
  
  return (
   <div className="modal">
     <div className="modal_content">
     <span className="close" onClick={handleClick}>&times;    </span>
     
     <form>
     <div >
  <label>
    First Name:
    <input type="text" name="first" />
  </label>
  <label>
    Last Name:
    <input type="text" name="last" />
  </label>
  

  </div>
  <div >
  <label>
    Card Number:
    <input type="text" name="card" />
  </label>
  <label>
    Address:
    <input type="text" name="address" />
  </label>
  </div>
  <div >
    <button>Book</button>
  </div>
    </form>
     </div>
    </div>
   
  );
 }

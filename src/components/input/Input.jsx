import React from 'react';
import "./input.css";

const Input = ({ type, name, className, placeholder, required, value, onChange }) => {
  return (
    <input
      type={type}
      name={name}
      className={`${className} input-field`}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;

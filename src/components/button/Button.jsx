import React from 'react';
import "./button.css";


const Button = ({
    className,
    text,
    onClick,
    ...props
}) => {
  return (
    <button onClick={onClick} {...props} className={`${className} button`}>{text}</button>
  )
};




export default Button;
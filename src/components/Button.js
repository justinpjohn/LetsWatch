import React from 'react'

const Button = (props) => {
    return (
        <button className='main-button' style={{backgroundColor: props.bgColor, color: props.txtColor}}> {props.text} </button>        
    );
}

export default Button;
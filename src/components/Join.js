import React from 'react';

const Join = () => {
    return (
        <div className='container d-flex h-100'>
            <div className='row justify-content-center align-self-center flex-column w-100 h-75'>
                <div className='row justify-content-center mb-5' style={{fontSize: '5.5em'}}> 
                    <span style={{color: 'white'}}>Lets</span>
                    <span style={{color: '#E53A3A'}}>Watch</span>
                </div>
                <div className='row justify-content-center mt-3'>
                    <button className='main-button' style={{backgroundColor: '#E53A3A', borderColor: '#E53A3A', color: 'white'}}> CREATE GROUP </button>
                </div>
                <div className='row justify-content-center mt-4'>
                    <button className='main-button' style={{backgroundColor: 'white', borderColor: 'white',}}> JOIN GROUP </button>
                </div>
            </div>
        </div>
    );
}

export default Join;
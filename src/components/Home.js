import React, { useState } from 'react';

import Modal from './Modal'

const Home = () => {
    
    return (
        <div className='container d-flex h-100'>
            <div className='row justify-content-center align-self-center flex-column w-100 h-75'>
                <div className='row justify-content-center mb-5' style={{fontSize: '5.5em'}}> 
                    <span style={{color: 'white'}}>Lets</span>
                    <span style={{color: '#E53A3A'}}>Watch</span>
                </div>
                
                <Modal />
            </div>
        </div>
    );
}

export default Home;
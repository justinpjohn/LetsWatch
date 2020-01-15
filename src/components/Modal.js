import React, { useState, useEffect } from 'react';

const Modal = (props) => {
    
    const [ visibility, setVisibility ] = useState(props.visibility);
    
    useEffect(() => {
        setVisibility(props.visibility);
        showModal();
        
    }, [props.visibility]);
    
    const showModal = () => { return ( visibility ? 'block' : 'none') };
        
    return (
        <div>
            <div className='row justify-content-center mt-3'>
                <button className='main-button' onClick={ () => setVisibility(true) } style={{backgroundColor: '#E53A3A', borderColor: '#E53A3A', color: 'white'}}> CREATE GROUP </button>
            </div>
            <div className='row justify-content-center mt-4'>
                <button className='main-button' onClick={ () => setVisibility(true) } style={{backgroundColor: 'white', borderColor: 'white'}}> JOIN GROUP </button>
            </div>
                    
            <div className="modal" style={{display: showModal()}}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Modal title</h5>
                    <button type="button" className="close" onClick={ () => setVisibility(false) }>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>Modal body text goes here.</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary">Save changes</button>
                    <button type="button" className="btn btn-secondary" onClick={ () => setVisibility(false) }>Close</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
}

export default Modal;
import React from 'react';

const Modal = ({ 
  isVisible, 
  hide,
  content,
  }) => isVisible ? 
    (
        <div className="modal" style={{display: 'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{content.header}</h5>
                <button type="button" className="close" onClick={ hide }>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{content.body}</p>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Continue</button>
                <button type="button" className="btn btn-secondary" onClick={ hide }>Close</button>
              </div>
            </div>
          </div>
        </div>
    )
    : null;

export default Modal;
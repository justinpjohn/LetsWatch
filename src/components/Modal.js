import React from 'react';

const Modal = ({ 
  id,
  isVisible, 
  hide,
  content,
  }) => isVisible ? 
    (
        <div id={(id) ? id : ''} className="modal" style={{display: 'block'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{content.header}</h5>
                <button type="button" className="close" onClick={ hide }>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{content.body}</div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" form='group-form'>Continue</button>
                <button type="button" className="btn btn-secondary" onClick={ hide }>Close</button>
              </div>
            </div>
          </div>
        </div>
    )
    : null;

export default Modal;
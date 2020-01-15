import React, { useState } from 'react';

const Form = () => {
    const [ username, setUsername ] = useState('');
    const [ groupID, setGroupID ] = useState('');
    
    const handleChange = (e) => {
        const value = e.target.value;
        
        if (e.target.id === 'username-input') {
            setUsername(value);
        } else {
            setGroupID(value);
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted: ' + username + ' ' + groupID);
    }
    
    
    return (
        <div>
            <form id='group-form' onSubmit={handleSubmit} onChange={handleChange}>
                <div class="form-group">
                    <label for="username-input">Username</label>
                    <input type="text" class="form-control" id="username-input" placeholder="Username"/>
                    <small class="form-text text-muted">This is how others will identify you.</small>
                </div>
                <div class="form-group">
                    <label for="group-input">Group ID</label>
                    <input type="text" class="form-control" id="group-input" placeholder="Group ID"/>
                    <small class="form-text text-muted">Group to create or join if it already exists.</small> 
                </div>
            </form>
        </div>
    );
}

export default Form;
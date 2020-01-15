import React, { useState } from 'react';

const Form = () => {
    const [ username, setUsername ] = useState('');
    const [ groupID, setGroupID ] = useState('');
    
    const handleChange = (e) => {
        console.log(e.target.value);
    }
    
    const handleSubmit = () => {
        console.log('submit');
    }
    
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div class="form-group">
                    <label for="username-input">Username</label>
                    <input type="text" class="form-control" id="username-input" placeholder="Username"/>
                    <small class="form-text text-muted">This is how others will identify you.</small>
                </div>
                <div class="form-group">
                    <label for="group-input">Group ID</label>
                    <input type="text" class="form-control" id="group-input" placeholder="Group ID"/>
                    <small class="form-text text-muted">This is your group code to share.</small> 
                </div>
            </form>
        </div>
    );
}

export default Form;
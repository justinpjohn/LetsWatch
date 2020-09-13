import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'


const Form = () => {
    
    const MAX_USERNAME_LENGTH = 30;
    const MAX_GROUPID_LENGTH = 30;
    
    const [ userData, setUserData ] = useState({userName: '', roomName: ''});
    const [ redirect, setRedirect ] = useState(false);
    
    const handleChange = (e) => {
        const value = e.target.value;
        
        if (e.target.id === 'username-input') {
            setUserData({userName: value, roomName: userData.groupID});
        } else {
            setUserData({userName: userData.userName, roomName: value});
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setRedirect(true);
    }
    
    return redirect ? <Redirect to={{
                        pathname: '/room',
                        state: { userData }
                    }} /> :
        (
            <div>
                <form id='group-form' onSubmit={handleSubmit} onChange={handleChange}>
                    <div class="form-group">
                        <label for="username-input">Username</label>
                        <input type="text" class="form-control" id="username-input" placeholder="Username" maxlength = { MAX_USERNAME_LENGTH }/>
                        <small class="form-text text-muted">This is how others will identify you.</small>
                    </div>
                    <div class="form-group">
                        <label for="group-input">Group ID</label>
                        <input type="text" class="form-control" id="group-input" placeholder="Group ID" maxlength = { MAX_GROUPID_LENGTH }/>
                        <small class="form-text text-muted">Group to create or join if it already exists.</small> 
                    </div>
                </form>
            </div>
        );
}

export default Form;
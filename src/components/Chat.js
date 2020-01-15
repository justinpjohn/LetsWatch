import React from 'react';

const Chat = (props) => {
    const user = props.location.state.user;
    console.log(user);
    
    return (
        <h1 style={{color: 'white'}}>Hello '{user.username}'! You are in the '{user.groupID}' group.</h1>
    );
}

export default Chat;
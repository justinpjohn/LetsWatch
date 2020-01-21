import React, {useEffect} from 'react';

const Message = ({messageInfo}) => {
    
    const messageObject = messageInfo.message;
    const currentUserSocketID = messageInfo.currUserSockID;

    let justify = 'start';
    let className = 'msg-container';
    if (currentUserSocketID === messageObject.content.authorSock) {
        justify = 'end';
        className = 'msg-container-send';
    } else if (messageObject.content.authorSock === 'admin') {
        className = 'msg-container-admin';
    }

    return (
        <div className={`d-flex justify-content-${justify} mb-3`}>
            <div className={className}>
                <div className={`d-flex justify-content-${justify} msg-header`}>{messageObject.content.authorUser}</div>
                <span id={`msg-${messageObject.index}`}>{messageObject.content.text}</span>
            </div>
        </div>
    );
}

export default Message;
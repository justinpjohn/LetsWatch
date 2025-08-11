import React from 'react';

const Message = ({ messageInfo }) => {
	const messageObject = messageInfo.message;
	const currentUserSocketID = messageInfo.currUserSockID;

	let justify = 'start';
	let className = 'msg-container msg-receive';
	if (currentUserSocketID === messageObject.content.authorSock) {
		justify = 'end';
		className = 'msg-container msg-send';
	} else if (messageObject.content.authorSock === 'admin') {
		className = 'msg-container msg-admin';
	}

	return (
		<div className={`msg d-flex justify-content-${justify} mb-3`}>
			<div className={`${className}`} style={{ maxWidth: '90%' }}>
				<div className={`d-flex justify-content-${justify} msg-header`}>
					{messageObject.content.authorUser}
				</div>
				<span
					id={`msg-${messageObject.index}`}
					style={{ display: 'block', wordWrap: 'break-word' }}
				>
					{messageObject.content.text}
				</span>
			</div>
		</div>
	);
};

export default Message;

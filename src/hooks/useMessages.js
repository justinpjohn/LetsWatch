import { useState, useEffect } from 'react';

const useMessages = () => {
	const [messages, setMessages] = useState([]);

	const addMessage = (messageInfo) => {
		// console.log(messageInfo);
		setMessages((prevMessages) => [...prevMessages, messageInfo]);
	};

	useEffect(() => {
		// console.log(messages);
	}, [messages]);

	return {
		messages,
		addMessage,
	};
};

export default useMessages;

import React, { useState, useEffect, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';
import { SocketContext } from '../../contexts/SocketContext';

import Chat from './Chat/Chat';
import Search from './Search/Search';
import Queue from './Queue/Queue';

import useMessages from '../../hooks/useMessages';

const DEFAULT_VIDEO_TIMESTAMP = process.env.REACT_APP_DEFAULT_VIDEO_TIMESTAMP;
const DEFAULT_VIDEO_STATE = process.env.REACT_APP_DEFAULT_VIDEO_STATE;

let unseenMessageCount = 0;

const SidePanel = () => {
	const { user } = useContext(UserContext);
	const socket = useContext(SocketContext);

	const [unseenMessages, setUnseenMessages] = useState(0);
	const { messages, addMessage } = useMessages();

	useEffect(() => {
		socket.on('chat message', ({ authorSocketID, authorUserName, msg }) => {
			if (authorSocketID !== socket.id && !isChatTabFocused()) {
				unseenMessageCount += 1;
				setUnseenMessages(unseenMessageCount);
			}

			addMessage({
				authorSock: authorSocketID,
				authorUser: authorUserName,
				text: msg,
			});
		});
	}, [socket]);

	const isChatTabFocused = () => {
		const chatTabDOM = document.getElementById('chat-tab');
		return chatTabDOM.classList.contains('active');
	};

	const resetUnseenMessages = () => {
		unseenMessageCount = 0;
		setUnseenMessages(0);
	};

	const emitVideoId = (videoID) => {
		const videoState = {
			videoID,
			videoTS: DEFAULT_VIDEO_TIMESTAMP,
			videoPS: DEFAULT_VIDEO_STATE,
		};
		socket.emit('select', { user, clientVideoState: videoState });
	};

	const emitQueueAppend = (result) => {
		socket.emit('queue append', { user, video: result });
	};

	const emitQueueRemove = (index) => {
		socket.emit('queue remove', { user, index });
	};

	const emitMessage = (msg) => {
		socket.emit('chat message', { user, msg });
	};

	return (
		<div
			className="col-lg-3 col-12 mh-100"
			id="side-wrapper"
			style={{ backgroundColor: 'black' }}
		>
			<div className="row text-center text-uppercase">
				<ul className="nav nav-tabs col-12 p-0" role="tablist">
					<li
						className="nav-item col-4 p-0"
						onClick={resetUnseenMessages}
					>
						<a
							className="nav-link active"
							id="chat-tab"
							data-toggle="tab"
							href="#chat"
							role="tab"
							aria-controls="chat"
							aria-selected="true"
							style={{
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							{unseenMessages === 0 ? (
								<div id="chat-text" className="m-auto">
									<span> Chat </span>
								</div>
							) : (
								<div id="unseen" className="circle">
									<span className="m-auto">
										{' '}
										{unseenMessages > 9
											? '9+'
											: unseenMessages}{' '}
									</span>
								</div>
							)}
						</a>
					</li>
					<li className="nav-item col-4 p-0">
						<a
							className="nav-link"
							id="search-tab"
							data-toggle="tab"
							href="#search"
							role="tab"
							aria-controls="search"
							aria-selected="false"
						>
							Search
						</a>
					</li>
					<li className="nav-item col-4 p-0">
						<a
							className="nav-link"
							id="queue-tab"
							data-toggle="tab"
							href="#queue"
							role="tab"
							aria-controls="queue"
							aria-selected="false"
						>
							Queue
						</a>
					</li>
				</ul>
			</div>
			<div className="row tab-content">
				<div
					className="tab-pane show active col-12 p-0"
					id="chat"
					role="tabpanel"
					aria-labelledby="chat-tab"
				>
					<Chat messages={messages} emitMessage={emitMessage} />
				</div>
				<div
					className="tab-pane col-12 p-0 mh-100"
					id="search"
					role="tabpanel"
					aria-labelledby="search-tab"
				>
					<Search
						emitVideoId={emitVideoId}
						emitQueueAppend={emitQueueAppend}
					/>
				</div>
				<div
					className="tab-pane col-12 p-0 mh-100"
					id="queue"
					role="tabpanel"
					aria-labelledby="queue-tab"
				>
					<Queue
						emitVideoId={emitVideoId}
						emitQueueRemove={emitQueueRemove}
					/>
				</div>
			</div>
		</div>
	);
};

export default SidePanel;

import React, { useEffect, useContext, useMemo } from 'react';
import { io } from 'socket.io-client';

import Video from './Video';
import SidePanel from './SidePanel/SidePanel';

import { UserContext } from '../contexts/UserContext';
import { SocketContext } from '../contexts/SocketContext';

const Room = () => {
	const { user } = useContext(UserContext);

	// create ONE socket instance for the component lifetime
	const socket = useMemo(
		() =>
			io(
				// no URL = same-origin (works on Render prod)
				{
					transports: ['websocket'],
					withCredentials: true,
				},
			),
		[],
	);

	useEffect(() => {
		const onConnect = () => console.log('socket connected', socket.id);
		const onError = (e) => console.error('connect_error', e);
		socket.on('connect', onConnect);
		socket.on('connect_error', onError);

		// join room
		socket.emit('room connection', { user });

		return () => {
			socket.emit('room disconnect', { user });
			socket.off('connect', onConnect);
			socket.off('connect_error', onError);
			socket.disconnect();
		};
	}, [socket, user]);

	return (
		<div
			id="main-container"
			className="container-fluid m-auto h-100"
			style={{ color: 'white' }}
		>
			<div id="main-row-nav" className="row">
				<nav className="navbar navbar-dark bg-dark py-0 w-100">
					<a className="navbar-brand" href="/">
						Lets<span style={{ color: '#E53A3A' }}>Watch</span>
					</a>
					<span>{user.name}</span>
				</nav>
			</div>

			<div id="body-wrapper" className="row">
				<SocketContext.Provider value={socket}>
					<Video />
					<SidePanel />
				</SocketContext.Provider>
			</div>
		</div>
	);
};

export default Room;

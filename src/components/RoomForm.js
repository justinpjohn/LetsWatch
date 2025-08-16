import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';

const RoomForm = () => {
	const { user, setUser } = useContext(UserContext);

	const MAX_USERNAME_LENGTH = 30;
	const MAX_ROOMNAME_LENGTH = 30;

	const [redirect, setRedirect] = useState(false);

	const handleChange = (e) => {
		const value = e.target.value;

		if (e.target.id === 'username-input') {
			setUser({ ...user, name: value });
		} else {
			setUser({ ...user, room: value });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setRedirect(true);
	};

	return redirect ? (
		<Redirect
			to={{
				pathname: `/r/${user['room']}`,
			}}
		/>
	) : (
		<div>
			<form
				id="group-form"
				onSubmit={handleSubmit}
				onChange={handleChange}
			>
				<div class="form-group">
					<label for="username-input">Username</label>
					<input
						type="text"
						id="username-input"
						class="form-control"
						placeholder="Username"
						maxlength={MAX_USERNAME_LENGTH}
					/>
					<small class="form-text text-muted">
						This is how others will identify you.
					</small>
				</div>
				<div class="form-group">
					<label for="group-input">Room Name</label>
					<input
						type="text"
						id="group-input"
						class="form-control"
						placeholder="Room Name"
						maxlength={MAX_ROOMNAME_LENGTH}
					/>
					<small class="form-text text-muted">
						Group to create or join if it already exists.
					</small>
				</div>
			</form>
		</div>
	);
};

export default RoomForm;

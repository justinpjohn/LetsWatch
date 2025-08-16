import React from 'react';
import { Html5Entities } from 'html-entities';

const htmlEntities = new Html5Entities();

/* 
    result should come in the following form:
    {
        channelTitle: "- AnimeEnfermos -"
        source: "YouTube"
        thumbnail: "https://i.ytimg.com/vi/0YF8vecQWYs/hqdefault.jpg"
        title: "美波「カワキヲアメク」MV"
        videoId: "0YF8vecQWYs"
    }
*/
const VideoCard = ({ result, index, handleVideoCardClick, queue }) => {
	return (
		<div
			className="card flex-shrink-0 mx-auto mb-1"
			key={index}
			data-index={index}
			alt={htmlEntities.decode(result.videoId)}
			onClick={(e) => handleVideoCardClick(e, result)}
		>
			<div className="d-flex flex-row no-gutters">
				{queue ? (
					<button className="remove-from-queue-btn">X</button>
				) : (
					<button className="add-to-queue-btn" />
				)}
				<div
					className="d-flex"
					style={{ width: '40%', maxWidth: '40%' }}
				>
					<img
						src={htmlEntities.decode(result.thumbnail)}
						class="card-img"
						alt="..."
					/>
				</div>
				<div
					className="d-flex"
					style={{ width: '60%', maxWidth: '60%' }}
				>
					<div className="card-body">
						<span className="card-title">
							{htmlEntities.decode(result.title)}
						</span>
						<p className="card-text">
							<small className="text-muted">
								{htmlEntities.decode(result.channelTitle)}
							</small>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoCard;

import { type AppSchema, db } from '@/lib/db';
import { Cursors } from '@instantdb/react';
import { LucideMousePointer2 } from 'lucide-react';
import { useState } from 'react';

const STATUSES = ['🤒', '🙂', '👽'];

type Foo = AppSchema['rooms']['chat'];

const UserCard = ({ user }: { user: { name: string; status: string } }) => {
	return (
		<div className="flex items-center gap-2 p-4">
			<div>{user.name}</div>
			<div>{user.status}</div>
		</div>
	);
};

const renderCoolCustomCursor = ({
	color,
	presence: { name, status },
}: { color: string; presence: { name: string; status: string } }) => (
	<div className={`flex items-center text-xs text-[color:${color}]`}>
		<LucideMousePointer2 style={{ stroke: color }} />
		{name || 'mystery person'} {status}
	</div>
);

const room = db.room('chat', 'chat-room-id');
export const Room = () => {
	const { user: myPresence, peers, publishPresence } = db.rooms.usePresence(room);
	const [nickname, setNickname] = useState('');

	if (!myPresence) return null;

	return (
		<Cursors
			room={room}
			className="h-full w-full"
			userCursorColor="tomato"
			renderCursor={renderCoolCustomCursor}
		>
			<div className="flex flex-col flex-grow w-full h-full max-w-screen-2xl mx-auto">
				<div>
					<input
						className="p-1 border border-neutral-400"
						placeholder="nickname"
						value={nickname}
						onChange={(e) => setNickname(e.target.value)}
					/>
					<button
						className="p-1 border border-neutral-400 bg-neutral-400 cursor-pointer"
						type="button"
						disabled={nickname.length < 3}
						onClick={() => publishPresence({ name: nickname })}
					>
						{myPresence?.name ? 'Change name' : 'Join'}
					</button>
				</div>
				<div>
					Set your status:
					<select onChange={(e) => publishPresence({ status: e.target.value })}>
						<option>status</option>
						{STATUSES.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</div>
				<div className="p-8" />
				<div>
					Who's here?
					<UserCard user={myPresence} />
					{Object.entries(peers).map(([peerId, peer]) => (
						<UserCard key={peerId} user={peer} />
					))}
				</div>
				<div className="flex-grow" />
				<div className="p-8" />
				Debug:
				<pre className="whitespace-pre-wrap text-xs">
					{JSON.stringify({ myPresence, peers }, null, 2)}
				</pre>
			</div>
		</Cursors>
	);
};

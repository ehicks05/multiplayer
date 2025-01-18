import { type AppSchema, db } from '@/lib/db';
import { Cursors } from '@instantdb/react';
import { LucideMousePointer2 } from 'lucide-react';
import { useState } from 'react';

const STATUSES = ['🤒', '🙂', '👽'];
const COLORS = [
	{ color: '#f00', tw: 'text-[#f00] bg-[#f00]' },
	{ color: '#0f0', tw: 'text-[#0f0] bg-[#0f0]' },
	{ color: '#00f', tw: 'text-[#00f] bg-[#00f]' },
];

type Foo = AppSchema['rooms']['chat'];

const UserCard = ({ user }: { user: { name: string; status: string } }) => {
	return (
		<div className="flex items-center gap-2 p-4">
			<div className="text-2xl">{user.status}</div>
			<div>{user.name}</div>
		</div>
	);
};

const renderCoolCustomCursor = ({
	color,
	presence: { name, status },
}: { color: string; presence: { name: string; status: string } }) => (
	<div className={`flex items-center text-xs text-neutral-600 text-[${color}]`}>
		<LucideMousePointer2 />
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
			userCursorColor={myPresence.color}
			renderCursor={renderCoolCustomCursor}
		>
			<div className="flex flex-col flex-grow h-svh w-svw max-w-screen-2xl mx-auto">
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
						{myPresence?.name ? 'Change name' : 'Set my nickname'}
					</button>
				</div>
				<div>
					<select
						className="p-1 border border-neutral-400"
						onChange={(e) => publishPresence({ status: e.target.value })}
					>
						<option>I'm Feeling</option>
						{STATUSES.map((status) => (
							<option
								key={status}
								value={status}
								selected={status === myPresence.status}
							>
								{status}
							</option>
						))}
					</select>
				</div>
				<div>
					<select
						className={`p-1 border border-neutral-400 bg-[${myPresence.color}]`}
						onChange={(e) => publishPresence({ color: e.target.value })}
					>
						<option>My color</option>
						{COLORS.map(({ color }) => (
							<option
								key={color}
								value={color}
								className={`bg-[${color}]`}
								selected={color === myPresence.color}
							/>
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

				{false && (
					<div>
						Debug:
						<pre className="whitespace-pre-wrap text-xs">
							{JSON.stringify({ myPresence, peers }, null, 2)}
						</pre>
					</div>
				)}
			</div>
		</Cursors>
	);
};

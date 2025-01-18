import { Room } from './app/Room';
import { Footer, Header } from './components/layout';

function MyApp() {
	return (
		<div className="flex flex-col min-h-screen">
			<div className="sm:px-4">
				<Header />
			</div>
			<div className="flex-grow flex flex-col h-full sm:px-4">
				<Room />
			</div>
			<Footer />
		</div>
	);
}

export default MyApp;

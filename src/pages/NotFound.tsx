import { Link } from 'react-router-dom';
import { GardenBackground } from '../components/GardenBackground';

export const NotFound = () => {
  return (
    <>
      {/* Background Effects */}
      <GardenBackground />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-6">
        <h1 className="text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-100">
          404
        </h1>
        <h2 className="text-3xl sm:text-4xl font-bold mt-4">Page Not Found</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 text-white font-semibold bg-primary rounded-xl shadow-md hover:shadow-lg transition hover:scale-105"
        >
          Go Home
        </Link>
      </div>
    </>

  );
};

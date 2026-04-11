import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-green-600">404</h1>
      <p className="text-gray-500 mb-6">Page introuvable</p>
      <Link to="/" className="bg-green-600 text-white px-5 py-2 rounded-lg">Retour</Link>
    </div>
  );
}
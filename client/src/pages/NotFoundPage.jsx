import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta.js';

export default function NotFoundPage() {
  useMeta({ title: 'Page not found | Industrial Solutions', description: 'The page you are looking for could not be found.' });
  return (
    <section className="section">
      <div className="container notfound">
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn--primary">Back to Home</Link>
      </div>
    </section>
  );
}

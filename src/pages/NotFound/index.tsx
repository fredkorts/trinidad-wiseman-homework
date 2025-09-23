import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NOT_FOUND_COPY, NOT_FOUND_IDS, ROUTES } from '@/constants';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = NOT_FOUND_COPY.TITLE;
  }, []);

  return (
    <section className="not-found" aria-labelledby={NOT_FOUND_IDS.TITLE}>
      <h1 id={NOT_FOUND_IDS.TITLE} className="page-title">
        {NOT_FOUND_COPY.TITLE}
      </h1>
      <p>{NOT_FOUND_COPY.DESCRIPTION}</p>
      <p>
        <Link to={ROUTES.HOME} className="not-found__link">
          {NOT_FOUND_COPY.ACTION}
        </Link>
      </p>
    </section>
  );
}

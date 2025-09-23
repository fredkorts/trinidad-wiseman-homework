import { HOME_PAGE_COPY } from '@/constants';

export default function Home() {
  return (
    <section aria-labelledby={HOME_PAGE_COPY.HEADING_ID} className="home-page">
      <h1 id={HOME_PAGE_COPY.HEADING_ID} className="page-title">
        {HOME_PAGE_COPY.TITLE}
      </h1>
      <p>{HOME_PAGE_COPY.DESCRIPTION}</p>
    </section>
  );
}

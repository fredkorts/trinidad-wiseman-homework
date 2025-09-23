import { Alert, Card, Skeleton, Tag, Image, Divider } from 'antd';
import { useEffect } from 'react';
import { useArticle } from '@/services/api';
import { ARTICLE_PAGE_COPY, ARTICLE_PAGE_IDS } from '@/constants';

export default function ArticlePage() {
  const { data, isLoading, isError, error } = useArticle();

  useEffect(() => {
    if (data?.title) {
      document.title = data.title;
    }

  }, [data]);

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (isError) {
    return (
      <Alert
        type="error"
        message={ARTICLE_PAGE_COPY.LOAD_ERROR}
        description={String((error as Error)?.message ?? '')}
      />
    );
  }

  if (!data) return null;

  return (
    <article className="article-page" aria-labelledby={ARTICLE_PAGE_IDS.TITLE}>

      <Card className="article-card">
        <header className="article-header">
          <h1 id={ARTICLE_PAGE_IDS.TITLE} className="page-title">{data.title}</h1>
        </header>

        {/* Intro (HTML) */}
        {data.intro && (
          <section className="article-intro" aria-label={ARTICLE_PAGE_COPY.INTRO_SECTION_ARIA_LABEL}>
            <div dangerouslySetInnerHTML={{ __html: data.intro }} />
          </section>
        )}

        {data.image?.large && (
          <div className="article-image">
            <Image
              src={data.image.large}
              alt={data.image.alt}
              title={data.image.title}
              className="article-image__media"
              placeholder
            />
            <div className="alt">{data.image.title}</div>
          </div>
        )}

        <Divider />

        {/* Body (HTML) */}
        {data.body && (
          <section className="article-body" aria-label={ARTICLE_PAGE_COPY.BODY_SECTION_ARIA_LABEL}>
            <div dangerouslySetInnerHTML={{ __html: data.body }} />
          </section>
        )}

        <footer className="article-footer">
          <div className="article-tags">
            {data.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </footer>
      </Card>
    </article>
  );
}

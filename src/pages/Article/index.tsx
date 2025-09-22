import { Alert, Card, Skeleton, Tag, Image, Divider } from 'antd';
import { useEffect } from 'react';
import { useArticle } from '@/services/api';

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
        message="Failed to load article"
        description={String((error as Error)?.message ?? '')}
      />
    );
  }

  if (!data) return null;

  return (
    <article className="article-page" aria-labelledby="article-title">
      
      <Card className="article-card">
        <header className="article-header">
          <h1 id="article-title" style={{ marginTop: 0 }}>{data.title}</h1>
        </header>

        {/* Intro (HTML) */}
        {data.intro && (
          <section className="article-intro" aria-label="Introduction" style={{ marginBottom: 16 }}>
            <div dangerouslySetInnerHTML={{ __html: data.intro }} />
          </section>
        )}

        {data.image?.large && (
          <div className="article-image" style={{ marginBottom: 16 }}>
            <Image
              src={data.image.large}
              alt={data.image.alt}
              title={data.image.title}
              style={{ maxWidth: '100%' }}
              placeholder
            />
            <div className="alt">{data.image.title}</div>
          </div>
        )}

        <Divider />

        {/* Body (HTML) */}
        {data.body && (
          <section className="article-body" aria-label="Body">
            <div dangerouslySetInnerHTML={{ __html: data.body }} />
          </section>
        )}

        <footer className="article-footer">
          <div className="article-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {data.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </footer>
      </Card>
    </article>
  );
}

import { Alert, Card, Skeleton, Descriptions, Tag, Image, Divider } from 'antd';
import { useEffect } from 'react';
import { useArticle } from '@/services/api';
import { unixToDate } from '@/services/api';

export default function ArticlePage() {
  const { data, isLoading, isError, error } = useArticle();

  useEffect(() => {
    if (data?.title) {
      document.title = data.title;
    }
  }, [data?.title]);

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

  const fullName = `${data.firstname} ${data.surname}`;
  const published = unixToDate(data.date).toLocaleString();

  return (
    <article aria-labelledby="article-title">
      <Card>
        <h1 id="article-title" style={{ marginTop: 0 }}>{data.title}</h1>

        <Descriptions size="small" column={1} style={{ marginBottom: 12 }}>
          <Descriptions.Item label="Author">{fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{data.phone}</Descriptions.Item>
          <Descriptions.Item label="Sex">{data.sex === 'm' ? 'Male' : 'Female'}</Descriptions.Item>
          <Descriptions.Item label="Published">{published}</Descriptions.Item>
          <Descriptions.Item label="Personal code">{data.personal_code}</Descriptions.Item>
        </Descriptions>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {data.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        {data.image?.large && (
          <div style={{ marginBottom: 16 }}>
            <Image
              src={data.image.large}
              alt={data.image.alt}
              title={data.image.title}
              width={640}
              style={{ maxWidth: '100%' }}
              placeholder
            />
          </div>
        )}

        {/* Intro (HTML) */}
        {data.intro && (
          <section aria-label="Introduction" style={{ marginBottom: 16 }}>
            <div dangerouslySetInnerHTML={{ __html: data.intro }} />
          </section>
        )}

        <Divider />

        {/* Body (HTML) */}
        {data.body && (
          <section aria-label="Body">
            <div dangerouslySetInnerHTML={{ __html: data.body }} />
          </section>
        )}

        {/* Extra images */}
        {data.images?.length ? (
          <>
            <Divider />
            <section aria-label="Gallery" style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {data.images.map((img, i) => (
                <Image key={i} src={img.medium} alt={img.alt} title={img.title} style={{ width: '100%' }} />
              ))}
            </section>
          </>
        ) : null}
      </Card>
    </article>
  );
}

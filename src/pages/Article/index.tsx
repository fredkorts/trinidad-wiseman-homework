import { Alert, Card, Skeleton } from 'antd';
import { useArticle } from '@/services/api';

export default function ArticlePage() {
  const { data, isLoading, isError, error } = useArticle();

  if (isLoading) return <Skeleton active paragraph={{ rows: 4 }} />;
  if (isError) return <Alert type="error" message="Failed to load article" description={String((error as Error)?.message ?? '')} />;

  return (
    <article aria-labelledby="article-title">
      <Card>
        <h1 id="article-title">{data?.title}</h1>
        <p>{data?.body}</p>
      </Card>
    </article>
  );
}

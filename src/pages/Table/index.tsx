import { Alert, Card, Skeleton } from 'antd';
import { useTable } from '@/services/api';
import CustomTable from '@/components/table/CustomTable';
import { TABLE_PAGE_COPY } from '@/constants';

export default function TablePage() {
  const { data, isLoading, isError, error } = useTable();

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (isError)
    return (
      <Alert
        type="error"
        message={TABLE_PAGE_COPY.LOAD_ERROR}
        description={String((error as Error)?.message ?? '')}
      />
    );

  return (
    <>
      <h1 className="page-title">{TABLE_PAGE_COPY.TITLE}</h1>
      <Card>
        <CustomTable rows={data ?? []} />
      </Card>
    </>
  );
}

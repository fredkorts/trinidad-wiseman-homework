import { Alert, Card, Skeleton } from 'antd';
import { useTable } from '@/services/api';
import CustomTable from '@/components/table/CustomTable';

export default function TablePage() {
  const { data, isLoading, isError, error } = useTable();

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (isError) return <Alert type="error" message="Failed to load table data" description={String((error as Error)?.message ?? '')} />;

  return (
    <>
      <h1 className="page-title">NIMEKIRI</h1>
      <Card>
        <CustomTable rows={data ?? []} />
      </Card>
    </>
  );
}

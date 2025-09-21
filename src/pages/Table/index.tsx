import { Alert, Card, Skeleton } from 'antd';
import { useTable } from '@/services/api';
import CustomTable from '@/components/table/CustomTable';

export default function TablePage() {
  const { data, isLoading, isError, error } = useTable();

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (isError) return <Alert type="error" message="Failed to load table data" description={String((error as Error)?.message ?? '')} />;

  return (
    <>
      <h1 style={{ textAlign: 'center', letterSpacing: 1, marginTop: 0, marginBottom: 16 }}>NIMEKIRI</h1>
      <Card>
        <CustomTable rows={data ?? []} />
      </Card>
    </>
  );
}

import { Skeleton, Table } from '@mantine/core';
import useSWR from 'swr';
import AlertBadge from '../AlertBadge/AlertBadge';

export default function SchoolTable() {
  const { data, isLoading, error } = useSWR('/api/register');
  const renderTableCell = (content: string) =>
    isLoading ? (
      <td>
        <Skeleton h={40} />
      </td>
    ) : (
      <td>{content}</td>
    );

  if (error) {
    return (
      <AlertBadge title="คำเตือน" color="red" description="เกิดข้อผิดพลาดในการดึงข้อมูลโรงเรียน" />
    );
  }

  return (
    <>
      {data.school && data.school_location && data.school_phone_number ? (
        <Table withColumnBorders withBorder>
          <thead>
            <tr>
              <th>โรงเรียน</th>
              <th>ที่อยู่</th>
              <th>โทรศัพท์</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {renderTableCell(data?.school)}
              {renderTableCell(data?.school_location)}
              {renderTableCell(data?.school_phone_number)}
            </tr>
          </tbody>
        </Table>
      ) : (
        <AlertBadge title="คำเตือน" color="blue" description="ยังไม่มีข้อมูลโรงเรียน" />
      )}
    </>
  );
}

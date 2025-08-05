import { Pagination } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useStatus } from '../../hooks/status';

export default function PaginationTab() {
  const { isAgree, isSchoolDone, isStudentDone, isPaymentDone } = useStatus();
  const conditions = [isAgree, isSchoolDone, isStudentDone, isPaymentDone];
  let allowPagination = 1;
  const paginationList = ['info', 'step1', 'step2', 'step3', 'step4'];

  conditions.forEach((condition) => {
    if (condition && condition < paginationList.length) {
      allowPagination += 1;
    }
  });
  const router = useRouter();

  const currentIndex = paginationList.findIndex((item) => `/dashboard/${item}` === router.pathname);
  const [active, setActive] = useState(currentIndex);
  useEffect(() => {
    setActive(currentIndex >= 0 ? currentIndex : 0);
  }, [router.pathname]);

  const handleOnChange = (value: number) => {
    setActive(value);
    router.push(`/dashboard/${paginationList[value]}`);
  };

  return <Pagination value={active} onChange={handleOnChange} total={allowPagination} />;
}

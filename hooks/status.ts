import useSWR from 'swr';

export function useStatus() {
  const { data } = useSWR('/api/status');
  return {
    isAgree: data?.agree_to_terms,
    isSchoolDone: data?.school,
    isStudentDone: data?.team_count_bol,
    isPaymentDone: data?.all_team_is_ready,
  };
}

export function useRegisterStatus() {
  const { data } = useSWR('/api/register-status');
  return {
    isAvailable: data?.status,
  };
}

export function useRegisterMedTalkStatus() {
  const { data } = useSWR('/api/register-medtalk-status');
  return {
    isMedTalkFull: data?.status,
  };
}

import Layout from '../../components/layout';
import SchoolForm from '../../components/Form/SchoolForm/SchoolForm';
import LoadingPlaceholder from '../../components/Placeholder/LoadingPlaceholder';
import { useStatus } from '../../hooks/status';

export default function index() {
  const { isAgree } = useStatus();
  if (isAgree === undefined || isAgree === false) {
    return (
      <>
        <Layout>
          <LoadingPlaceholder />
        </Layout>
      </>
    );
  }
  return (
    <>
      <Layout>
        <SchoolForm />
      </Layout>
    </>
  );
}

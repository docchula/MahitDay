import { Center, Loader } from '@mantine/core';

export default function LoadingPlaceholder() {
  return (
    <>
      <Center h={200} mx="auto">
        <Loader size="xl" variant="dots" mx="auto" />
      </Center>
    </>
  );
}

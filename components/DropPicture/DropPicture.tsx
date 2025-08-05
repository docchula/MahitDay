import { Group, Text, useMantineTheme, rem, Image, Center } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';

interface DropPictureProps extends Partial<DropzoneProps> {
  descriptiontext: string;
  imageFile: FileWithPath | null;
  setImageFile: (file: FileWithPath | null) => void;
}

export function DropPicture({
  descriptiontext,
  imageFile,
  setImageFile,
  ...dropzoneProps
}: DropPictureProps) {
  const theme = useMantineTheme();
  return (
    <>
      <Dropzone
        onDrop={(files) => {
          setImageFile(files[0]);
        }}
        onReject={() => {}}
        maxSize={2 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        multiple={false}
        {...dropzoneProps}
      >
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: rem(220), pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <IconUpload
              size="3.2em"
              stroke={1.5}
              color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              size="3.2em"
              stroke={1.5}
              color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            {imageFile ? (
              <Center>
                {typeof imageFile === 'object' ? (
                  <Image src={URL.createObjectURL(imageFile)} maw={240} radius="sm" />
                ) : (
                  <Image src={`data:image/jpeg;base64,${imageFile}`} maw={240} radius="sm" />
                )}
              </Center>
            ) : (
              <IconPhoto size="3.2em" stroke={1.5} />
            )}
          </Dropzone.Idle>
          <div>
            <Text size="xl" inline>
              ลากรูปภาพมาที่นี่หรือคลิกเพื่อเลือกไฟล์
            </Text>
            <Text size="sm" c="orange" inline mt={7}>
              {descriptiontext}
            </Text>
          </div>
        </Group>
      </Dropzone>
    </>
  );
}

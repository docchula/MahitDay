import { Scanner } from '@yudiel/react-qr-scanner';
import { Button, Container, Modal, NumberInput } from '@mantine/core';
import { useRef, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { ToastContainer } from 'react-toastify';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../components/Layout/AdminLayout';
import ScannedInfo from '../../components/ScannedInfo/ScannedInfo';
import 'react-toastify/dist/ReactToastify.css';

export default function Index() {
    const { data: session } = useSession();
    const [scanResult, setScanResult] = useState(0);
    const [opened, { open, close }] = useDisclosure(false);
    const [pausedCamera, setPausedCamera] = useState(false);
    const numberRef = useRef<HTMLInputElement>(null);

    const handleScan = (result: { rawValue: any; }[]) => {
        const parsedResult = Number(result[0]?.rawValue);
        if (!Number.isNaN(parsedResult)) {
            setScanResult(parsedResult);
            open();
        }
    };

    if (!session?.user?.email || session.user.email.split('@')[1] !== 'docchula.com') {
        return <pre>Unauthorized</pre>;
    }

    return (
        <AdminLayout>
            <Button m="md" onClick={() => setPausedCamera(!pausedCamera)}>{pausedCamera ? 'Start Camera' : 'Pause Camera'}</Button>
            <NumberInput
                placeholder="Number"
                label="ID"
                ref={numberRef}
                withAsterisk
            />
            <Button onClick={() => {
                const value = numberRef.current?.value;
                if (value !== undefined) {
                    const parsedValue = Number(value);
                    if (!Number.isNaN(parsedValue)) {
                        setScanResult(parsedValue);
                        open();
                    }
                }
            }}
            >Submit
            </Button>
            <Container size="xl">
                <Scanner
                    paused={pausedCamera}
                    allowMultiple={false}
                    onScan={result => handleScan(result)}
                />
            </Container>
            <Modal opened={opened} onClose={close} title="Result">
                <ScannedInfo id={String(scanResult)} />
            </Modal>
            <ToastContainer
                position="bottom-right"
                theme="colored"
                stacked
            />
        </AdminLayout>
    );
}

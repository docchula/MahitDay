import { Group } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

export default function SocialIcons() {
    return (
        <Group spacing="sm">
            <p>ช่องทางติดตามข่าวสาร</p>
            <Link href="https://www.instagram.com/amsci.official/" target="_blank">
                <Image src="/instagram-logo.png" alt="Instagram Logo" width={34} height={34} />
            </Link>
        </Group>
    );
}

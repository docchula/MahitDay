import { Group } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

export default function SocialIcons() {
    return (
        <Group spacing="sm">
            <Link href="https://www.facebook.com/anandayquiz/" target="_blank">
                <Image src="/facebook-logo.png" alt="Facebook Logo" width={34} height={34} />
            </Link>
            <Link href="https://www.instagram.com/amsci.official/" target="_blank">
                <Image src="/instagram-logo.png" alt="Instagram Logo" width={34} height={34} />
            </Link>
            <Link href="https://lin.ee/3NeEl2g" target="_blank">
                <Image src="/line-logo.png" alt="Line Logo" width={34} height={34} />
            </Link>
        </Group>
    );
}

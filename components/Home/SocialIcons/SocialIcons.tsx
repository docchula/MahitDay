import { Group } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

export default function SocialIcons() {
    return (
        <Group spacing="sm">
            <p>ช่องทางติดตามข่าวสาร</p>
            <Link href="https://www.instagram.com/mahitdayquiz.official/" target="_blank">
                <Image src="/instagram-logo.png" alt="Instagram Logo" width={34} height={34} />
            </Link>
            <Link href="https://www.facebook.com/p/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B9%81%E0%B8%82%E0%B9%88%E0%B8%87%E0%B8%82%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%AD%E0%B8%9A%E0%B8%9B%E0%B8%B1%E0%B8%8D%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%A0%E0%B8%B2%E0%B8%9E-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%A3%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%8A%E0%B8%99%E0%B8%81-100054200633702/?_rdr" target="_blank">
                <Image src="/facebook-logo.png" alt="Facebook Logo" width={34} height={34} />
            </Link>
        </Group>
    );
}

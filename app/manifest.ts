import type { MetadataRoute } from 'next'

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'BorkJud บอกจุด',
        short_name: 'BorkJud',
        description: 'บอกจุด คือเว็บแอพที่วิเคราะห์อาการเมื่อยตามร่างกาย พร้อมแนะนำวิธีแก้เบื้องต้น และส่งข้อมูลให้หมอนวดได้',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#f4c692',
        icons: [
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
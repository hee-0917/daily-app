import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '소비요정',
    short_name: '소비요정',
    description: '일일 지출 관리 앱',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
}
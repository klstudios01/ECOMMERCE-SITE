import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KL STUDIOS Luxury Commerce',
    short_name: 'KL STUDIOS',
    description: 'Precision acoustics, wearable tech, and Italian full-grain leather carry.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0F17',
    theme_color: '#F59E0B',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

// Allow importing CSS files (side-effect imports) in TypeScript
declare module '*.css';

// Specific declarations for Swiper's CSS side-effect imports
declare module 'swiper/css';
declare module 'swiper/css/pagination';
declare module 'swiper/css/navigation';
declare module 'swiper/css/scrollbar';

// Fallback for any other swiper css paths
declare module 'swiper/css/*';

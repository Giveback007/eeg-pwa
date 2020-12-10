declare global {
    const log: typeof console.log;
    const env: 'production' | 'development';
    const qok: boolean;
}

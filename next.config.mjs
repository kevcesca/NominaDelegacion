/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        loader: 'custom',
        loaderFile: './my-loader.ts',
    },
}

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/url-shortener",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

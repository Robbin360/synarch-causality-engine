/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      use: {
        loader: "url-loader",
        options: {
          limit: 1000,
          publicPath: "/_next/static/images",
          outputPath: "static/images",
          name: "[name].[hash:7].[ext]",
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
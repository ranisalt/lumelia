import path from "path";

const config = {
  clearMocks: true,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
};

export default config;

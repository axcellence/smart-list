/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // custom min height
      minHeight: {
        dynamic: ["100vh", "100dvh"],
      },
    },
  },
  plugins: [],
};

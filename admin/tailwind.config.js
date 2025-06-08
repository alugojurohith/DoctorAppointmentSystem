/** @type {import('tailwindcss').Config} */
export default {
 content: [
  './index.html',
  './*.{js,ts,jsx,tsx}',       // root files
  './src/**/*.{js,ts,jsx,tsx}', // subfolders
],

  theme: {
    extend: {
      colors:{
        'primary':"#5F6FFF"
      }
    },
  },
  plugins: [],
}
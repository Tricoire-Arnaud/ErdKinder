/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../frontend/views/**/*.ejs",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#7C9A92',    // Vert sauge
        'secondary': '#F4EAE6',  // Beige naturel
        'accent': '#E6A57E',     // Terra cotta
        'text': '#2C3E50',       // Bleu foncé
        'dark': '#1A2A36'        // Bleu très foncé
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
} 
module.exports = {
  'src/**/*.{js,jsx,ts,tsx}': ['yarn lint', 'yarn i18n:extract'],
  'src/**/*.{js,jsx,ts,tsx,json,css,scss,md}': ['yarn format'],
}

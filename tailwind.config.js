module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production' ? true : false,
    content: ["./src/components/**/*.js", "./src/pages/**/*.js"],
  },
  corePlugins: {
    fontFamily: false
  },
  theme: {
    extend: {
      colors: {
        'dark-0': '#121212',
        'dark-1': '#1E1E1E',
        'dark-2': '#232323',
        'dark-3': '#252525',
        'dark-4': '#272727',
        'dark-6': '#2C2C2C',
        'dark-8': '#2E2E2E',
        'dark-12': '#333333',
        'dark-16': '#363636',
        'dark-24': '#383838',
        'primary-1': '#fac8cd',
        'primary-2': '#e69292',
        'primary-3': '#d86868',
        'primary-4': '#df4544',
        'primary-5': '#e13128',
        'primary-6': '#d32728',
        'primary-7': '#c21c23',
        'primary-8': '#b5131c',
        'primary-9': '#a60010',
        'black-1': '#1B1B1B',
        'black-2': '#3F3F3F',
        'black-3': '#616161',
        'black-4': '#8F8F8F',
        'black-5': '#BFBFBF',
        'black-6': '#DFDFDF',
        'white-1': '#F9F9F9'
      },
      opacity: {
        '87': '87%',
        '60': '60%'
      },
      boxShadow: {
        'inner-sm': 'inset 0px 1px 8px rgba(0, 0, 0, 0.25)',
        'subtle': `0px 0px 4px rgba(0, 0, 0, 0.15)`
      },
      padding: {
        'third': '33.3%',
        'half': '50%',
        'full': '100%',
        '3/4': '75%',
      },
      minWidth: {
        'third': '33.3%',
        'half': '50%',
        'full': '100%'
      }
    }
  }
}
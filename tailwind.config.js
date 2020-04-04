module.exports = {
  corePlugins: {
    fontFamily: false
  },
  theme: {
    extend: {
      colors: {
        'black-1': '#1B1B1B',
        'black-2': '#3F3F3F',
        'black-3': '#616161',
        'black-4': '#8F8F8F',
        'black-5': '#BFBFBF',
        'black-6': '#DFDFDF',
        'white-1': '#F9F9F9'
      },
      boxShadow: {
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
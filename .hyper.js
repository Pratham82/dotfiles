module.exports = {
  config: {
    // choose either `'stable'` for receiving highly polished,
    // or `'canary'` for less polished but more frequent updates
    updateChannel: 'stable',

    // default font size in pixels for all tabs
    fontSize: 12,
    // font family with optional fallbacks
    fontFamily: 'Fira code',
    //'Menlo, "DejaVu Sans Mono", Consolas, "Lucida Console", monospace'
    
    // default font weight: 'normal' or 'bold'
    fontWeight: 'normal',

    // font weight for bold characters: 'normal' or 'bold'
    fontWeightBold: 'bold',

    // line height as a relative unit
    lineHeight: 1.15,

    // letter spacing as a relative unit
    letterSpacing: 0,

    // terminal cursor background color and opacity (hex, rgb, hsl, hsv, hwb or cmyk)
    cursorColor: 'rgba(248,28,229,0.8)',

    // terminal text color under BLOCK cursor
    cursorAccentColor: '#000',

    // `'BEAM'` for |, `'UNDERLINE'` for _, `'BLOCK'` for █
    cursorShape: 'BLOCK',

    // set to `true` (without backticks and without quotes) for blinking cursor
    cursorBlink: false,

    // color of the text
    foregroundColor: '#fff',

    // terminal background color
    // opacity is only supported on macOS
    backgroundColor: '#000',
    
     opacity: 0.50,
    

    // terminal selection color
    selectionColor: 'rgba(248,28,229,0.3)',

    // border color (window, tabs)
    borderColor: '#333',

    // custom CSS to embed in the main window
    css: '',

    // custom CSS to embed in the terminal window
    termCSS: '',

    // if you're using a Linux setup which show native menus, set to false
    // default: `true` on Linux, `true` on Windows, ignored on macOS
    showHamburgerMenu: '',

    // set to `false` (without backticks and without quotes) if you want to hide the minimize, maximize and close buttons
    // additionally, set to `'left'` if you want them on the left, like in Ubuntu
    // default: `true` (without backticks and without quotes) on Windows and Linux, ignored on macOS
    showWindowControls: '',

    // custom padding (CSS format, i.e.: `top right bottom left`)
    padding: '12px 14px',

    // the full list. if you're going to provide the full color palette,
    // including the 6 x 6 color cubes and the grayscale map, just provide
    // an array here instead of a color map object
    colors: {
      black: '#000000',
      red: '#C51E14',
      green: '#1DC121',
      yellow: '#C7C329',
      blue: '#0A2FC4',
      magenta: '#C839C5',
      cyan: '#20C5C6',
      white: '#C7C7C7',
      lightBlack: '#686868',
      lightRed: '#FD6F6B',
      lightGreen: '#67F86F',
      lightYellow: '#FFFA72',
      lightBlue: '#6A76FB',
      lightMagenta: '#FD7CFC',
      lightCyan: '#68FDFE',
      lightWhite: '#FFFFFF',
    },

    // PowerShell on Windows
    // - Example: `C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`
    shell: '',

    // for setting shell arguments (i.e. for using interactive shellArgs: `['-i']`)
    // by default `['--login']` will be used
    shellArgs: ['--login'],

    // for environment variables
    env: {},

    // set to `false` for no bell
    bell: 'SOUND',

    // if `true` (without backticks and without quotes), selected text will automatically be copied to the clipboard
    copyOnSelect: false,

    // if `true` (without backticks and without quotes), hyper will be set as the default protocol client for SSH
    defaultSSHApp: true,

    quickEdit: false,
    macOptionSelectionMode: 'vertical',

    // URL to custom bell
    // bellSoundURL: 'http://example.com/bell.mp3',

    // Whether to use the WebGL renderer. Set it to false to use canvas-based
    // rendering (slower, but supports transparent backgrounds)
    webGLRenderer: true,

    // for advanced config flags please refer to https://hyper.is/#cfg
  },

  // 	Themes: 'hyperterm-gruvbox-dark', 'hyper-material-theme'
  plugins: [
    'hypercwd',
    'hyperterm-dibdabs',
    'hyper-blink',
    'hyperterm-tabs',
    'hyper-materialshell'
  ],

  // in development, you can create a directory under
  // `~/.hyper_plugins/local/` and include it here
  // to load it and avoid it being `npm install`ed
  localPlugins: [],

  keymaps: {
    // Example
    // 'window:devtools': 'cmd+alt+o',
  },
};

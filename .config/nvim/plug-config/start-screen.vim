let g:startify_custom_header = [  
        \' /$$   /$$ /$$$$$$$$  /$$$$$$  /$$    /$$ /$$$$$$ /$$      /$$',
        \'| $$$ | $$| $$_____/ /$$__  $$| $$   | $$|_  $$_/| $$$    /$$$',
        \'| $$$$| $$| $$      | $$  \ $$| $$   | $$  | $$  | $$$$  /$$$$',
        \'| $$ $$ $$| $$$$$   | $$  | $$|  $$ / $$/  | $$  | $$ $$/$$ $$',
        \'| $$  $$$$| $$__/   | $$  | $$ \  $$ $$/   | $$  | $$  $$$| $$',
        \'| $$\  $$$| $$      | $$  | $$  \  $$$/    | $$  | $$\  $ | $$',
        \'| $$ \  $$| $$$$$$$$|  $$$$$$/   \  $/    /$$$$$$| $$ \/  | $$',
        \'|__/  \__/|________/ \______/     \_/    |______/|__/     |__/',
        \]

let g:startify_session_dir = '~/.config/nvim/session'

let g:startify_lists = [
          \ { 'type': 'files',     'header': ['   Files']                        },
          \ { 'type': 'dir',       'header': ['   Current Directory '. getcwd()] },
          \ { 'type': 'sessions',  'header': ['   Sessions']                     },
          \ { 'type': 'bookmarks', 'header': ['   Bookmarks']                    },
          \ ]

let g:startify_session_autoload = 1
let g:startify_session_delete_buffers = 1
let g:startify_change_to_vcs_root = 1
let g:startify_fortune_use_unicode = 1
let g:startify_session_persistence = 1

let g:startify_bookmarks = [
            \ { 'i': '~/.config/nvim/init.vim' },
            \ { 't': '~/.tmux.conf' },
            \ { 'z': '~/.zshrc' },
            \ { 'n':  '~/Dev/Nodejs-tutorial'},
            \ { 'r':'~/Dev/React-framework'},
            \ ]

let g:startify_files_number =10
let g:startify_change_to_vcs_root = 1
let g:startify_fortune_use_unicode = 1

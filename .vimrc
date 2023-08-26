set relativenumber
set noerrorbells
set smartindent  
set incsearch
set nowrap
set termguicolors
set tabstop=4 softtabstop=4
syntax enable
set colorcolumn=80
highlight ColorColumn ctermbg=10 guibg=grey

nnoremap ; :
let mapleader=","
imap jj <Esc>

let g:rainbow_active = 1

"Plug 'valloric/youcompleteme'

" Important!!
if has('termguicolors')
  set termguicolors
endif

" For dark version.
set background=dark

" For light version.
"set background=light

" Set contrast.
" This configuration option should be placed before `colorscheme gruvbox-material`.
" Available values: 'hard', 'medium'(default), 'soft'
" let g:gruvbox_material_background = 'hard'

" colorscheme gruvbox

"set background=dark
"Themes:
"base16-material-dark
"murphy 
"onedark
"dracula
"miramare
"gurvbox
"gruvbox-material
"set background=dark
"monokai
"sv
"railscasts
"archman

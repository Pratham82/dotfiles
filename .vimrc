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

call plug#begin('~/.vim/plugged')
Plug 'morhetz/gruvbox'                                                         
Plug 'jremmen/vim-ripgrep'
Plug 'vim-utils/vim-man'
Plug 'chriskempson/base16-vim'
Plug 'davidhalter/jedi-vim'
Plug 'dracula/vim', { 'as': 'dracula' }
Plug 'joshdick/onedark.vim'
Plug 'sainnhe/gruvbox-material'
Plug 'preservim/nerdtree'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'sheerun/vim-polyglot'
Plug 'gruvbox-community/gruvbox'
Plug 'sainnhe/gruvbox-material'
Plug 'phanviet/vim-monokai-pro'
Plug 'vim-airline/vim-airline'
Plug 'flazz/vim-colorschemes'
Plug '/home/mpaulson/personal/vim-be-good'
Plug 'pangloss/vim-javascript'
Plug 'mattn/emmet-vim'
call plug#end()

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

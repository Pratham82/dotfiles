"    ____      _ __        _
"   /  _/___  (_) /__   __(_)___ ___
"   / // __ \/ / __/ | / / / __ `__ \
" _/ // / / / / /__| |/ / / / / / / /
"/___/_/ /_/_/\__(_)___/_/_/ /_/ /_/


set termguicolors     " enable true colors support
source $HOME/.config/nvim/vim-plug/plugins.vim
source $HOME/.config/nvim/general/settings.vim
source $HOME/.config/nvim/keys/mappings.vim
source $HOME/.config/nvim/plug-config/coc.vim
source $HOME/.config/nvim/themes/airline.vim
source $HOME/.config/nvim/plug-config/start-screen.vim
source $HOME/.config/nvim/plug-config/signify.vim
source $HOME/.config/nvim/plug-config/sneak.vim
source $HOME/.config/nvim/plug-config/fzf.vim


" Lua Plugins
luafile $HOME/.config/nvim/lua/plug-colorizer.lua

" Themes
"source $HOME/.config/nvim/themes/onedark.vim

" Oceanic
"let g:material_style='oceanic'
"set background=dark
"colorscheme vim-material

" Gruvbox
colorscheme gruvbox
"colorscheme happy_hacking 
"colorscheme jellybeans
"colorscheme nord

" Ocea Material *****
"set background=dark
"colorscheme oceanic_material


"let g:airline_theme='one'
"colorscheme one
"set background=dark " for the dark version


" Adding transperncy
"highlight Normal guibg=none
"highlight NonText guibg=none

highlight Normal guibg=none
highlight NonText guibg=none

"let g:lightline = { 'colorscheme': 'nightfly' }
"let g:moonflyIgnoreDefaultColors = 1
"colorscheme nightfly;w 🚨🔶

let g:ale_sign_error = '🚨'
let g:ale_sign_warning ='🔧'
let g:ale_sign_info = '🔔'
" Ale setup

"Setting Airline theme
let g:airline_theme="serene"
"let g:airline_theme='base_16'

let g:rainbow#max_level = 16
let g:rainbow#pairs = [['(', ')'], ['[', ']']]

" List of colors that you do not want. ANSI code or #RRGGBB
autocmd FileType * RainbowParentheses
let g:rainbow#blacklist = [233, 234]

"let g:rainbow#max_level = 16
"let g:rainbow#pairs = [['(', ')'], ['[', ']'], ['{', '}']]
"autocmd FileType * RainbowParentheses

packloadall
" Load all of the helptags now, after plugins have been loaded.
" All messages and errors will be ignored.
silent! helptags ALL

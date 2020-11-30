"'wakatime/vim-wakatime'    ____      _ __        _
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
source $HOME/.config/nvim/plug-config/rainbow.vim


" Lua Plugins
luafile $HOME/.config/nvim/lua/plug-colorizer.lua
luafile $HOME/.config/nvim/lua/treesitter.lua

" Treesitter
autocmd FileType c,cpp,proto, AutoFormatBuffer clang-format

" Spotify Status
let g:spotify_status_style = 'emoji'

let g:spotify_status_format = ' {status} {artists} - {song} {decorator}'





" Themes
"source $HOME/.config/nvim/themes/onedark.vim
" Oceanic
"let g:material_style='oceanic'
"set background=dark
"colorscheme vim-material

" Palenight
set background=dark
colorscheme palenight



" Gruvbox
"colorscheme gruvbox
"set background=dark
"colorscheme happy_hacking 
"colorscheme jellybeans
"colorscheme nord


" Solarized
"colorscheme NeoSolarized
"let g:airline_theme="solarized_flood"


"Solarized
"syntax enable
"set background=dark
"colorscheme solarized

" Oceanic Material *****
"set background=dark
"colorscheme oceanic_material

"let g:airline_theme='one'
"colorscheme one
"set background=dark " for the dark version
"let g:airline_theme="material"

let g:airline_theme="onedark"
"let g:airline_theme="base16_grayscale"


" Adding transperncy
"highlight Normal guibg=none
"highlight NonText guibg=none

highlight Normal guibg=none
highlight NonText guibg=none

"let g:lightline = { 'colorscheme': 'nightfly' }
"let g:moonflyIgnoreDefaultColors = 1
"colorscheme nightfly;w 🚨🔶❌

"let g:ale_sign_error = 'E'
"let g:ale_sign_warning ="W"
let g:ale_sign_error = '❌'
let g:ale_sign_warning ='🔶'
let g:ale_sign_info = '🔔'
" Ale setup


"Setting Airline theme
"let g:airline_theme="gruvbox"

"let g:rainbow_active = 1 "set to 0 if you want to enable it later via :RainbowToggle



" List of colors that you do not want. ANSI code or #RRGGBB
"autocmd FileType * RainbowParentheses
"let g:rainbow#blacklist = [233, 234]


packloadall
" Load all of the helptags now, after plugins have been loaded.
" All messages and errors will be ignored.
silent! helptags ALL

"    ____        __
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

"##### Color Themes #####

" OneDark
"source $HOME/.config/nvim/themes/onedark.vim

"##### Oceanic
"let g:material_style='oceanic'
"set background=dark
"colorscheme vim-material
"colorscheme nightfly

" ##### Oceanic Material 
"set background=dark
"ndow -n nvim
"tmux new-window -n server
"tmux send-keys -t nvim nvim ENTER
"tmux send-keys -t server 'tmux split-window && ltp' ENTER
"
"tmux select-window -t server
"colorscheme oceanic_material
colorscheme OceanicNext
let g:airline_theme="oceanicnext"

"##### Nord
"colorscheme nord
"let g:airline_theme="nord"

"##### Palenight
"set background=dark
"colorscheme palenight

"##### Gruvbox
"colorscheme gruvbox
"set background=dark

"##### Happy hacking
"colorscheme happy_hacking 

"##### Horizon dark
"colorscheme base16-horizon-dark

"##### NeoSolarized
"colorscheme NeoSolarized
"let g:airline_theme="solarized_flood"

"##### Nightlify
"colorscheme nightfly
"let g:lightline = { 'colorscheme': 'nightfly' }
"let g:moonflyIgnoreDefaultColors = 1

"##### One dark
"let g:airline_theme='one'
"colorscheme one
"set background=dark " for the dark version
"let g:airline_theme="material"

"##### Orion
"colorscheme rigel


"##### Monochrome
"colorscheme monochrome


"##### Airline Themes #####

"let g:airline_theme="onedark"
"let g:airline_theme="base16_grayscale"
"let g:airline_theme="gruvbox"

" Adding transperncy
"highlight Normal guibg=none
"highlight NonText guibg=none

"##### Misc

highlight Normal guibg=none
highlight NonText guibg=none

" Ale setup
" 🚨🔶❌
let g:ale_sign_error = '❌'
let g:ale_sign_warning ='🔶'
let g:ale_sign_info = '🔔'

" List of colors that you do not want. ANSI code or #RRGGBB
"autocmd FileType * RainbowParentheses
"let g:rainbow#blacklist = [233, 234]


packloadall
" Load all of the helptags now, after plugins have been loaded.
" All messages and errors will be ignored.
silent! helptags ALL

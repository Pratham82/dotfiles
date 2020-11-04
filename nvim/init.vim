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

" Adding transperncy
highlight Normal guibg=none
highlight NonText guibg=none

"highlight Normal guibg=none
"highlight NonText guibg=none

"let g:lightline = { 'colorscheme': 'nightfly' }
"let g:moonflyIgnoreDefaultColors = 1
"colorscheme nightfly;w 🚨



" Ale setup
let g:ale_sign_error = '🚨'
let g:ale_sign_warning = '🔧'

"Setting Airline theme
let g:airline_theme="jellybeans"

let g:rainbow#max_level = 16
let g:rainbow#pairs = [['(', ')'], ['[', ']'], ['{', '}']]
autocmd FileType * RainbowParentheses



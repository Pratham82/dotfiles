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
source $HOME/.config/nvim/plug-config/rnvimr.vim
source $HOME/.config/nvim/plug-config/fzf.vim
source $HOME/.config/nvim/plug-config/rnvimr.vim
source  $HOME/.config/nvim/plug-config/start-screen.vim
source $HOME/.config/nvim/plug-config/signify.vim
source $HOME/.config/nvim/plug-config/sneak.vim
source $HOME/.config/nvim/plug-config/quickscope.vim
source $HOME/.config/nvim/keys/which-key.vim
source $HOME/.config/nvim/plug-config/floaterm.vim
luafile $HOME/.config/nvim/lua/plug-colorizer.lua

"Setting background theme
"set background=dark
"colorscheme oceanic_material
"source $HOME/.config/nvim/themes/onedark.vim
"source $HOME/.config/nvim/themes/oceanic-next.vim


set bg=dark
colorscheme gruvbox

"set background=dark
"colorscheme oceanic_material
"let g:oceanic_material_allow_italic=1

"set termguicolors     " enable true colors support
"let ayucolor="light"  " for light version of theme
"let ayucolor="mirage" " for mirage version of theme
"let ayucolor="dark"   " for dark version of theme
"colorscheme ayu

let g:rainbow_active = 1

"let g:rainbow#max_level = 16
"let g:rainbow#pairs = [['(', ')'], ['[', ']'], ['{', '}']]
"autocmd FileType * RainbowParentheses

"let g:rainbow_active = 1
"let g:airline_theme="gruvbox"

"set background=dark
"colorscheme palenight

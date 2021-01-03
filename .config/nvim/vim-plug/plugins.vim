" auto-install vim-plug
if empty(glob('~/.config/nvim/autoload/plug.vim'))
  silent !curl -fLo ~/.config/nvim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  "autocmd VimEnter * PlugInstall
  "autocmd VimEnter * PlugInstall | source $MYVIMRC
endif

call plug#begin('~/.config/nvim/autoload/plugged')
    " Themes
    Plug 'joshdick/onedark.vim'
  	Plug 'hardcoreplayers/oceanic-material'
    Plug 'mhartington/oceanic-next'
    Plug 'hzchirs/vim-material'
		Plug 'kristijanhusak/vim-hybrid-material'
		Plug 'mhartington/oceanic-next'
		Plug 'ayu-theme/ayu-vim'
		Plug 'hardcoreplayers/oceanic-material'
		Plug 'hzchirs/vim-material'
		Plug 'rakr/vim-one'
    Plug 'bluz71/vim-nightfly-guicolors'
    Plug 'gruvbox-community/gruvbox'
    Plug 'yorickpeterse/happy_hacking.vim'
    Plug 'arcticicestudio/nord-vim'
    Plug 'glepnir/oceanic-material'
    Plug 'overcache/NeoSolarized'
    Plug 'dracula/vim', { 'as': 'dracula' }
    Plug 'fxn/vim-monochrome'
    Plug 'drewtempelmeyer/palenight.vim'
    Plug 'chriskempson/base16-vim'
    Plug 'voronianski/oceanic-next-color-scheme'   
    Plug 'altercation/vim-colors-solarized'

    " Spotify control
    Plug 'stsewd/spotify.nvim', { 'do': ':UpdateRemotePlugins' }

    " Code formatting (for c++)
    Plug 'google/vim-maktaba'
    Plug 'google/vim-codefmt'
    Plug 'google/vim-glaive'

    " Function signature
    "Plug 'davidhalter/jedi-vim'

    "Plug 'wakatime/vim-wakatime'

    "Multiple cursor 
    Plug 'mg979/vim-visual-multi', {'branch': 'master'}

    " Ale installation

    " Better Syntax Support
    Plug 'sheerun/vim-polyglot'
    " File Explorer
    Plug 'scrooloose/NERDTree'
    " Auto pairs for '(' '[' '{'
    Plug 'jiangmiao/auto-pairs'

    " Rainbow brackets
    " Plug 'luochen1990/rainbow'	
    Plug 'junegunn/rainbow_parentheses.vim'


    " Snippets
    Plug 'peitalin/vim-jsx-typescript'
    Plug 'honza/vim-snippets'
    Plug 'mlaursen/vim-react-snippets'

    " For setting the current directory as the main directory
    Plug 'airblade/vim-rooter'

    "Indent lines

    "FZF and others
     Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
     Plug 'junegunn/fzf.vim'
     Plug 'airblade/vim-rooter'
   
    " Stable version of coc
    Plug 'neoclide/coc.nvim', {'branch': 'release'}

    " Project Management 
    Plug 'mhinz/vim-startify'

    " Text Navigation
    Plug 'justinmk/vim-sneak'

    " Git Integration
    Plug 'mhinz/vim-signify'
    Plug 'tpope/vim-fugitive'
    Plug 'tpope/vim-rhubarb'
    Plug 'junegunn/gv.vim'

    " Colors in terminal
    Plug 'norcalli/nvim-colorizer.lua'

    "Treesitter
    Plug 'nvim-treesitter/nvim-treesitter'


    " Airline and airline themes
    Plug 'vim-airline/vim-airline'
    Plug 'vim-airline/vim-airline-themes'


call plug#end()

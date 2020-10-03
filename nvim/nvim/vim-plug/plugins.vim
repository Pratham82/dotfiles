" auto-install vim-plug
if empty(glob('~/.config/nvim/autoload/plug.vim'))
  silent !curl -fLo ~/.config/nvim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  "autocmd VimEnter * PlugInstall
  autocmd VimEnter * PlugInstall | source $MYVIMRC
endif

call plug#begin('~/.config/nvim/autoload/plugged')

    " Better Syntax Support
    Plug 'sheerun/vim-polyglot'
    " File Explorer
    Plug 'scrooloose/NERDTree'
  	Plug 'jiangmiao/auto-pairs'

	" Themes
    Plug 'joshdick/onedark.vim'
    Plug 'morhetz/gruvbox'
		Plug 'drewtempelmeyer/palenight.vim'	
		Plug 'kristijanhusak/vim-hybrid-material'
		Plug 'mhartington/oceanic-next'
		Plug 'dracula/vim', { 'as': 'dracula' }
		Plug 'ayu-theme/ayu-vim'
		Plug 'hardcoreplayers/oceanic-material'

	
		" Intellisense
		" Stable version of coc
		Plug 'neoclide/coc.nvim', {'branch': 'release'}
		Plug 'luochen1990/rainbow'	
		Plug 'vim-airline/vim-airline'
		Plug 'vim-airline/vim-airline-themes'
		Plug 'kevinhwang91/rnvimr', {'do': 'make sync'}
		Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
		Plug 'junegunn/fzf.vim'
		Plug 'airblade/vim-rooter'
		Plug 'airblade/vim-rooter'
		Plug 'honza/vim-snippets'
		Plug 'peitalin/vim-jsx-typescript'
		Plug  'Yggdroot/indentLine'

		
call plug#end()

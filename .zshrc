# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="/home/pratham82/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
#ZSH_THEME="robbyrussell"
#ZSH_THEME="oxide"
ZSH_THEME="spaceship"
#ZSH_THEME="af-magic"
#ZSH_THEME="bullet-train"
#ZSH_THEME="darkblood"
#ZSH_THEME="xiong-chiamiov"
#ZSH_THEME="ys"
#ZSH_THEME="pure"
#ZSH_THEME="lambda-mod"
#ZSH_THEME="dpoggi"

#ZSH_THEME="agnoster"
# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS=true

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git zsh-autosuggestions vi-mode fzf)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.

# Paths for firefox dev edition
#PATH=${PATH}:"${HOME}/.local/bin"
export PATH=/opt/firefox/firefox:$PATH

# Adding path for deno
export DENO_INSTALL="/home/pratham82/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

# Aadding path for pure theme
fpath+=$HOME/.zsh/pure

# Export path for lsd
export PATH=/home/pratham82/.cargo/bin:$PATH

# Lmabda mode theme
export LAMBDA_MOD_N_DIR_LEVELS=3
#load `lambda-mod` and `oh-my-zsh`


# Example aliases
# alias ohmyzsh="mate ~/.oh-my-zsh"
alias zs="nvim ~/.zshrc"
alias sz="source ~/.zshrc"
alias vs="vim ~/.vimrc"
alias sv="source ~/.vimrc"
alias nvs="nvim ~/.config/nvim/init.vim"
alias nvp="nvim .config/nvim/vim-plug/plugins.vim"
alias as="nvim ~/.config/alacritty/alacritty.yml"
alias asd="cd ~/.config/alacritty/"
alias sht="cd ~/Dev/Shell-scripting"
alias cnv="cd ~/.config/nvim"
alias kas="tmux kill-server"

# System aliases
alias cc="cd ~"
alias dev="cd ~/Dev"
alias py="cd ~/Dev/Python-Programming"
alias c="clear"
alias api="sudo apt install"
alias ap="sudo apt"
alias dot="cp /home/pratham82/{.zshrc,.vimrc,.hyper.js,.tmux.conf} /home/pratham82/dotfiles; sudo cp -r ~/.config/nvim dotfiles/nvim;
sudo cp -r ~/.config/alacritty dotfiles/alacirtty";
alias mk="mkdir"


# Git aliases
alias gs="git status"
alias ga="git add"
alias gaa="git add ."
alias gc="git commit -m"
alias gp="git push"
alias gl="git log"
alias gr="git reset"    
alias gre="git revert"
alias gpu="git pull"
alias k8000="sudo fuser -k 8000/tcp"
alias gcb="git chekout -b"
alias gco="git chekout"

# MongoDB aliases
alias startmo="sudo service mongod start"
alias stopmo="sudo service mongod stop"
alias statmo="sudo service mongod status"

# Shortcuts for lsd
alias ls='lsd'
alias l='ls -l'
alias la='ls -a'
alias lla='ls -la'
alias lt='ls --tree'

# Important shortcuts
alias c.="code ."

bindkey -v

function zle-keymap-select zle-line-init
{
    # change cursor shape in iTerm2
    case $KEYMAP in
        vicmd)      print -n -- "\E]50;CursorShape=0\C-G";;  # block cursor
        viins|main) print -n -- "\E]50;CursorShape=1\C-G";;  # line cursor
    esac

    zle reset-prompt
    zle -R
}

function zle-line-finish
{
    print -n -- "\E]50;CursorShape=0\C-G"  # block cursor
}

zle -N zle-line-init
zle -N zle-line-finish
zle -N zle-keymap-select

fzf-history-widget-accept() {
  fzf-history-widget
  zle accept-line
}
zle     -N     fzf-history-widget-accept
bindkey '^X^R' fzf-history-widget-accept


# Drive ss
# alias tuts="cd dev/sdb1/Downloads/Tutorials"

neofetch
source /home/pratham82/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
#source ./zsh-syntax-highlighting/zsh-syntax-highlighting.zsh


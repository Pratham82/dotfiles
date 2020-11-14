# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
#if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
#  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
#  typeset -g POWERLEVEL9K_INSTANT_PROMPT=quiet
#
#fi

export ZSH="/home/pratham82/.oh-my-zsh"
#ZSH_THEME="spaceship"
#ZSH_THEME="fishy"
#ZSH_THEME="fino"
#ZSH_THEME="gentoo"
ZSH_THEME="gianu"
#ZSH_THEME="pure"
#ZSH_THEME="trapd00r"
#ZSH_THEME="passion"
#ZSH_THEME="oxide"
#ZSH_THEME="lambda-mod"
#ZSH_THEME="zeta"
#ZSH_THEME="jovial"
#ZSH_THEME="powerlevel10k/powerlevel10k"
#POWERLEVEL9K_MODE="nerdfont-complete"
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

# Adding Go binary to the Path
export PATH=$PATH:/usr/local/go/bin

export PATH=$PATH:/usr/local/bin/nvim
#alias nvim=/usr/local/bin/nvim.appimage


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
alias kc="nvim ~/.config/kitty/kitty.conf"
alias asd="cd ~/.config/alacritty/"
alias sht="cd ~/Dev/Shell-scripting"
alias cnv="cd ~/.config/nvim"
alias kas="tmux kill-server"
alias ts="nvim ~/.tmux.conf"
alias robo='/usr/local/bin/robomongo/bin/robo3t'

# Project starters aliases
alias ns="npm start"
alias cra="npx create-react-app"

# System aliases
alias dev="cd ~/Dev"
alias py="cd ~/Dev/Python-Programming"
alias c="clear"
alias cgs="clear && git status"
alias api="sudo apt install"
alias ap="sudo apt"
#alias dot="cp /home/pratham82/{.zshrc,.vimrc,.hyper.js,.tmux.conf} /home/pratham82/dotfiles; sudo cp -r ~/.config/nvim dotfiles/; sudo cp -r ~/.i3 dotfiles;
#sudo cp -r ~/.config/alacritty dotfiles/alacirtty";
alias dot="cp /home/pratham82/{.tmux.conf,.zshrc} /home/pratham82/dotfiles; sudo cp -r ~/.config/nvim dotfiles/; sudo cp -r ~/.i3 dotfiles;
sudo cp -r ~/.config/alacritty dotfiles/alacirtty;sudo cp -r ~/.config/kitty dotfiles/kitty; sudo cp -r ~/.config/polybar dotfiles/;  sudo cp -r ~/.config/Code/User/* dotfiles/vscode;";
alias mk="mkdir"
alias sleep="shutdown now"

# tmux aliases
alias ide=~/ide


# Git aliases
alias gs="git status"
alias ga="git add"
alias gaa="git add ."
alias gc="git commit -m"
alias gcl="git clone"
alias gp="git push"
alias gl="git log"
alias gr="git reset"    
alias gre="git revert"
alias gpu="git pull"
alias k8000="sudo fuser -k 8000/tcp"
alias gcb="git chekout -b"
alias gco="git chekout"



# MongoDB aliases
#alias startmo="sudo service mongod start"
#alias stopmo="sudo service mongod stop"
#alias statmo="sudo service mongod status"
alias startmo="sudo systemctl start monogdb"
alias stopmo="sudo service mongod stop"
alias statmo="sudo service mongod status"

# Shortcuts for lsd
alias ls='lsd'
alias l='ls -l'
alias la='ls -a'
alias lla='ls -la'
alias lt='ls --tree'

## Projects structure
alias ltp='lt node_modules --depth 0&& lt --ignore-glob node_modules'

# Aliases for Arch
alias i3c='nvim ~/.i3/config'
alias pc='nvim ~/.config/polybar/config'
alias drc='nvim ~/.dmenurc'
alias pac='sudo pacman -S'

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


# Loading pure theme
#autoload -U promptinit; promptinit
#prompt pure

#neofetch
source /home/pratham82/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
#source ./zsh-syntax-highlighting/zsh-syntax-highlighting.zsh


source /home/pratham82/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

source /home/pratham82/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
#[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh



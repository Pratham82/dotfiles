export ZSH="/home/pratham82/.oh-my-zsh"
ZSH_THEME="spaceship"
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
alias ts="nvim ~/.tmux.conf"
alias robo='/usr/local/bin/robomongo/bin/robo3t'

# Project starters aliases
alias ns="npm start"
alias cra="npx create-react-app"

# System aliases
alias cc="cd ~"
alias dev="cd ~/Dev"
alias py="cd ~/Dev/Python-Programming"
alias c="clear"
alias cgs="clear && git status"
alias api="sudo apt install"
alias ap="sudo apt"
alias dot="cp /home/pratham82/{.zshrc,.vimrc,.hyper.js,.tmux.conf} /home/pratham82/dotfiles; sudo cp -r ~/.config/nvim dotfiles/;
sudo cp -r ~/.config/alacritty dotfiles/alacirtty";
alias mk="mkdir"
alias sleep="shutdown now"


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
alias startmo="sudo service mongod start"
alias stopmo="sudo service mongod stop"
alias statmo="sudo service mongod status"

# Shortcuts for lsd
alias ls='lsd'
alias l='ls -l'
alias la='ls -a'
alias lla='ls -la'
alias lt='ls --tree'

# Aliases for Arch
alias i3c='nvim ~/.i3/config'

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


source /home/pratham82/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

source /home/pratham82/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

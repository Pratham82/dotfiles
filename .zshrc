# Fig pre block. Keep at the top of this file.
[[ -f "$HOME/.fig/shell/zshrc.pre.zsh" ]] && builtin source "$HOME/.fig/shell/zshrc.pre.zsh"
# Include rbenv for ZSH
#export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
#if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
#  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
#  typeset -g POWERLEVEL9K_INSTANT_PROMPT=quiet
#
#fi

export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="spaceship"
#ZSH_THEME="fishy"
#ZSH_THEME="fino"
#ZSH_THEME="gentoo"
#ZSH_THEME="robbyrussell"
ZSH_THEME="gianu"
##ZSH_THEME="trapd00r"
#ZSH_THEME="passion"
#ZSH_THEME="agnoster"
#ZSH_THEME="oxide"
#ZSH_THEME="lambda-mod"
#ZSH_THEME="zeta"
#SH_THEME="jovial"
#ZSH_THEME="powerlevel10k/powerlevel10k"
#POWERLEVEL9K_MODE="nerdfont-complete"
plugins=(git zsh-autosuggestions vi-mode fzf)
source $ZSH/oh-my-zsh.sh
#BROWSER=/usr/bin/google-chrome-stable
BROWSER=/usr/bin/firefox-developer-edition

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

# Export Path for google-chrome-ubstable

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
alias nvp="nvim ~/.config/nvim/vim-plug/plugins.vim"
alias ac="nvim ~/.config/alacritty/alacritty.yml"
alias kc="nvim ~/.config/kitty/kitty.conf"
alias asd="cd ~/.config/alacritty/"
alias sht="cd ~/Dev/Shell-scripting"
alias cnv="cd ~/.config/nvim"
alias kas="tmux kill-server"
alias ts="nvim ~/.tmux.conf"
alias pico="nvim ~/.config/picom.conf"
alias robo='/usr/local/bin/robomongo/bin/robo3t'
alias space='sudo du -sh'
alias spaced='sudo du -h --max-depth=1'

# Project starters aliases
alias ns="npm start"
alias cra="npx create-react-app"
alias nap="ng new"
alias ras="ng serve --open"

# System aliases
alias dev="cd ~/Dev"
alias py="cd ~/Dev/Python-Programming"
alias c="clear"
alias cgs="clear && git status"
alias api="sudo apt install"
alias ap="sudo apt"
#alias pfetch/pfetch'
#alias dot="cp /home/pratham82/{.zshrc,.vimrc,.hyper.js,.tmux.conf} /home/pratham82/dotfiles; sudo cp -r ~/.config/nvim dotfiles/; sudo cp -r ~/.i3 dotfiles;
#sudo cp -r ~/.config/alacritty dotfiles/alacirtty";
alias dot="cp /home/pratham82/{.tmux.conf,.zshrc} /home/pratham82/dotfiles; sudo cp -r ~/.config/nvim dotfiles/.config; sudo cp -r ~/.config/i3 dotfiles/.config;
sudo cp -r ~/.config/alacritty dotfiles/.config;sudo cp -r ~/.config/kitty dotfiles/.config; sudo cp -r ~/.config/polybar dotfiles/.config;  sudo cp -r ~/.config/Code/User/* dotfiles/.config/vscode; sudo cp ~/.config/picom.conf dotfiles/.config";
alias mk="mkdir"
alias sleep="shutdown now"

# tmux aliases
alias ide=~/ide

# Github automation
alias ghstart=~/start-project.sh

# Postgres
# Enable postgresql: sudo systemctl enable postgresql.service
alias pgs='sudo systemctl status postgresql'
alias pgu='sudo systemctl start postgresql'
alias pgd='sudo systemctl stop postgresql'
alias pgc='psql -d test'

# MongoDB aliases
alias startmo="sudo systemctl start mongodb"
alias stopmo="sudo systemctl stop mongodb"
alias statmo="sudo systemctl status mongodb"

# Docker
alias dockerup="sudo systemctl start docker"
alias dockerdown="sudo systemctl stop docker"
alias dockerstat="sudo systemctl status docker"

# Curl
alias get="curl cheat.sh/"

#Docker related
# Setting docker for normal user
#sudo gpasswd -a pratham82 docker
#newgrp docker

# Removing docker
# suod pacman -Rns docker
# sudo groupdel docker
# suod rm -rf /var/lib/docker

# TeamViewer
alias teamup="sudo systemctl start teamviewerd.service"
alias teamdown="sudo systemctl stop teamviewerd.service"
alias teamstat="sudo systemctl status teamviewerd.service"

# Colors
alias cols="nvim ~/dotfiles/terminal-bg-colors.conf"

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
#jalias gcb="git checkout -b"
#alias gco="git checkout"

# Development shortcuts
alias ecgen="npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react -D"

#alias startmo="sudo service mongod start"
#alias stopmo="sudo service mongod stop"
#alias statmo="sudo service mongod status"

# Shortcuts for lsd
alias ls='lsd'
alias l='ls -l'
alias la='ls -a'
alias lla='ls -la'
alias lt='ls --tree'

## Projects structure
alias ltp='lt node_modules --depth 0&& lt --ignore-glob node_modules'

# Aliases for Arch
alias i3c='nvim ~/.config/i3/config'
alias pc='nvim ~/.config/polybar/config'
alias drc='nvim ~/.dmenurc'
alias pac='sudo pacman -S'
alias pacr='sudo pacman -R'

## Aliases for snap 
alias startsnap='sudo systemctl enable --now snapd.socket'
alias stopsnap='sudo systemctl stop --now snapd.socket'
alias statsnap='sudo systemctl status --now snapd.socket'
alias snapi='sudo snap install'
alias snapun='sudo snap remove'

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

# Vi mode shortcut
# ctrl + shift + space

# Drive ss
# alias tuts="cd dev/sdb1/Downloads/Tutorials"

# Fetch tools
#neofetch
#pfetch
#ufetch
#colorscript random
#nerdfetch

source $HOME/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
#[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

export FZF_BASE=/path/to/fzf/install/dir
#eval "$(starship init zsh)"
[ -f "/home/pratham82/.ghcup/env" ] && source "/home/pratham82/.ghcup/env" # ghcup-env
source "$HOME/.zsh/spaceship/spaceship.zsh"

export PATH="/Users/pratham82/Library/Caches/fnm_multishells/34182_1688615604306/bin":$PATH
export FNM_NODE_DIST_MIRROR="https://nodejs.org/dist"
export FNM_ARCH="arm64"
export FNM_MULTISHELL_PATH="/Users/pratham82/Library/Caches/fnm_multishells/34182_1688615604306"
export FNM_LOGLEVEL="info"
export FNM_DIR="/Users/pratham82/Library/Application Support/fnm"
export FNM_VERSION_FILE_STRATEGY="local"
rehash

# Fig post block. Keep at the bottom of this file.
[[ -f "$HOME/.fig/shell/zshrc.post.zsh" ]] && builtin source "$HOME/.fig/shell/zshrc.post.zsh"
eval "$(/opt/homebrew/bin/brew shellenv)"

# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
#export PATH="$PATH:$HOME/.rvm/bin"
#echo 'eval "$(~/.rbenv/bin/rbenv init - zsh)"' >> ~/.zshrc


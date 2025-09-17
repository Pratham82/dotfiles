#!/bin/bash

# Define the source (home directory)
SOURCE="$HOME"

# Define the destination (current directory)
DEST="$(pwd)"

echo "Copying config files from $SOURCE to $DEST..."

# Copy the .config folder
cp -r "$SOURCE/.config" "$DEST/"

# Copy common dotfiles (add more if needed)
for file in .bashrc .zshrc .vimrc .gitconfig .profile .bash_profile .npmrc; do
  if [ -f "$SOURCE/$file" ]; then
    cp "$SOURCE/$file" "$DEST/"
    echo "Copied $file"
  fi
done

echo "All config files copied successfully!"


#!/bin/bash

# Common setup
TARGET_DIR="$HOME/tmsh/bin/dist/dist64"
TARGET_FILE="$TARGET_DIR/tmsh"
DOWNLOAD_URL="https://zimoshi.github.io/tmsh"

mkdir -p "$TARGET_DIR"
curl -fsSL "$DOWNLOAD_URL" -o "$TARGET_FILE" || { echo "❌ Download failed"; exit 1; }
chmod +x "$TARGET_FILE"

# Add launch + PATH config to supported shells
ZSHRC="$HOME/.zshrc"
BASHRC="$HOME/.bashrc"
FISH_CONFIG="$HOME/.config/fish/config.fish"

ZSH_LINE="[ -f \"$TARGET_FILE\" ] && \"$TARGET_FILE\" ; export PATH=\"$TARGET_DIR:\$PATH\""
BASH_LINE="[ -f \"$TARGET_FILE\" ] && \"$TARGET_FILE\" ; export PATH=\"$TARGET_DIR:\$PATH\""
FISH_LINE="if test -f \"$TARGET_FILE\"; $TARGET_FILE; end; set -gx PATH \"$TARGET_DIR\" \$PATH"

# Zsh
if [ -f "$ZSHRC" ] && ! grep -Fq "$TARGET_FILE" "$ZSHRC"; then
  echo "$ZSH_LINE" >> "$ZSHRC"
  echo "✅ Updated .zshrc"
fi

# Bash
if [ -f "$BASHRC" ] && ! grep -Fq "$TARGET_FILE" "$BASHRC"; then
  echo "$BASH_LINE" >> "$BASHRC"
  echo "✅ Updated .bashrc"
fi

# Fish
if [ -f "$FISH_CONFIG" ] && ! grep -Fq "$TARGET_FILE" "$FISH_CONFIG"; then
  echo "$FISH_LINE" >> "$FISH_CONFIG"
  echo "✅ Updated config.fish"
fi

echo "✅ tmsh installed and configured for zsh, bash, and fish (if present)."

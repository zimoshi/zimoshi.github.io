#!/bin/bash

set -e

# Detect platform
os_id="$(echo "$OSTYPE" | sed 's/[0-9.]//g')"

# Fetch latest downloads page
html=$(curl -sL https://www.python.org/downloads/)

# Determine platform and get download URL
case "$os_id" in
  darwin)
    echo "[+] Platform: macOS"
    if [[ "$html" =~ https://www.python.org/ftp/python/[0-9]+\.[0-9]+\.[0-9]+/python-[0-9]+\.[0-9]+\.[0-9]+-macosx10\.[0-9]+\.pkg ]]; then
      url="${BASH_REMATCH[0]}"
      filename="$HOME/Downloads/$(basename "$url")"
      echo "[+] Downloading: $url"
      curl -L -o "$filename" "$url"
      echo "[*] Downloaded to $filename"
      echo "[*] Opening installer..."
      open "$filename"
    else
      echo "[!] macOS installer URL not found."
    fi
    ;;

  linux*)
    echo "[+] Platform: Linux"
    if [[ "$html" =~ https://www.python.org/ftp/python/[0-9]+\.[0-9]+\.[0-9]+/Python-[0-9]+\.[0-9]+\.[0-9]+\.tgz ]]; then
      url="${BASH_REMATCH[0]}"
      filename="$HOME/Downloads/$(basename "$url")"
      echo "[+] Downloading: $url"
      curl -L -o "$filename" "$url"
      echo "[*] Downloaded to $filename"
      echo "[*] To install manually:"
      echo "    tar -xzf $filename && cd Python-* && ./configure && make && sudo make install"
    else
      echo "[!] Source tarball URL not found."
    fi
    ;;

  *)
    echo "[!] Unsupported platform: $os_id"
    ;;
esac

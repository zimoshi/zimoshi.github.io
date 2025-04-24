#!/bin/bash

set -e

REPO_URL="https://github.com/zimoshi/minicube.git"
INSTALL_DIR="/usr/local/minicube"
BIN_PATH="/usr/local/bin/minicube"
PYTHON=$(which python3 || which python)

echo "🧊 [MiniCube Installer] Cloning MiniCube from GitHub..."
sudo git clone "$REPO_URL" "$INSTALL_DIR"

echo "🧊 [MiniCube Installer] Setting up permissions..."
sudo chmod -R +x "$INSTALL_DIR"

echo "🧊 [MiniCube Installer] Creating launcher at $BIN_PATH..."
echo "#!/bin/bash" | sudo tee "$BIN_PATH" > /dev/null
echo "cd $INSTALL_DIR && $PYTHON main.py" | sudo tee -a "$BIN_PATH" > /dev/null
sudo chmod +x "$BIN_PATH"

echo "🧊 [MiniCube Installer] All set! Type 'minicube' to start your virtual shell."

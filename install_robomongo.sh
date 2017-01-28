#!/bin/bash -e

# Script for installing Robomongo on Ubuntu.

# Copyright 2013 Binary Birch Tree
# http://www.binarybirchtree.com

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

INSTALL_DIR=$HOME/opt
TEMP_DIR=$HOME/tmp

# Install dependencies using Aptitude.
sudo apt-get update
sudo apt-get install -y git qt5-default qt5-qmake scons cmake

# Get the source code from Git. Perform a shallow clone to reduce download time.
mkdir -p $TEMP_DIR
cd $TEMP_DIR
git clone --depth 1 https://github.com/paralect/robomongo.git

# Compile the source.
mkdir -p robomongo/target
cd robomongo/target
cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=$INSTALL_DIR
make
make install

# As of the time of this writing, the Robomongo makefile doesn't actually
# install into the specified install prefix, so we have to install it manually.
mkdir -p $INSTALL_DIR
mv install $INSTALL_DIR/robomongo
mkdir -p $HOME/bin
ln -s $INSTALL_DIR/robomongo/bin/robomongo.sh $HOME/bin/robomongo

# Clean up.
rm -rf $TEMP_DIR/robomongo

#!/bin/zsh

function realpath { echo $(cd $(dirname $1); pwd)/$(basename $1); }

BASEDIR=`realpath $(dirname $0)`

if  [ -d /tmp/screenToGif ]; then
    rm -r /tmp/screenToGif;
fi

if  [ -f /tmp/screenToGif.out ]; then
    rm -r /tmp/screenToGif.out;
fi

if  [ -f /tmp/screenToGif.err ]; then
    rm -r /tmp/screenToGif.err;
fi

rm -rf $BASEDIR/screenToGif.js;

LA_FILE=~/Library/LaunchAgents/screenToGif.plist

if [ -f "$LA_FILE" ]; then
    launchctl unload "$LA_FILE";
fi

rm -rf "$LA_FILE";

echo "ScreenToGif has been uninstalled with success."
echo "You can now remove the $BASEDIR directory if you wish to."
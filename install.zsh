#!/bin/zsh

function realpath { echo $(cd $(dirname $1); pwd)/$(basename $1); }

BASEDIR=`realpath $(dirname $0)`
TEMPLATEDIR="$BASEDIR/templates"

if ! [ -x "$(command -v node)" ]; then
  echo 'Error: node is not installed.' >&2
  exit 1
fi
if ! [ -x "$(command -v brew)" ]; then
  echo 'Error: brew is not installed.' >&2
  exit 1
fi


PATH_TO_NODE="$(which node)";
PATH_TO_SCREENSHOTS="$(defaults read com.apple.screencapture location | sed 's#~#'${HOME}'#g')";

if ! [ -d /tmp/screenToGif ]; then
    mkdir /tmp/screenToGif
fi

PLISTFILE="screenToGif.plist"
JSFILE="screenToGif.js"

rm -rf $BASEDIR/$PLISTFILE;
cp $TEMPLATEDIR/$PLISTFILE $BASEDIR/$PLISTFILE;
sed -i '' 's~{NODE}~'"${PATH_TO_NODE}"'~g' "$BASEDIR/$PLISTFILE";
sed -i '' 's~{PATH_TO_SCRIPT}~'"${BASEDIR}"'~g' "$BASEDIR/$PLISTFILE";
sed -i '' 's#{PATH_TO_SCREENSHOTS}#'"${PATH_TO_SCREENSHOTS}"'#g' "$BASEDIR/$PLISTFILE";

rm -rf $BASEDIR/$JSFILE;
cp $TEMPLATEDIR/$JSFILE $BASEDIR/$JSFILE;
sed -i '' 's#{PATH_TO_SCREENSHOTS}#'"${PATH_TO_SCREENSHOTS}"'#g' "$BASEDIR/$JSFILE";

if ! [ -x "$(command -v ffmpeg)" ]; then
  brew install ffmpeg;
fi
if ! [ -x "$(command -v gifski)" ]; then
  brew install gifski;
fi

LA_FILE="$HOME/Library/LaunchAgents/$PLISTFILE"

if [ -f "$LA_FILE" ]; then
    launchctl unload "$LA_FILE";
fi

mv $BASEDIR/$PLISTFILE "$LA_FILE";
launchctl load "$LA_FILE"

echo "Installed 🥳"
echo "To see logs: tail -f /tmp/screenToGif.out"
echo "To see errors: tail -f /tmp/screenToGif.err"
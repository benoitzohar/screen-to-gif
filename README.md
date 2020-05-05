# screen-to-gif
[MacOS only] Convert automatically screen recordings into gifs.


## Prerequisites

You'll need [Node.js](https://nodejs.org/en/) and [Brew](https://brew.sh/) to get started.
You'll also need [zsh](http://zsh.sourceforge.net/) but it comes pre-installed with the latest version of MacOS so you should be set.

The installer will install [ffmpeg](https://www.ffmpeg.org/) and [gifski-api](https://github.com/sindresorhus/Gifski/tree/master/gifski-api) on your computer.

It will then watch the directory used by MacOS to save screen recordings and encode any new `.mov` file into a gif.

## Installation

1. Download the repo content
2. Open your terminal
3. Run the installation program:

```bash
cd [PATH-TO-THE-DOWNLOADED-FOLDER];
./install.zsh
```

## Usage

The install script will use `launchctl` to register a directoy watcher.

To see it in action:

1. Use `Command + Shift + 5` 
2. Move the record area
3. Click on the `Record` button
4. Use the `Stop recording` icon that appeared in your top bar (more infos about recording your screen [here](https://support.apple.com/en-ca/HT208721))
5. Open your `Screenshots` folder
6. Wait a few seconds for the script to be able to convert the movie to gif
7. Enjoy your gif.

## 


## Uninstallation

Run the uninstall script from the downloaded directory:
```bash
./uninstall.zsh
```
const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

const DIR = "{PATH_TO_SCREENSHOTS}/";
const TMP_DIR = "/tmp/screenToGif/";

const deleteDirectoryRecursive = function(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file, index) => {
      const curDirc = path.join(dir, file);
      if (fs.lstatSync(curDirc).isDirectory()) {
        deleteFolderRecursive(curDirc);
      } else {
        fs.unlinkSync(curDirc);
      }
    });
    fs.rmdirSync(dir);
  }
};

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR);
}
else {
  deleteDirectoryRecursive(TMP_DIR);
  fs.mkdirSync(TMP_DIR);
}


async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

const getLastScreenRecorderFile = () => {
  const files = fs.readdirSync(DIR);

  const movies = files.filter((f) => f.endsWith(".mov"));
  const ordered = movies
    .map((m) => ({ time: fs.lstatSync(DIR + m).mtime.getTime(), name: m }))
    .sort((a, b) => b.time - a.time)
    .map(({ name }) => name);

  return ordered[0];
};

const movie = getLastScreenRecorderFile();
const gifName = movie.replace(".mov", ".gif");
if (!fs.existsSync(DIR + gifName)) {
  const extractFrames = `/usr/local/bin/ffmpeg -i "${DIR + movie}" -r 5 "${
    TMP_DIR + movie
  }.frame%04d.png"`;
  console.log("[ScreenToGif] Extract frames with: " + extractFrames);
  sh(extractFrames)
    .then(({ stdout, stderr }) =>
      console.log("[ScreenToGif] Extracted! " + stdout + "(error:" + stderr + ")")
    )
    .then(() => {
      const frames = fs.readdirSync(TMP_DIR);
      console.log("[ScreenToGif] Got "+frames.length+" frames...");
      const turnToGif = `/usr/local/bin/gifski --quality 8 --width 800 --fps 7 -o "${DIR + gifName}" ${
        TMP_DIR + movie.split(" ").join("\\ ")
      }.frame*.png`;
      console.log("[ScreenToGif] Turn into gif with: " + turnToGif);

      return sh(turnToGif).then(({ stdout, stderr }) =>
        console.log("[ScreenToGif] Gif created! " + stdout + "(error:" + stderr + ")")
      );
    })
    .then(() => {
      const frames = fs.readdirSync(TMP_DIR);
      console.log("[ScreenToGif] Cleaning up "+frames.length+" frames...");
      frames.forEach(f => fs.unlinkSync(TMP_DIR + f));
    })
    .then(() => {
      console.log("[ScreenToGif] All done ✅");
    })
    .catch(console.log);
} else {
  console.log("[ScreenToGif] Gif already exists:" + gifName);
}

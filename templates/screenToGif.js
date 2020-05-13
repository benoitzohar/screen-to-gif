const fs = require("fs");
const exec = require("child_process").exec;

const DIR = "{PATH_TO_SCREENSHOTS}/";
const TMP_DIR = "/tmp/screenToGif/";

if (!fs.existsSync(TMP_DIR)) {
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
  const extractFrames = `/usr/local/bin/ffmpeg -i "${DIR + movie}" "${
    TMP_DIR + movie
  }.frame%04d.png"`;
  console.log("Extract frames with: " + extractFrames);
  sh(extractFrames)
    .then(({ stdout, stderr }) =>
      console.log("Extracted! " + stdout + "(error:" + stderr + ")")
    )
    .then(() => {
      const turnToGif = `/usr/local/bin/gifski --quality 12 --width 800 -o "${DIR + gifName}" ${
        TMP_DIR + movie.split(" ").join("\\ ")
      }.frame*.png `;
      console.log("Turn into gif with: " + turnToGif);

      return sh(turnToGif).then(({ stdout, stderr }) =>
        console.log("Gif created! " + stdout + "(error:" + stderr + ")")
      );
    })
    .then(() => {
      console.log("Cleaning up frames...");
      const frames = fs.readdirSync(TMP_DIR);
      frames.forEach(f => fs.unlinkSync(TMP_DIR + f));
    })
    .then(() => {
      console.log("All done ✅");
    })
    .catch(console.log);
} else {
  console.log("Gif already exists:" + gifName);
}

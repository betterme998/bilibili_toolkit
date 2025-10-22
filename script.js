const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
let child_process = require("child_process");
const { spawn } = require("child_process");

function readFolder(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    let addPath = path.resolve("./b");
    let newPath = path.resolve(folderPath) + "\\";

    files.forEach((file, index) => {
      const filePath = path.join(newPath, file);
      const filesItem = fs.readdirSync(filePath);

      // 过滤出音频/视频/.json路径
      const mediaFiles = filesItem
        .filter((item) => {
          return (
            path.extname(item) === ".m4s" || path.extname(item) === ".json"
          );
        })
        .map((item) => path.join(filePath, item));

      // 分离音频、视频和json文件
      const jsonFile = mediaFiles.find(
        (file) => path.extname(file) === ".json"
      );
      const m4sFiles = mediaFiles.filter(
        (file) => path.extname(file) === ".m4s"
      );

      if (!jsonFile || m4sFiles.length < 2) {
        console.log(`文件夹 ${file} 中缺少必要的文件`);
        return;
      }

      // 获取视频标题信息
      let videoInfo = JSON.parse(fs.readFileSync(jsonFile)).title;

      // 确保输出文件名是合法的文件名
      videoInfo = videoInfo.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

      // 简单判断哪个是音频哪个是视频文件（通常音频文件较小）
      let videoFile, audioFile;
      if (fs.statSync(m4sFiles[0]).size > fs.statSync(m4sFiles[1]).size) {
        videoFile = m4sFiles[0];
        audioFile = m4sFiles[1];
      } else {
        videoFile = m4sFiles[1];
        audioFile = m4sFiles[0];
      }
      console.log(videoFile);
      

      // 检查文件是否存在且可读
      if (!fs.existsSync(videoFile) || !fs.existsSync(audioFile)) {
        console.log(`文件缺失: ${videoFile} 或 ${audioFile}`);
        return;
      }

      // 执行ffmpeg命令代码
      // const command = `ffmpeg -i "${videoFile}" -i "${audioFile}" -vcodec copy -acodec copy -f mp4 "${addPath}\\${videoInfo}.mp4"`;
      // console.log(`执行命令: ${command}`);

      // shell.exec(command, function (code, stdout, stderr) {
      //   if (code === 0) {
      //     console.log(`成功处理: ${videoInfo}`);
      //   } else {
      //     console.log(`处理失败: ${videoInfo}`, stderr);
      //   }
      // });
    });
  } catch (error) {
    console.error(`Error reading folder: ${error.message}`);
  }
}
// 指定要读取的文件夹路径
const folderPath = "./a";

// 调用函数
readFolder(folderPath);
/*
a文件放哔哩哔哩下载好的文件夹，b文件放合并好的文件夹

每次执行sell时，先遍历输出视频标题，看看有没有问题

如果遇见长时间等待问题，可能是合并的视频标题中存在非法文件名，需要而外处理

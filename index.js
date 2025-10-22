const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
let child_process = require("child_process");
const { spawn } = require("child_process");

// 执行 npm run build 命令

function readFolder(folderPath) {
  try {
    // 读取文件夹内容,返回一个数组，包含所有文件名
    const files = fs.readdirSync(folderPath);

    // 显示文件列表
    let addPath = path.resolve("./b"); //b文件夹路径
    let newPath = path.resolve(folderPath) + "\\"; //a文件夹路径
    console.log(newPath);

    files.forEach((file, index) => {
      const filePath = path.join(newPath, file); //拼接文件路径
      const filesItem = fs.readdirSync(filePath); //获取文件列表数组

      // 过滤出音频/视频/.json路径
      const videoAudio = filesItem
        .filter((item) => {
          return (
            path.extname(item) === ".m4s" || path.extname(item) === ".json"
          );
        })
        .map((item) => path.join(filePath, item));

      // 获取.json文件当中的视频标题信息
      let videoInfo = JSON.parse(fs.readFileSync(videoAudio[2])).title;
      let videoPath = videoAudio[0];
      let audioPath = videoAudio[1];
      console.log(videoPath);
      console.log(audioPath);

      // console.log(videoAudio);
      //执行ffmpeg命令代码;
      shell.exec(
        `ffmpeg -i ${videoPath} -i ${audioPath} -vcodec copy -acodec copy -f mp4 ${addPath}\\${videoInfo}.mp4`,
        function (code, stdout, stderr) {
          if (code === 0) {
            console.log("成功");
            // do something
          }
        }
      );
    });
  } catch (error) {
    // console.error(`Error reading folder: ${error.message}`);
  }
}

// 指定要读取的文件夹路径
const folderPath = "./d";

// 调用函数
readFolder(folderPath);
/*
a文件放哔哩哔哩下载好的文件夹，b文件放合并好的文件夹

每次执行sell时，先遍历输出视频标题，看看有没有问题

如果遇见长时间等待问题，可能是合并的视频标题中存在非法文件名，需要而外处理
*/

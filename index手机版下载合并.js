const { log } = require("console");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
let child_process = require("child_process");
const { spawn } = require("child_process");

// 执行 npm run build 命令

function readFolder(folderPath) {
  try {
    // 读取文件夹内容
    const files = fs.readdirSync(folderPath);

    // 显示文件列表
    let addPath = path.resolve("./b");
    let newPath = path.resolve(folderPath) + "\\";
    console.log(newPath);

    files.forEach((file, index) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      // 路径当中文件名称有时不同
      let numberPath = "80";
      const files = fs.readdirSync(path.resolve(newPath + `${file}`));
      if (Number(files[0])) {
        numberPath = files[0];
      }
      // 音频和视频路径
      let videoPath = newPath + `${file}/${numberPath}/video.m4s`;
      let audioPath = newPath + `${file}/${numberPath}/audio.m4s`;
      console.log(videoPath);
      console.log(audioPath);

      // 视频标题
      let entryUrl = path.resolve(newPath + `${file}`, "./entry.json");

      let rawdata = "";
      let fileinfo = "";
      let newName = "";
      // 存在文件缺失用
      // fs.access(entryUrl, fs.constants.F_OK, (err) => {
      //   entryUrl = err
      //     ? index
      //     : path.resolve(newPath + `${file}`, "./entry.json");

      //   if (err) {
      //     newName = index + "";
      //   } else {
      //     rawdata = fs.readFileSync(entryUrl);
      //     fileinfo = JSON.parse(rawdata);
      //     newName =
      //       fileinfo.page_data.page +
      //       String(fileinfo.page_data.part).slice(
      //         String(fileinfo.page_data.part).indexOf("-day")
      //       );
      //   }
      //   console.log(newName);
      //   shell.exec(
      //     `ffmpeg -i ${videoPath} -i ${audioPath} -vcodec copy -acodec copy -f mp4 ${addPath}\\${newName}.mp4`,
      //     function (code, stdout, stderr) {
      //       if (code === 0) {
      //         console.log("成功");
      //         // do something
      //       }
      //     }
      //   );
      // });

      // 获取视频标题信息
      rawdata = fs.readFileSync(entryUrl);
      fileinfo = JSON.parse(rawdata);
      console.log(rawdata);
      // 裁剪 需要排序名称使用
      // newName =
      //   fileinfo.page_data.page +
      //   String(fileinfo.page_data.part)
      //     .slice(String(fileinfo.page_data.part).indexOf("-"))
      //     .replace(/\s/g, "");

      // 不裁剪 需要排序名称使用
      newName =
        fileinfo.page_data.page +
        "_" +
        String(fileinfo.page_data.part).replace(/\s/g, "");

      // 不需要排序名称使用
      // newName = String(fileinfo.page_data.part).replace(/\s/g, "");
      // console.log(newName);

      //执行ffmpeg命令代码;
      shell.exec(
        `ffmpeg -i ${videoPath} -i ${audioPath} -vcodec copy -acodec copy -f mp4 ${addPath}\\${newName}.mp4`,
        function (code, stdout, stderr) {
          if (code === 0) {
            console.log("成功");
            // do something
          }
        }
      );
    });
  } catch (error) {
    console.error(`Error reading folder: ${error.message}`);
  }
}

// 指定要读取的文件夹路径
const folderPath = "./a/995248168";

// 调用函数
readFolder(folderPath);
/*
a文件放哔哩哔哩下载好的文件夹，b文件放合并好的文件夹

每次执行sell时，先遍历输出视频标题，看看有没有问题

如果遇见长时间等待问题，可能是合并的视频标题中存在非法文件名，需要而外处理
*/

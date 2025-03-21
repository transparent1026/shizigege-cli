import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";
import createLogger from "progress-estimator";
import chalk from "chalk";
import log from "./log";
// import figlet from "figlet";
// 初始化进度条
const logger = createLogger({
  spinner: {
    interval: 300,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) =>
      // console.info(item)
      chalk.green(item)
    ),
  },
});

// Partial是ES6的语法糖
const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(), // 当前工作目录
  binary: "git", // 指定 git 二进制文件路径
  maxConcurrentProcesses: 6, // 最大并发进程数
};

// const goodPrinter = async () => {
//   const data = await figlet("shizigege");
//   console.log(chalk.rgb(40, 156, 193).visible(data));
// };

export const clone = async (
  url: string,
  projectName: string,
  options: string[]
) => {
  const git: SimpleGit = simpleGit(gitOptions);
  try {
    await logger(git.clone(url, projectName, options), "代码下载中: ", {
      estimate: 7000, // 预计下载时间
    });

    // goodPrinter();
    console.log();
    console.log(chalk.blueBright(`==================================`));
    console.log(chalk.blueBright(`=== 欢迎使用 shizigege-cli 脚手架 ===`));
    console.log(chalk.blueBright(`==================================`));
    console.log();

    log.success(`项目创建成功 ${chalk.blueBright(projectName)}`);
    log.success(`执行以下命令启动项目：`);
    log.info(`cd ${chalk.blueBright(projectName)}`);
    log.info(`${chalk.yellow("pnpm")} install`);
    log.info(`${chalk.yellow("pnpm")} run dev`);
  } catch {
    console.log("下载失败");
  }
};

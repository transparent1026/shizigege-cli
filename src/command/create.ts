import path from "path";
import fs from "fs-extra";
import { input, select } from "@inquirer/prompts";
import { clone } from "../utils/clone";
import { name, version } from "../../package.json";
import axios, { AxiosResponse } from "axios";
import { gt } from "lodash";
import chalk from "chalk";
interface TemplateInfo {
  name: string; // 模板名称
  downloadUrl: string; // 模板下载地址
  description: string; // 模板描述
  branch: string; // 模板分支
}

// 模板下载列表
export const templates: Map<string, TemplateInfo> = new Map([
  [
    "Vite-Vue3-practice-tempalte",
    {
      name: "Vite-Vue3-practice-tempalte",
      downloadUrl: "git@gitee.com:ywdgd/vue3-demo1.git",
      description: "Vue3技术栈开发测试模板",
      branch: "master",
    },
  ],
  [
    "flowable-tempalte",
    {
      name: "flowable-tempalte",
      downloadUrl: "git@gitee.com:ywdgd/style-contact.git",
      description: "flowable测试模板",
      branch: "master",
    },
  ],
]);

// 是否覆盖已存在文件函数
export function isOverwrite(fileName: string) {
  console.warn(`${fileName}文件夹存在`);
  return select({
    message: "是否覆盖?",
    choices: [
      { name: "覆盖", value: true },
      { name: "取消", value: false },
    ],
  });
}

// 注意这里必须换成npm镜像
export const getNpmInfo = async (name: string) => {
  const npmUrl = `https://registry.npmjs.org/${name}`;
  let res = {};
  try {
    res = await axios.get(npmUrl);
  } catch (error) {
    console.error(error);
  }
  return res;
};

export const getNpmLatestVersion = async (name: string) => {
  const { data } = (await getNpmInfo(name)) as AxiosResponse;
  console.log(data, "data的值");
  return data["dist-tags"].latest;
};

export const checkVersion = async (name: string, version: string) => {
  // 获取远端最新版本
  const latestVersion = await getNpmLatestVersion(name);
  // 判断当前版本是否大于远端版本号
  const need = gt(latestVersion, version);
  if (need) {
    console.warn(
      `检查到dawei最新版本： ${chalk.blackBright(
        latestVersion
      )}，当前版本是：${chalk.blackBright(version)}`
    );
    console.log(
      `可使用： ${chalk.yellow(
        "npm install shizigege-cli@latest"
      )}，或者使用：${chalk.yellow("shizigege update")}更新`
    );
  }
};

// 创建函数
export async function create(projectName?: string) {
  console.log(projectName);

  // 初始化模板列表
  const tempalteList = Array.from(templates).map((item) => {
    const [name, info] = item;
    return {
      name,
      value: name,
      description: info.description,
    };
  });
  // 如果没有项目名称就输入
  if (!projectName) {
    projectName = await input({ message: "请输入项目名称" });
  }

  // 如果文件夹存在，则提示是否覆盖
  const filePath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(filePath)) {
    const run = await isOverwrite(projectName);
    if (run) {
      await fs.remove(filePath);
    } else {
      return; // 不覆盖直接结束
    }
  }

  await checkVersion(name, version);
  const tempalteName = await select({
    message: "请选择模板",
    choices: tempalteList,
  });

  const info = templates.get(tempalteName);
  console.log(info);
  // 获取到选择模板进行克隆
  if (info) {
    clone(info.downloadUrl, projectName, ["-b", info.branch]);
  }
}

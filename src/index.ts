import { Command } from "commander";
import { version } from "../package.json";
import { create } from "./command/create";
const program = new Command();
program.name("shizigege").version(version,'-v, --version'); // 注意这里只能用单引号，否则会报错

program.command("create").description("创建一个新项目").argument('[name]', '项目名称').action(async (dirName) => {
    create(dirName)
});

program.parse();

import { Command } from "commander";
import { add, clear, showAll } from "./index";
const program = new Command();

program.option("-a, --xxx", "test command");

program
    .command("add")
    .description("add a file")
    .argument("<string>", "file to add")
    .option("-first", "first input a file name")
    .action((title: string) => {
        add(title);
    });

program
    .command("clear")
    .description("clear all task")
    .action(() => {
        clear();
    });

// 说明没输入任何操作
if (process.argv.length === 2) {
    showAll();
} else {
    program.parse(process.argv);
}

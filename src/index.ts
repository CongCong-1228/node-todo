import inquirer from "inquirer";
import { db } from "./db";

type Task = {
    title: string;
    done: boolean;
};

type ToDoList = any[];

const printTasks = (list: ToDoList) => {
    inquirer
        .prompt({
            type: "list",
            name: "index",
            message: "请选择你要操作的任务",
            choices: [
                { name: "退出", value: "-1" },
                ...list.map((task: Task, index: number) => {
                    return {
                        name: `${task.done ? "[x]" : "[_]"} ${index + 1} - ${
                            task.title
                        }`,
                        value: index.toString(),
                    };
                }),
                { name: "+ 创建任务", value: "-2" },
            ],
        })
        .then((answer) => {
            const index = parseInt(answer.index);
            if (index >= 0) {
                askForAction(list, index);
            } else if (index === -2) {
                askForCreateAction(list);
            }
        });
};

const askForAction = (list: ToDoList, index: number) => {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "请选择操作",
            choices: [
                { name: "退出", value: "quit" },
                { name: "已完成", value: "markAsDone" },
                { name: "未完成", value: "markAsUnDone" },
                { name: "改标题", value: "updateTitle" },
                { name: "删除", value: "remove" },
            ],
        })
        .then((actionAnswer) => {
            switch (actionAnswer.action) {
                case "markAsDone":
                    markAsDone(list, index);
                    break;
                case "markAsUnDone":
                    markAsUnDone(list, index);
                    break;
                case "updateTitle":
                    updateTitle(list, index);
                    break;
                case "remove":
                    remove(list, index);
                    break;
            }
        });
};

const askForCreateAction = (list: ToDoList) => {
    inquirer
        .prompt({
            type: "input",
            name: "title",
            message: "输入任务标题",
        })
        .then((titleAnswer) => {
            list.push({ title: titleAnswer.title, done: false });
            db.write(list);
        });
};

const markAsDone = (list: ToDoList, index: number) => {
    list[index].done = true;
    db.write(list);
};
const markAsUnDone = (list: ToDoList, index: number) => {
    list[index].done = false;
    db.write(list);
};

const updateTitle = (list: ToDoList, index: number) => {
    inquirer
        .prompt({
            type: "input",
            name: "title",
            message: "新的标题",
            default: list[index].title,
        })
        .then((titleAnswer) => {
            list[index].title = titleAnswer.title;
            db.write(list);
        });
};

const remove = (list: ToDoList, index: number) => {
    list.splice(index, 1);
    db.write(list);
};

export const add = async (title: string): Promise<any> => {
    // 类型为unknown的时候在最后使用断言声明类型
    // 先读取当前数据库
    const list = (await db.read()) as ToDoList;
    const task: Task = { title, done: false };
    // 将新加内容加入到数据库中
    list.push(task);
    db.write(list);
};

export const clear = async (): Promise<any> => {
    // 直接往数据库中写入空数组，清空数据库
    db.write([]);
};

export const showAll = async (): Promise<any> => {
    const list = (await db.read()) as ToDoList;
    printTasks(list);
};

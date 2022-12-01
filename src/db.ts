import fs from "fs";

// 读取文件路径的库
import p from "path";

// find user home dir path
const homeDir = process.env.HOME || require("os").homedir();

// 设置数据库目录
const dbPath = p.join(homeDir, ".todo");

export const db = {
    read(path: string = dbPath) {
        return new Promise((resolve, reject): any => {
            fs.readFile(path, { flag: "a+" }, (error, data) => {
                if (error) return reject(error);
                let list: any[];
                try {
                    list = JSON.parse(data.toString());
                } catch (error2) {
                    list = [];
                }
                return resolve(list);
            });
        });
    },

    write(list: string[], path: string = dbPath) {
        return new Promise<void>((resolve, reject) => {
            const string = JSON.stringify(list);
            fs.writeFile(path, string + "\n", (error) => {
                if (error) return reject(error);
                resolve();
            });
        });
    },
};

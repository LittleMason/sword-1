import * as fs from "fs";
import { mkdir } from "fs/promises";
import * as path from "path";
import * as os from "os";
import { OutputChannel } from "../outputChannel";
import { ActionsType, createModel } from "../types/templates";
import {
  vueTemp,
  apiTemp,
  dataTemp,
  drawerTemp,
  storeTemp,
} from "../templates";

export class FileUtil {
  private static readonly WIN32_HOST_PATH: string =
    "C:\\Windows\\System32\\drivers\\etc\\hosts";
  private static readonly MAC_HOST_PATH: string = "/etc/hosts";
  private static readonly META_FILE_NAME: string = "meta.json";

  public static createDefaultHostFloder(appRoot: string) {
    OutputChannel.appendLine(`Ready to create ${path.join(appRoot, ".host")}`);
    fs.mkdirSync(path.join(appRoot, ".host"));
    // create current host file
    const osType = os.platform();
    let sysHostPath =
      osType.indexOf("win32") > -1 ? this.WIN32_HOST_PATH : this.MAC_HOST_PATH;
    let data = fs.readFileSync(sysHostPath);

    fs.writeFileSync(path.join(appRoot, ".host", "default.host"), data);
    // set default choose host
    fs.writeFileSync(
      path.join(appRoot, ".host", this.META_FILE_NAME),
      JSON.stringify({ cur: ["default22"] })
    );

    OutputChannel.appendLine(`Create ${path.join(appRoot, ".host")} success`);
  }

  public static async createFolderByTemp(params: createModel) {
    const {
      projectUrl,
      modelName,
      modelPath,
      actions,
      title,
      addName,
      apiName,
      hasStore,
      apis,
      hasDictionary,
      hasDynamicTable,
      hasProjectDefaultParam,
    } = params;
    const folderPath = `${projectUrl}\\src\\views\\${modelPath}`; //生成模块完整路径
    const apiPath = `${projectUrl}\\src\\api\\${modelPath}`; //生成api完整路径
    const apiFileName = apiName ? `${apiName}.ts` : "index.ts"; //api文件名称

    const res = await mkdir(folderPath);
    const dataResult = await fs.writeFileSync(
      `${folderPath}\\data.ts`,
      dataTemp(hasDictionary)
    );
    if (hasStore) {
      await fs.writeFileSync(`${folderPath}\\store.ts`, storeTemp(modelName));
    }
    await fs.writeFileSync(`${apiPath}\\${apiFileName}`, apiTemp(apis, title));
    await fs.writeFileSync(
      `${folderPath}\\index.vue`,
      vueTemp(addName, modelName, title, apiPath, actions)
    );
    await fs.writeFileSync(
      `${folderPath}\\Drawer.vue`,
      drawerTemp(
        apiPath,
        modelName,
        addName,
        hasProjectDefaultParam,
        hasDynamicTable,
        actions
      )
    );
    console.log("dataResult:", dataResult);
    return res;
  }

  public static createHostFile(appRoot: string, name: string) {
    fs.writeFileSync(
      path.join(appRoot, ".host", `${name}.host`),
      `# enjoy host : ${name} \n`
    );
  }

  public static renameHostFile(appRoot: string, oldname: string, name: string) {
    fs.renameSync(
      path.join(appRoot, ".host", `${oldname}.host`),
      path.join(appRoot, ".host", `${name}.host`)
    );
  }

  public static getMetaInfo(appRoot: string): any {
    var metaData = fs.readFileSync(
      path.join(appRoot, ".host", this.META_FILE_NAME)
    );
    return JSON.parse(metaData.toString());
  }

  public static setMetaInfo(appRoot: string, data: any): void {
    fs.writeFileSync(
      path.join(appRoot, ".host", this.META_FILE_NAME),
      JSON.stringify(data)
    );
  }

  public static delHostFile(appRoot: string, item: any) {
    // del metainfo
    let metaInfo = this.getMetaInfo(appRoot);
    let curLabelIndex = metaInfo.cur.indexOf(
      path.basename(item.label, ".host")
    );

    if (metaInfo.cur && curLabelIndex > -1) {
      metaInfo.cur.splice(curLabelIndex, 1);
      this.setMetaInfo(appRoot, metaInfo);
    }

    if (fs.existsSync(item.filePath)) {
      fs.unlinkSync(item.filePath);
    }
  }

  public static gethostConfigFileList(appRoot: string): any {
    OutputChannel.appendLine(
      `Ready to get usefull host config from : ${path.join(
        appRoot,
        ".host"
      )} floder.`
    );
    let hostFiles: string[] = fs.readdirSync(path.join(appRoot, ".host"));
    let usefullHostFiles: string[] = new Array<string>();
    if (hostFiles && hostFiles.length > 0) {
      hostFiles.forEach((hostFile) => {
        let fileStats: fs.Stats = fs.statSync(
          path.join(appRoot, ".host", hostFile)
        );
        if (fileStats.isFile() && hostFile !== this.META_FILE_NAME) {
          usefullHostFiles.push(hostFile);
        }
      });
    }
    OutputChannel.appendLine(
      `Get usefull host config from : ${path.join(appRoot, ".host")} success`
    );
    return usefullHostFiles;
  }

  public static syncChooseHost(appRoot: string): any {
    const osType = os.platform();
    let sysHostPath =
      osType.indexOf("win32") > -1 ? this.WIN32_HOST_PATH : this.MAC_HOST_PATH;
    let data = "";
    let metaInfo = this.getMetaInfo(appRoot);
    let files = this.gethostConfigFileList(appRoot);
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        if (metaInfo.cur.indexOf(path.basename(file, ".host")) > -1) {
          let filePath = path.join(appRoot, ".host", file);
          let curHostData = fs.readFileSync(filePath).toString();
          data =
            data +
            `\n# host ${file} start\n` +
            curHostData +
            `\n# host ${file} end\n`;
        }
      });
    }
    fs.writeFileSync(sysHostPath, data);

    OutputChannel.appendLine(
      `syncChooseHost: ${metaInfo.cur.join(",")}success`
    );
  }
  public static pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }

    return true;
  }
}

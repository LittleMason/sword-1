import * as fs from 'fs';
import {mkdir} from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { OutputChannel } from "../outputChannel";

interface createModel {
    name:string;
    url:string;
}
export class FileUtil{
    private static readonly WIN32_HOST_PATH:string = "C:\\Windows\\System32\\drivers\\etc\\hosts";
    private static readonly MAC_HOST_PATH:string = "/etc/hosts";
    private static readonly META_FILE_NAME:string = "meta.json";

    public static createDefaultHostFloder(appRoot:string){
        OutputChannel.appendLine(`Ready to create ${path.join(appRoot, '.host')}`);
        fs.mkdirSync(path.join(appRoot, '.host'));
        // create current host file
        const osType = os.platform();
        let sysHostPath = osType.indexOf('win32') > -1 ? this.WIN32_HOST_PATH : this.MAC_HOST_PATH;
        let data = fs.readFileSync(sysHostPath);   
        
        fs.writeFileSync(path.join(appRoot, '.host','default.host'), data);
        // set default choose host
        fs.writeFileSync(path.join(appRoot, '.host', this.META_FILE_NAME), JSON.stringify(
           { cur: ['default22'] }
        ));

        OutputChannel.appendLine(`Create ${path.join(appRoot, '.host')} success`);
    }

    public static datasFactory(chars?:object){
        return '我是你爸爸'
    }
    public static storeFactory(chars?:object){
        return '我是你爸爸'
    }
    public static vueFactory(chars?:object){
        return `<template>
        <div>
          <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
            <template #toolbar>
              <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <TableAction
                  :actions="[
                    {
                      icon: 'clarity:note-edit-line',
                      onClick: handleEdit.bind(null, record),
                    },
                    {
                      icon: 'ant-design:delete-outlined',
                      color: 'error',
                      popConfirm: {
                        title: '是否确认删除',
                        placement: 'left',
                        confirm: handleDelete.bind(null, record),
                      },
                    },
                  ]"
                />
              </template>
            </template>
          </BasicTable>
          <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
        </div>
      </template>
      <script lang="ts">
        import { defineComponent, nextTick } from 'vue';
      
        import { recusionMap } from '/@/utils/helper/treeHelper';
        import { BasicTable, useTable, TableAction } from '/@/components/Table';
        import { getMenuList } from '/@/api/auth/menu';
      
        import { useDrawer } from '/@/components/Drawer';
        import MenuDrawer from './MenuDrawer.vue';
      
        import { useMenuStore } from "./menu.store";
        import { columns, searchFormSchema, initClientID } from './menu.data';
      
        export default defineComponent({
          name: 'MenuManagement',
          components: { BasicTable, MenuDrawer, TableAction },
          setup() {
            //设置clientID
            const menuStore = useMenuStore();
            menuStore.setClientID(initClientID);
      
            const [registerDrawer, { openDrawer }] = useDrawer();
            const handleAfterFetch = (res)=>{
              return recusionMap(res[0].childMenus);
            }
            const [registerTable, { reload, expandAll, collapseAll,getDataSource }] = useTable({
              title: '菜单列表',
              api: getMenuList,
              columns,
              formConfig: {
                labelWidth: 120,
                schemas: searchFormSchema,
              },
              isTreeTable: true,
              pagination: false,
              striped: false,
              useSearchForm: true,
              showTableSetting: true,
              bordered: true,
              showIndexColumn: false,
              canResize: false,
              actionColumn: {
                width: 80,
                title: '操作',
                dataIndex: 'action',
                // slots: { customRender: 'action' },
                fixed: undefined,
              },
              afterFetch:handleAfterFetch
            });
            function handleCreate() {
              openDrawer(true, {
                isUpdate: false,
              });
            }
      
            function handleEdit(record: Recordable) {
              console.log('record:',record);
              openDrawer(true, {
                record:{...record,menuNameZh:record.menuName},
                isUpdate: true,
                parentMenu:getDataSource()
              });
            }
      
            function handleDelete(record: Recordable) {
              console.log(record);
            }
      
            function handleSuccess() {
              reload();
            }
      
            function onFetchSuccess() {
              // 演示默认展开所有表项
              nextTick(collapseAll);
            }
      
            return {
              registerTable,
              registerDrawer,
              handleCreate,
              handleEdit,
              handleDelete,
              handleSuccess,
              onFetchSuccess,
            };
          },
        });
      </script>
      `
    }

    public static async createFolderByTemp(params:createModel){
        const folderPath = `${params.url}\\${params.name}`;
        const res = await mkdir(folderPath);
        await fs.writeFileSync(folderPath+'\\'+params.name+'.data.js', this.datasFactory());
        await fs.writeFileSync(folderPath+'\\'+params.name+'.store.js', this.storeFactory());
        await fs.writeFileSync(folderPath+'\\'+'index.vue', this.vueFactory());
       return res;
    }

    public static createHostFile(appRoot:string,name:string){
        fs.writeFileSync(path.join(appRoot, '.host', `${name}.host`), `# enjoy host : ${name} \n`);
    }

    public static renameHostFile(appRoot:string, oldname:string, name:string){
        fs.renameSync(path.join(appRoot, '.host', `${oldname}.host`), path.join(appRoot, '.host', `${name}.host`));
    }

    public static getMetaInfo(appRoot:string):any{
        var metaData = fs.readFileSync(path.join(appRoot, '.host', this.META_FILE_NAME));
        return JSON.parse(metaData.toString());
    }

    public static setMetaInfo(appRoot:string, data:any):void{
        fs.writeFileSync(path.join(appRoot, '.host', this.META_FILE_NAME), JSON.stringify(data));
    }

    public static delHostFile(appRoot:string,item: any){
        // del metainfo
        let metaInfo = this.getMetaInfo(appRoot);
        let curLabelIndex = metaInfo.cur.indexOf(path.basename(item.label,'.host'));

        if(metaInfo.cur && curLabelIndex > -1){
            metaInfo.cur.splice(curLabelIndex,1);
            this.setMetaInfo(appRoot, metaInfo);
        }

        if (fs.existsSync(item.filePath)) {
            fs.unlinkSync(item.filePath);
        }
    }

    public static gethostConfigFileList(appRoot:string):any{
        OutputChannel.appendLine(`Ready to get usefull host config from : ${path.join(appRoot, '.host')} floder.`);
        let hostFiles:string[] = fs.readdirSync(path.join(appRoot, '.host'));
        let usefullHostFiles:string[] = new Array<string>();
        if(hostFiles && hostFiles.length > 0){
            hostFiles.forEach((hostFile)=>{
                let fileStats:fs.Stats = fs.statSync(path.join(appRoot, '.host', hostFile));
                if(fileStats.isFile() && hostFile !== this.META_FILE_NAME){
                    usefullHostFiles.push(hostFile);
                }
            });
        }
        OutputChannel.appendLine(`Get usefull host config from : ${path.join(appRoot, '.host')} success`);
        return usefullHostFiles;
    }

    public static syncChooseHost(appRoot:string): any{
        const osType = os.platform();
        let sysHostPath = osType.indexOf('win32') > -1 ? this.WIN32_HOST_PATH : this.MAC_HOST_PATH;
        let data = '';
        let metaInfo = this.getMetaInfo(appRoot);
        let files = this.gethostConfigFileList(appRoot);
        if(files && files.length >0){
            files.forEach((file:any)=>{
                if(metaInfo.cur.indexOf(path.basename(file,'.host')) > -1){
                    let filePath = path.join(appRoot,'.host',file);
                    let curHostData = fs.readFileSync(filePath).toString();
                    data = data + `\n# host ${file} start\n` + curHostData + `\n# host ${file} end\n`;
                }
            });
        }
        fs.writeFileSync(sysHostPath, data);

        OutputChannel.appendLine(`syncChooseHost: ${metaInfo.cur.join(',')}success`);
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
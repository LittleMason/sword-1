import {ActionsType} from '../types/templates'

const addBtn = (name)=>{
    return `<a-button type="primary" @click="handleCreate"> 新增${name} </a-button>`
}
const editBtn = ()=>{
    return `{
        icon: 'clarity:note-edit-line',
        onClick: handleEdit.bind(null, record),
        tooltip:'编辑'
      },`
}
const delBtn = ()=>{
    return `{
        icon: 'ant-design:delete-outlined',
        onClick: handleDelete.bind(null, record),
        tooltip:'删除'
      },`
}

const handleAdd = ()=>{
    return `//新增
    function handleCreate() {
      openDrawer(true, {
        isUpdate: false,
      });
    }
    function handleSuccess() {
      reload();
    }`
}

const handleEdit = ()=>{
    return `//编辑
    function handleEdit(record: Recordable) {
      openDrawer(true, {
        record,
        isUpdate: true,
      });
    }`
}

const handleDelete = ()=>{
    return `//删除
    function handleDelete(){

    }`
}
/**
 * @param {string} addName - 新增按钮名称
 * @param {ActionsType} actions - 增删改等操作的启用
 */
export const temps = (addName,actions:ActionsType)=>{
    const {add,del,edit} = actions;
    return `
<template>
    <div>
      <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
        <template #toolbar>
          ${add?addBtn(addName):''}
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                ${edit?editBtn():''}
                ${del?delBtn():''}
              ]"
            />
          </template>
        </template>
      </BasicTable>
      <Drawer @register="registerDrawer" ${add?`@success="handleSuccess"`:''}/>
    </div>
</template>`
}
/**
 * @param {string} modelName - sfc文件名称
 * @param {string} title - 表格名称
 * @param {string} apiPath - 定义api文件存放路径
 * @param {ActionsType} actions - 增删改等操作的启用
 */
export const scripts = (modelName,title,apiPath,actions:ActionsType)=>{
    const {add,del,edit,upload,_export} = actions;
    return `
    <script lang="ts">
    //other第三方
    import { defineComponent, ref } from 'vue';
    //self全局业务组件
    import { BasicTable, useTable, TableAction } from '/@/components/Table';
    import {useDrawer} from "/@/components/Drawer";
    //self页面局部配置及组件
    import { Origin${upload?',Upload,':''}${_export?'Export,Download':''} } from '/@/api/${apiPath}';
    import { columns, searchFormSchema } from './data';
    import Drawer from './Drawer.vue';
  
    export default defineComponent({
      name: '${modelName}',
      components: { BasicTable, Drawer, TableAction },
      setup() {
        const [registerDrawer, { openDrawer }] = useDrawer();
        const [registerTable, { reload }] = useTable({
          title:'${title}',
          api: Origin,
          ${upload?
          `importApi:Upload,
          downloadApi:Download,`:''
          }
          ${_export?`exportApi:Export`:''},
          columns,
          formConfig: {
            labelWidth: 120,
            schemas: searchFormSchema,
          },
          useSearchForm: true,
          showTableSetting: true,
          bordered: true,
          showIndexColumn: true,
          canResize: true,
          actionColumn: {
            width: 80,
            title: '操作',
            dataIndex: '_action',
            fixed: 'left',
          },
        }); 
             
        ${add?handleAdd():''}
        ${del?handleDelete():''}
        ${edit?handleEdit():''}
        
        return {
          registerTable,
          registerDrawer,
          ${add?'handleCreate,':undefined}
          ${add?'handleSuccess,':undefined}
          ${del?'handleDelete,':undefined}
          ${edit?'handleEdit,':undefined}
        };
      },
    });
  </script>`
}


/**
 * @param {string} addName - 添加按钮名称
 * @param {string} modelName - sfc文件名称
 * @param {string} title - 表格名称
 * @param {string} apiPath - 定义api文件存放路径
 * @param {ActionsType} actions - 增删改等操作的启用
 */
const vueTemp = (addName,modelName,title,apiPath,actions:ActionsType)=>{
    return `
    ${temps(addName,actions)}
    ${scripts(modelName,title,apiPath,actions)}
    `
}
export default vueTemp;
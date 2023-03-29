import {ActionsType} from '../types/templates'
let isSimpleSearch = false;
const addBtn = (name)=>{
    return `<a-button type="primary" @click="handleCreate"> ${name||'新增'} </a-button>`
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
      color: 'error',
      tooltip:'删除',
      popConfirm: {
        title: '是否确认删除',
        placement: 'left',
        confirm: handleDelete.bind(null, record),
      },
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
    async function handleDelete(record: Recordable) {
      await Del(record.id);
      reload();
    }`
}
/**
 * @param {string} addName - 新增按钮名称
 * @param {ActionsType} actions - 增删改等操作的启用
 */
export const temps = (addName,actions:ActionsType)=>{
    const {add,del,edit} = actions;
    const needDrawer = (add ?? del ?? edit)
    return `
<template>
    <div>
      <BasicTable @register="registerTable">
        <template #toolbar>
          ${add?addBtn(addName):''}
        </template>
        <template #bodyCell="{ column${!isSimpleSearch ? ', record':''} }">
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
      ${!isSimpleSearch?`<Drawer @register="registerDrawer" ${add?`@success="handleSuccess"`:''}/>`:''}
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
    import { defineComponent } from 'vue';
    //self全局业务组件
    import { BasicTable, useTable, TableAction } from '/@/components/Table';
    //self页面局部配置及组件
    import { Origin,${del?'Del,':''}${upload?'Upload,Download,':''}${_export?'Export':''} } from '/@/api/${apiPath}';
    import { columns, searchFormSchema } from './data';
    //编辑框
    ${!isSimpleSearch?`import {useDrawer} from "/@/components/Drawer";`:''}
    ${!isSimpleSearch?`import Drawer from './Drawer.vue';`:''}
  
    export default defineComponent({
      name: '${modelName}',
      components: { BasicTable, ${!isSimpleSearch?'Drawer,':''} TableAction },
      setup() {
        ${!isSimpleSearch?`const [registerDrawer${!isSimpleSearch ? `,{ openDrawer }`:''}] = useDrawer();`:''}
        const [registerTable, {${!isSimpleSearch?'reload, ':''}${_export?'getForm':''}}] = useTable({
          title:'${title}',
          api: Origin,
          ${upload?
          `importApi:Upload,
          downloadApi:Download,`:''
          }
          ${_export?`exportApi: function () {
            return Export(getForm().getFieldsValue());
          },`:''}
          columns,
          formConfig: {
            labelWidth: 120,
            baseColProps:{span:8},
            schemas: searchFormSchema,
          },
          useSearchForm: true,
          showTableSetting: true,
          bordered: true,
          showIndexColumn: true,
          canResize: true,
          actionColumn: ${!isSimpleSearch?`{
            width: 80,
            title: '操作',
            dataIndex: 'action',
            fixed: 'left',
          }`:'undefined'},
        }); 
             
        ${add?handleAdd():''}
        ${del?handleDelete():''}
        ${edit?handleEdit():''}
        
        return {
          registerTable,
          ${!isSimpleSearch?'registerDrawer,':''}
          ${add?'handleCreate,':''}
          ${add?'handleSuccess,':''}
          ${del?'handleDelete,':''}
          ${edit?'handleEdit,':''}
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
  const { add,edit,del } = actions;
  isSimpleSearch = !add && !edit && !del;
    return `
    ${temps(addName,actions)}
    ${scripts(modelName,title,apiPath,actions)}
    `
}
export default vueTemp;
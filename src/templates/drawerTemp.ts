import { ActionsType } from '../types/templates'
const dynamicTable = ()=>{
    return `
    <BasicTable @register="registerTable">
        <template #headerCell="{ column }">
            <template v-if="column.key === 'customOprate'">
            <span>
                <a-button type="primary" @click="handleAddDriver(column)">新增</a-button>
            </span>
            </template>
            <template v-else>
            <span>
                {{ column.customTitle }}
            </span>
            </template>
        </template>
        <template #bodyCell="datas">
            <template v-if="datas.column.key === 'driverName' || datas.column.key === 'driverTel'">
                <a-input allow-clear v-model:value="tableDatas[datas.index][datas.column.key]" />
            </template>
            <template v-else-if="datas.column.key === 'customOprate'">
                <a-button type="primary" danger @click="handleDelDriver(datas)">删除</a-button>
            </template>
        </template>
    </BasicTable>`
}

const registerTable = ()=>{
    return `
    //table
    const [registerTable, {}] = useTable({
      columns: driversColumn,
      dataSource: tableDatas,
    });`
}

const projectDefaultParam = ()=>{
    return `
    const userStore = useUserStore();
    const appendUserInfo = {
      parkId:userStore.getUserInfo.parkId,
      parkCode:userStore.getUserInfo.parkCode,
    }`
}
const temps = (hasDynamicTable:boolean)=>{
    return `
    <BasicDrawer
      v-bind="$attrs"
      @register="registerDrawer"
      showFooter
      :title="getTitle"
      width="50%"
      @ok="handleSubmit"
    >
        <BasicForm @register="registerForm" />
        ${hasDynamicTable?dynamicTable():''}
    </BasicDrawer>`
}

/**
 * @param {string} apiPath - api文件路径，不需要/@/api/这截公共路径
 * @param {string} modelName - 模块名称
 * @param {string} addName - 新增按钮名称
 * @param {boolean} hasProjectDefaultParam - 当前系统是否有默认传参
 * @param {boolean} hasDynamicTable - 是否启用动态表格
 * @param {ActionsType} actions - 操作启用
 */
const drawerTemp = (apiPath,modelName,addName,hasProjectDefaultParam,hasDynamicTable,actions:ActionsType) => {
  const {add,edit} = actions;
  return `
<template>
    ${temps(hasDynamicTable)}
</template>
<script lang="ts">
    import { defineComponent, ref, computed, unref } from 'vue';
    import { BasicForm, useForm } from '/@/components/Form/index';
    import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
    ${hasDynamicTable?`import { BasicTable } from '/@/components/Table'`:''};
    import { formSchema } from './data';
    import { useUserStore } from '/@/store/modules/user';
  
    import { ${add?'add':''}, ${edit?'edit':''}, } from '/@/api/${apiPath}';
  
    export default defineComponent({
      name: '${modelName}Drawer',
      components: { BasicDrawer, BasicForm, ${hasDynamicTable?`BasicTable`:''} },
      emits: ['success', 'register'],
      setup(_, { emit }) {
        const isUpdate = ref(true);
        const getTitle = computed(() => (!unref(isUpdate) ? '${addName}' : '${addName.replace(/新增/,'编辑')}'));
        const record = ref(null);

        ${hasDynamicTable?`const tableDatas = ref<Array<any>>([]);`:''}
        ${hasDynamicTable?registerTable():''}

        //form
        const [registerForm, { validate, getFieldsValue, setFieldsValue, resetFields, updateSchema }] =
          useForm({
            labelWidth: 120,
            schemas: formSchema,
            showActionButtonGroup: false,
            baseColProps: { lg: 12, md: 24 },
          });
        //drawer
        const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
            resetFields();
            setDrawerProps({ confirmLoading: false });
            isUpdate.value = !!data?.isUpdate;
            if (unref(isUpdate)) {
            setFieldsValue({
                ...data.record,
            });
            record.value = data.record;
            }
        });
        //submit
        async function handleSubmit() {
            try {
              ${hasProjectDefaultParam?projectDefaultParam():''}
              setDrawerProps({ confirmLoading: true });
              const values = await validate();
              if (!unref(isUpdate)) {
                //add
                await add({ ...values,${hasProjectDefaultParam?`...appendUserInfo`:''} });
              } else {
                //edit
                await edit({ ...values, id: unref(record)?.id, ${hasProjectDefaultParam?`...appendUserInfo`:''} });
              }
              closeDrawer();
              emit('success');
            } finally {
              setDrawerProps({ confirmLoading: false });
            }
        }
  
        return {
          getTitle,
          registerDrawer,
          registerForm,
          handleSubmit,
          getFieldsValue,
        };
      },
    });
</script>
  `;
};

export default drawerTemp;

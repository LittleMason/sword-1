import { DynamicFieldType } from "../types/templates";

const useDictionary = () => {
  return `    
    import { } from '/@/api/common/web/webSelect';
    import { useDictionary } from '/@/store/modules/dictionary';

    const dictionStore = useDictionary();
    const deptWebSelectHandler = async function () {

    };
    await deptWebSelectHandler();`;
};

const createTableField = (dynamicFields: DynamicFieldType[]) => {
  //${item.component ? `component:'${item.component}'` : ""} 后续有table组件了再加该字段
  return dynamicFields.map((item) => {
    return `{
            title: '${item.label}',
            dataIndex: '${item.field}',
            width: ${item.width ?? 100},
        }`;
  });
};

const createSearchFormField = (dynamicFields: DynamicFieldType[]) => {
  const datas = dynamicFields.filter((item) => {
    return item.isSearchForm === 1;
  });
  return datas.map((item) => {
    const colSpan = item.component.indexOf("Picker") != -1 ? "24" : "8";
    return `{
         field: '${item.formField || item.field}',
         label: '${item.label}',
         component: '${item.component}',
         colProps: { span: ${colSpan} },
        }`;
  });
};

const createEditFormField = (dynamicFields: DynamicFieldType[]) => {
  const datas = dynamicFields.filter((item) => {
    return item.isEditForm === 1;
  });
  return datas.map((item) => {
    return `{
            field: '${item.formField || item.field}',
            label: '${item.label}',
            component: '${item.component}',
            required: ${item.required ? 'true' : 'false'},
        }`;
  });
};
const dataTemp = (
  hasDictionary: boolean,
  dynamicFields: DynamicFieldType[]
) => {
  return `
    import { BasicColumn, FormSchema } from '/@/components/Table';
    ${hasDictionary ? useDictionary() : ""}

    export const columns: BasicColumn[] = [
      ${createTableField(dynamicFields)}
    ];

    export const searchFormSchema: FormSchema[] = [
      ${createSearchFormField(dynamicFields)}
    ];
    
    export const formSchema: FormSchema[] = [
      ${createEditFormField(dynamicFields)}
    ];`;
};
export default dataTemp;

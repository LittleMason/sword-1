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
  return dynamicFields.map((item) => {
    return `{
            title: '${item.label}',
            dataIndex: '${item.field}',
            width: '${item.width ?? 100}',
            ${item.component ? `component:${item.component}` : ""}
        }`;
  });
};

const createSearchFormField = (dynamicFields: DynamicFieldType[]) => {
  const datas = dynamicFields.filter((item) => {
    return item.isSearchForm === 1;
  });
  return datas.map((item) => {
    const colSpan = item.component.indexOf("Picker") ? "24" : "8";
    return `{
         field: '${item.field}',
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
            field: '${item.field}',
            label: '${item.label}',
            component: '${item.component}',
            required: ${item.required?'true':'false'},
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

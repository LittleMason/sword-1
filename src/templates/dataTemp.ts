const useDictionary = ()=>{
    return `    
    import { } from '/@/api/common/web/webSelect';
    import { useDictionary } from '/@/store/modules/dictionary';

    const dictionStore = useDictionary();
    const deptWebSelectHandler = async function () {

    };
    await deptWebSelectHandler();`
}
const dataTemp = (hasDictionary:boolean)=>{
    return `
    import { BasicColumn, FormSchema } from '/@/components/Table';
    ${hasDictionary?useDictionary():''}

    // {
    //   title: 'XX',
    //   dataIndex: 'XX',
    //   width: 80,
    // },
    export const columns: BasicColumn[] = [
      
    ];

    // {
    //     field: 'parkCode',
    //     label: '园区',
    //     component: 'Input',
    //     colProps: { span: 8 },
    // },
    export const searchFormSchema: FormSchema[] = [

    ];
    
    // {
    //     field: 'plateNumber',
    //     label: '车牌号',
    //     component: 'Input',
    //     required: true,
    // },
    export const formSchema: FormSchema[] = [
      
    ];`
}
export default dataTemp
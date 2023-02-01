export type ComponentType =
  | 'Input'
  | 'InputGroup'
  | 'InputPassword'
  | 'InputSearch'
  | 'InputTextArea'
  | 'InputNumber'
  | 'InputCountDown'
  | 'Select'
  | 'ApiSelect'
  | 'TreeSelect'
  | 'ApiTree'
  | 'ApiTreeSelect'
  | 'ApiRadioGroup'
  | 'RadioButtonGroup'
  | 'RadioGroup'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'AutoComplete'
  | 'ApiCascader'
  | 'Cascader'
  | 'DatePicker'
  | 'MonthPicker'
  | 'RangePicker'
  | 'WeekPicker'
  | 'TimePicker'
  | 'Switch'
  | 'StrengthMeter'
  | 'Upload'
  | 'IconPicker'
  | 'Render'
  | 'Slider'
  | 'Rate'
  | 'Divider'
  | 'ApiTransfer';

export type ActionsType = {
  add?: boolean;
  del?: boolean;
  edit?: boolean;
  upload?: boolean;
  _export?: boolean;
};

export type DynamicFieldType = {
  field:string; //数据库字段
  label:string; //展示名称
  component:ComponentType; //组件
  isSearchForm:boolean | number; //是否是搜索表单字段
  isEditForm:boolean | number; //是否是编辑表单字段
  required?:boolean | number; //编辑字段是否必填
  id:any;
  width?:string | number; //表单列表宽度
}

export type ApiMaps = {
  Origin: string; //查询接口
  Add?:string; //新增接口
  Edit?:string; //编辑接口
  Del?:string; //删除接口
  Upload?:string; //上传接口
  Download?:string; //下载接口
  Export?:string; //导出接口
};

export type createModel = {
  projectUrl: string; //项目地址
  modelName: string; //当前模块名称&sfc文件name名称
  modelPath: string; //模块从views文件夹目录开始的路径（不需要写views）
  title: string; //table的title配置
  addName: string; //新增按钮文案
  dynamicFields?:DynamicFieldType[], //表单、搜索栏、编辑栏数据
  actions?: ActionsType; //操作启用
  apiFileName?: string; //当前模块接口文件名称
  hasStore?: boolean; //是否需要store模块
  hasDictionary?: boolean; //是否启用下拉字典
  hasDynamicTable?: boolean; //动态表格组件
  hasProjectDefaultParam?: boolean;
  apis?: ApiMaps; //接口地址数组
};

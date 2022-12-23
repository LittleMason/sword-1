export type ActionsType = {
    add?:boolean;
    del?:boolean;
    edit?:boolean;
    upload?:boolean;
    _export?:boolean;
    
}

export type createModel={
    projectUrl: string; //项目地址
    modelName: string; //当前模块名称&sfc文件name名称
    modelPath: string; //模块从views文件夹目录开始的路径（不需要写views）
    title:string; //table的title配置
    addName:string; //新增按钮文案
    actions?: ActionsType; //操作启用
    apiName?: string; //当前模块接口文件名称
    hasStore?:boolean; //是否需要store模块
    hasDictionary?:boolean; //是否启用下拉字典
    hasDynamicTable?:boolean;
    hasProjectDefaultParam?:boolean;
    apis?:Array<string>; //接口地址数组
}
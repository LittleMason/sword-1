const fetchApi = (url) => {
  return `Origin = '${url}', //查询`;
};
const addApi = (url) => {
  return `Add = '${url}', //新增`;
};
const delApi = (url) => {
  return `Del = '${url}', //删除`;
};
const editApi = (url) => {
  return `Edit = '${url}', //编辑`;
};
const uploadApi = (upUrl, downUrl) => {
  return `Upload = '${upUrl}', //导入
  Download = '${downUrl}', //模板下载
  `;
};
const exportApi = (url) => {
  return `Export = '${url}', //编辑`;
};
const apiTemp = (apis,title) => {
  const { Origin, Add, Edit, Del, Upload, Download, Export } = apis;
  return `
    import { lorealHttp } from '/@/utils/http/axios';

    enum Api {
      ${Origin ? fetchApi(Origin):''}
      ${Add ? addApi(Add):''}
      ${Del ? delApi(Del):''}
      ${Edit ? editApi(Edit):''}
      ${Upload ? uploadApi(Upload, Download):''}
      ${Export ? exportApi(Export):''}
    }
    
    export const Origin = (params?: any) =>
      lorealHttp.post<any>({ url: Api.Origin, params });
    ${
      Add
        ? `export const Add = (params: any) =>
      lorealHttp.post<any>({ url: Api.Add, params },{autoMessage:true,autoMessageSuccess:'新增成功！'});`
        : ""
    }
    ${
      Del
        ? `export const Del = (id: any) =>
      lorealHttp.post<any>({ url: \`\${Api.Del}/\${id}\` },{autoMessage:true,autoMessageSuccess:'删除成功！'});`
        : ""
    }
    ${
      Edit
        ? `export const Edit = (params: any) =>
        lorealHttp.post<any>({ url: Api.Edit, params },{autoMessage:true,autoMessageSuccess:'编辑成功！'});`
        : ""
    }
    ${
      Upload
        ? `
        export const Upload = (params: any) =>
          lorealHttp.uploadFile(
            {
              url: Api.Upload,
            },
            params,
          );
        export const Download = () =>
          lorealHttp.post<any>(
            { url: Api.Download },
            {
              isDownload: true,
              fileName: '模板文件.xlsx',
            },
          );
        `
        : ""
    }
    ${
      Export
        ? `
        export const Export = (params?:any) =>
          lorealHttp.post<any>(
            { url: Api.Export,params },
            {
              isDownload: true,
              fileName: '${title}.xlsx',
            },
          );`
        : ""
    }
    `;
};
export default apiTemp;

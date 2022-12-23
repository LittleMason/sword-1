/**
 * @param {string} param - 模块名称
 */
const storeTemp = (modelName)=>{
    return `
    import { defineStore } from 'pinia';

    interface ${modelName+'State'} {
      
    }
    export const useMenuStore = defineStore({
      id: 'store-${modelName}',
      state: (): ${modelName+'State'} => ({
        
      }),
      actions: {
        
      },
    });
    `
}
export default storeTemp;
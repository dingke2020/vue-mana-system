// import axios from '../axios'
import axios from 'axios'
/* 
 * 菜单管理模块
 */

 // 保存
export const save = (data) => {
    return axios({
        url: '/menu/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/menu/delete',
        method: 'post',
        data
    })
}
// 查找导航菜单树
export const findNavTree = () => {
    // return axios({
    //     url: '/static/navTree.json',
    //     method: 'get',
        
    // })
    console.log(localStorage.getItem("reloaded"));
    console.log(localStorage.getItem("roleId"));
    return axios.get('/static/navTreeAll.json') //开发环境
    // return axios.get('/documents/navTreeAll.json') //生产环境
    
    // if(localStorage.getItem("roleId") == '1'){
    //     return axios.get('/static/navTreeAll.json') //开发环境
    //     // return axios.get('/documents/navTreeAll.json') //生产环境
    // }else{
    //     return axios.get('/static/navTree.json') //开发环境
    //     // return axios.get('/documents/navTree.json') //生产环境
    // }
}
// 查找导航菜单树
export const findMenuTree = () => {
    return axios({
        url: '/menu/findMenuTree',
        method: 'get'
    })
}
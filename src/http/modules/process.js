// import axios from '../axios'
import axios from 'axios'
/* 
 * 用户管理模块
 */

// 保存
export const save = (data) => {
    // return axios({
    //     url: '/user/save',
    //     method: 'post',
    //     data
    // })
    return axios.post('xaj/mission/addMission',{
        params:data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/user/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    // return axios({
    //     url: '/static/taskManaList.json',
    //     method: 'get',
    //     data
    // })
    return axios.get('/xaj/process/searchProcessList',{
        params:data
    })
}
export const findPageParameter = (data) => {
    return axios({
        url: '/static/processList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/process/searchProcessParametersList',{
    //     params:data
    // })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/user/findPermissions',
        method: 'get',
        params
    })
}
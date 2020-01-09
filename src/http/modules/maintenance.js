// import axios from '../axios'
import axios from 'axios'
/* 
 * 用户管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/user/save',
        method: 'post',
        data
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
    return axios({
        url: '/static/MaintenanceManaList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/maintenance/searchMaintenancePlanList',{
    //     params:data
    // })
}
export const findRecordPage = (data) => {
    return axios({
        url: '/static/MaintenanceManaList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/maintenance/searchMaintenanceRecordList',{
    //     params:data
    // })
}
export const findRepairPage = (data) => {
    return axios({
        url: '/static/MaintenanceManaList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/maintenance/searchRepairRecordList',{
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
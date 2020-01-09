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
    return axios({
        url: '/static/StatisticList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/statistic/searchEmployeePerformanceList',{
    //     params:data
    // })
}
export const findChart = (data) => {
    return axios({
        url: '/static/StatisticList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/statistic/searchEmployeePerformanceChart',{
    //     params:data
    // })
}
export const findPageEquipment = (data) => {
    return axios({
        url: '/static/StatisticList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/statistic/searchEquipmentPerformanceList',{
    //     params:data
    // })
}
export const findChartEquipment = (data) => {
    return axios({
        url: '/static/StatisticList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/statistic/searchEquipmentPerformanceChart',{
    //     params:data
    // })
}
export const findPageAMaintenance = (data) => {
    return axios({
        url: '/static/StatisticList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/statistic/searchMaintenanceStatisticsList',{
    //     params:data
    // })
}
export const findChartAMaintenance = (data) => {
    return axios({
        url: '/static/StatisticList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/statistic/searchMaintenanceStatisticsChart',{
    //     params:data
    // })
}
export const findPageBMaintenance = (data) => {
    return axios({
        url: '/static/StatisticList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/statistic/searchRepairStatisticsList',{
    //     params:data
    // })
}
export const findChartBMaintenance = (data) => {
    return axios({
        url: '/static/StatisticList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/statistic/searchRepairStatisticsChart',{
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
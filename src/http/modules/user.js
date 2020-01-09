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
        url: '/static/UserManaList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/user/searchUserList',{
    //     params:data
    // })
}
export const findPageAuthority = () => {
    return axios({
        url: '/static/UserManaList.json',
        method: 'get'
    })
    // return axios.get('/xaj/user/searchRoleSelection')
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/user/findPermissions',
        method: 'get',
        params
    })
}
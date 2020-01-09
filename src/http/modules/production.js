// import axios from '../axios'
import axios from 'axios'

/* 
 * 机构管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/dept/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/dept/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/static/productionManaList.json',
        method: 'get',
        data
    })
    // return axios.get('/xaj/production/searchByCondition',{
    //     params:data
    // })
}
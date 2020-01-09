/* 
 * 接口统一集成模块
 */
import * as login from './modules/login'
import * as task from './modules/task'
import * as production from './modules/production'
import * as role from './modules/role'
import * as menu from './modules/menu'
import * as maintenance from './modules/maintenance'
import * as configuration from './modules/configuration'
import * as user from './modules/user'
import * as process from './modules/process'
import * as statistic from './modules/statistic'
// import * as log from './modules/log'


// 默认全部导出
export default {
    login,
    task,
    production,
    role,
    menu,
    maintenance,
    configuration,
    user,
    process,
    statistic
    // log
}
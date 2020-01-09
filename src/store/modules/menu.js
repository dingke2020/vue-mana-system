export default {
    state: {
        navTree: [
                  // {"id":1,"icon":"icon-ali-list","name":"任务管理"},
                  // {"id":2,"icon":"icon-ali-Bag","name":"生产管理"}
                  ]
    },
    getters: {
   
    },
    mutations: {
        setNavTree(state, navTree){  // 设置导航菜单树
            state.navTree = navTree;
        }
    },
    actions: {
        
    }
}
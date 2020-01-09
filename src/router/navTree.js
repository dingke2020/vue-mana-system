export default [{
		"id": 35,
		"createBy": "admin",
		"createTime": null,
		"lastUpdateBy": "admin",
		"lastUpdateTime": "2019-06-14T09:05:24.000+0000",
		"parentId": 0,
		"name": "任务管理",
		"url": "/Task/Index",
		"perms": null,
		"type": 2,
		"icon": "icon-ali-list",
		"orderNum": 3,
		"delFlag": 0,
		"parentName": null,
		"level": 0,
		"children": []
	},{
		"id": 45,
		"createBy": "admin",
		"createTime": "2018-11-15T06:39:30.000+0000",
		"lastUpdateBy": "admin",
		"lastUpdateTime": "2018-11-15T06:56:18.000+0000",
		"parentId": 0,
		"name": "生产管理",
		"url": "/Production/Index",
		"perms": "",
		"type": 1,
		"icon": "icon-ali-Bag",
		"orderNum": 5,
		"delFlag": 0,
		"parentName": null,
		"level": 0,
		"children": []
	},{
		"id": 85,
		"createBy": "admin",
		"createTime": "2018-11-15T06:39:30.000+0000",
		"lastUpdateBy": "admin",
		"lastUpdateTime": "2018-11-15T06:56:18.000+0000",
		"parentId": 0,
		"name": "配置管理",
		"url": "/Configuration/Index",
		"perms": "",
		"type": 1,
		"icon": "icon-ali-geara",
		"orderNum": 5,
		"delFlag": 0,
		"parentName": null,
		"level": 0,
		"children": [
			{	"id": 400,
				"name": "工序管理",
				"url": "/Configuration/Index"
			},
			{	"id": 401,
				"name": "设备管理",
				"url": "/Configuration/Device"
			},
			{	"id": 402,
				"name": "物料管理",
				"url": "/Configuration/Material"
			},
			{	"id": 403,
				"name": "工艺路线",
				"url": "/Configuration/Route"
			}
		]
	},{
		"id": 95,
		"createBy": "admin",
		"createTime": "2018-11-15T06:39:30.000+0000",
		"lastUpdateBy": "admin",
		"lastUpdateTime": "2018-11-15T06:56:18.000+0000",
		"parentId": 0,
		"name": "用户管理",
		"url": "/User/Authority",
		"perms": "",
		"type": 1,
		"icon": "icon-ali-sitemap",
		"orderNum": 5,
		"delFlag": 0,
		"parentName": null,
		"level": 0,
		"children": [
			{	"id": 500,
				"name": "员工管理",
				"url": "/User/Index"
			},
			{	"id": 501,
				"name": "权限管理",
				"url": "/User/Authority"
			}
		]
	}]

function Task() {

}

// 任务分类
Task.category = { 
	unkown : 0,
	func   : 1,            // 新功能
	optimi_inner : 2,      // 内网优化
	optimi_outer : 3,      // 外网优化
	bug_inner : 4,         // 内网BUG
	bug_outer : 5,         // 外网BUG
};

// 任务优先级
Task.priority = {
	A : 1,                 // 紧急重要
	B : 2,                 // 紧急不重要
	C : 3,                 // 重要不紧急
	D : 4,                 // 不重要不紧急
};

// 任务状态
Task.status = {
	none : 0,
	created : 1,           // 未开始执行
	coding  : 2,           // 编码中...
	cotest  : 3,           // 联调中...
	qatest  : 4,           // 内网测试中...
	passed  : 5,           // 内网版本测试通过
	released: 6,           // 发布/外网版本测试通过
};

Task.category2text = function(category) {
	switch (category) {
		case Task.category.unkown:
			return '未知';
		case Task.category.func:
			return '新功能';
		case Task.category.optimi_inner:
			return '内网优化';
		case Task.category.optimi_outer:
			return '外网优化';
		case Task.category.bug_inner:
			return '内网BUG';
		case Task.category.bug_outer:
			return '外网BUG';
	}

	return '未知';
}

Task.priority2text = function(priority) {
	switch(priority) {
		case 1:
			return 'A';
		case 2:
			return 'B';
		case 3:
			return 'C';
		case 4:
			return 'D';
	}

	return 'D'
}

Task.status2text = function(status) {
	switch(status) {
		case 0:
			return '未知';
		case 1:
			return '尚未开始';
		case 2:
			return '开发编码';
		case 3:
			return '开发联调';
		case 4:
			return '开发测试';
		case 5: 
			return '测试通过';
		case 6:
			return '已经发布';
	}
	return  '未知';
}

Task.time2text = function(seconds) {
	var date = new Date();
	date.setTime(seconds*1000);
	return (date.getFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate()); 
}

function TaskGrid() {
	this.grid = null;
	this.data = null;
}

TaskGrid.prototype.init = function(selector) {
	this.grid = new dhtmlXGridObject(selector);
	this.grid.setImagePath("/codebase/imgs/");
	this.grid.setHeader("单号,描述,任务分类,优先级,状态,策划,服务器,客户端,QA,提交时间,联调时间,测试时间,版本时间");
	this.grid.setInitWidths("70,300");
	this.grid.setColAlign("center,left,center,center,center,center,center,center,center,center,center,center,center");
	this.grid.setColTypes("dyn,link,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
	this.grid.setColSorting("int,str,str,str,str,str,str,str,str,date,date,date,date");
	this.grid.enableAutoWidth(true);
	this.grid.enableAutoHeight(true);
	this.grid.setStyle("text-align:center;font-weight:bold;");
	this.grid.init();
	this.grid.setSkin("dhx_skyblue");
	
}

TaskGrid.prototype.parse = function(serverdata) {

	var data = new Object();
	data.rows = new Array();

	for (var i = 0; i < serverdata.length; i++) {
		data.rows[i] = new Object();
		data.rows[i].data = new Array();

		data.rows[i].id = serverdata[i].id;                    
		data.rows[i].data[0] = serverdata[i].id;
		data.rows[i].data[1] = serverdata[i].desc;
		data.rows[i].data[2] = Task.category2text(serverdata[i].category);
		data.rows[i].data[3] = Task.priority2text(serverdata[i].priority);
		data.rows[i].data[4] = Task.status2text(serverdata[i].status);
		data.rows[i].data[5] = serverdata[i].designer;
		data.rows[i].data[6] = serverdata[i].server;
		data.rows[i].data[7] = serverdata[i].client;
		data.rows[i].data[8] = serverdata[i].qa;
		data.rows[i].data[9] = Task.time2text(serverdata[i].createtime);
		data.rows[i].data[10] = Task.time2text(serverdata[i].plan_servertime);
		data.rows[i].data[11] = Task.time2text(serverdata[i].plan_cotesttime);
		data.rows[i].data[12] = Task.time2text(serverdata[i].plan_qatesttime);
	}

	console.log(data);

	this.grid.parse(data,"json");	
}
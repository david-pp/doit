
function PlanVersion() {
}

// 版本类型
PlanVersion.category = {
	invalid   : 0,	// 未知
	single    : 1,  // 单区
	multizone : 2,  // 大区
	allzone   : 3,  // 全区
};

// 版本状态
PlanVersion.status = {
	created   	   : 0,  // 刚创建
	debug_test     : 1,  // 内网测试中
	release_test   : 2,  // 外网测试中
	passed         : 3,  // 版本结束
};

PlanVersion.category2text = function (category) {
	switch (category) {
		case 0: return "未知";
		case 1: return "单区";
		case 2: return "大区";
		case 3: return "全区";
	}

	return "未知";
}

PlanVersion.status2img = function (status) {
	switch (status) {
		case 0: return '/codebase/imgs/verstatus_3_created.gif';
		case 1: return '/codebase/imgs/verstatus_1_debugtest.gif';
		case 2: return '/codebase/imgs/verstatus_2_releasetest.gif';
		case 3: return '/codebase/imgs/verstatus_4_passed.gif';
	}

	return '/codebase/imgs/red.gif';
}

function TaskPlan () {
	this.layout = null;
	this.grid_plan = null;
	this.grid_plan_tasks = null;
	this.grid_tasks = null;
}

TaskPlan.prototype.refreshTaskTitle = function () {
	this.layout.setText("b", "未发布的单子 | 总数:" + this.grid_tasks.getRowsNum());
}

TaskPlan.prototype.refreshPlanTasksTitle = function(add) {
	this.layout.setText("c", "版本内容 | 总数:" + (this.grid_plan_tasks.getRowsNum() + add));
}

TaskPlan.prototype.deleteVersion = function(vid) {
	this.grid_plan.deleteRow(vid);

	$.get("/ajax/plan_delete?id=" + vid, function(serverdata, retstatus) {
	});

	$.get("/ajax/plan_remove?vid=" + vid, function(serverdata, retstatus) {
	});
}

TaskPlan.prototype.addVersion = function(vid) {
	alert('add');
}

TaskPlan.prototype.editVersion = function(vid) {
	alert('edit');
}

TaskPlan.prototype.init = function() {
	this.layout = new dhtmlXLayoutObject(document.body, "3L");
	this.layout.cells("a").setText("版本计划");
	this.layout.cells("b").setText("未发布的单子");
	this.layout.cells("c").setText("版本内容");
	this.layout.cells("a").setWidth(250);
	//this.layout.cells("b").setHeight(250);
	this.layout.setCollapsedText("a", "版本计划");
	this.layout.setCollapsedText("b", "未发布的单子");
	this.layout.setCollapsedText("c", "版本内容");

	var statusBar = this.layout.cells("a").attachStatusBar();
    statusBar.setText("Simple Status Bar");

	this.initPlan();
	this.initTasks();
	//this.initPlanTasks(1);
}

TaskPlan.prototype.initPlan = function() {

	this.grid_plan = this.layout.cells("a").attachGrid();	
	this.grid_plan.setImagePath("/codebase/imgs/");
	this.grid_plan.setHeader("状态,日期,类型,描述");
	this.grid_plan.setColAlign("center,center,center,left");
	this.grid_plan.setColTypes("img,ro,ro,link");
	this.grid_plan.setColSorting("str,date,str,str");
	this.grid_plan.setStyle("text-align:center;");
	this.grid_plan.enableAutoWidth(true);
	//this.grid_plan.enableAutoHeight(true);

	var _grid_plan = this.grid_plan;
	var _plan = this;

	// context menu
	this.menu = new dhtmlXMenuObject();
	this.menu.setIconsPath("/codebase/imgs/");
	this.menu.renderAsContextMenu();
	this.menu.attachEvent("onClick", function(menuitemId, type) {
		var data = _grid_plan.contextID.split("_");
    	//rowInd_colInd;
    	var rId = data[0];
    	var cInd = data[1];

    	if (menuitemId == 'delete') {
    		_plan.deleteVersion(rId);
    	}
    	else if (menuitemId == 'new') {
    		_plan.addVersion(rId);
    	}
    	else if (menuitemId == 'edit') {
    		_plan.editVersion(rId);
    	}

		return true;
	});

	this.menu.loadXML("/plan_context.xml");
	this.grid_plan.enableContextMenu(this.menu);

	this.grid_plan.attachEvent("onRowSelect", function(id) {
		_plan.initPlanTasks(id);
	});

	this.grid_plan.init();
	this.grid_plan.setSkin("dhx_terrace");

	$.get("/ajax/plan_list", function(serverdata, retstatus) {
		var data = new Object();
		data.rows = new Array();

		for (var i = 0; i < serverdata.length; i++) {
			data.rows[i] = new Object();
			data.rows[i].data = new Array();

			data.rows[i].id = serverdata[i].id; 
			data.rows[i].data[0] = PlanVersion.status2img(serverdata[i].status);                   
			data.rows[i].data[1] = Task.time2text(serverdata[i].time_make);
			data.rows[i].data[2] = PlanVersion.category2text(serverdata[i].category);
			data.rows[i].data[3] = serverdata[i].desc + '^/p/' + serverdata[i].id;
		}

		_grid_plan.parse(data,"json");	

		_grid_plan.selectRow(0, true, true, true);
	});
}

TaskPlan.prototype.initTasks = function() {
	this.grid_tasks = this.layout.cells("b").attachGrid();	
	this.grid_tasks.setImagePath("/codebase/imgs/");
	this.grid_tasks.setHeader("单号,描述,任务分类,优先级,状态,策划,服务器,客户端,QA,创建时间,提交时间,联调时间,测试时间");
	this.grid_tasks.attachHeader("#text_filter,#text_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter");

	this.grid_tasks.setInitWidths("80,260");
	this.grid_tasks.setColAlign("center,left,center,center,center,center,center,center,center,center,center,center,center");
	this.grid_tasks.setColTypes("ro,link,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
	this.grid_tasks.setColSorting("int,str,str,str,str,str,str,str,str,date,date,date,date");
	this.grid_tasks.setStyle("text-align:center;");
	this.grid_tasks.enableAutoWidth(true);
	this.grid_tasks.enableSmartRendering(true);

	//this.grid_tasks.enableAutoHeight(true);

	var _plan = this;
	var _grid_tasks = this.grid_tasks;

	this.grid_tasks.attachEvent('onDrag', function(sid, tid, sObj) {
		$.get('/ajax/plan_remove?vid='+ sObj.vid +'&tid=' + sid, function(serverdata, retstatus){
		});

		_plan.refreshPlanTasksTitle(-1);
		return true;
	});

	this.grid_tasks.enableDragAndDrop(true);
	this.grid_tasks.init();
	this.grid_tasks.setSkin("dhx_terrace");
	//this.grid_tasks.setSkin("dhx_web");

	
	$.get("ajax/tasklist?type=forplan", function(serverdata, retstatus) {
		var data = new Object();
		data.rows = new Array();

		for (var i = 0; i < serverdata.length; i++) {
				data.rows[i] = new Object();
				data.rows[i].data = new Array();

				data.rows[i].id = serverdata[i].id;                    
				data.rows[i].data[0] = serverdata[i].id;
				data.rows[i].data[1] = serverdata[i].desc + '^/t/' + serverdata[i].id;
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

		_grid_tasks.parse(data,"json");	

		_plan.refreshTaskTitle();
	});
}

TaskPlan.prototype.initPlanTasks = function(vid) {
	this.grid_plan_tasks = this.layout.cells("c").attachGrid();	
	this.grid_plan_tasks.setImagePath("/codebase/imgs/");
	this.grid_plan_tasks.setHeader("单号,描述,任务分类,优先级,状态,策划,服务器,客户端,QA,创建时间,提交时间,联调时间,测试时间");
	this.grid_plan_tasks.setInitWidths("80,260");
	this.grid_plan_tasks.setColAlign("center,left,center,center,center,center,center,center,center,center,center,center,center");
	this.grid_plan_tasks.setColTypes("ro,link,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
	this.grid_plan_tasks.setColSorting("int,str,str,str,str,str,str,str,str,date,date,date,date");
	this.grid_plan_tasks.setStyle("text-align:center;");
	this.grid_plan_tasks.enableAutoWidth(true);
	//this.grid_plan_tasks.enableAutoHeight(true);
	this.grid_plan_tasks.enableDragAndDrop(true);
	this.grid_plan_tasks.vid = vid;

	var _plan = this;
	var _grid_plan_tasks = this.grid_plan_tasks;
	this.grid_plan_tasks.attachEvent('onDrag', function(sid, tid) {
		if (_grid_plan_tasks.doesRowExist(sid))
		{
			alert('任务已存在，不能添加！');
			return false;
		}

		$.get('/ajax/plan_add?vid='+ vid +'&tid=' + sid, function(serverdata, retstatus){

		});

		_plan.refreshPlanTasksTitle(1);

		return true;
	});

	this.grid_plan_tasks.init();
	this.grid_plan_tasks.setSkin("dhx_terrace");

	$.get("/ajax/plan_tasks?id=" + vid, function(serverdata, retstatus) {
		var data = new Object();
		data.rows = new Array();

		for (var i = 0; i < serverdata.length; i++) {
				data.rows[i] = new Object();
				data.rows[i].data = new Array();

				data.rows[i].id = serverdata[i].id;                    
				data.rows[i].data[0] = serverdata[i].id;
				data.rows[i].data[1] = serverdata[i].desc + '^/t/' + serverdata[i].id;
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

		_grid_plan_tasks.parse(data,"json");
		_plan.refreshPlanTasksTitle(0);
	});
}
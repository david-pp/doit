
function TaskPlan () {
	this.layout = null;
	this.grid_plan = null;
	this.grid_plan_tasks = null;
	this.grid_tasks = null;
}

TaskPlan.prototype.init = function() {
	this.layout = new dhtmlXLayoutObject(document.body, "3L");
	this.layout.cells("a").setText("版本计划");
	this.layout.cells("b").setText("单子");
	this.layout.cells("c").setText("版本内容");
	this.layout.cells("a").setWidth(250);
	this.layout.cells("b").setHeight(250);
	//this.layout.setCollapsedText("a", "版本计划");

	this.initPlan();
	this.initTasks(Task.status.passed);
	//this.initPlanTasks(1);
}

TaskPlan.prototype.initPlan = function() {
	this.grid_plan = this.layout.cells("a").attachGrid();	
	this.grid_plan.setImagePath("/codebase/imgs/");
	this.grid_plan.setHeader("日期,类型,描述");
	this.grid_plan.setColAlign("center,center,left");
	this.grid_plan.setColTypes("ro,ro,ro");
	this.grid_plan.setColSorting("date,str,str");
	this.grid_plan.setStyle("text-align:center;");
	this.grid_plan.enableAutoWidth(true);
	//this.grid_plan.enableAutoHeight(true);

	var _grid_plan = this.grid_plan;
	var _plan = this;

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
			data.rows[i].data[0] = Task.time2text(serverdata[i].time_make);
			data.rows[i].data[1] = serverdata[i].category;
			data.rows[i].data[2] = serverdata[i].desc;
		}

		_grid_plan.parse(data,"json");	

		_grid_plan.selectRow(0, true, true, true);
	});
}

TaskPlan.prototype.initTasks = function(status) {
	this.grid_tasks = this.layout.cells("b").attachGrid();	
	this.grid_tasks.setImagePath("/codebase/imgs/");
	this.grid_tasks.setHeader("单号,描述,任务分类,优先级,状态,策划,服务器,客户端,QA,创建时间,提交时间,联调时间,测试时间");
	this.grid_tasks.setInitWidths("80,260");
	this.grid_tasks.setColAlign("center,left,center,center,center,center,center,center,center,center,center,center,center");
	this.grid_tasks.setColTypes("ro,link,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
	this.grid_tasks.setColSorting("int,str,str,str,str,str,str,str,str,date,date,date,date");
	this.grid_tasks.setStyle("text-align:center;");
	this.grid_tasks.enableAutoWidth(true);
	//this.grid_tasks.enableAutoHeight(true);

	var _grid_tasks = this.grid_tasks;
	this.grid_tasks.attachEvent('onDrag', function(sid, tid, sObj) {
		$.get('/ajax/plan_remove?vid='+ sObj.vid +'&tid=' + sid, function(serverdata, retstatus){
		});

		return true;
	});

	this.grid_tasks.enableDragAndDrop(true);
	this.grid_tasks.init();
	this.grid_tasks.setSkin("dhx_terrace");

	

	$.get("/ajax/tasklist?status=" + status, function(serverdata, retstatus) {
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
	this.grid_plan_tasks.enableAutoHeight(true);
	this.grid_plan_tasks.enableDragAndDrop(true);
	this.grid_plan_tasks.vid = vid;

	var _grid_plan_tasks = this.grid_plan_tasks;
	this.grid_plan_tasks.attachEvent('onDrag', function(sid, tid) {
		if (_grid_plan_tasks.doesRowExist(sid))
		{
			alert('任务已存在，不能添加！');
			return false;
		}

		$.get('/ajax/plan_add?vid='+ vid +'&tid=' + sid, function(serverdata, retstatus){

		});

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
	});
}
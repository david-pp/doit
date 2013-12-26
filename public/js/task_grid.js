


function TaskGrid(status) {
	this.grid = null;
	this.data = null;
	this.serverdata = null;
	this.status = status;
}

TaskGrid.prototype.init = function(selector) {
	this.grid = new dhtmlXGridObject(selector);
	this.grid.setImagePath("/codebase/imgs/");
	this.grid.setHeader("单号,描述,任务分类,优先级,状态,策划,服务器,客户端,QA,创建时间,提交时间,联调时间,测试时间");
	this.grid.setInitWidths("80,260");
	this.grid.setColAlign("center,left,center,center,center,center,center,center,center,center,center,center,center");
	this.grid.setColTypes("ro,link,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
	this.grid.setColSorting("int,str,str,str,str,str,str,str,str,date,date,date,date");
	this.grid.enableAutoWidth(true);
	this.grid.enableAutoHeight(true);
	
	this.grid.setStyle("text-align:center;");
	this.grid.init();
	this.grid.setSkin("dhx_terrace");	
}

TaskGrid.prototype.parse = function(serverdata) {

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

	this.data = data;

	this.grid.parse(this.data,"json");	

	// set bgcolor
	var now = new Date();
	for (var i = 0; i < serverdata.length; i++) {

		var need = false;
		var date = new Date();
		if (Task.status.coding == this.status)
		{
			need = true;
			date.setTime(serverdata[i].plan_servertime*1000);
		}
		else if (Task.status.cotest == this.status)
		{
			need = true;
			date.setTime(serverdata[i].plan_cotesttime*1000);
		}
		else if (Task.status.qatest == this.status)
		{
			need = true;
			date.setTime(serverdata[i].plan_qatesttime*1000);
		}

		if (need) 
		{
			// today
			if (now.getFullYear() == date.getFullYear() 
				&& now.getMonth() == date.getMonth() 
				&& now.getDate() == date.getDate())
			{
				this.grid.setRowColor(serverdata[i].id, Task.color.danger);
			} else {

				// timeout
				if (now.getTime() > date.getTime())
					this.grid.setRowColor(serverdata[i].id, Task.color.warning);
			} 
		}
	}
}

TaskGrid.prototype.reset = function(selector) {
	this.init(selector);
	this.grid.parse(this.data,"json");
};

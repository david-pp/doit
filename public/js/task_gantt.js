
function TaskGantt(status) {
	this.status = status;
}

TaskGantt.prototype.init = function(selector) {
	// date parsing
	gantt.config.xml_date="%Y-%m-%j";

	// scale
	gantt.config.date_scale="%d/%n";
	gantt.config.scale_height = 90;

	var weekScaleTemplate = function(date){
		var dateToStr = gantt.date.date_to_str("%d/%n");
		var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
		return dateToStr(date) + " - " + dateToStr(endDate);
	};

	gantt.config.subscales = [
		{unit:"week", step:1, template:weekScaleTemplate},
		{unit:"day", step:1, date:"%D" }
	];

	// setting weekend & today
	gantt.templates.scale_cell_class = function(date){
		var today = new Date();
		if(today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() == date.getDate()) {
			return "today";
		}

        if(date.getDay()==0||date.getDay()==6){
            return "weekend";
        }
    };

    // columns
    gantt.config.columns = [
    	{name : 'id', label:"#", width:20, template: function(item) { return item.id; }},
    	{name:"text", label:"Desc", tree:true, width:'*' }
     ];

    // tooltips
    gantt.templates.tooltip_text = function(start,end,task){
	    return "<b>单　号: </b>" + task.id + 
	    "<br/><b>分　类: </b> "+task.category +
	    "<br/><b>状　态: </b> "+task.status +
	    "<br/><b>优先级: </b> "+task.priority +
	    "<br/><b>策　划: </b> "+task.designer +
	    "<br/><b>服务器: </b> "+task.server +
	    "<br/><b>客户端: </b> "+task.client +
	    "<br/><b>测　试: </b> "+task.qa;
	};

	// auto adjusting scale length
	gantt.config.fit_tasks = true;

	gantt.config.task_height = 25;
    gantt.config.row_height = 30;

    gantt.config.readonly = true;

	gantt.init(selector);

	$.get("/ajax/tasklist?status=" + this.status, function(data, retstatus) {
		gantt.parse(TaskGantt.parse(data));
	});
}

TaskGantt.parse = function(serverdata) {
  var tasks = new Object();
  tasks.data = new Array();

  for (var i = 0; i < serverdata.length; i++) {
    tasks.data[i] = new Object();
    tasks.data[i].id = serverdata[i].id;
    tasks.data[i].text = serverdata[i].desc;
    tasks.data[i].start_date = Task.time2text(serverdata[i].createtime);
    tasks.data[i].duration = parseInt((serverdata[i].plan_qatesttime - serverdata[i].createtime + 24*3600)/(24*3600));
    tasks.data[i].progress = 0.0;
    tasks.data[i].open = true;
    tasks.data[i].category =  Task.category2text(serverdata[i].category);
    tasks.data[i].status = Task.status2text(serverdata[i].status);
    tasks.data[i].priority = Task.priority2text(serverdata[i].priority);
    tasks.data[i].designer = serverdata[i].designer;
    tasks.data[i].server = serverdata[i].server;
    tasks.data[i].client = serverdata[i].client;
    tasks.data[i].qa = serverdata[i].qa;
  }

  return tasks;
}
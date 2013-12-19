
function TaskGantt(status) {
	this.status = status;
}

TaskGantt.prototype.init = function(selector) {
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
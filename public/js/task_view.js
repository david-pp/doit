

function TaskViewer(status) {
	this.status = status;
	this.selector = null;
	this.taskgrid = new TaskGrid(status);
}

TaskViewer.prototype.statusIcon = function() {
	switch (this.status) {
		case Task.status.created  : return 'glyphicon-folder-close';
		case Task.status.coding   : return 'glyphicon-flash';
		case Task.status.cotest   : return 'glyphicon-refresh';
		case Task.status.qatest   : return 'glyphicon-fire';
		case Task.status.passed   : return 'glyphicon-ok';
		case Task.status.released : return 'glyphicon-send';
	}

	return 'glyphicon-star';
}


TaskViewer.prototype.init = function(selector) {
	taskhtml =
'<div class="panel panel-default"> \
  <div class="panel-heading"> \
	<span class="glyphicon ' + this.statusIcon() + '"></span> ' + Task.status2text(this.status) + 
   '<button id="view_gantt_fullscreen'+ this.status +'" class="right" data-toggle="tooltip" data-placement="top" title="Gantt全屏视图"><span class="glyphicon glyphicon-fullscreen"></span></button>\
	<button id="view_gantt' + this.status + '" class="right" data-toggle="tooltip" data-placement="top" title="Gantt窗口视图"><span class="glyphicon glyphicon-indent-left"></span></button>\
	<button id="view_list' + this.status + '" class="right" data-toggle="tooltip" data-placement="top" title="列表视图"><span class="glyphicon glyphicon-list"></span></button>\
  </div>\
  <!--<div class="panel-body"></div>-->\
  <div id="list_here' + this.status + '" style="width:100%"></div>\
  <iframe id="gantt_here' + this.status + '" src="#" frameborder="0" style="width:100%;""></iframe>\
  <!--<div class="panel-footer"></div>-->\
</div>';
	
	$(selector).html(taskhtml);

	$('#gantt_here' + this.status).css('height','760px');
	$('#gantt_here' + this.status).attr("src","/gantt?status=" + this.status);

	
	var _taskgrid = this.taskgrid;
	var _status = this.status;

	this.taskgrid.init('list_here' + this.status);

	$.get("/ajax/tasklist?status=" + this.status, function(data, retstatus) {
		_taskgrid.parse(data);
		$('#gantt_here' + _status).hide();
		//console.log(data);
	});

	$('#view_list' + this.status).click(function(){
		$('#gantt_here' + _status).hide();
		$('#list_here' + _status).show();
	});

	$('#view_gantt' + this.status).click(function(){
		$('#list_here' + _status).hide();
		$('#gantt_here' + _status).show();
		$('#gantt_here' + _status).css('height','760px');
	});

	$('#view_gantt_fullscreen' + this.status).click(function(){
		//open("/gantt?status=<%=status%>", 'newwindow', 'toolbar=no,menubar=no,fullscreen=yes');
		open("/gantt?status=" + _status);
	});
}


TaskViewer.prototype.show = function() {
	$(this.selector).show();
}

TaskViewer.prototype.hide = function() {
	$(this.selector).hide();
}
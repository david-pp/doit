	gantt.config.xml_date="%Y-%m-%j";

		// setting scale
		gantt.config.date_scale="%d/%n";
		/*
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
        gantt.templates.task_cell_class = function(item,date){
        	var today = new Date();
			if(today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() == date.getDate()) {
				return "today";
			}

            if(date.getDay()==0||date.getDay()==6){
                return "weekend"
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

        //gantt.config.readonly = true;
        gantt.config.fit_tasks = true; 
        gantt.config.task_height = 20;
        gantt.config.row_height = 30;
        */

        //gantt.init("gantt_here"); 
		//gantt.parse(Task.parseGanttData(data));
		//$('#gantt_here').hide();









<div class="panel panel-default">
  <!-- Default panel contents -->
  <div class="panel-heading">
	<% if (status == 'created') { %>
		<span class="glyphicon glyphicon-folder-close"></span> 尚未开始
	<% } else if (status == 'coding') { %>
		<span class="glyphicon glyphicon-flash"></span> 编码中
	<% } else if (status == 'cotest') { %>
		<span class="glyphicon glyphicon-refresh"></span> 联调中
	<% } else if (status == 'qatest') { %>
		<span class="glyphicon glyphicon-fire"></span> 测试中
	<% } else if (status == 'passed') { %>
		<span class="glyphicon glyphicon-ok"></span> 测试通过
	<% } else if (status == 'released') { %>
		<span class="glyphicon glyphicon-send"></span> 已放外网
	<% } %>

	 <button id="view_gantt_fullscreen" class="right" data-toggle="tooltip" data-placement="top" title="Gantt全屏视图"><span class="glyphicon glyphicon-fullscreen"></span></button>
	  <button id="view_gantt" class="right" data-toggle="tooltip" data-placement="top" title="Gantt窗口视图"><span class="glyphicon glyphicon-indent-left"></span></button>
	  <button id="view_list" class="right" data-toggle="tooltip" data-placement="top" title="列表视图"><span class="glyphicon glyphicon-list"></span></button>
  </div>
  <!--<div class="panel-body"></div>-->
  <div id="tasklist" style="width:100%"></div>
  <iframe id="gantt_here" src="#" frameborder="0" style='width:100%;'></iframe>
  <!--<div class="panel-footer"></div>-->
</div>



<script>
	var status = 0;
	var taskgrid = new TaskGrid();
	taskgrid.init('tasklist');

	<% if (status == 'created') { %>
		status = Task.status.created;
	<% } else if (status == 'coding') { %>
		status = Task.status.coding;
	<% } else if (status == 'cotest') { %>
		status = Task.status.cotest;
	<% } else if (status == 'qatest') { %>
		status = Task.status.qatest;
	<% } else if (status == 'passed') { %>
		status = Task.status.passed;
	<% } else if (status == 'released') { %>
		status = Task.status.released;
	<% } %>

	$('#gantt_here').css('height','760px');
	$('#gantt_here').attr("src","/gantt?status=<%=status%>");

	$.get("/ajax/tasklist?status=" + status,function(data, status){
		taskgrid.parse(data);
		$('#gantt_here').hide();
	});

	$('#view_list').click(function(){
		$('#gantt_here').hide();
		$('#tasklist').show();
	});

	$('#view_gantt').click(function(){
		$('#tasklist').hide();
		$('#gantt_here').show();
		$('#gantt_here').css('height','760px');
	});

	$('#view_gantt_fullscreen').click(function(){
		//open("/gantt?status=<%=status%>", 'newwindow', 'toolbar=no,menubar=no,fullscreen=yes');
		open("/gantt?status=<%=status%>");
	});


</script>
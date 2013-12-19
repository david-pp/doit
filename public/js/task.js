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

Task.parseGanttData = function(serverdata) {
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

  console.log(tasks);

  return tasks;
}

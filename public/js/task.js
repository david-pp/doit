var mygrid = null;

data = { rows: [
  { id: 1001, data: ["1001", "通用ROLL点机制^/t/1001", "功能", "A-紧急重要", "开发编码", "张三","王二三","程同学","程同学","05/01/2004","05/01/2004","05/01/2004","05/01/2004"]}
 ,{ id: 1002, data: ["1002", "我是一个任务我是一个任务我是一个任务我是一个任务我是一个任务^/t/1002", "外网BUG", "B-紧急", "开发联调", "张四","王二四","林同学","林同学","06/01/2004","06/01/2004","06/01/2004","05/01/2004"]}

    ]}

mygrid = new dhtmlXGridObject('gridbox');
mygrid.setImagePath("/codebase/imgs/");
mygrid.setHeader("单号,描述,任务分类,优先级,状态,策划,服务器,客户端,QA,提交时间,联调时间,测试时间,版本时间");
mygrid.setInitWidths("70,300");
mygrid.setColAlign("center,left,center,center,center,center,center,center,center,center,center,center,center");
mygrid.setColTypes("dyn,link,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
mygrid.setColSorting("int,str,str,str,str,str,str,str,str,date,date,date,date");
mygrid.enableAutoWidth(true);
mygrid.enableAutoHeight(true);

mygrid.setStyle("text-align:center;font-weight:bold;");

mygrid.init();
mygrid.setSkin("dhx_skyblue");
mygrid.parse(data,"json")

function UserTable(data) {
  this.users = data;
  this.title = "";
}

UserTable.group2Text = function(group) {
  switch (group) {
    case 1: return '客户端';
    case 2: return '服务器';
    case 3: return '策划';
    case 4: return 'QA';
  }
  return '';
}

UserTable.prototype.show = function(selector) {
  var userhtml = 
  '<div class="panel panel-default"> \
    <!-- Default panel contents --> \
    <div class="panel-heading"> \
    <span class="glyphicon glyphicon-user"> ' + this.title + '</span> \
    <a href="#" class="right button_adduser"><span class="glyphicon glyphicon-plus"></span></a> \
    </div> \
    <!-- Table --> \
    <table class="table table-bordered table-hover table-condensed"> \
      <thead> \
        <tr> \
          <th>工号</th> \
          <th>姓名</th> \
          <th>密码</th> \
          <th>类型</th> \
          <th>权限</th> \
          <th>操作</th> \
        </tr> \
      </thead> \
      <tbody>';

  for (var i = 0; i < this.users.length; i++) {
    userhtml +=  '<tr> \
      <td>' + this.users[i].id + '</td> \
      <td>' + this.users[i].name + '</td> \
      <td>' + this.users[i].passwd + '</td> \
      <td>' + UserTable.group2Text(this.users[i].group) + '</td> \
      <td> \
      <input type="checkbox" disabled="disabled "'+ ((this.users[i].privillege & 1) ? 'checked="checked"' : '') +'> ADMIN \
      <input type="checkbox" disabled="disabled "'+ ((this.users[i].privillege & 2) ? 'checked="checked"' : '') +'> PM \
      </td> \
      <td> \
      <a href="#" class="button_edituser" value="' + i +'"><span class="glyphicon glyphicon-edit"></span></a>\
      <a href="#" class="button_deluser" value="' + i + '"><span class="glyphicon glyphicon-minus"></span></a>\
      </td>\
    </tr>';
  }

  userhtml += 
      '</tbody> \
    </table> \
  </div>';

  $(selector).html(userhtml);
}

function UserEditDlg(data) {
  this.user = data;
}

UserEditDlg.prototype.show = function(selector) {
  var info=
  '<div class="modal fade" id="userEditDlg" tabindex="-1" role="dialog" aria-labelledby="userEditDlgLabel" aria-hidden="true"> \
  <div class="modal-dialog"> \
    <div class="modal-content"> \
      <div class="modal-header"> \
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
        <h4 class="modal-title" id="userEditDlgLabel">' + (this.user ? "编辑成员信息" : "添加成员")+ '</h4> \
      </div> \
      <div class="modal-body"> \
        <form class="form-horizontal" role="form"> \
          <div class="form-group"> \
            <label for="inputEmail3" class="col-sm-2 control-label" id="focusedInput" >工号</label> \
            <div class="col-sm-10"> \
              <input type="email" class="form-control" id="user_id" value="'+((this.user && this.user.id) ? this.user.id : '')+'"> \
            </div> \
          </div> \
          <div class="form-group"> \
            <label for="inputPassword3" class="col-sm-2 control-label">姓名</label> \
            <div class="col-sm-10"> \
              <input type="text" class="form-control" id="user_name" value="'+((this.user && this.user.name) ? this.user.name : '')+'"> \
            </div> \
          </div> \
          <div class="form-group"> \
            <label for="inputPassword3" class="col-sm-2 control-label">密码</label> \
            <div class="col-sm-10"> \
              <input type="password" class="form-control" id="user_passwd" value="'+((this.user && this.user.passwd) ? this.user.passwd : '')+'"> \
            </div> \
          </div> \
          <div class="form-group"> \
            <label for="inputPassword3" class="col-sm-2 control-label">权限</label> \
            <div class="col-sm-10"> \
              <label class="checkbox-inline"> \
                <input type="checkbox" id="user_privillege_admin" value="1" ' + ((this.user && this.user.privillege && (this.user.privillege & 1)) ? 'checked="checked"' : '') + '> ADMIN \
              </label> \
              <label class="checkbox-inline"> \
                <input type="checkbox" id="user_privillege_pm" value="2" ' + ((this.user && this.user.privillege && (this.user.privillege & 2)) ? 'checked="checked"' : '') + '> PM \
              </label>   \
              <label class="checkbox-inline"> \
                <select class="form-control" id="user_group"> \
                  <option value="2" ' +((this.user && this.user.group && this.user.group==2) ? 'selected="selected"' : '')+ '>服务器</option> \
                  <option value="1" ' +((this.user && this.user.group && this.user.group==1) ? 'selected="selected"' : '')+ '>客户端</option> \
                  <option value="3" ' +((this.user && this.user.group && this.user.group==3) ? 'selected="selected"' : '')+ '>策划</option> \
                  <option value="4" ' +((this.user && this.user.group && this.user.group==4) ? 'selected="selected"' : '')+ '>QA</option> \
                </select> \
               </label>\
            </div> \
          </div> \
        </form> \
      </div> \
      <div class="modal-footer"> \
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button> \
        <button type="submit" class="btn btn-primary" id="user_submit">保存</button> \
      </div> \
    </div><!-- /.modal-content --> \
  </div><!-- /.modal-dialog --> \
  </div><!-- /.modal -->'

  $(selector).html(info);

  $('#userEditDlg').modal('show');

  $('#user_submit').click(function(){

    var privillege = 0;
    if ($('#user_privillege_admin').val()=='1')
      privillege += 1;
    if ($('#user_privillege_pm').val()=='2')
      privillege += 2;

    var user = {
      id    : $('#user_id').val(),
      name  : $('#user_name').val(),
      passwd: $('#user_passwd').val(),
      group : $('#user_group').val(),
      privillege : privillege,
    };

    console.log(user);
    console.log($('#user_privillege_pm').attr('checked'));
    $('#userEditDlg').modal('hide');
  });
} 

UserEditDlg.prototype.hide = function() {
  $('#userEditDlg').modal('hide');
}


var ut = new UserTable();
var ue = new UserEditDlg();

function reg_useradmin_event() 
{
  $('.button_adduser').click(function(){
    ue.user = null;
    ue.show('#user_edit_dlg')
  });

  $('.button_edituser').click(function(){
    var value = $(this).attr('value');
    if (value < ut.users.length)
    {
      ue.user = ut.users[value];
      console.log(ue.user);
      ue.show('#user_edit_dlg');
    }
  });

  $('.button_deluser').click(function(){
    var value = $(this).attr('value');

    console.log(ut.users);
    if (value < ut.users.length)
    {
      ut.users.splice(value, 1);
      ut.show('#user_programer');
      reg_useradmin_event();      
    }
  });
}

$(document).ready(function(){
  $.get("/ajax/userlist",function(data,status){
    ut.users = data;
    ut.title = "项目成员";
    ut.show('#user_programer');

    reg_useradmin_event();
  });

});






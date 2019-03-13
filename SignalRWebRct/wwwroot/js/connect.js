
"use strict";
let user = new Model({
    connectionId: "",
    inCall: false,
    username: ""
})
let users = new Model({
    userlist : []
})
let connection = new signalR.HubConnectionBuilder().withUrl("/lolo").build();
let start = async function () {
    try {
        await connection.start();
        console.log("connected");
        connection.invoke("Join", localStorage.getItem("user")).catch(function (err) {
            return console.error(err.toString());
        });
    } catch (err) {
        console.log(err);
        setTimeout(() => start(), 5000);
    }
};
connection.onclose(async () => {
    await start();
});
connection.on("UpdateUserList", function (userList) {
    users.userlist = userList;
    $('[data-kackisi]').text(userList.length);
    var html = "";
    userList.forEach(function(item){
        html += "<li class='Users' data-listConnectionId='"+item.connectionId+"'>"+
        "<a href='#'><div class='Username' data-listUsername=''>"+item.username+"</div>"+
        "<div class='helper' data-liststatus=''>"+status(item.status)+"</div></a></li>"
        
      });
      $(".user-list").html(html);
});
connection.on("join", function (m) {
    user.connectionId = m.connectionId;
    user.username = m.username;
    user.inCall = m.inCall;
    $('[data-status]').text(status(m.inCall));
});
let giris = async function () {
    if (await localStorage.getItem("user") == undefined)
    {
        alertify.prompt("Adın Ne?", '', 'Misafir' + Math.floor((Math.random() * 10000) + 1), function (e, us) {
            if (e == false || us == '') {
                us = 'Misafir' + Math.floor((Math.random() * 10000) + 1);
                alertify.success('Sana Bu Kullanıcıyı Atadık. Hayırlı Olsun ' + us);
            }
            localStorage.setItem("user", us);
            $('[data-username]').text(localStorage.getItem("user"));
            start();
        }, '');
    }
    else
    {
        $('[data-username]').text(localStorage.getItem("user"));
        start();
    }
}
function status(a)
{
    if (a) {
      return  "Arıyor";
    }
    else {
       return "Beklemede";
    }
}


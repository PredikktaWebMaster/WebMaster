//var userDomains;
var username = localStorage['username'];
var password = localStorage['password'];
var validDomains = {};
$(document).ready(function () {
    //userDomains = JSON.parse(localStorage['domain']);

//    $.ajax({
//        type: 'POST',
//        url: 'https://mandrillapp.com/api/1.0/messages/send.json',
//    data: {
//        key: 'cf833413566af697150bc6555616e75f-us17',
//      message: {
//        from_email: 'jibin@predikkta.com',
//        to: [
//            {
//              email: 'jibin@predikkta.com',
//              name: 'Jibin',
//              type: 'to'
//      },
//],
//autotext: 'true',
//subject: 'YOUR SUBJECT HERE!',
//html: '<h1>YOUR EMAIL CONTENT HERE! YOU CAN USE HTML!</h1>'
//}
//    },
//    success: function (data) {
//        alert("hai");
//    }

//}).done(function(response) {
//    console.log(response); // if you're into that sorta thing
//});



if (localStorage['isLoggedOut'] == "true" || localStorage['isLoggedOut'] == null) {
        window.location = "login.html?Result=LoginRequired&";
    }
else{
    $.ajax({
        type: 'GET',
        contenttype: 'application/json',
        datatype: 'json',
        crossDomain: true,
        url: 'http://localhost:61647/api/searchconsole/LoginCheck?userName=' + username + '&password=' + password + '&',
        success: function (data) {
            if (data != 0) {
                $("#invalid").css('display', 'none');
                localStorage['isLoggedOut'] = false;

                validDomains.domains = [];
                for (var i = 0; i < data.length; i++) {
                    validDomains.domains.push({ "id": data[i], "status": 'ok' });
                }
                localStorage['domain'] = JSON.stringify(validDomains);
                DomainLoader();

            }
            else {
                $("#invalid").css('display', 'block');
                $("#loginRequired").css('display', 'none');
            }

        },
        error: function (e) {

        }

    });

}

});

function Submit(domainId)
{
    //window.location = "HtmlPage1.html?Domain=" + domainId + "&User=" + username + "&";
    window.location = "domainConsole.html?Domain=" + domainId + "&User=" + username + "&";
}


function DomainLoader()
{
    $.ajax({
        type: 'GET',
        contenttype: 'application/json',
        datatype: 'json',
        crossDomain: true,
        url: 'http://localhost:61647/api/searchconsole/Domains',
        success: function (data) {
            var div = "";
            if (data != "" && data != "") {
                for (var i = 0; i < validDomains.domains.length; i++) {

                    for (var j = 0; j < data.length; j++) {
                        if (validDomains.domains[i].id == data[j].Id) {
                            //div += "<div id='domain" + validDomains.domains[i].id + "' class='eachDomain' onclick='Submit(" + validDomains.domains[i].id + ")' onmouseover = 'highLight(" + validDomains.domains[i].id + ")' onmouseout = 'dim(" + validDomains.domains[i].id + ")'><span class='domainName'>" + data[j].Name + "</span><span><img src='images/link-white-small.png' /></span></div>";
                            div += "<li>  <div id='domain" + validDomains.domains[i].id + "' style='cursor:pointer' onclick='Submit(" + validDomains.domains[i].id + ")' onmouseover = 'highLight(" + validDomains.domains[i].id + ")' onmouseout = 'dim(" + validDomains.domains[i].id + ")'>" + data[j].Name + "<span><img src='images/link-white-small.png' /></span></div></li>";
                            break;
                        }
                    }

                }
                //$("#container").html(div);
                $(".website-list").html(div);
      
            }

        },
        error: function (e) {
        }

    });
}

function highLight(tableid) {
    $("#domain" + tableid).removeClass("highLight");
    $("#domain" + tableid).addClass("highLight");
}

function dim(tableid)
{
    $("#domain" + tableid).removeClass("highLight");
}

function logginout() {
    localStorage['isLoggedOut'] = true;
}

function homeRedirect() {
    //window.location = "login.html";
    window.location = "login.html";
}
/// <reference path="C:\Users\Jibin Thomas\Documents\Visual Studio 2015\Projects\WebMaster\WebMaster\Domains.html" />
/// <reference path="C:\Users\Jibin Thomas\Documents\Visual Studio 2015\Projects\WebMaster\WebMaster\Domains.html" />

var previousPageUrl;
var parameters = Array();
var validDomains = {};
$(document).ready(function () {
    //if (typeof (history.pushState) != "undefined") {
    //    var obj = { Title: 'login', Url: 'login' };
    //    history.pushState(obj, obj.Title, obj.Url);
    //}
    $("#loginRequired").css('display', 'none');
    previousPageUrl = window.location.href;
    parameters[0] = previousPageUrl.substring(previousPageUrl.lastIndexOf("=") + 1, previousPageUrl.lastIndexOf("&"));
    if (parameters[0] == "")
    {
        $("#Username").val(localStorage['username']);
        $("#Password").val(localStorage['password']);
    }
    else
    {
        $("#loginRequired").css('display', 'block');
    }


});

function Submit() {
    var username = $("#Username").val();
    var password = $("#Password").val();
    if (username && password)
    {
        $("#invalid").css('display', 'none');
        localStorage['username'] = username;                          //creating session storage to store username
        localStorage['password'] = password;                          //creating session storage to store password
        var fh = 'http://localhost:61647/api/searchconsole/LoginCheck?userName=' + username + '&password=' + password + '&';

        $.ajax({
            type: 'GET',
            contenttype: 'application/json',
            datatype: 'json',
            crossDomain: true,
            url: 'http://localhost:61647/api/searchconsole/LoginCheck?userName=' + username + '&password=' + password + '&',
            success: function (data) {
                if (data != 0) {
                    $("#invalid").css('display', 'none');
                    localStorage['isLoggedOut'] = false;              // session variable which is used to check the login/logout status

                    validDomains.domains = [];
                    for (var i = 0; i < data.length; i++) {
                        validDomains.domains.push({"id":data[i], "status" : 'ok'});
                    }
                    localStorage['domain'] = JSON.stringify(validDomains);                              // session variable to store the list of valid domains
                    ////window.location = "HtmlPage1.html?Domain=" + data + '&User=' + username + '&';
                    ////window.location = "HtmlPage1.html?Domain=1&User=' + username + '&";
                    // window.location = "Domains.html?User=" + username + "&";

                    //window.location = "yourDomains.html?User=" + username + "&";                        //redirecting to next page after user validation
                    window.location = "list-websites.html?User=" + username + "&";
                }
                else {
                    $("#invalid").css('display', 'block');
                    $("#loginRequired").css('display', 'none');
                }

            },
            error: function (e) {
                alert("error occured"+fh);
            }

        });
    }
    else
    {
        $("#invalid").css('display', 'block');
        
    }
}
function homeRedirect()
{
    //window.location = "login.html";
    window.location = "login.html";
}

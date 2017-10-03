//var userDomains;
var username = localStorage['username'];
var password = localStorage['password'];
var validDomains = {};
$(document).ready(function () {
    //userDomains = JSON.parse(localStorage['domain']);

if (localStorage['isLoggedOut'] == "true" || localStorage['isLoggedOut'] == null) {
        window.location = "Login.html?Result=LoginRequired&";
    }
else{
    $.ajax({
        type: 'GET',
        contenttype: 'application/json',
        datatype: 'json',
        crossDomain: true,
        url: 'http://localhost:8067/api/searchconsole/LoginCheck?userName=' + username + '&password=' + password + '&',
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
    window.location = "HtmlPage1.html?Domain=" + domainId + "&User=" + username + "&";
}


function DomainLoader()
{
    $.ajax({
        type: 'GET',
        contenttype: 'application/json',
        datatype: 'json',
        crossDomain: true,
        url: 'http://localhost:8067/api/searchconsole/Domains',
        success: function (data) {
            var div = "";
            if (data != "" && data != "") {
                for (var i = 0; i < validDomains.domains.length; i++) {

                    for (var j = 0; j < data.length; j++) {
                        if (validDomains.domains[i].id == data[j].Id) {
                            div += "<div id='domain" + validDomains.domains[i].id + "' class='eachDomain' onclick='Submit(" + validDomains.domains[i].id + ")'><b>" + data[j].Name + "</b></div>";
                            break;
                        }
                    }

                }
                $("#container").html(div);

            }

        },
        error: function (e) {

        }

    });
}

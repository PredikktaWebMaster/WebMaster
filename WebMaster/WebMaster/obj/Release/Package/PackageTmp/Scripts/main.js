var row;
var row1;
var row2;
var row3;
var c1;
var c2;
var c3;
var c4;
var series = Array();
var totalClick = 0;
var totalCTR = 0.0;
var avgCTR = 0.0;
var totalImpressions = 0;
var totalPosition = 0.0;
var avgPosition = 0.0;
var decider = 0;
var oldestDate;
var latestDate;
var startDate;
var endDate;
var C1startDate;
var C1endDate;
var C2startDate;
var C2endDate;
var categories = Array();
var domainName;
var row_first;
var row_second;
var row_head;
var queryHitter = 0;
var pageHitter = 0;
var deviceHitter = 0;
var dateHitter = 0;
var lastDateWithValue;
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var previousPageUrl;
var parameters = Array();
$(document).ready(function () {

    previousPageUrl = window.location.href;
    parameters[0] = previousPageUrl.substring(previousPageUrl.indexOf("=") + 1, previousPageUrl.indexOf("&"));
    parameters[1] = previousPageUrl.substring(previousPageUrl.lastIndexOf("=") + 1, previousPageUrl.lastIndexOf("&"));
    //if (localStorage['isLoggedOut'] == "true" || localStorage['isLoggedOut'] == null || localStorage['domain'] != parameters[0])
    if (localStorage['isLoggedOut'] == "true" || localStorage['isLoggedOut'] == null) {
        window.location = "Login.html?Result=LoginRequired&";
    }
    else {
        $("#mainBody").css("cursor", "wait");
        $("#radioQueries").prop('checked', false);
        $("#radioPages").prop('checked', false);
        $("#radioDevices").prop('checked', false);
        $("#radioDates").prop('checked', false);

        $("#Title_Click").text("Total Clicks");
        $("#Title_Impression").text("Total Impression");
        $("#Title_Ctr").text("Total CTR");
        $("#Title_Position").text("Total Position");

        $.ajax({
            type: 'GET',
            contenttype: 'application/json',
            datatype: 'json',
            crossDomain: true,
            url: 'http://localhost:8067/api/searchconsole/GetDates?domainID=' + parseInt(parameters[0]) + '&',
            success: function (data) {
                if (data[0] != null || data[1] != null) {
                    $("#mainBody").css("cursor", "default");
                    $("#mainBody").css("display", "block");
                    NProgress.start();
                    oldestDate = moment(data[0].Date.substr(0, data[0].Date.indexOf('T'))).format("MM/DD/YYYY");
                    latestDate = moment(data[1].Date.substr(0, data[1].Date.indexOf('T'))).format("MM/DD/YYYY");
                    startDate = moment(data[1].Date.substr(0, data[1].Date.indexOf('T'))).subtract(1, 'month').format("MM/DD/YYYY");
                    endDate = latestDate;
                    $('#calStartDate').val(startDate);
                    $('#calEndDate').val(endDate);
                    $("#calStartDate").datepicker({ maxDate: new Date(latestDate), minDate: new Date(oldestDate) });
                    $("#calEndDate").datepicker({ maxDate: new Date(latestDate), minDate: new Date(oldestDate) });

                    $("#startdate1").datepicker({ maxDate: new Date(latestDate), minDate: new Date(oldestDate) });
                    $("#enddate1").datepicker({ maxDate: new Date(latestDate), minDate: new Date(oldestDate) });
                    $("#startdate2").datepicker({ maxDate: new Date(latestDate), minDate: new Date(oldestDate) });
                    $("#enddate2").datepicker({ maxDate: new Date(latestDate), minDate: new Date(oldestDate) });


                    $.ajax({
                        type: 'GET',
                        contenttype: 'application/json',
                        datatype: 'json',
                        url: 'http://localhost:8067/api/searchconsole/SearchByDate?startDate=' + startDate + '&endDate=' + endDate + '&domainID=' + parseInt(parameters[0]) + '&',
                        success: function (data) {
                            row3 = "";
                            $("#charts").css("display", "none");
                            //lastDateWithValue = data[data.length - 1].Date.substr(0, data[data.length - 1].Date.indexOf('T'));
                            //endDate =  data[data.length - 1].Date;
                            //$('#calEndDate').val(endDate);
                            for (var i = data.length - 1; i >= 0; i--) {
                                row3 += "<tr style='cursor:pointer' onclick='eachRow(\"" + data[i].Date.substr(0, data[i].Date.indexOf('T')) + "\",\"Date\")'><td class=\"column\">" + data[i].Date.substr(0, data[i].Date.indexOf('T')) + "</td><td class=\"column\">" + data[i].Clicks + "</td><td class=\"column\">" + data[i].Impressions + "</td><td class=\"column\">" + (data[i].CTR * 100).toFixed(2) + "%</td><td class=\"column\">" + data[i].Position.toFixed(1) + "</td></tr>";
                            }
                            $("#tablebody3").html(row3);
                            $("#tablebody3").append('<tr class="noExl"><td><button onclick="fnExcelReport(\'mytable3\');"> DOWNLOAD </button></td></tr>');
                            //$("#mytable3").hpaging({
                            //    "limit": 50
                            //});
                            $("#load").css("display", "none");
                            NProgress.done();
                            $("#charts_comp").css("display", "none");
                            $("#charts").css("display", "block");
                            $("#charts").css("display", "block");
                            $("#mytable3").css("display", "table");
                            highlight("mytable3")
                            formData(data, 0)

                        }
                    });

                }
                else {
                    alert("Oops..!! No data Found");
                }
            }

        });

        $("#hover").click(function () {
            $(this).fadeOut();
            $("#popup").fadeOut();
        });

        // close on click to X
        $("#close").click(function () {
            $("#hover").fadeOut();
            $("#popup").fadeOut();
        });

        $("#calStartDate").keyup(function (event) {
            if (event.keyCode == 13) {
                $("#calEndDate").focus();
            }
        });

        $("#calEndDate").keyup(function (event) {
            if (event.keyCode == 13) {
                if ($('#calStartDate').val() == null || $('#calStartDate').val() == "" || $('#calEndDate').val() == null || $('#calEndDate').val() == "") {
                    alert("Both start and end dates are mandatory to proceed");
                }
                else {
                    $("#btnSearch").click();
                }

            }
        });

        var queryChecked = 'true';
        var pageChecked = $('#radioPages').val($(this).is(':checked')).val();
        var deviceChecked = $('#radioDevices').val($(this).is(':checked')).val();
        var dateChecked = $('#radioDates').val($(this).is(':checked')).val();

        $('#radioQueries').change(function () {
            $("#load").css("display", "block");
            NProgress.start();
            $("#mytable").css("display", "none");
            $("#mytable1").css("display", "none");
            $("#mytable2").css("display", "none");
            $("#mytable3").css("display", "none");
            $("#mytable4").css("display", "none");
            $("#mytable5").css("display", "none");
            $("#mytable6").css("display", "none");
            $("#eachRow").css("display", "none");
            $("#charts").css("display", "none");
            $("#charts_comp").css("display", "none");
            $("#eachRow_Comp").css("display", "none");
            $("#notifier").css("display", "none");
            if (decider == 0) {
                if (startDate == $('#calStartDate').val() && endDate == $('#calEndDate').val() && queryHitter > 0) {
                    $("#load").css("display", "none");
                    NProgress.done();
                    $("#mytable").css("display", "table");
                    $("#charts").css("display", "block");
                }
                else {
                    startDate = $('#calStartDate').val() ? $('#calStartDate').val() : null;
                    endDate = $('#calEndDate').val() ? $('#calEndDate').val() : null;

                    clickChecked = $('#radioQueries').val($(this).is(':checked')).val();
                    if (clickChecked = "true") {
                        $.ajax({
                            type: 'GET',
                            contenttype: 'application/json',
                            datatype: 'json',
                            url: 'http://localhost:8067/api/searchconsole/SearchByQuery?startDate=' + startDate + '&endDate=' + endDate + '&query=&domainID=' + parseInt(parameters[0]) + '&',
                            success: function (data) {
                                row = "";
                                $("#tablebody").html("");
                                //for (var i = 0; i < data.length; i++) 
                                var loopLimit = data.length >= 2000 ? 2000 : data.length;
                                for (var i = 0; i < loopLimit; i++) {

                                    row += "<tr style='cursor:pointer' onclick='eachRow(\"" + data[i].Query + "\",\"Query\")'><td class=\"column\">" + data[i].Query + "</td><td class=\"column Query_Clicks\">" + data[i].Clicks + "</td><td class=\"column Query_Impressions\">" + data[i].Impressions + "</td><td class=\"column Query_CTR\">" + (data[i].CTR * 100).toFixed(2) + "%</td><td class=\"column Query_Position\">" + data[i].Position.toFixed(1) + "</td></tr>";
                                }
                                $("#tablebody").html(row);
                                $("#tablebody").append('<tr class="noExl"><td><button onclick="fnExcelReport(\'mytable\');"> DOWNLOAD </button></td></tr>');
                                //$("#mytable").hpaging({
                                //      "limit": 50  });
                                formData(data, 1);
                                highlight("mytable");
                                $("#load").css("display", "none");
                                NProgress.done();
                                //for (var b = 0; b < 4; b++)
                                //{
                                //    if(c1.series[b].visible == false)
                                //    {
                                //        //$('td:nth-child(#' + c1.series[b].name + '),th:nth-child(#' + c1.series[b].name + ')').hide();
                                //        $(".Query_" + c1.series[b].name).hide();
                                //    }
                                //}
                                columnHide(4, c1, "Query");
                                $("#mytable").css("display", "table");
                                $("#charts").css("display", "block");
                            }
                        });

                    }
                }
                queryHitter++;
            }
            else {

                C1startDate = $('#startdate1').val() ? $('#startdate1').val() : null;
                C1endDate = $('#enddate1').val() ? $('#enddate1').val() : null;
                C2startDate = $('#startdate2').val() ? $('#startdate2').val() : null;
                C2endDate = $('#enddate2').val() ? $('#enddate2').val() : null;

                clickChecked = $('#radioQueries').val($(this).is(':checked')).val();
                if (clickChecked = "true") {
                    $.ajax({
                        type: 'GET',
                        contenttype: 'application/json',
                        datatype: 'json',
                        url: 'http://localhost:8067/api/searchconsole/Comp_SearchByQuery?startDate1=' + C1startDate + '&endDate1=' + C1endDate + '&startDate2=' + C2startDate + '&endDate2=' + C2endDate + '&query=&domainID=' + parseInt(parameters[0]) + '&',
                        success: function (data) {
                            $("#mytable4").html("");
                            row_head = "";
                            //row_head = "<thead>" +
                            //   " <tr>" +
                            //  "<th>Pages</th>" +
                            //  "<th id='Clicks_1'>" + C1startDate + "-" + C1endDate + " Clicks</th>" +
                            //  "<th id='Clicks_2'>" + C2startDate + "-" + C2endDate + " Clicks</th>" +
                            //  "<th id='Impressions_1'>" + C1startDate + "-" + C1endDate + " Impressions</th>" +
                            //  "<th id='Impressions_2'>" + C2startDate + "-" + C2endDate + " Impressions</th>" +
                            //  "<th id='CTR_1'>" + C1startDate + "-" + C1endDate + " CTR</th>" +
                            //  "<th id='CTR_2'>" + C2startDate + "-" + C2endDate + " CTR</th>" +
                            //  "<th id='Position_1'>" + C1startDate + "-" + C1endDate + " Position</th>" +
                            //  "<th id='Position_2'>" + C2startDate + "-" + C2endDate + " Position</th>" +
                            //  "</tr>" +
                            //  "</thead>";
                            row_head = "<thead>" +
                               " <tr>" +
                              "<th>Queries</th>" +
                              "<th id='Clicks_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " Clicks</th>" +
                              "<th id='Clicks_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " Clicks</th>" +
                              "<th id='Impressions_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " Impressions</th>" +
                              "<th id='Impressions_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " Impressions</th>" +
                              "<th id='CTR_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " CTR</th>" +
                              "<th id='CTR_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " CTR</th>" +
                              "<th id='Position_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " Position</th>" +
                              "<th id='Position_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " Position</th>" +
                              "</tr>" +
                              "</thead>";

                            $("#mytable4").html(row_head);

                            row = "";
                            //for (var i = 0; i < data[1].length; i++)
                            var loopLimit = data[1].length >= 2000 ? 2000 : data[1].length;
                            for (var i = 0; i < loopLimit; i++) {

                                row += "<tr style='cursor:pointer' onclick='eachRowComp(\"" + data[0][i].Query + "\",\"Query\")'><td>" + data[0][i].Query + "</td><td class=\"Query_Clicks_1\">" + data[0][i].Clicks + "</td><td class=\"Query_Clicks_2\">" + data[1][i].Clicks + "</td><td class=\"Query_Impressions_1\">" + data[0][i].Impressions + "</td><td class=\"Query_Impressions_2\">" + data[1][i].Impressions + "</td><td class=\"Query_CTR_1\">" + (data[0][i].CTR * 100).toFixed(2) + "%</td><td class=\"Query_CTR_2\">" + (data[1][i].CTR * 100).toFixed(2) + "%</td><td class=\"Query_Position_1\">" + data[0][i].Position.toFixed(1) + "</td><td class=\"Query_Position_2\">" + data[1][i].Position.toFixed(1) + "</td></tr>";
                            }
                            $("#mytable4").append(row);
                            $("#mytable4").append('<tr class="noExl"><td><button onclick="fnExcelReport(\'mytable4\');"> DOWNLOAD </button></td></tr>');
                            //$("#mytable").hpaging({
                            //      "limit": 50  });
                            //formData(data, 1);
                            highlight("mytable4");
                            $("#load").css("display", "none");
                            NProgress.done();
                            //for (var b = 0; b < 8; b++) {
                            //    if (c3.series[b].visible == false) {
                            //        //$('td:nth-child(#' + c1.series[b].name + '),th:nth-child(#' + c1.series[b].name + ')').hide();
                            //        $(".Query_" + c3.series[b].name + "_1, #" + c3.series[b].name + "_1").hide();
                            //        $(".Query_" + c3.series[b].name + "_2, #" + c3.series[b].name + "_2").hide();
                            //    }
                            //}

                            compareColumnHide(8, c3, "Query");

                            $("#mytable4").css("display", "table");
                            $("#charts_comp").css("display", "block");
                        }
                    });

                }
            }
        });

        $('#radioPages').change(function () {
            pageChecked = $('#radioPages').val($(this).is(':checked')).val();

            $("#charts").css("display", "none");
            $("#charts_comp").css("display", "none");
            $("#eachRow_Comp").css("display", "none");
            $("#eachRow").css("display", "none");
            $("#mytable").css("display", "none");
            $("#mytable1").css("display", "none");
            $("#mytable2").css("display", "none");
            $("#mytable3").css("display", "none");
            $("#mytable4").css("display", "none");
            $("#mytable5").css("display", "none");
            $("#mytable6").css("display", "none");
            $("#notifier").css("display", "none");
            $("#load").css("display", "block");
            NProgress.start();
            if (decider == 0) {
                if (startDate == $('#calStartDate').val() && endDate == $('#calEndDate').val() && pageHitter > 0) {
                    $("#load").css("display", "none");
                    NProgress.done();
                    $("#mytable1").css("display", "table");
                    $("#charts").css("display", "block");
                }
                else {
                    startDate = $('#calStartDate').val() ? $('#calStartDate').val() : null;
                    endDate = $('#calEndDate').val() ? $('#calEndDate').val() : null;
                    if (pageChecked = "true") {
                        $.ajax({
                            type: 'GET',
                            contenttype: 'application/json',
                            datatype: 'json',
                            url: 'http://localhost:8067/api/searchconsole/SearchByPage?startDate=' + startDate + '&endDate=' + endDate + '&page=&domainID=' + parseInt(parameters[0]) + '&',
                            success: function (data) {
                                row1 = "";
                                for (var i = 0; i < data.length; i++) {
                                    row1 += "<tr style='cursor:pointer' onclick='eachRow(\"" + data[i].Page + "\",\"Page\")'><td class=\"column\">" + data[i].Page + "</td><td class=\"column Page_Clicks\">" + data[i].Clicks + "</td><td class=\"column Page_Impressions\">" + data[i].Impressions + "</td><td class=\"column Page_CTR\">" + (data[i].CTR * 100).toFixed(2) + "%</td><td class=\"column Page_Position\">" + data[i].Position.toFixed(1) + "</td></tr>";
                                }
                                $("#tablebody1").html(row1);
                                $("#tablebody1").append('<tr class="noExl"><td><button onclick="fnExcelReport(\'mytable1\');"> DOWNLOAD </button></td></tr>');
                                //$("#mytable1").hpaging({
                                //    "limit": 50
                                //});
                                formData(data, 1);
                                highlight("mytable1");
                                $("#load").css("display", "none");
                                NProgress.done();
                                //for (var b = 0; b < 4; b++) {
                                //    if (c1.series[b].visible == false) {
                                //        //$('td:nth-child(#' + c1.series[b].name + '),th:nth-child(#' + c1.series[b].name + ')').hide();
                                //        $(".Page_" + c1.series[b].name).hide();
                                //    }
                                //}
                                columnHide(4, c1, "Page");
                                $("#mytable1").css("display", "table");
                                $("#charts").css("display", "block");
                            }
                        });
                    }
                }
                pageHitter++;
            }
            else {
                C1startDate = $('#startdate1').val() ? $('#startdate1').val() : null;
                C1endDate = $('#enddate1').val() ? $('#enddate1').val() : null;
                C2startDate = $('#startdate2').val() ? $('#startdate2').val() : null;
                C2endDate = $('#enddate2').val() ? $('#enddate2').val() : null;

                if (pageChecked = "true") {
                    $.ajax({
                        type: 'GET',
                        contenttype: 'application/json',
                        datatype: 'json',
                        url: 'http://localhost:8067/api/searchconsole/Comp_SearchByPage?startDate1=' + C1startDate + '&endDate1=' + C1endDate + '&startDate2=' + C2startDate + '&endDate2=' + C2endDate + '&page=&domainID=' + parseInt(parameters[0]) + '&',
                        success: function (data) {
                            $("#mytable5").html("");
                            row_head = "";
                            //row_head = "<thead>" +
                            //   " <tr>" +
                            //  "<th>Pages</th>" +
                            //  "<th id='Clicks_1'>" + C1startDate + "-" + C1endDate + " Clicks</th>" +
                            //  "<th id='Clicks_2'>" + C2startDate + "-" + C2endDate + " Clicks</th>" +
                            //  "<th id='Impressions_1'>" + C1startDate + "-" + C1endDate + " Impressions</th>" +
                            //  "<th id='Impressions_2'>" + C2startDate + "-" + C2endDate + " Impressions</th>" +
                            //  "<th id='CTR_1'>" + C1startDate + "-" + C1endDate + " CTR</th>" +
                            //  "<th id='CTR_2'>" + C2startDate + "-" + C2endDate + " CTR</th>" +
                            //  "<th id='Position_1'>" + C1startDate + "-" + C1endDate + " Position</th>" +
                            //  "<th id='Position_2'>" + C2startDate + "-" + C2endDate + " Position</th>" +
                            //  "</tr>" +
                            //  "</thead>";

                            row_head = "<thead>" +
                             " <tr>" +
                            "<th>Queries</th>" +
                            "<th id='Clicks_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " Clicks</th>" +
                            "<th id='Clicks_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " Clicks</th>" +
                            "<th id='Impressions_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " Impressions</th>" +
                            "<th id='Impressions_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " Impressions</th>" +
                            "<th id='CTR_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " CTR</th>" +
                            "<th id='CTR_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " CTR</th>" +
                            "<th id='Position_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " Position</th>" +
                            "<th id='Position_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " Position</th>" +
                            "</tr>" +
                            "</thead>";

                            $("#mytable5").html(row_head);

                            row1 = "";
                            for (var i = 0; i < data[1].length; i++) {

                                row1 += "<tr style='cursor:pointer' onclick='eachRowComp(\"" + data[0][i].Page + "\",\"Page\")'><td>" + data[0][i].Page + "</td><td class=\"Page_Clicks_1\">" + data[0][i].Clicks + "</td><td class=\"Page_Clicks_2\">" + data[1][i].Clicks + "</td><td class=\"Page_Impressions_1\">" + data[0][i].Impressions + "</td><td class=\"Page_Impressions_2\">" + data[1][i].Impressions + "</td><td class=\"Page_CTR_1\">" + (data[0][i].CTR * 100).toFixed(2) + "%</td><td class=\"Page_CTR_2\">" + (data[1][i].CTR * 100).toFixed(2) + "%</td><td class=\"Page_Position_1\">" + data[0][i].Position.toFixed(1) + "</td><td class=\"Page_Position_2\">" + data[1][i].Position.toFixed(1) + "</td></tr>";
                            }
                            $("#mytable5").append(row1);
                            $("#mytable5").append('<tr class="noExl"><td><button onclick="fnExcelReport(\'mytable5\');"> DOWNLOAD </button></td></tr>');
                            //$("#mytable1").hpaging({
                            //    "limit": 50
                            //});
                            //formData(data, 1);
                            highlight("mytable5");
                            $("#load").css("display", "none");
                            NProgress.done();
                            compareColumnHide(8, c3, "Page");
                            $("#mytable5").css("display", "table");
                            $("#charts_comp").css("display", "block");
                        }
                    });
                }
            }
        });

        $('#radioDevices').change(function () {
            $("#load").css("display", "block");
            NProgress.start();
            $("#mytable").css("display", "none");
            $("#mytable1").css("display", "none");
            $("#mytable2").css("display", "none");
            $("#mytable3").css("display", "none");
            $("#mytable4").css("display", "none");
            $("#mytable5").css("display", "none");
            $("#mytable6").css("display", "none");
            $("#eachRow").css("display", "none");
            $("#charts").css("display", "none");
            $("#notifier").css("display", "none");
            $("#charts_comp").css("display", "none");
            $("#eachRow_Comp").css("display", "none");

            deviceChecked = $('#radioDevices').val($(this).is(':checked')).val();

            if (decider == 0) {
                if (startDate == $('#calStartDate').val() && endDate == $('#calEndDate').val() && deviceHitter > 0) {
                    $("#load").css("display", "none");
                    NProgress.done();
                    $("#mytable2").css("display", "table");
                    $("#charts").css("display", "block");
                }
                else {
                    startDate = $('#calStartDate').val() ? $('#calStartDate').val() : null;
                    endDate = $('#calEndDate').val() ? $('#calEndDate').val() : null;
                    if (deviceChecked = "true") {
                        row2 = "";
                        $.ajax({
                            type: 'GET',
                            contenttype: 'application/json',
                            datatype: 'json',
                            url: 'http://localhost:8067/api/searchconsole/SearchByDevice?startDate=' + startDate + '&endDate=' + endDate + '&domainID=' + parseInt(parameters[0]) + '&',
                            success: function (data) {
                                row2 = "";
                                for (var i = 0; i < data.length; i++) {
                                    var Typename = data[i].DeviceType == 1 ? "DESKTOP" : data[i].DeviceType == 2 ? "MOBILE" : data[i].DeviceType == 3 ? "TABLET" : null;
                                    row2 += "<tr><td class=\"column\">" + Typename + "</td><td class=\"column Device_Clicks\">" + data[i].Clicks + "</td><td class=\"column Device_Impressions\">" + data[i].Impressions + "</td><td class=\"column Device_CTR\">" + (data[i].CTR * 100).toFixed(2) + "%</td><td class=\"column Device_Position\">" + data[i].Position.toFixed(1) + "</td></tr>";
                                }
                                $("#tablebody2").html(row2);
                                $("#tablebody2").append('<tr class="noExl"><td><button onclick="fnExcelReport(\'mytable2\');"> DOWNLOAD </button></td></tr>');
                                //$("#mytable2").hpaging({
                                //    "limit": 50
                                //});
                                formData(data, 1);
                                $("#load").css("display", "none");
                                NProgress.done();
                                columnHide(4, c1, "Device");
                                $("#mytable2").css("display", "table");
                                $("#charts").css("display", "block");
                            }
                        });
                    }
                }
                deviceHitter++;
            }
            else {
                C1startDate = $('#startdate1').val() ? $('#startdate1').val() : null;
                C1endDate = $('#enddate1').val() ? $('#enddate1').val() : null;
                C2startDate = $('#startdate2').val() ? $('#startdate2').val() : null;
                C2endDate = $('#enddate2').val() ? $('#enddate2').val() : null;
                if (deviceChecked = "true") {
                    $.ajax({
                        type: 'GET',
                        contenttype: 'application/json',
                        datatype: 'json',
                        url: 'http://localhost:8067/api/searchconsole/Comp_SearchByDevice?startDate1=' + C1startDate + '&endDate1=' + C1endDate + '&startDate2=' + C2startDate + '&endDate2=' + C2endDate + '&domainID=' + parseInt(parameters[0]) + '&',
                        success: function (data) {
                            $("#mytable6").html("");
                            row_head = "";
                            //row_head = "<thead>" +
                            //   " <tr>" +
                            //  "<th>Devices</th>" +
                            //  "<th id='Clicks_1'>" + C1startDate + "-" + C1endDate + " Clicks</th>" +
                            //  "<th id='Clicks_2'>" + C2startDate + "-" + C2endDate + " Clicks</th>" +
                            //  "<th id='Impressions_1'>" + C1startDate + "-" + C1endDate + " Impressions</th>" +
                            //  "<th id='Impressions_2'>" + C2startDate + "-" + C2endDate + " Impressions</th>" +
                            //  "<th id='CTR_1'>" + C1startDate + "-" + C1endDate + " CTR</th>" +
                            //  "<th id='CTR_2'>" + C2startDate + "-" + C2endDate + " CTR</th>" +
                            //  "<th id='Position_1'>" + C1startDate + "-" + C1endDate + " Position</th>" +
                            //  "<th id='Position_2'>" + C2startDate + "-" + C2endDate + " Position</th>" +
                            //  "</tr>" +
                            //  "</thead>";

                            row_head = "<thead>" +
                             " <tr>" +
                            "<th>Devices</th>" +
                            "<th id='Clicks_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " Clicks</th>" +
                            "<th id='Clicks_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " Clicks</th>" +
                            "<th id='Impressions_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " Impressions</th>" +
                            "<th id='Impressions_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " Impressions</th>" +
                            "<th id='CTR_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " CTR</th>" +
                            "<th id='CTR_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " CTR</th>" +
                            "<th id='Position_1'>" + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + " Position</th>" +
                            "<th id='Position_2'>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " Position</th>" +
                            "</tr>" +
                            "</thead>";

                            $("#mytable6").html(row_head);

                            row2 = "";
                            for (var i = 0; i < data[1].length; i++) {
                                var Typename = data[0][i].DeviceType == 1 ? "DESKTOP" : data[0][i].DeviceType == 2 ? "MOBILE" : data[0][i].DeviceType == 3 ? "TABLET" : null;
                                row2 += "<tr><td>" + Typename + "</td><td class=\"Device_Clicks_1\">" + data[0][i].Clicks + "</td><td class=\"Device_Clicks_2\">" + data[1][i].Clicks + "</td><td class=\"Device_Impressions_1\">" + data[0][i].Impressions + "</td><td class=\"Device_Impressions_2\">" + data[1][i].Impressions + "</td><td class=\"Device_CTR_1\">" + (data[0][i].CTR * 100).toFixed(2) + "%</td><td class=\"Device_CTR_2\">" + (data[1][i].CTR * 100).toFixed(2) + "%</td><td class=\"Device_Position_1\">" + data[0][i].Position.toFixed(1) + "</td><td class=\"Device_Position_2\">" + data[1][i].Position.toFixed(1) + "</td></tr>";
                            }
                            $("#mytable6").append(row2);
                            $("#mytable6").append('<tr class="noExl"><td><button onclick="fnExcelReport(\'mytable6\');"> DOWNLOAD </button></td></tr>');
                            //$("#mytable1").hpaging({
                            //    "limit": 50
                            //});
                            //formData(data, 1);
                            $("#load").css("display", "none");
                            NProgress.done();
                            compareColumnHide(8, c3, "Device");
                            $("#mytable6").css("display", "table");
                            $("#charts_comp").css("display", "block");
                        }
                    });
                }
            }
        });

        $('#radioDates').change(function () {
            $("#load").css("display", "block");
            NProgress.start();
            $("#mytable").css("display", "none");
            $("#mytable1").css("display", "none");
            $("#mytable2").css("display", "none");
            $("#mytable3").css("display", "none");
            $("#mytable4").css("display", "none");
            $("#mytable5").css("display", "none");
            $("#mytable6").css("display", "none");
            $("#notifier").css("display", "none");
            $("#charts_comp").css("display", "none");
            $("#eachRow_Comp").css("display", "none");
            $("#eachRow").css("display", "none");
            $("#charts").css("display", "none");

            dateChecked = $('#radioDates').val($(this).is(':checked')).val();

            if (decider == 0) {
                if (startDate == $('#calStartDate').val() && endDate == $('#calEndDate').val()) {
                    $("#load").css("display", "none");
                    NProgress.done();
                    $("#mytable3").css("display", "table");
                    $("#charts").css("display", "block");
                }
                else {
                    startDate = $('#calStartDate').val() ? $('#calStartDate').val() : null;
                    endDate = $('#calEndDate').val() ? $('#calEndDate').val() : null;
                    if (deviceChecked = "true") {
                        $.ajax({
                            type: 'GET',
                            contenttype: 'application/json',
                            datatype: 'json',
                            url: 'http://localhost:8067/api/searchconsole/SearchByDate?startDate=' + startDate + '&endDate=' + endDate + '&domainID=' + parseInt(parameters[0]) + '&',
                            success: function (data) {
                                row3 = "";
                                $("#charts").css("display", "none");
                                for (var i = data.length - 1; i >= 0 ; i--) {
                                    row3 += "<tr style='cursor:pointer' onclick='eachRow(\"" + data[i].Date.substr(0, data[i].Date.indexOf('T')) + "\",\"Date\")'><td class=\"column\">" + data[i].Date.substr(0, data[i].Date.indexOf('T')) + "</td><td class=\"column Date_Clicks\">" + data[i].Clicks + "</td><td class=\"column Date_Impressions\">" + data[i].Impressions + "</td><td class=\"column Date_CTR\">" + (data[i].CTR * 100).toFixed(2) + "%</td><td class=\"column Date_Position\">" + data[i].Position.toFixed(1) + "</td></tr>";
                                }
                                $("#tablebody3").html(row3);
                                $("#tablebody3").append('<tr class="noExl"><td><button onclick="fnExcelReport(\'mytable3\');"> DOWNLOAD </button></td></tr>');
                                formData(data, 1);
                                $("#load").css("display", "none");
                                NProgress.done();
                                columnHide(4, c1, "Date");
                                $("#charts").css("display", "block");
                                $("#mytable3").css("display", "table");
                                highlight("mytable3");

                            }
                        });
                    }
                }
            }
            else {
                C1startDate = $('#startdate1').val() ? $('#startdate1').val() : null;
                C1endDate = $('#enddate1').val() ? $('#enddate1').val() : null;
                C2startDate = $('#startdate2').val() ? $('#startdate2').val() : null;
                C2endDate = $('#enddate2').val() ? $('#enddate2').val() : null;
                comparisondata(C1startDate, C1endDate, C2startDate, C2endDate);
            }
        });

        $("#sevenDays").click(function () {
            alert("seven days");
        });

        $('#btnSearch').click(function () {

            $("#TC1").css("display", "none");
            $("#TI1").css("display", "none");
            $("#AC1").css("display", "none");
            $("#AP1").css("display", "none");

            decider = 0;
            startDate = $('#calStartDate').val();
            endDate = $('#calEndDate').val();
            if (startDate == null || startDate == "" || endDate == null || endDate == "") {
                alert("Both start and end dates are mandatory to proceed");
            }
            else {
                $("#radioQueries").prop('checked', false);
                $("#radioPages").prop('checked', false);
                $("#radioDevices").prop('checked', false);
                $("#radioDates").prop('checked', true);
                queryHitter = 0;
                pageHitter = 0;
                deviceHitter = 0;

                if (startDate && endDate) {
                    $("#load").css("display", "block");
                    NProgress.start();
                    $("#mytable").css("display", "none");
                    $("#eachRow").css("display", "none");
                    $("#mytable1").css("display", "none");
                    $("#mytable2").css("display", "none");
                    $("#mytable3").css("display", "none");
                    $("#mytable4").css("display", "none");
                    $("#mytable5").css("display", "none");
                    $("#mytable6").css("display", "none");
                    $("#notifier").css("display", "none");
                    $("#charts").css("display", "none");
                    $("#charts_comp").css("display", "none");
                    $("#eachRow_Comp").css("display", "none");

                    var url = 'http://localhost:8067/api/searchconsole/SearchByDate?startDate=' + startDate + '&endDate=' + endDate + '&domainID=' + parseInt(parameters[0]) + '&';
                    $.ajax({
                        type: 'GET',
                        contenttype: 'application/json',
                        datatype: 'json',
                        url: url,
                        success: function (data) {
                            row3 = "";
                            $("#charts").css("display", "none");
                            for (var i = data.length - 1; i >= 0 ; i--) {
                                row3 += "<tr style='cursor:pointer' onclick='eachRow(\"" + data[i].Date.substr(0, data[i].Date.indexOf('T')) + "\",\"Date\")'><td class=\"column\">" + data[i].Date.substr(0, data[i].Date.indexOf('T')) + "</td><td class=\"column Date_Clicks\">" + data[i].Clicks + "</td><td class=\"column Date_Impressions\">" + data[i].Impressions + "</td><td class=\"column Date_CTR\">" + (data[i].CTR * 100).toFixed(2) + "%</td><td class=\"column Date_Position\">" + data[i].Position.toFixed(1) + "</td></tr>";
                            }
                            $("#tablebody3").html(row3);
                            $("#tablebody3").append('<tr class="noExl"><td><button onclick="fnExcelReport(\'mytable3\');"> DOWNLOAD </button></td></tr>');
                            //$("#mytable3").hpaging({
                            //    "limit": 50
                            //});
                            $("#load").css("display", "none");
                            NProgress.done();
                            columnHide(4, c1, "Date");
                            $("#charts").css("display", "block");
                            $("#mytable3").css("display", "table");
                            highlight("mytable3");
                            formData(data, 0);
                        }
                    });
                }
            }
        });

        $("#radioDates").prop('checked', true);



        function formData(data, dec) {
            totalClick = 0;
            totalCTR = 0.0;
            avgCTR = 0.0;
            totalImpressions = 0;
            totalPosition = 0.0;
            avgPosition = 0.0;
            series = Array();
            categories = Array();

            domainName = data.DomainName;
            var clickarray = new Array();
            var Imparray = new Array();
            var Ctrarray = new Array();
            var Posarray = new Array();
            for (var dayCount = 0; dayCount < data.length; dayCount++) {
                if (dec == 0) {
                    categories.push(data[dayCount].Date.substr(0, data[dayCount].Date.indexOf('T')));
                    Imparray[dayCount] = data[dayCount].Impressions;
                    Ctrarray[dayCount] = (data[dayCount].CTR * 100);
                    Posarray[dayCount] = data[dayCount].Position;
                    clickarray[dayCount] = data[dayCount].Clicks;
                }

                totalClick += data[dayCount].Clicks;
                totalCTR += data[dayCount].CTR;
                totalImpressions += data[dayCount].Impressions;
                totalPosition += data[dayCount].Position;

            }
            avgCTR = ((totalClick / totalImpressions) * 100).toFixed(2);
            avgPosition = (totalPosition / data.length).toFixed(1);
            if (dec == 0) {
                var item1 = { name: "Clicks", data: clickarray, dashStyle: 'solid', color: '#2C732C' }
                var item2 = { name: "Impressions", data: Imparray, dashStyle: 'solid', color: '#10A3EE' }
                var item3 = { name: "CTR", data: Ctrarray, dashStyle: 'solid', color: '#EEB410' }
                var item4 = { name: "Position", data: Posarray, dashStyle: 'solid', color: '#E06255' }
                series.push(item1);
                series.push(item2);
                series.push(item3);
                series.push(item4);
                var title = "Data Analysis:<b> " + startDate.substr(startDate.indexOf('/') + 1, 2) + " " + months[new Date(startDate).getMonth()] + " - " + endDate.substr(endDate.indexOf('/') + 1, 2) + " " + months[new Date(endDate).getMonth()] + " </b>";
                chartMaker(categories, series, 0, "Dates", title);
            }

            $("#TotalClicks").html(totalClick);
            $("#TotalImpression").html(totalImpressions);
            $("#AvgCTR").html(avgCTR);
            $("#AvgPosition").html(avgPosition);
        }



        jQuery(document).ready(function (e) {
            function t(t) {
                e(t).bind("click", function (t) {
                    t.preventDefault();
                    e(this).parent().fadeOut()
                })
            }
            e(".dropdown-toggle").click(function () {
                var t = e(this).parents(".button-dropdown").children(".dropdown-menu").is(":hidden");
                e(".button-dropdown .dropdown-menu").hide();
                e(".button-dropdown .dropdown-toggle").removeClass("active");
                if (t) {
                    e(this).parents(".button-dropdown").children(".dropdown-menu").toggle().parents(".button-dropdown").children(".dropdown-toggle").addClass("active")
                }
            });
            e(document).bind("click", function (t) {
                var n = e(t.target);
                if (!n.parents().hasClass("button-dropdown")) e(".button-dropdown .dropdown-menu").hide();
            });
            e(document).bind("click", function (t) {
                var n = e(t.target);
                if (!n.parents().hasClass("button-dropdown")) e(".button-dropdown .dropdown-toggle").removeClass("active");
            })
        });

        $("#3").click(function () {
            $("#load").css("display", "block");
            NProgress.start();
            decider = 1;
            C1startDate = moment(latestDate).subtract(6, 'days').format("MM/DD/YYYY");
            C1endDate = moment(latestDate).format("MM/DD/YYYY");
            C2startDate = moment(latestDate).subtract(13, 'days').format("MM/DD/YYYY");
            C2endDate = moment(latestDate).subtract(7, 'days').format("MM/DD/YYYY");
            comparisondata(C1startDate, C1endDate, C2startDate, C2endDate);
            $('#startdate1').val(C1startDate);
            $('#enddate1').val(C1endDate);
            $('#startdate2').val(C2startDate);
            $('#enddate2').val(C2endDate);
        });
        $("#4").click(function () {
            $("#load").css("display", "block");
            NProgress.start();
            decider = 1;
            C1startDate = moment(latestDate).subtract(27, 'days').format("MM/DD/YYYY");
            C1endDate = moment(latestDate).format("MM/DD/YYYY");
            C2startDate = moment(latestDate).subtract(55, 'days').format("MM/DD/YYYY");
            C2endDate = moment(latestDate).subtract(28, 'days').format("MM/DD/YYYY");
            comparisondata(C1startDate, C1endDate, C2startDate, C2endDate);
            $('#startdate1').val(C1startDate);
            $('#enddate1').val(C1endDate);
            $('#startdate2').val(C2startDate);
            $('#enddate2').val(C2endDate);

        });
        $("#5").click(function () {
            $("#popup").css("display", "block");
        });

        $("#customComp").click(function () {
            $("#load").css("display", "block");
            NProgress.start();
            decider = 1;
            C1startDate = $('#startdate1').val();
            C1endDate = $('#enddate1').val();
            C2startDate = $('#startdate2').val();
            C2endDate = $('#enddate2').val();
            comparisondata(C1startDate, C1endDate, C2startDate, C2endDate);
            $("#hover").fadeOut();
            $("#popup").fadeOut();
        });
    }
});


function eachRow(element, Type) {
    var functionName = "";
    startDate = $('#calStartDate').val() ? $('#calStartDate').val() : null;
    endDate = $('#calEndDate').val() ? $('#calEndDate').val() : null;
    $("#radioQueries").prop('checked', false);
    $("#radioPages").prop('checked', false);
    $("#radioDevices").prop('checked', false);
    $("#radioDates").prop('checked', false);
    series = Array();
    categories = Array();
    var clickarray = new Array();
    var Imparray = new Array();
    var Ctrarray = new Array();
    var Posarray = new Array();
    totalClick = 0;
    totalCTR = 0.0;
    avgCTR = 0.0;
    totalImpressions = 0;
    totalPosition = 0.0;
    avgPosition = 0.0;

    if (Type == "Query") {
        functionName = "SearchByQuery";
    }
    else if (Type == "Page") {
        functionName = "SearchByPage";
        $("#specificPage").text(element + " ▼");
        $("#Parent_specificPage").css("display", "block");
    }
    else if (Type == "Device") {
        functionName = "SearchByDevice";
    }
    else if (Type == "Date") {
        functionName = "SearchByDate";
        startDate = element;
        endDate = element;
    }
    $.ajax({
        type: 'GET',
        contenttype: 'application/json',
        datatype: 'json',
        url: 'http://localhost:8067/api/searchconsole/' + functionName + '?startDate=' + startDate + '&endDate=' + endDate + '&' + Type + '=' + element + '&domainID=' + parseInt(parameters[0]) + '&',
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                categories.push("");

                Imparray[i] = { name: data[i].Date.substr(0, data[i].Date.indexOf('T')), y: data[i].Impressions };
                Ctrarray[i] = { name: data[i].Date.substr(0, data[i].Date.indexOf('T')), y: (data[i].CTR * 100) };
                Posarray[i] = { name: data[i].Date.substr(0, data[i].Date.indexOf('T')), y: data[i].Position };
                clickarray[i] = { name: data[i].Date.substr(0, data[i].Date.indexOf('T')), y: data[i].Clicks };

                totalClick += data[i].Clicks;
                totalCTR += data[i].CTR;
                totalImpressions += data[i].Impressions;
                totalPosition += data[i].Position;

            }
            avgCTR = ((totalClick / totalImpressions) * 100).toFixed(2);
            avgPosition = (totalPosition / data.length).toFixed(1);

            var item1 = { name: "Clicks", data: clickarray, dashStyle: 'solid', color: '#2C732C' }
            var item2 = { name: "Impressions", data: Imparray, dashStyle: 'solid', color: '#10A3EE' }
            var item3 = { name: "CTR", data: Ctrarray, dashStyle: 'solid', color: '#EEB410' }
            var item4 = { name: "Position", data: Posarray, dashStyle: 'solid', color: '#E06255' }

            series.push(item1);
            series.push(item2);
            series.push(item3);
            series.push(item4);
            $("#mytable").css("display", "none");
            $("#mytable1").css("display", "none");
            $("#mytable2").css("display", "none");
            $("#mytable3").css("display", "none");
            $("#mytable4").css("display", "none");
            $("#mytable5").css("display", "none");
            $("#mytable6").css("display", "none");
            $("#notifier").css("display", "none");
            $("#charts_comp").css("display", "none");
            $("#eachRow_Comp").css("display", "none");
            $("#eachRow").css("display", "none");
            $("#charts").css("display", "none");
            var title = "Data Analysis:<b> " + startDate.substr(startDate.indexOf('/') + 1, 2) + " " + months[new Date(startDate).getMonth()] + " - " + endDate.substr(endDate.indexOf('/') + 1, 2) + " " + months[new Date(endDate).getMonth()] + " </b>";
            chartMaker(categories, series, 1, element, title);
            $("#load").css("display", "none");
            NProgress.done();
            $("#TotalClicks").html(totalClick);
            $("#TotalImpression").html(totalImpressions);
            $("#AvgCTR").html(avgCTR);
            $("#AvgPosition").html(avgPosition);

        }
    });



}


function eachRowComp(element, Type) {
    var functionName = "";
    C1startDate = $('#startdate1').val() ? $('#startdate1').val() : null;
    C1endDate = $('#enddate1').val() ? $('#enddate1').val() : null;
    C2startDate = $('#startdate2').val() ? $('#startdate2').val() : null;
    C2endDate = $('#enddate2').val() ? $('#enddate2').val() : null;
    if (Type == "Query") {
        functionName = "Comp_SearchByQuery";
    }
    else if (Type == "Page") {
        functionName = "Comp_SearchByPage";
    }
    else if (Type == "Device") {
        functionName = "Comp_SearchByDevice";
    }
    $("#radioQueries").prop('checked', false);
    $("#radioPages").prop('checked', false);
    $("#radioDevices").prop('checked', false);
    $("#radioDates").prop('checked', false);

    $("#load").css("display", "block");
    NProgress.start();
    $("#mytable").css("display", "none");
    $("#eachRow").css("display", "none");
    $("#mytable1").css("display", "none");
    $("#mytable2").css("display", "none");
    $("#mytable3").css("display", "none");
    $("#mytable4").css("display", "none");
    $("#mytable5").css("display", "none");
    $("#mytable6").css("display", "none");
    $("#notifier").css("display", "none");
    $("#charts_comp").css("display", "none");
    $("#eachRow_Comp").css("display", "none");
    $("#eachRow").css("display", "none");
    $("#charts").css("display", "none");

    var yu = 'http://localhost:8067/api/searchconsole/' + functionName + '?startDate1=' + C1startDate + '&endDate1=' + C1endDate + '&startDate2=' + C2startDate + '&endDate2=' + C2endDate + '&' + Type + '=' + element + '&domainID=' + parseInt(parameters[0]) + '&';
    $.ajax({
        type: 'GET',
        contenttype: 'application/json',
        datatype: 'json',
        url: 'http://localhost:8067/api/searchconsole/' + functionName + '?startDate1=' + C1startDate + '&endDate1=' + C1endDate + '&startDate2=' + C2startDate + '&endDate2=' + C2endDate + '&' + Type + '=' + element + '&domainID=' + parseInt(parameters[0]) + '&',
        success: function (data) {
            series = Array();
            categories = Array();
            var fl;
            if (data[2].length >= data[3].length) {
                fl = 2;
            }
            else {
                fl = 3;
            }
            for (var i = 0; i < 2; i++) {
                var clickarray = new Array();
                var Imparray = new Array();
                var Ctrarray = new Array();
                var Posarray = new Array();
                totalClick = 0;
                totalCTR = 0.0;
                avgCTR = 0.0;
                totalImpressions = 0;
                totalPosition = 0.0;
                avgPosition = 0.0;
                for (var j = 0; j < data[i].length; j++) {
                    if (i == fl) {
                        categories.push("Day " + (j + 1));
                    }

                    Imparray[j] = { name: data[i][j].Date.substr(0, data[i][j].Date.indexOf('T')), y: data[i][j].Impressions };
                    Ctrarray[j] = { name: data[i][j].Date.substr(0, data[i][j].Date.indexOf('T')), y: (data[i][j].CTR * 100) };
                    Posarray[j] = { name: data[i][j].Date.substr(0, data[i][j].Date.indexOf('T')), y: data[i][j].Position };
                    clickarray[j] = { name: data[i][j].Date.substr(0, data[i][j].Date.indexOf('T')), y: data[i][j].Clicks };

                    totalClick += data[i][j].Clicks;
                    totalCTR += data[i][j].CTR;
                    totalImpressions += data[i][j].Impressions;
                    totalPosition += data[i][j].Position;
                }

                avgCTR = ((totalClick / totalImpressions) * 100).toFixed(2);
                avgPosition = (totalPosition / data.length).toFixed(1);

                if (i == 2) {
                    //var item1 = { name: "Clicks" + C1startDate + "-" + C1endDate + "", data: clickarray, dashStyle: 'longdash', color: '#2C732C' }
                    //var item2 = { name: "Impressions" + C1startDate + "-" + C1endDate + "", data: Imparray, dashStyle: 'longdash', color: '#10A3EE' }
                    //var item3 = { name: "CTR" + C1startDate + "-" + C1endDate + "", data: Ctrarray, dashStyle: 'longdash', color: '#EEB410' }
                    //var item4 = { name: "Position" + C1startDate + "-" + C1endDate + "", data: Posarray, dashStyle: 'longdash', color: '#E06255' }
                    var item1 = { name: "Clicks", data: clickarray, dashStyle: 'longdash', color: '#2C732C', id: 'Clicks1' }
                    var item2 = { name: "Impressions", data: Imparray, dashStyle: 'longdash', color: '#10A3EE', id: 'Imp1' }
                    var item3 = { name: "CTR", data: Ctrarray, dashStyle: 'longdash', color: '#EEB410', id: 'CTR1' }
                    var item4 = { name: "Position", data: Posarray, dashStyle: 'longdash', color: '#E06255', id: 'Pos1' }
                    series.push(item1);
                    series.push(item2);
                    series.push(item3);
                    series.push(item4);
                    $("#TotalClicks1").html(totalClick);
                    $("#TotalImpression1").html(totalImpressions);
                    $("#AvgCTR1").html(avgCTR);
                    $("#AvgPosition1").html(avgPosition);
                }
                else {
                    //var item1 = { name: "Clicks" + C2startDate + "-" + C2endDate + "", data: clickarray, dashStyle: 'solid', color: '#2C732C' }
                    //var item2 = { name: "Impressions" + C2startDate + "-" + C2endDate + "", data: Imparray, dashStyle: 'solid', color: '#10A3EE' }
                    //var item3 = { name: "CTR" + C2startDate + "-" + C2endDate + "", data: Ctrarray, dashStyle: 'solid', color: '#EEB410' }
                    //var item4 = { name: "Position" + C2startDate + "-" + C2endDate + "", data: Posarray, dashStyle: 'solid', color: '#E06255' }
                    var item1 = { name: "Clicks", data: clickarray, dashStyle: 'solid', color: '#2C732C', id: 'Clicks2', linkedTo: 'Clicks1' }
                    var item2 = { name: "Impressions", data: Imparray, dashStyle: 'solid', color: '#10A3EE', id: 'Imp2', linkedTo: 'Imp1' }
                    var item3 = { name: "CTR", data: Ctrarray, dashStyle: 'solid', color: '#EEB410', id: 'CTR2', linkedTo: 'CTR1' }
                    var item4 = { name: "Position", data: Posarray, dashStyle: 'solid', color: '#E06255', id: 'Pos2', linkedTo: 'Pos1' }
                    series.push(item1);
                    series.push(item2);
                    series.push(item3);
                    series.push(item4);
                    $("#TotalClicks").html(totalClick);
                    $("#TotalImpression").html(totalImpressions);
                    $("#AvgCTR").html(avgCTR);
                    $("#AvgPosition").html(avgPosition);
                }
            }
            var title = "Comparison:<b> " + C1startDate.substr(C1startDate.indexOf('/') + 1, 2) + " " + months[new Date(C1startDate).getMonth()] + " - " + C1endDate.substr(C1endDate.indexOf('/') + 1, 2) + " " + months[new Date(C1endDate).getMonth()] + "</b> VS <b>" + C2startDate.substr(C2startDate.indexOf('/') + 1, 2) + " " + months[new Date(C2startDate).getMonth()] + " - " + C2endDate.substr(C2endDate.indexOf('/') + 1, 2) + " " + months[new Date(C2endDate).getMonth()] + " </b>";
            chartMaker(categories, series, 3, element, title);

        }
    });

}

function comparisondata(startDate, endDate, s2, e2) {
    $("#radioQueries").prop('checked', false);
    $("#radioPages").prop('checked', false);
    $("#radioDevices").prop('checked', false);
    $("#radioDates").prop('checked', true);
    $("#load").css("display", "block");
    NProgress.start();
    series = Array();
    categories = Array();
    $("#Title_Click").html("Clicks <br>" + startDate.substr(startDate.indexOf('/') + 1, 2) + " " + months[new Date(startDate).getMonth()] + " - " + endDate.substr(endDate.indexOf('/') + 1, 2) + " " + months[new Date(endDate).getMonth()]);
    $("#Title_Impression").html("Impression <br>" + startDate.substr(startDate.indexOf('/') + 1, 2) + " " + months[new Date(startDate).getMonth()] + " - " + endDate.substr(endDate.indexOf('/') + 1, 2) + " " + months[new Date(endDate).getMonth()]);
    $("#Title_Ctr").html("CTR <br>" + startDate.substr(startDate.indexOf('/') + 1, 2) + " " + months[new Date(startDate).getMonth()] + " - " + endDate.substr(endDate.indexOf('/') + 1, 2) + " " + months[new Date(endDate).getMonth()]);
    $("#Title_Position").html("Position <br>" + startDate.substr(startDate.indexOf('/') + 1, 2) + " " + months[new Date(startDate).getMonth()] + " - " + endDate.substr(endDate.indexOf('/') + 1, 2) + " " + months[new Date(endDate).getMonth()]);

    $("#Title_Click1").html("Clicks <br>" + s2.substr(s2.indexOf('/') + 1, 2) + " " + months[new Date(s2).getMonth()] + " - " + e2.substr(e2.indexOf('/') + 1, 2) + " " + months[new Date(e2).getMonth()]);
    $("#Title_Impression1").html("Impression <br>" + s2.substr(s2.indexOf('/') + 1, 2) + " " + months[new Date(s2).getMonth()] + " - " + e2.substr(e2.indexOf('/') + 1, 2) + " " + months[new Date(e2).getMonth()]);
    $("#Title_Ctr1").html("CTR <br>" + s2.substr(s2.indexOf('/') + 1, 2) + " " + months[new Date(s2).getMonth()] + " - " + e2.substr(e2.indexOf('/') + 1, 2) + " " + months[new Date(e2).getMonth()]);
    $("#Title_Position1").html("Position <br>" + s2.substr(s2.indexOf('/') + 1, 2) + " " + months[new Date(s2).getMonth()] + " - " + e2.substr(e2.indexOf('/') + 1, 2) + " " + months[new Date(e2).getMonth()]);

    if (startDate && endDate) {
        $("#mytable").css("display", "none");
        $("#mytable1").css("display", "none");
        $("#mytable2").css("display", "none");
        $("#mytable3").css("display", "none");
        $("#mytable4").css("display", "none");
        $("#mytable5").css("display", "none");
        $("#mytable6").css("display", "none");
        //$("#load").css("display", "none");
        //NProgress.done();
        $("#eachRow").css("display", "none");
        $("#charts").css("display", "none");
        $("#charts_comp").css("display", "none");
        $("#notifier").css("display", "none");
        //$("#load").css("display", "block");
        //NProgress.start();
        var url = 'http://localhost:8067/api/searchconsole/Comp_SearchByDate?startDate1=' + startDate + '&endDate1=' + endDate + '&startDate2=' + s2 + '&endDate2=' + e2 + '&domainID=' + parseInt(parameters[0]) + '&';
        $.ajax({
            type: 'GET',
            contenttype: 'application/json',
            datatype: 'json',
            url: url,
            success: function (data) {
                var fl;
                if (data[0].length >= data[1].length) {
                    fl = 0;
                }
                else {
                    fl = 1;
                }
                for (var i = 0; i < data.length; i++) {
                    var clickarray = new Array();
                    var Imparray = new Array();
                    var Ctrarray = new Array();
                    var Posarray = new Array();
                    totalClick = 0;
                    totalCTR = 0.0;
                    avgCTR = 0.0;
                    totalImpressions = 0;
                    totalPosition = 0.0;
                    avgPosition = 0.0;
                    for (var j = 0; j < data[i].length; j++) {
                        if (i == fl) {
                            categories.push("Day " + (j + 1));
                        }

                        Imparray[j] = { name: data[i][j].Date.substr(0, data[i][j].Date.indexOf('T')), y: data[i][j].Impressions };
                        Ctrarray[j] = { name: data[i][j].Date.substr(0, data[i][j].Date.indexOf('T')), y: data[i][j].CTR * 100 };
                        Posarray[j] = { name: data[i][j].Date.substr(0, data[i][j].Date.indexOf('T')), y: data[i][j].Position };
                        clickarray[j] = { name: data[i][j].Date.substr(0, data[i][j].Date.indexOf('T')), y: data[i][j].Clicks };

                        totalClick += data[i][j].Clicks;
                        totalCTR += data[i][j].CTR;
                        totalImpressions += data[i][j].Impressions;
                        totalPosition += data[i][j].Position;
                    }
                    avgCTR = ((totalClick / totalImpressions) * 100).toFixed(2);
                    avgPosition = (totalPosition / data.length).toFixed(1);
                    if (i == 0) {
                        //var item1 = { name: "Clicks (" + startDate + "-" + endDate + " )", data: clickarray, dashStyle: 'longdash', color: '#2C732C', marker: { symbol: 'circle' }, id: 'Clicks1' }
                        //var item2 = { name: "Impressions (" + startDate + "-" + endDate + " )", data: Imparray, dashStyle: 'longdash', color: '#10A3EE', marker: { symbol: 'circle' }, id: 'Imp1' }
                        //var item3 = { name: "CTR (" + startDate + "-" + endDate + " )", data: Ctrarray, dashStyle: 'longdash', color: '#EEB410', marker: { symbol: 'circle' }, id: 'CTR1' }
                        //var item4 = { name: "Position (" + startDate + "-" + endDate + " )", data: Posarray, dashStyle: 'longdash', color: '#E06255', marker: { symbol: 'circle' }, id: 'Pos1' }
                        var item1 = { name: "Clicks", data: clickarray, dashStyle: 'longdash', color: '#2C732C', marker: { symbol: 'circle' }, id: 'Clicks1' }
                        var item2 = { name: "Impressions", data: Imparray, dashStyle: 'longdash', color: '#10A3EE', marker: { symbol: 'circle' }, id: 'Imp1' }
                        var item3 = { name: "CTR", data: Ctrarray, dashStyle: 'longdash', color: '#EEB410', marker: { symbol: 'circle' }, id: 'CTR1' }
                        var item4 = { name: "Position", data: Posarray, dashStyle: 'longdash', color: '#E06255', marker: { symbol: 'circle' }, id: 'Pos1' }
                        series.push(item1);
                        series.push(item2);
                        series.push(item3);
                        series.push(item4);
                        $("#TotalClicks1").html(totalClick);
                        $("#TotalImpression1").html(totalImpressions);
                        $("#AvgCTR1").html(avgCTR);
                        $("#AvgPosition1").html(avgPosition);
                    }
                    else {
                        //var item1 = { name: "Clicks (" + s2 + "-" + e2 + " )", data: clickarray, dashStyle: 'solid', color: '#2C732C', marker: { symbol: 'diamond' }, id: 'Clicks2', linkedTo: 'Clicks1' }
                        //var item2 = { name: "Impressions (" + s2 + "-" + e2 + " )", data: Imparray, dashStyle: 'solid', color: '#10A3EE', marker: { symbol: 'diamond' }, id: 'Imp2',linkedTo:'Imp1' }
                        //var item3 = { name: "CTR (" + s2 + "-" + e2 + " )", data: Ctrarray, dashStyle: 'solid', color: '#EEB410', marker: { symbol: 'diamond' }, id: 'CTR2',linkedTo: 'CTR1' }
                        //var item4 = { name: "Position (" + s2 + "-" + e2 + " )", data: Posarray, dashStyle: 'solid', color: '#E06255', marker: { symbol: 'diamond' }, id: 'Pos2',linkedTo: 'Pos1' }
                        var item1 = { name: "Clicks", data: clickarray, dashStyle: 'solid', color: '#2C732C', marker: { symbol: 'diamond' }, id: 'Clicks2', linkedTo: 'Clicks1' }
                        var item2 = { name: "Impressions", data: Imparray, dashStyle: 'solid', color: '#10A3EE', marker: { symbol: 'diamond' }, id: 'Imp2', linkedTo: 'Imp1' }
                        var item3 = { name: "CTR", data: Ctrarray, dashStyle: 'solid', color: '#EEB410', marker: { symbol: 'diamond' }, id: 'CTR2', linkedTo: 'CTR1' }
                        var item4 = { name: "Position", data: Posarray, dashStyle: 'solid', color: '#E06255', marker: { symbol: 'diamond' }, id: 'Pos2', linkedTo: 'Pos1' }
                        series.push(item1);
                        series.push(item2);
                        series.push(item3);
                        series.push(item4);
                        $("#TotalClicks").html(totalClick);
                        $("#TotalImpression").html(totalImpressions);
                        $("#AvgCTR").html(avgCTR);
                        $("#AvgPosition").html(avgPosition);
                    }



                }
                var title = "Comparison:<b> " + startDate.substr(startDate.indexOf('/') + 1, 2) + " " + months[new Date(startDate).getMonth()] + " - " + endDate.substr(endDate.indexOf('/') + 1, 2) + " " + months[new Date(endDate).getMonth()] + "</b> VS <b>" + s2.substr(s2.indexOf('/') + 1, 2) + " " + months[new Date(s2).getMonth()] + " - " + e2.substr(e2.indexOf('/') + 1, 2) + " " + months[new Date(e2).getMonth()] + " </b>";
                chartMaker(categories, series, 2, "Dates", title);
                $("#TC1").css("display", "inline-block");
                $("#TI1").css("display", "inline-block");
                $("#AC1").css("display", "inline-block");
                $("#AP1").css("display", "inline-block");
                $("#load").css("display", "none");
                NProgress.done();
            }
        });
    }
}

function chartMaker(categories, series, flag, XaxisLabel, Title) {
    var flq = 0;
    if (flag == 0) {
        $("#eachRow").css("display", "none");
        $("#charts_comp").css("display", "none");
        $("#eachRow_Comp").css("display", "none");
        c1 = Highcharts.chart('charts', {
            chart: {
                type: 'line',
                zoomType: 'xy'
            },
            xAxis: {
                title: { text: '' + XaxisLabel },
                categories: categories
            },
            yAxis: {
                min: 0,

                title: {
                    text: ''
                },
            },
            plotOptions: {
                series: {
                    events: {
                        legendItemClick: function (event) {
                            if (this.visible == true) {

                                var t = $("#" + this.name).index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').css("display","none");
                                if (this.name == "Clicks") {
                                    flq++;
                                }
                                else if (this.name == "Impressions") {
                                    flq++;
                                }
                                else if (this.name == "CTR") {
                                    flq++;
                                }

                                if (flq == 3) {
                                    c1.yAxis[0].update({
                                        reversed: true
                                    });
                                }

                            }
                            else {
                                var t = $("#" + this.name).index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').css("display", "table");
                                if (this.name == "Clicks") {
                                    flq--;
                                }
                                else if (this.name == "Impressions") {
                                    flq--;
                                }
                                else if (this.name == "CTR") {
                                    flq--;
                                }

                                if (flq != 3) {
                                    c1.yAxis[0].update({
                                        reversed: false
                                    });
                                }
                            }
                        }
                    }
                }
            },
            series: series,
            exporting: { enabled: true },
            title: {
                text: '' + Title
            }//,
            //subtitle: {
            //    text: '' + XaxisLabel+ ' Graph'
            //}
        });

        $("#charts").css("display", "block");
    }
    else if (flag == 1) {
        var flq1 = 0;
        $("#charts").css("display", "none");
        $("#charts_comp").css("display", "none");
        $("#eachRow_Comp").css("display", "none");
         c2 = Highcharts.chart('eachRow', {
            chart: {
                type: 'line',
                zoomType: 'xy'
            },
            xAxis: {
                title: { text: '' + XaxisLabel },
                categories: categories
            },
            yAxis: {
                min: 0,

                title: {
                    text: ''
                },
            },
            plotOptions: {
                series: {
                    events: {
                        legendItemClick: function (event) {
                            if (this.visible == true) {

                                var t = $("#" + this.name).index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').hide();

                                if (this.name == "Clicks") {
                                    flq1++;
                                }
                                else if (this.name == "Impressions") {
                                    flq1++;
                                }
                                else if (this.name == "CTR") {
                                    flq1++;
                                }

                                if (flq1 == 3) {
                                    c2.yAxis[0].update({
                                        reversed: true
                                    });
                                }
                            }
                            else {
                                var t = $("#" + this.name).index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').show();
                                if (this.name == "Clicks") {
                                    flq1--;
                                }
                                else if (this.name == "Impressions") {
                                    flq1--;
                                }
                                else if (this.name == "CTR") {
                                    flq1--;
                                }

                                if (flq1 != 3) {
                                    c2.yAxis[0].update({
                                        reversed: false
                                    });
                                }
                            }
                        }
                    }
                }
            },
            series: series,
            exporting: { enabled: true },
            title: {
                text: '' + Title
            }//,
            //subtitle: {
            //    text: '' + XaxisLabel
            //}
        });
        $("#eachRow").css("display", "block");
        $("#notifier").css("display", "block");
    }
    else if (flag == 2) {
        var flq2 = 0;
        $("#eachRow").css("display", "none");
        $("#charts").css("display", "none");
        $("#eachRow_Comp").css("display", "none");
         c3 = Highcharts.chart('charts_comp', {
            chart: {
                type: 'line',
                zoomType: 'xy'
            },
            xAxis: {
                title: { text: '' + XaxisLabel },
                categories: categories
            },
            yAxis: {
                min: 0,

                title: {
                    text: ''
                },
            },
            tooltip: {
                formatter: function () {
                    var s = '<b ' + this.x + '</b>';

                    $.each(this.points, function (i, point) {
                        if (point.series.symbol == "circle") {
                            s += '<br/><span style="font-size:x-large;color:' + point.color + '">\u2505</span> ' + point.series.name.substr(0, point.series.name.indexOf(" ")) + ' ( ' + point.key + ' ) : <b> ' + point.y + '</b>';
                        }
                        else {
                            s += '<br/><span style="font-size:x-large;color:' + point.color + '">\u2500</span> ' + point.series.name.substr(0, point.series.name.indexOf(" ")) + ' ( ' + point.key + ' ) : <b> ' + point.y + '</b>';
                        }
                    });
                    return s;
                },
                shared: true,
                crosshairs: true
            },
            plotOptions: {
                series: {
                    events: {
                        legendItemClick: function (event) {
                            if (this.visible == true) {

                                var t = $("#" + this.name + "_1").index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').hide();
                                var t = $("#" + this.name + "_2").index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').hide();
                                if (this.name == "Clicks") {
                                    flq2++;
                                }
                                else if (this.name == "Impressions") {
                                    flq2++;
                                }
                                else if (this.name == "CTR") {
                                    flq2++;
                                }

                                if (flq2 == 3) {
                                    c3.yAxis[0].update({
                                        reversed: true
                                    });
                                }
                            }
                            else {
                                var t = $("#" + this.name + "_1").index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').show();
                                var t = $("#" + this.name + "_2").index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').show();
                                if (this.name == "Clicks") {
                                    flq2--;
                                }
                                else if (this.name == "Impressions") {
                                    flq2--;
                                }
                                else if (this.name == "CTR") {
                                    flq2--;
                                }

                                if (flq2 != 3) {
                                    c3.yAxis[0].update({
                                        reversed: false
                                    });
                                }
                            }
                        }
                    }
                }
            },
            series: series,
            exporting: { enabled: true },
            title: {
                text: '' + Title
            }//,
            //subtitle: {
            //    text: '' + XaxisLabel + ' Comparison Graph'
            //}
        });

        $("#charts_comp").css("display", "block");

    }
    else {
        var flq3 = 0;
        $("#eachRow").css("display", "none");
        $("#charts").css("display", "none");
        $("#charts_comp").css("display", "none");
         c4 = Highcharts.chart('eachRow_Comp', {
            chart: {
                type: 'line',
                zoomType: 'xy'
            },
            xAxis: {
                title: { text: '' + XaxisLabel },
                categories: categories
            },
            yAxis: {
                min: 0,

                title: {
                    text: ''
                },
            },
            plotOptions: {
                series: {
                    events: {
                        legendItemClick: function (event) {
                            if (this.visible == true) {

                                var t = $("#" + this.name + "_1").index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').hide();
                                var t = $("#" + this.name + "_2").index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').hide();
                                if (this.name == "Clicks") {
                                    flq3++;
                                }
                                else if (this.name == "Impressions") {
                                    flq3++;
                                }
                                else if (this.name == "CTR") {
                                    flq3++;
                                }

                                if (flq3 == 3) {
                                    c4.yAxis[0].update({
                                        reversed: true
                                    });
                                }
                            }
                            else {
                                var t = $("#" + this.name + "_1").index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').show();
                                var t = $("#" + this.name + "_2").index() + 1;
                                $('td:nth-child(' + t + '),th:nth-child(' + t + ')').show();
                                if (this.name == "Clicks") {
                                    flq3--;
                                }
                                else if (this.name == "Impressions") {
                                    flq3--;
                                }
                                else if (this.name == "CTR") {
                                    flq3--;
                                }

                                if (flq3 != 3) {
                                    c4.yAxis[0].update({
                                        reversed: false
                                    });
                                }
                            }
                        }
                    }
                }
            },
            series: series,
            exporting: { enabled: true },
            title: {
                text: '' + Title
            }//,
            //subtitle: {
            //    text: '' + XaxisLabel + ' Comparison Graph'
            //}
        });

        $("#eachRow_Comp").css("display", "block");
        $("#notifier").css("display", "block");

    }

}

$('.tableHover tr').hover(function () {
    $(".tableHover").addClass('thover');
}, function () {
    $(".tableHover").removeClass('thover');
});


function highlight(tableid) {
    var row = tableid + " tbody tr";
    $("#" + row).unbind().on('mouseover mouseout', (function () {
        $(this).toggleClass("highlight");
    }))
}



//function fnExcelReport(id) {
//    var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
//    var textRange; var j = 0;
//    tab = document.getElementById(''+id); // id of table

//    for (j = 0 ; j < tab.rows.length-1 ; j++) {
//        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
//        //tab_text=tab_text+"</tr>";
//    }

//    tab_text = tab_text + "</table>";
//    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
//    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
//    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

//    var ua = window.navigator.userAgent;
//    var msie = ua.indexOf("MSIE ");

//    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
//    {
//        txtArea1.document.open("txt/html", "replace");
//        txtArea1.document.write(tab_text);
//        txtArea1.document.close();
//        txtArea1.focus();
//        sa = txtArea1.document.execCommand("SaveAs", true, "data.xls");
//    }
//    else                 //other browser not tested on IE 11
//        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

//    return (sa);
//}

function fnExcelReport(id) {
    $("#" + id).table2excel({
        // exclude CSS class
        exclude: ".noExl",
        name: "Sheet 1",
        filename: "Data.xls" //do not include extension
    });

}

//function reset(type)
//{
//    $("#specific" + type).text("");
//    $("#Parent_specific" + type).css("display", "none");
//    $("#eachRow").css("display", "none");
//    if (type == 'Page')
//    {
//        $("#load").css("display", "none");
//        $("#mytable1").css("display", "block");
//        $("#charts").css("display", "block");
//    }
//}

function logginout() {
    localStorage['isLoggedOut'] = true;
    //var sd = JSON.parse(localStorage['domain']);
    //for(var i = 0;i<sd.length;i++)
    //{

    //}
}

function columnHide(noOfColumns,chartType,columnNamePrefix)
{
    for (var b = 0; b < noOfColumns; b++) {
        if (chartType.series[b].visible == false) {
            //$('td:nth-child(#' + c1.series[b].name + '),th:nth-child(#' + c1.series[b].name + ')').hide();
            $("." + columnNamePrefix + "_" + chartType.series[b].name).hide();
        }
    }
}

function compareColumnHide(noOfColumns, chartType, columnNamePrefix)
{
    for (var b = 0; b < noOfColumns; b++) {
        if (chartType.series[b].visible == false) {
            //$('td:nth-child(#' + c1.series[b].name + '),th:nth-child(#' + c1.series[b].name + ')').hide();
            $("." + columnNamePrefix + "_" + chartType.series[b].name + "_1, #" + chartType.series[b].name + "_1").hide();
            $("." + columnNamePrefix + "_" + chartType.series[b].name + "_2, #" + chartType.series[b].name + "_2").hide();
        }
    }
}

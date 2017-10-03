$(document).ready(function () {
    //$('#chkFilterClicks').val($(this).is(':checked')).val(true);
    //$('#chkFilterClicks').prop('checked', true);
    var clickChecked = 'true';
    var ctrChecked = $('#chkFilterCTR').val($(this).is(':checked')).val();
    var impressionsChecked = $('#chkFilterImpressions').val($(this).is(':checked')).val();
    var positionChecked = $('#chkFilterPosition').val($(this).is(':checked')).val();

    $('#chkFilterClicks').change(function () {
        //alert($('#chkFilterClicks').val($(this).is(':checked')).val());
        clickChecked = $('#chkFilterClicks').val($(this).is(':checked')).val();
        //alert(clickChecked);
        callJSON();
    });

    $('#chkFilterCTR').change(function () {
        //alert($('#chkFilterCTR').val($(this).is(':checked')).val());
        ctrChecked = $('#chkFilterCTR').val($(this).is(':checked')).val();
        //alert(ctrChecked);
        callJSON();
    });

    $('#chkFilterImpressions').change(function () {
        //alert($('#chkFilterImpressions').val($(this).is(':checked')).val());
        impressionsChecked = $('#chkFilterImpressions').val($(this).is(':checked')).val();
        //alert(impressionsChecked);
        callJSON();
    });

    $('#chkFilterPosition').change(function () {
        //alert($('#chkFilterPosition').val($(this).is(':checked')).val());
        positionChecked = $('#chkFilterPosition').val($(this).is(':checked')).val();
        //alert(positionChecked);
        callJSON();
    });

    $('#btnSearch').click(function () {
        var startDate = $('#calStartDate').val();
        var endDate = $('#calEndDate').val();
        if (startDate && endDate) {
            var url = 'http://localhost:8067/api/searchconsole/searchbydate?startDate=' + startDate + '&endDate=' + endDate;
            $.ajax({
                type: 'GET',
                contenttype: 'application/json',
                datatype: 'json',
                url: url,
                success: function (data) {
                    formData(data);
                }
            });
        }
    });

    $.ajax({
        type: 'GET',
        contenttype: 'application/json',
        datatype: 'json',
        url: 'http://localhost:8067/api/searchconsole/searchbydate?startDate=09-10-2016&endDate=09-21-2016',
        success: function (data) {
            formData(data);
        }
    });

    function callJSON() {
        var startDate = $('#calStartDate').val();
        var endDate = $('#calEndDate').val();
        if (startDate && endDate) {
            var url = 'http://localhost:8067/api/searchconsole/searchbydate?startDate=' + startDate + '&endDate=' + endDate;
            $.ajax({
                type: 'GET',
                contenttype: 'application/json',
                datatype: 'json',
                url: url,
                success: function (data) {
                    formData(data);
                }
            });
        }
    }

    function formData(data) {
        var categories = Array();
        var series = Array();
        var domainName = data.DomainName;
        var series = Array();

        for (var dayCount = 0; dayCount < data.DaySearchList.length; dayCount++) {
            categories.push(data.DaySearchList[dayCount]);
        }

        for (var filterCount = 0; filterCount < data.FilterList.length; filterCount++) {
            if (data.FilterList[filterCount].Name == 'Clicks' && clickChecked == 'true') {
                var item = { name: data.FilterList[filterCount].Name, data: data.FilterList[filterCount].Data }
                series.push(item);
            } else if (data.FilterList[filterCount].Name == 'CTR' && ctrChecked == 'true') {
                var item = { name: data.FilterList[filterCount].Name, data: data.FilterList[filterCount].Data }
                series.push(item);
            } else if (data.FilterList[filterCount].Name == 'Impressions' && impressionsChecked == 'true') {
                var item = { name: data.FilterList[filterCount].Name, data: data.FilterList[filterCount].Data }
                series.push(item);
            } else if (data.FilterList[filterCount].Name == 'Position' && positionChecked == 'true') {
                var item = { name: data.FilterList[filterCount].Name, data: data.FilterList[filterCount].Data }
                series.push(item);
            }
        }

        Highcharts.chart('charts', {
            title: {
                text: 'Search Console',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: ' + domainName,
                x: -20
            },
            xAxis: {
                title: { text: 'Dates' },
                categories: categories
            },
            yAxis: {
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 1
            },
            series: series
        });
    }

});

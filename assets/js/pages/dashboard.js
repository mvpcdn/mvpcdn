/** Methods **/
function regimen_patients_linechart(last30dates, chartdata) {
    $('#reg_patient_chart').highcharts({
        chart: {
            type: 'line',
            borderWidth: 1,
            borderColor: '#ccc',
        },
        title: {text: 'Regimen Dispensation', x: -20},
        subtitle: {text: '', x: -20},
        xAxis: {categories: last30dates, title: {text: 'Last 30 Days'}},
        yAxis: {title: {text: 'No. Of Patients'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
        tooltip: {valueSuffix: ''},
        legend: {layout: 'vertical', align: 'right', verticalAlign: 'top', borderWidth: 1, x: 0, y: 60},
        series: chartdata
    });
}

function status_patients_piechart(chartdata) {
    $('#status_patient_chart').highcharts({
        chart: {plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: 'pie', borderWidth: 1, borderColor: '#ccc',
            events: {
                load: function(event) {
                    var total = 0;
                    for (var i = 0, len = this.series[0].yData.length; i < len; i++) {
                        total += this.series[0].yData[i];
                    }
                    var text = this.renderer.text('Total: ' + total, this.plotLeft, this.plotTop - 10).attr({zIndex: 5}).add();
                }
            }
        },
        title: {text: 'Patients Under Active Care', x: -20},
        tooltip: {pointFormat: '{series.name}: <b>{point.y:.0f}</b>'},
        plotOptions: {pie: {allowPointSelect: true, cursor: 'pointer', dataLabels: {enabled: true, format: '<b>{point.name}</b>: {point.y:.0f}', style: {color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'}}}},
        series: [{name: "No. Of Patients", colorByPoint: true, data: chartdata}]
    });
}

function status_patients_piechart1(chartdata) {
    $('#status_patient_chart1').highcharts({
        chart: {plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: 'pie', borderWidth: 1, borderColor: '#ccc',
            events: {
                load: function(event) {
                    var total = 0;
                    for (var i = 0, len = this.series[0].yData.length; i < len; i++) {
                        total += this.series[0].yData[i];
                    }
                    var text = this.renderer.text('Total: ' + total, this.plotLeft, this.plotTop - 10).attr({zIndex: 5}).add();
                }
            }
        },
        title: {text: 'Patients Missing From Active Care', x: -20},
        tooltip: {pointFormat: '{series.name}: <b>{point.y:.0f}</b>'},
        plotOptions: {pie: {allowPointSelect: true, cursor: 'pointer', dataLabels: {enabled: true, format: '<b>{point.name}</b>: {point.y:.0f}', style: {color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'}}}},
        series: [{name: "No. Of Patients", colorByPoint: true, data: chartdata}]
    });
}

function sacs_fac_count_chart(chartdata) {
    $('#sacs_fac_count_chart').highcharts({
        chart: {plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: 'pie', borderWidth: 1, borderColor: '#ccc',
            events: {
                load: function(event) {
                    var total = 0;
                    for (var i = 0, len = this.series[0].yData.length; i < len; i++) {
                        total += this.series[0].yData[i];
                    }
                    var text = this.renderer.text('Total: ' + total, this.plotLeft, this.plotTop - 10).attr({zIndex: 5}).add();
                }
            }
        },
        title: {text: 'Facility Creation Count', x: -20},
        tooltip: {pointFormat: '{series.name}: <b>{point.y:.0f}</b>'},
        plotOptions: {pie: {allowPointSelect: true, cursor: 'pointer', dataLabels: {enabled: true, format: '<b>{point.name}</b>: {point.y:.0f}', style: {color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'}}}},
        series: [{name: "No. Of Facilities", colorByPoint: true, data: chartdata}]
    });
}

function sacs_dispatch_summary_chart(chartdata) {
    $('#dispatch_summary_chart').highcharts({
        chart: {plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: 'pie', borderWidth: 1, borderColor: '#ccc',
            events: {
                load: function(event) {
                    var total = 0;
                    for (var i = 0, len = this.series[0].yData.length; i < len; i++) {
                        total += this.series[0].yData[i];
                    }
                    var text = this.renderer.text('Total: ' + total, this.plotLeft, this.plotTop - 10).attr({zIndex: 5}).add();
                }
            }
        },
        title: {text: 'Dispatch Summary (Last 30 days)', x: -20},
        tooltip: {pointFormat: '{series.name}: <b>{point.y:.0f}</b>'},
        plotOptions: {pie: {allowPointSelect: true, cursor: 'pointer', dataLabels: {enabled: true, format: '<b>{point.name}</b>: {point.y:.0f}', style: {color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'}}}},
        series: [{name: "No. Of Dispatch", colorByPoint: true, data: chartdata}]
    });
}

function relocation_piechart(chartdata){
    $('#relocation_chart').highcharts({
        chart:{plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: 'pie', borderWidth:1, borderColor:'#ccc',
            events: {
                load: function(event) {
                    var total = 0; 
                    for (var i = 0, len = this.series[0].yData.length; i < len; i++) {
                        total += this.series[0].yData[i];
                    }
                    var text = this.renderer.text('Total: ' + total, this.plotLeft, this.plotTop - 10).attr({zIndex: 5}).add();
                }
            }
        },
        title:          {text: 'RELOCATIONS IN LAST 30 DAYS', x: -20},
        tooltip:        {pointFormat: '{series.name}: <b>{point.y:.0f}</b>'},
        plotOptions:    {pie: {allowPointSelect: true, cursor: 'pointer', dataLabels: {enabled: true, format: '<b>{point.name}</b>: {point.y:.0f}', style: {color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'}}}},
        
        series: [{name: "No. Of Relocations", colorByPoint: true, data: chartdata}]
    });
}

/** Events **/
$(document).ready(function() {
    $(".dueb1").click(function(e) {
        e.preventDefault();
        $(".due-sel-dt").text($(this).text());
        $(".due1").show();
        $(".due2, .due3").hide();
        $(".dueb1").hide();
        $(".dueb2, .dueb3").show();
    });

    $(".dueb2").click(function(e) {
        e.preventDefault();
        $(".due-sel-dt").text($(this).text());
        $(".due2").show();
        $(".due1, .due3").hide();
        $(".dueb2").hide();
        $(".dueb1, .dueb3").show();
    });

    $(".dueb3").click(function(e) {
        e.preventDefault();
        $(".due-sel-dt").text($(this).text());
        $(".due3").show();
        $(".due1, .due2").hide();
        $(".dueb3").hide();
        $(".dueb1, .dueb2").show();
    });

    /** **/
    $(".cd4weekdate").change(function() {
        var ob = $(this);
        setTimeout(function() {
            var dt = ob.val();
            $.ajax({
                url: SITE_URL + "dashboard/fac_weeklycd4",
                method: 'POST',
                data: {dt: dt, csrf_imsnaco: get_csrf_cookie()},
                dataType: 'JSON',
                success: function(res) {
                    $("#no_of_cd4").text(res.npatients);
                }
            });

        }, 200);
    });


    /** Regimen patients line chart **/
    $("#inclac").change(function() {
        var r = $("#reg_dd").val();
        var lac = $("#inclac").prop('checked') ? 1 : 0;
        $.ajax({
            url: SITE_URL + "dashboard/regimen_patients",
            method: 'POST',
            data: {regimen: r, lac: lac, csrf_imsnaco: get_csrf_cookie()},
            dataType: 'JSON',
            success: function(res) {
                regimen_patients_linechart(last30dates, res.reg_disp);
            }
        });
    });

    $("#reg_dd").change(function() {
        var r = $.trim($(this).find('option:selected').text());

        var chartd = [];
        if (!$(this).val()) {
            chartd = chartdata;
        } else {
            $.each(chartdata, function(k, v) {
                if (v.name == r) {
                    chartd.push(v);
                    return false;
                }
            });
        }

        regimen_patients_linechart(last30dates, chartd);
    });

    if (typeof last30dates != 'undefined') {
        regimen_patients_linechart(last30dates, chartdata);
    }

    if (typeof piechartdata != 'undefined') {
        status_patients_piechart(piechartdata);
    }

    if (typeof piechartdata1 != 'undefined') {
        status_patients_piechart1(piechartdata1);
    }

    if (typeof sacs_fac_count != 'undefined') {
        sacs_fac_count_chart(sacs_fac_count);
    }

    if (typeof dispatch_summary != 'undefined') {
        sacs_dispatch_summary_chart(dispatch_summary);
    }
    
    if (typeof reloc_data != 'undefined') {
        relocation_piechart(reloc_data);
    }

    /*--Notification Box--*/
    if($('#notes_box').find('tbody tr').length>1){
        $('#notes_box').DataTable({
            "order": [[ 2, "desc" ]]
        });
    }
});
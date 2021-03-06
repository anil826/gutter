// Gets data from provided url and updates DOM element.
function generate_os_data(url, element) {
    $.get(url, function (data) {
        $(element).text(data[0]);
    }, "json");
}

// If dataTable with provided ID exists, destroy it.
function destroy_dataTable(table_id) {
    var table = $("#" + table_id);
    var ex = document.getElementById(table_id);
    if ($.fn.DataTable.fnIsDataTable(ex)) {
        table.hide().dataTable().fnClearTable();
        table.dataTable().fnDestroy();
    }
}

//DataTables
//Sort file size data.
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "file-size-units": {
        K: 1024,
        M: Math.pow(1024, 2),
        G: Math.pow(1024, 3),
        T: Math.pow(1024, 4),
        P: Math.pow(1024, 5),
        E: Math.pow(1024, 6)
    },

    "file-size-pre": function (a) {
        var x = a.substring(0, a.length - 1);
        var x_unit = a.substring(a.length - 1, a.length);
        if (jQuery.fn.dataTableExt.oSort['file-size-units'][x_unit]) {
            return parseInt(x * jQuery.fn.dataTableExt.oSort['file-size-units'][x_unit], 10);
        }
        else {
            return parseInt(x + x_unit, 10);
        }
    },

    "file-size-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "file-size-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

//DataTables
//Sort numeric data which has a percent sign with it.
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "percent-pre": function (a) {
        var x = (a === "-") ? 0 : a.replace(/%/, "");
        return parseFloat(x);
    },

    "percent-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "percent-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

//DataTables
//Sort IP addresses
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "ip-address-pre": function (a) {
        // split the address into octets
        //
        var x = a.split('.');

        // pad each of the octets to three digits in length
        //
        function zeroPad(num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        }

        // build the resulting IP
        var r = '';
        for (var i = 0; i < x.length; i++)
            r = r + zeroPad(x[i], 3);

        // return the formatted IP address
        //
        return r;
    },

    "ip-address-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "ip-address-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

/*******************************
 Data Call Functions
 *******************************/

var dashboard = {};

dashboard.getPs = function () {
    $.get('/gutter/fetch-data/ps', function (data) {
        destroy_dataTable("ps_dashboard");
        $("#filter-ps").val("").off("keyup");
        _head = data.reverse().pop()
        data.reverse();
        var psTable = $("#ps_dashboard").dataTable({
            aoColumns: $.map(_head, function (element, index) {
                return {sTitle: element}
            }),
            aaData: data,
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: true,
            sDom: "lrtip",
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();

        $("#filter-ps").on("keyup", function () {
            psTable.fnFilter(this.value);
        });
    }, "json");
}

dashboard.getNetStat = function () {
    $.get('/gutter/fetch-data/netstats', function (data) {
        destroy_dataTable("netstat_dashboard");

        _head = data.reverse().pop()
        data.reverse();
        $("#netstat_dashboard").dataTable({
            aaData: data,
            aoColumns: $.map(_head, function (element, index) {
                return {sTitle: element}
            }),
            aaSorting: [
                [0, "desc"]
            ],
            iDisplayLength: 5,
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: true,
            sDom: "lrtip",
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    }, "json");
}


dashboard.getUsers = function () {
    $.get('/gutter/fetch-data/users', function (data) {
        destroy_dataTable("users_dashboard");

        _head = data.reverse().pop()
        data.reverse();

        $("#users_dashboard").dataTable({
            aaData: data,
            aoColumns: $.map(_head, function (element, index) {
                return {sTitle: element}
            }),
            aaSorting: [
                [0, "desc"]
            ],
            iDisplayLength: 5,
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: false,
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    }, "json");
    $("select[name='users_dashboard_length']").val("5");
}

dashboard.getOnline = function () {
    $.get('/gutter/fetch-data/online', function (data) {
        destroy_dataTable("online_dashboard");

        _head = data.reverse().pop()
        data.reverse();

        $("#online_dashboard").dataTable({
            aaData: data,
            aoColumns: $.map(_head, function (element, index) {
                return {sTitle: element}
            }),
            aaSorting: [
                [0, "desc"]
            ],
            iDisplayLength: 5,
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: false,
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    }, "json");
    $("select[name='online_dashboard_length']").val("5");
}

dashboard.getLastLog = function () {
    $.get('/gutter/fetch-data/last_login', function (data) {
        destroy_dataTable("lastlog_dashboard");
        _head = data.reverse().pop()
        data.reverse();

        $("#lastlog_dashboard").dataTable({
            aaData: data,
            aoColumns: $.map(_head, function (element, index) {
                return {sTitle: element}
            }),
            aaSorting: [
                [2, "desc"]
            ],
            iDisplayLength: 5,
            bPaginate: true,
            sPaginationType: "full_numbers",
            bFilter: false,
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    }, "json");
    $("select[name='lastlog_dashboard_length']").val("5");
}

dashboard.getRam = function () {
    $.get('/gutter/fetch-data/ram', function (data) {
        var ram_total = data[0];
        var ram_used = Math.round((data[1] / ram_total) * 100);
        var ram_free = Math.round((data[2] / ram_total) * 100);

        $("#ram-total").text(ram_total);
        $("#ram-used").text(data[1]);
        $("#ram-free").text(data[2]);

        $("#ram-free-per").text(ram_free);
        $("#ram-used-per").text(ram_used);
    }, "json");
}

dashboard.getDf = function () {
    $.get('/gutter/fetch-data/df', function (data) {
        var table = $("#df_dashboard");
        var ex = document.getElementById("df_dashboard");
        if ($.fn.DataTable.fnIsDataTable(ex)) {
            table.hide().dataTable().fnClearTable();
            table.dataTable().fnDestroy();
        }
        _head = data.reverse().pop()
        data.reverse();
        table.dataTable({
            aaData: data,
            aoColumns: $.map(_head, function (element, index) {
                return {sTitle: element}
            }),
            iDisplayLength: 5,
            bPaginate: true,
            bFilter: false,
            bAutoWidth: true,
            bInfo: false
        }).fadeIn();
    }, "json");
}

dashboard.getWhereIs = function () {
    $.get('/gutter/fetch-data/whereis', function (data) {
        var table = $("#whereis_dashboard");
        var ex = document.getElementById("whereis_dashboard");
        if ($.fn.DataTable.fnIsDataTable(ex)) {
            table.hide().dataTable().fnClearTable();
            table.dataTable().fnDestroy();
        }

        _head = data.reverse().pop()
        data.reverse();
        table.dataTable({
            aaData: data,
            aoColumns: $.map(_head, function (element, index) {
                return {sTitle: element}
            }),
            bPaginate: true,
            iDisplayLength: 6,
            bFilter: false,
            aaSorting: [
                [1, "desc"]
            ],
            bAutoWidth: false,
            bInfo: false
        }).fadeIn();
    }, "json");
}
// General Info Area
dashboard.getOs = function () {
    generate_os_data('/gutter/fetch-data/issue', "#os-info");
    generate_os_data('/gutter/fetch-data/hostname', "#os-hostname");
    generate_os_data('/gutter/fetch-data/time', "#os-time");
    generate_os_data('/gutter/fetch-data/uptime', "#os-uptime");
}

dashboard.getIp = function () {
    $.get('/gutter/fetch-data/ip', function (data) {
        destroy_dataTable("ip_dashboard");
        $("#ip_dashboard").dataTable({
            aaData: data,
            aoColumns: [
                { sTitle: "Interface" },
                { sTitle: "IP" }
            ],
            iDisplayLength: 5,
            bPaginate: true,
            sPaginationType: "two_button",
            bFilter: false,
            bAutoWidth: true,
            bInfo: false
        }).fadeIn();
    }, "json");
}

dashboard.getPing = function () {
    var refreshIcon = $('#refresh-ping .icon-refresh');
    refreshIcon.addClass('icon-spin');

    $.ajax({
        url: '/gutter/fetch-data/ping',
        cache: false,
        success: function (data) {
            destroy_dataTable("ping_dashboard");
            _head = data.reverse().pop()
            data.reverse();

            $("#ping_dashboard").dataTable({
                aaData: data,
                aoColumns: $.map(_head, function (element, index) {
                    return {sTitle: element}
                }),
                aaSorting: [
                    [0, "desc"]
                ],
                bPaginate: true,
                sPaginationType: "full_numbers",
                bFilter: true,
                sDom: "lrtip",
                bAutoWidth: false,
                bInfo: false
            }).fadeIn();
        },
        complete: function () {
            refreshIcon.removeClass('icon-spin');
        }
    });
}

dashboard.getLoadAverage = function () {
    $.get('/gutter/fetch-data/load_average', function (data) {
        $("#cpu-1min").text(data[0][0]);
        $("#cpu-5min").text(data[1][0]);
        $("#cpu-15min").text(data[2][0]);
        $("#cpu-1min-per").text(data[0][1]);
        $("#cpu-5min-per").text(data[1][1]);
        $("#cpu-15min-per").text(data[2][1]);
    }, "json");
    generate_os_data('/gutter/fetch-data/numberofcores', "#core-number");
}

dashboard.getBandwidth = function () {
    var refreshIcon = $('#refresh-bandwidth .icon-refresh');
    refreshIcon.addClass('icon-spin');

    $.ajax({
        url: '/gutter/fetch-data/bandwidth',
        cache: false,
        dataType: 'json',
        success: function (data) {
            $('#bw-tx').text(data.tx);
            $('#bw-rx').text(data.rx);
        },
        complete: function () {
            refreshIcon.removeClass('icon-spin');
        }
    });

}

dashboard.getSwaps = function () {
    $.get('/gutter/fetch-data/swap', function (data) {
        var table = $("#swap_dashboard");
        var ex = document.getElementById("swap_dashboard");
        if ($.fn.DataTable.fnIsDataTable(ex)) {
            table.hide().dataTable().fnClearTable();
            table.dataTable().fnDestroy();
        }
        _head = data.reverse().pop()
        data.reverse();

        table.dataTable({
            aaData: data,
            aoColumns: $.map(_head, function (element, index) {
                return {sTitle: element}
            }),
            iDisplayLength: 5,
            bPaginate: true,
            bFilter: false,
            bAutoWidth: true,
            bInfo: false
        }).fadeIn();

    }, "json");

}


/**
 * Refreshes all widgets. Does not call itself recursively.
 */
dashboard.getAll = function () {
    for (var item in dashboard.fnMap) {
        if (dashboard.fnMap.hasOwnProperty(item) && item !== "all") {
            dashboard.fnMap[item]();
        }
    }
}

dashboard.fnMap = {
    all: dashboard.getAll,
    ram: dashboard.getRam,
    whereis: dashboard.getWhereIs,
    ps: dashboard.getPs,
    df: dashboard.getDf,
    os: dashboard.getOs,
    ping: dashboard.getPing,
    online: dashboard.getOnline,
    netstat: dashboard.getNetStat,
    users: dashboard.getUsers,
    swap: dashboard.getSwaps,
    cpu: dashboard.getLoadAverage,
    bandwidth: dashboard.getBandwidth,
    lastlog: dashboard.getLastLog,
    ip: dashboard.getIp
};

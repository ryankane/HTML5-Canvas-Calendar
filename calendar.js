$(document).ready(function() {
    var today = new Date();

    $('#month').val(today.getMonth());
    $('#year').val(today.getFullYear());

    CanvasCalendar.initialize();
});

var maxDays = 7;
var maxWeeks = 6;
var maxMonths = 12;
var delay = 800;

window.CanvasCalendar = {
    initialize: function() {
        var $month = $('#month');
        var $year = $('#year');

        $month.on('change', function() {
            CanvasCalendar.refreshCalendar();
        });

        $year.on('change', function() {
            CanvasCalendar.refreshCalendar();
        });

        $year.on('keyup', function() {
            clearTimeout($.data(this, 'timer'));
            var wait = setTimeout(function(field) {
                $(field).trigger('change');
            }, delay, this);
            $(this).data('timer', wait);
        });

        CanvasCalendar.refreshCalendar();
    },

    refreshCalendar: function() {
        var selectedMonth = document.getElementById("month").value;
        var selectedYear = document.getElementById("year").value;

        monthDay = 0;

        selectedDate = new Date(selectedYear, selectedMonth, 1);
        var thisMonth = selectedDate.getMonth() + 1;
        var thisYear = selectedDate.getYear();
        var prevYear = thisMonth - 1 < 0 ? thisYear - 1 : thisYear;

        prevMonthLastDate = getLastDayOfMonth(thisMonth - 1, prevYear);
        thisMonthLastDate = getLastDayOfMonth(thisMonth, thisYear);
        thisMonthFirstDay = selectedDate.getDay();
        thisMonthFirstDate = selectedDate.getDate();

        nextMonthFirstDay = thisMonth === maxMonths ? 1 : thisMonth + 1;

        dateOffset = thisMonthFirstDay;

        canvas = document.getElementById("calendar");
        context = canvas.getContext("2d");
        context.fillStyle = "#f0f0f0";

        CanvasCalendar.drawCalendar();
    },

    drawCalendar: function() {
        for (var week = 0; week < maxWeeks; week++) {
            drawWeek(week);
        }
    },

    settings: {
        currMonthColor: '#202020',
        prevMonthColor: '#909090',
        currWeekendColor : '#008',
        prevWeekendColor : '#88B'
    }
};

var canvas;
var context;

var thisMonth;
var prevMonthLastDate;
var thisMonthLastDate;
var thisMonthFirstDay;
var nextMonthFirstDay;
var monthDay;

var dateOffset;

function refreshCalendar() {

}

function drawWeek(week) {
    for (var day = 0; day < maxDays; day++) {
        drawDay(day, week);
    }
}

function drawDay(day, week) {
    x_offset = maxDays + 106 * day;
    y_offset = (maxWeeks - 1) + 106 * week;

    context.fillStyle = "#f0f0f0";
    context.fillRect(x_offset, y_offset, 100, 100);

    var dayOfMonth = 0;
    var isCurrMonth = false;
    
    // First week
    if (week === 0) {
        if (day < thisMonthFirstDay) {            
            dayOfMonth = prevMonthLastDate - (dateOffset - day) + 1;
            isCurrMonth = false;
        } else if (day === thisMonthFirstDay) {
            monthDay = 1;
            dayOfMonth = thisMonthFirstDate + (dateOffset - day);
            isCurrMonth = true;
        } else {
            monthDay++;
            dayOfMonth = monthDay;
            isCurrMonth = true;
        }
    }
    // Last weeks
    else if (thisMonthLastDate <= monthDay) {
        monthDay++;
        dayOfMonth = monthDay - thisMonthLastDate;
        isCurrMonth = false;
    }
    // Other weeks
    else {
        monthDay++;
        dayOfMonth = monthDay;
        isCurrMonth = true;
    }
    
    drawDayNumber(day, dayOfMonth, isCurrMonth, CanvasCalendar.settings);
}

function drawDayNumber(dayOfWeek, dayNumber, isCurrMonth, settings) {
    var color;

    if (dayOfWeek === 0 || dayOfWeek === 6) {
        color = isCurrMonth ? settings.currWeekendColor : settings.prevWeekendColor;
    } else {
        color = isCurrMonth ? settings.currMonthColor : settings.prevMonthColor;
    }

    context.fillStyle = color;
    context.font = "bold 32px sans-serif";
    context.fillText(dayNumber, x_offset + 10, y_offset + 35);
}

function getLastDayOfMonth(month, year) {
    switch (month) {
        case 0: // Prevents error when checking for previous month in January
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
        case 13: // Prevents error when checking for next month in December
            return 31;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        case 2:
            return isLeapYear(year) ? 29 : 28;
    }
}

function isLeapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

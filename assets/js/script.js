// set luxon to DateTime variable
var DateTime = luxon.DateTime;

// apply background color to columns conditionally
var setBackgroundColor = function (hour) {
  // get div position that matches the hour
  var index = "";
  var $timeBlockArray = $(".container").children();
  $timeBlockArray.each(function (i) {
    this.id === hour ? (index = i) : false;
  });

  // color divs
  $timeBlockArray.each(function (i) {
    var $textContainer = $(this).children("div");
    switch (true) {
      case i < index:
        $textContainer.addClass("past");
        break;
      case i === index:
        $textContainer.addClass("present");
        break;
      case i > index:
        $textContainer.addClass("future");
      default:
        $textContainer.addClass("future");
    }
  });
};

// get current date and hour
var currentTimeAndDay = function () {
  var day = DateTime.now().toLocaleString(DateTime.DATE_MED);
  var time = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE);
  return time + " " + day;
};

// get current hour with AM/PM to match element id
var currentHour = function () {
  var hour = currentTimeAndDay().replace(/:.+/, "");
  var morningOrEvening = currentTimeAndDay().match(/AM|PM/);
  return hour + morningOrEvening;
};
var hour = currentHour();

// render colors on load
setBackgroundColor(hour);

// display current time
$("#currentDay").text(currentTimeAndDay);

// re-render time and colors after one minute
var clockInterval = setInterval(function () {
  $("#currentDay").text(currentTimeAndDay);
  hour = currentHour();
  setBackgroundColor(hour);
}, 1000 * 60);

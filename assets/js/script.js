// set luxon to DateTime variable
var DateTime = luxon.DateTime;

// apply background color to columns conditionally
var setBackgroundColor = function (hour) {
  // get div position that matches the hour
  var currentHourIndex = "";
  var $timeBlockArray = $(".container").children();
  $timeBlockArray.each(function (i) {
    this.id === hour ? (currentHourIndex = i) : false;
  });

  // color divs
  $timeBlockArray.each(function (i) {
    var $textContainer = $(this).children("div");
    switch (true) {
      case hour === "6PM":
        $textContainer.removeClass("present future");
        $textContainer.addClass("past");
        break;
      case i < currentHourIndex:
        $textContainer.removeClass("present future");
        $textContainer.addClass("past");
        break;
      case i === currentHourIndex:
        $textContainer.removeClass("past future");
        $textContainer.addClass("present");
        break;
      case i > currentHourIndex:
        $textContainer.removeClass("past present");
        $textContainer.addClass("future");
        break;
      default:
        $textContainer.removeClass("past present");
        $textContainer.addClass("future");
        break;
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

// render input on click
$(".container").on("click", ".text-container", function () {
  // if no children elements
  if ($(this).children().length === 0) {
    $(this).append("<textarea>");
    $(this).children("textarea").trigger("focus");
  }
  // if child element is present
  if ($(this).children(".description").length === 1) {
    var value = $(this).children(".description").html();

    $(this)
      .children(".description")
      .replaceWith("<textarea>" + value + "</textarea>");

    $(this).children("textarea").trigger("focus");
  }

  // when user clicks off textarea
  $(this)
    .children("textarea")
    .on("blur", function () {
      var value = $(this).val();
      $(this).replaceWith("<p class='description'>" + value + "</p>");
    });
});

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

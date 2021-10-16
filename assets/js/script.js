// set luxon to DateTime variable
var DateTime = luxon.DateTime;

// create rows and inner elements
var hourBlock = 9;
var morningOrEvening = "AM";
for (var i = 0; i < 9; i++) {
  // switch to PM at hourBlock 12
  if (i === 3) {
    morningOrEvening = "PM";
  }
  // switch hourBlock to 1 after hourBlock 12
  if (i === 4) {
    hourBlock = 1;
  }

  var $timeBlockDiv = $(
    "<div class='row' id='" + hourBlock + morningOrEvening + "'>"
  );
  var $timeBlockSpan = $("<span class='hour col-1'>");
  $timeBlockSpan.text(hourBlock + morningOrEvening);

  var $timeBlockTextContainer = $("<div class='text-container col-10'>");

  var $timeBlockButton = $("<button class='saveBtn col-1'>");
  $timeBlockButton.html("<i class='far fa-save'></i>");

  $timeBlockDiv.append(
    $timeBlockSpan,
    $timeBlockTextContainer,
    $timeBlockButton
  );

  $timeBlockDiv.appendTo($(".container"));

  hourBlock++;
}

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
  var day = DateTime.now().toLocaleString(DateTime.DATE_HUGE);
  var time = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE);
  return time + " -- " + day;
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

// save to local storage when user clicks 'save' button
$(".container").on("click", ".saveBtn", function () {
  var parentID = $(this).parent(".row").attr("id");
  localStorage[parentID] = $(this).siblings("div").children().html();
});

// populate time blocks with localStorage data
var storageArray = Object.entries(localStorage);
$(".container")
  .children()
  .each(function () {
    for (i = 0; i < storageArray.length; i++) {
      if (this.id === storageArray[i][0]) {
        $(this)
          .children("div")
          .append("<p class='description'>" + storageArray[i][1] + "</p>");
      }
    }
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

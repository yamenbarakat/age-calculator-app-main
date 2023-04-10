// holder elements
const holders = document.querySelectorAll(".holder");
const year = document.querySelector(".year");
const month = document.querySelector(".month");
const day = document.querySelector(".day");

// inputs elements
const inputs = document.querySelectorAll("#age-calc input");
const yearInput = document.getElementById("year-input");
const monthInput = document.getElementById("month-input");
const dayInput = document.getElementById("day-input");

// msg elements
const msgs = document.querySelectorAll(".msg");
const dayMsg = document.getElementById("day-msg");
const monthMsg = document.getElementById("month-msg");
const yearMsg = document.getElementById("year-msg");

// results elements
const yearsRes = document.querySelector(".results .years");
const monthsRes = document.querySelector(".results .months");
const daysRes = document.querySelector(".results .days");

// submit button
const submit = document.getElementById("submit");

// days number in months
const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// the state of validation
let state;

submit.addEventListener("click", (e) => {
  e.preventDefault();

  // remove errors msg and remove styles from labels and inputs
  removeStyles();
  removeMsgs();

  // reset resluts elements
  yearsRes.textContent = "--";
  monthsRes.textContent = "--";
  daysRes.textContent = "--";

  // initiate state
  state = false;

  // date values
  const yearValue = +yearInput.value;
  const monthValue = +monthInput.value;
  const dayValue = +dayInput.value;

  // current date
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  // save date values and current date in an object
  const dateValues = {
    yearValue,
    monthValue,
    dayValue,
    currentYear,
    currentMonth,
    currentDay,
  };

  // check if any field is empty
  if (checkEmpty()) {
    // stop the function here
    return;
  }

  // validate inputs
  if (validateInputs(dateValues)) {
    // stop the function here
    return;
  }

  // calculate age
  calcAge(dateValues);
});

function removeStyles() {
  holders.forEach((holder) => {
    holder.classList.remove("invalid");
  });
}

function removeMsgs() {
  msgs.forEach((msg) => {
    msg.textContent = "";
  });
}

function checkEmpty() {
  inputs.forEach((input) => {
    if (input.value === "") {
      // make the state true
      state = true;

      // if it is empty, show error msg
      input.nextElementSibling.textContent = "This field is required";
    }
  });

  // if one of the input is empty, style all labels and inputs
  if (state) {
    styleElements();
  }

  return state;
}

// style labels and inputs by adding class invalid for each of them
function styleElements() {
  holders.forEach((holder) => {
    holder.classList.add("invalid");
  });
}

// validate inputs
function validateInputs(dateValues) {
  // destruct
  const { yearValue, monthValue, dayValue } = dateValues;

  // check  if the number is wrong
  checkWrong(yearValue, monthValue, dayValue);

  // check if the month value is not compatible with the day value
  isCompatible(monthValue, dayValue);

  // check if the number is in the future
  checkFuture(dateValues);

  return state;
}

// check if the number is wrong
function checkWrong(yearValue, monthValue, dayValue) {
  // check year
  if (1 > yearValue) {
    errorNum(yearInput, "year");
    state = true;
  }

  // check month
  if (12 < monthValue || 1 > monthValue) {
    errorNum(monthInput, "month");
    state = true;
  }

  // check day
  if (31 < dayValue || 1 > dayValue) {
    errorNum(dayInput, "day");
    state = true;
  }
}

// check if the month value is not compatible with the day value
function isCompatible(monthValue, dayValue) {
  // get the number of the days of the monthValue
  const monthDays = months[monthValue - 1];

  if (monthDays < dayValue) {
    errorNum(dayInput, "day");
    state = true;
  }
}

// check if the number is in the future
function checkFuture(dateValues) {
  // destruct
  const {
    yearValue,
    monthValue,
    dayValue,
    currentYear,
    currentMonth,
    currentDay,
  } = dateValues;

  // check if the year is in the future
  if (currentYear < yearValue) {
    errorFuture(yearInput);
    state = true;
  }

  // check if the year is current and the month is in the future
  if (
    currentYear === yearValue &&
    currentMonth < monthValue &&
    12 >= monthValue
  ) {
    errorFuture(monthInput);
    state = true;
  }

  // check if the year and month are current but the day is current or in the future
  if (
    currentYear === yearValue &&
    currentMonth === monthValue &&
    currentDay <= dayValue &&
    31 >= dayValue
  ) {
    errorFuture(dayInput);
    state = true;
  }
}

// calculate age
function calcAge(dateValues) {
  // destruct
  const {
    yearValue,
    monthValue,
    dayValue,
    currentYear,
    currentMonth,
    currentDay,
  } = dateValues;

  // display years result
  yearsRes.textContent = currentYear - yearValue;

  // check months
  if (monthValue <= currentMonth) {
    // display months result
    monthsRes.textContent = currentMonth - monthValue;
  } else {
    // update years result
    yearsRes.textContent = currentYear - yearValue - 1;

    // display months result
    monthsRes.textContent = 12 + currentMonth - monthValue;
  }

  // check days
  if (dayValue <= currentDay) {
    // display days result
    daysRes.textContent = currentDay - dayValue;
  } else if (currentMonth === monthValue && dayValue > currentDay) {
    // update years result
    yearsRes.textContent = currentYear - yearValue - 1;

    // update months result
    monthsRes.textContent = 12;

    // display days result
    daysRes.textContent = months[monthValue - 1] + currentDay - dayValue;
  } else {
    // update months result
    monthsRes.textContent--;

    // display days result
    daysRes.textContent = months[currentMonth - 2] + currentDay - dayValue;
  }
}

// show error msg if the number is wrong
function errorNum(input, type) {
  input.nextElementSibling.textContent = `Must be a valid ${type}`;
}

// show error msg if the number is in the future
function errorFuture(input) {
  input.nextElementSibling.textContent = "Must be in the past";
}

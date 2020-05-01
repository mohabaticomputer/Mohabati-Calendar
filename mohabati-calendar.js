
persianDate.toLocale("fa");
const holidays = { celebration: [5, 23], aza: [9], tatilat: [19] };
const alerts = { success: [5, 23], warning: [9], danger: [18] };

//window.onload = InitialRun('calendar-container');

function InitialRun(tmpElementId, baseDate="") {
  let elementId = tmpElementId;
  
  if(baseDate==="") {
    baseDate = new persianDate()
  } else {
    let date = baseDate.split('/');
    date[0] = parseInt(date[0]);
    date[1] = parseInt(date[1]);
    date[2] = parseInt(date[2]);
    baseDate = new persianDate();
    baseDate.date(date[2]);
    baseDate.month(date[1]);
    baseDate.year(date[0]);
  }
  makeCalendar(baseDate, holidays, new persianDate(), elementId);
};

function makeCalendar(baseDate, holidays, today, elementId) {
  let calendar = document.getElementById(elementId);
  calendar.innerHTML = "";
  let table = document.createElement("table");
  table.setAttribute("id", elementId+"-calendar");
  table.classList.add('claendar-table');
  calendar.appendChild(table);

  let Rows = makeRow(baseDate, holidays, today, elementId);
  Rows.forEach((row) => {
    table.appendChild(row);
  });
  table.appendChild(makeFooter(baseDate, elementId));
}

function makeTopHeader(baseDate, elementId) {
  let row = document.createElement("tr");
  row.classList.add("header");
  row.classList.add("BUTTON_BHS");

  let td = document.createElement("td");
  td.setAttribute(
    "data-date",
    baseDate.date(1).subtract("M", 1).toLocale("en").format("YYYY/MM/DD")
  );
  td.setAttribute(
    "data-calendarid",
    elementId
  );
  td.setAttribute("colspan", "1");
  td.classList.add("topheader-left");
  td.onclick = prevMonth;

  td.appendChild(document.createTextNode('«'));
  row.appendChild(td);

  let topheaderCenter = document.createElement("td");
  topheaderCenter.classList.add("topheader-center");
  topheaderCenter.setAttribute("colspan", "5");
  topheaderCenter.appendChild(
    document.createTextNode(baseDate.format("MMMM YYYY"))
  );
  topheaderCenter.setAttribute("data-date", baseDate.toLocale("en").format("YYYY"));
  topheaderCenter.setAttribute(
    "data-calendarid",
    elementId
  );
  topheaderCenter.onclick = goToYear;
  row.appendChild(topheaderCenter);

  let td3 = document.createElement("td");
  td3.setAttribute(
    "data-date",
    baseDate.date(1).add("M", 1).toLocale("en").format("YYYY/MM/DD")
  );
  td3.setAttribute(
    "data-calendarid",
    elementId
  );
  td3.setAttribute("colspan", "1");
  td3.classList.add("topheader-right");
  td3.onclick = nextMonth;
  td3.appendChild(document.createTextNode('»'));
  row.appendChild(td3);

  return row;
}

function makeHeader(className) {
  let row = document.createElement("tr");
  for (let i = 1; i <= 7; i++) {
    let th = document.createElement("th");
    let dayText = document.createTextNode(getPersianWeekDayName(i));
    th.appendChild(dayText);
    row.appendChild(th);
  }
  let clss = className.split(" ");
  clss.forEach((cls) => {
    row.classList.add(cls);
  });

  return row;
}

function makeFooter(baseDate, elementId) {
  let row = document.createElement("tr");
  let td = document.createElement("td");
  td.setAttribute("colspan", "7");
  td.setAttribute(
    "data-date",
    baseDate.date(1).toLocale("en").format("YYYY/MM/DD")
  );
  td.setAttribute(
    "data-calendarid",
    elementId
  );

  td.appendChild(
    document.createTextNode(
      "امروز " + new persianDate().format("dddd  DD MMMM  YYYY")
    )
  );

  row.classList.add("BUTTON_BHS");

  td.onclick = currentMonth;

  row.appendChild(td);
  return row;
}

function makeRow(baseDate, holidays, today, elementId) {
  let startOfCalendarTable = getStartOfCalendarTable(baseDate);

  let Rows = [];
  Rows.push(makeTopHeader(baseDate, elementId));
  Rows.push(makeHeader("weekdayheader BUTTON_BHS2"));

  let goThroughDays = startOfCalendarTable;
  let rowCompleteStatus = false;

  for (let i = 1; i <= 6; i++) {
    let row = document.createElement("tr");
    rowCompleteStatus = false;
    while (!rowCompleteStatus) {
      row.appendChild(
        makeCell(goThroughDays, baseDate, holidays, alerts, today)
      );
      if (goThroughDays.day() === 7) {
        rowCompleteStatus = true;
      }
      goThroughDays = goThroughDays.add("d", 1);
    }
    Rows.push(row);
  }
  return Rows;
}

function makeCell(day, baseDate, holidays, alerts, today) {
  let td = document.createElement("td");
  let dayText = document.createTextNode(day.date());

  if (baseDate.month() === day.month()) {
    td.classList.add("currentMonth");
    td.classList.add("cellDays");
  }
  if (baseDate.month() > day.month()) {
    td.classList.add("prevMonth");
  }
  if (baseDate.month() < day.month()) {
    td.classList.add("nextMonth");
  }

  if (baseDate.month() === day.month()) {
    if (alerts.success.includes(day.date())) {
      td.classList.add("success-alert");
    }
    if (alerts.warning.includes(day.date())) {
      td.classList.add("warning-alert");
    }
    if (alerts.danger.includes(day.date())) {
      td.classList.add("danger-alert");
    }
    if (holidays.celebration.includes(day.date())) {
      td.classList.add("holiday-celebration");
    }
    if (holidays.aza.includes(day.date())) {
      td.classList.add("holiday-aza");
    }
    if (holidays.tatilat.includes(day.date())) {
      td.classList.add("holiday-tatilat");
    }
    if (day.day() === 7) {
      td.classList.add("holiday-tatilat");
    }
    if (today.format("YYYYMMDD") === day.format("YYYYMMDD")) {
      td.classList.add("today");
    }
  }

  td.appendChild(dayText);
  td.onclick = cellSelect;

  return td;
}

function getPersianWeekDayName(day) {
  switch (day) {
    case 1:
      return "ش";
    case 2:
      return "ی";
    case 3:
      return "د";
    case 4:
      return "س";
    case 5:
      return "چ";
    case 6:
      return "پ";
    case 7:
      return "ج";
    default:
      return "";
  }
}

function prevMonth(e) {
  let date = e.target.dataset.date.split("/");
  let datee = new persianDate();
  datee.year(parseInt(date[0]));
  datee.month(parseInt(date[1]));
  datee.date(parseInt(date[2]));
  makeCalendar(datee, holidays, new persianDate(new Date()), e.target.dataset.calendarid);
}

function nextMonth(e) {
  let date = e.target.dataset.date.split("/");
  let datee = new persianDate();
  datee.year(parseInt(date[0]));
  datee.month(parseInt(date[1]));
  datee.date(parseInt(date[2]));
  makeCalendar(datee, holidays, new persianDate(), e.target.dataset.calendarid);
}

function currentMonth(e) {
  makeCalendar(new persianDate(), holidays, new persianDate(), e.target.dataset.calendarid);
}

function cellSelect(e) {
  if (e.target.classList.contains("cellDays")) {
    e.target.classList.remove("cellDays");
    e.target.classList.add("cellselected");
  } else {
    e.target.classList.remove("cellselected");
    e.target.classList.add("cellDays");
  }
}

function getNumberOfCalendarRows(baseDate) {
  let numberOfRows = 5;

  let startOfMonthDay = baseDate.date(1);

  if (
    (startOfMonthDay.day() === 7 && baseDate.daysInMonth() >= 30) ||
    (startOfMonthDay.day() === 6 && baseDate.daysInMonth() == 31)
  ) {
    numberOfRows = 6;
  }

  return numberOfRows;
}

function getStartOfCalendarTable(baseDate) {
  if (baseDate.date(1).day() > 1) {
    return baseDate.date(1).subtract("d", (baseDate.date(1).day() - 1));
  } else return baseDate;
}

/* ---------- Make Month View---------- */

function makeMonthView(baseDate, elementId) {
  let calendar = document.getElementById(elementId);
  calendar.innerHTML = "";
  let table = document.createElement("table");
  table.setAttribute("id", elementId+"-calendar");
  table.classList.add('claendar-table');
  calendar.appendChild(table);

  let Rows = makeMonthViewRow(baseDate, elementId);
  Rows.forEach((row) => {
    table.appendChild(row);
  });
  table.appendChild(makeFooter(baseDate));
}

function makeMonthViewRow(baseDate, elementId) {
  let startYear = baseDate.date(1).subtract("y", ((baseDate.year() % 10) + 1));

  let Rows = [];
  Rows.push(makeTopHeaderMonthView(baseDate, startYear));
  Rows.push(makeExtendedYears(startYear, baseDate, elementId));
  Rows.push(makeExtendedYears(startYear.add("y", 6), baseDate, elementId));
  let month =1;
  for(let i=1; i<=4; i++) {
    let tr = document.createElement('tr');
    for(let j =1; j<=3;j++) {
      let td = document.createElement('td');
      td.appendChild(document.createTextNode(getPersianMonthName(month)));
      td.setAttribute('data-date',baseDate.month(month).toLocale("en").format('YYYY/MM'));
      td.setAttribute('data-calendarid',elementId);
      td.setAttribute('colspan',2);
      td.classList.add('cellDays');

      td.onclick = goToMonth;
      tr.appendChild(td);
      month++;
    }
    Rows.push(tr);
  }
  Rows.push(makeInputDate(elementId));
  return Rows;
}

function makeTopHeaderMonthView(baseDate, startYear) {
  let row = document.createElement("tr");
  row.classList.add("header");
  row.classList.add("BUTTON_BHS");

  let td = document.createElement("td");
  td.setAttribute(
    "data-date",
    baseDate.date(1).subtract("y", 1).toLocale("en").format("YYYY")
  );
  td.setAttribute("colspan", "1");
  td.classList.add("topheader-left");
  //td.onclick = prevYears;

  td.appendChild(document.createTextNode('«'));
  row.appendChild(td);

  let topheaderCenter = document.createElement("td");
  topheaderCenter.classList.add("topheader-center");
  topheaderCenter.setAttribute("colspan", "4");

  let endYear = startYear.add("y", 11);

  topheaderCenter.appendChild(
    document.createTextNode(
      startYear.format("YYYY") + " - " + endYear.format("YYYY")
    )
  );
  topheaderCenter.setAttribute("data-date", baseDate.format("YYYY"));
  //topheaderCenter.onclick = makeMonthView;
  row.appendChild(topheaderCenter);

  let td3 = document.createElement("td");
  td3.setAttribute(
    "data-date",
    baseDate.date(1).add("M", 1).toLocale("en").format("YYYY/MM/DD")
  );
  td3.setAttribute("colspan", "1");
  td3.classList.add("topheader-right");
  //td3.onclick = nextYears;

  td3.appendChild(document.createTextNode('»'));
  row.appendChild(td3);

  return row;
}

function makeExtendedYears(baseDate, currentYear, elementId) {
  let tr = document.createElement("tr");
  tr.classList.add("BUTTON_BHS2");

  for (let i = 1; i <= 6; i++) {
    let td = document.createElement("td");
    td.setAttribute("data-date", baseDate.toLocale('en').format("YYYY"));
    td.setAttribute("data-calendarid", elementId);
    td.onclick = goToYear;
    td.appendChild(document.createTextNode(baseDate.format("YYYY")));
    if (baseDate.year() === currentYear.year()) {
      td.classList.add("month-header-Selected");
    }
    tr.appendChild(td);

    baseDate = baseDate.add("y", 1);
  }

  return tr;
}

function makeInputDate(elementId) {
  let tr = document.createElement('tr');
  tr.classList.add('BUTTON_BHS2');
  
  let td1 = document.createElement('td').appendChild(document.createTextNode('تاریخ : '));
  tr.appendChild(td1);

  let td2 = document.createElement('td');
  td2.setAttribute('colspan', '4');
  // create input year
  let inputYear = document.createElement('input');
  inputYear.setAttribute('id', 'calendarYear');
  inputYear.setAttribute('type', 'number');
  inputYear.setAttribute('placeholder', 'سال');
  inputYear.classList.add('day-select');

  // create input month
  let inputMonth = document.createElement('input');
  inputMonth.setAttribute('id', 'calendarMonth');
  inputMonth.setAttribute('type', 'number');
  inputMonth.setAttribute('placeholder', 'ماه');
  inputMonth.classList.add('day-select');

  // create input day
  let inputDay = document.createElement('input');
  inputDay.setAttribute('id', 'calendarDay');
  inputDay.setAttribute('type', 'number');
  inputDay.setAttribute('placeholder', 'روز');
  inputDay.classList.add('day-select');


  td2.appendChild(inputYear);
  td2.appendChild(inputMonth);
  td2.appendChild(inputDay);
  tr.appendChild(td2);

  let td3 = document.createElement('td');
  // create input button
  let inputButton = document.createElement('input');
  inputButton.setAttribute('type', 'button');
  inputButton.setAttribute('value', 'برو');
  inputButton.setAttribute('data-calendarid', elementId);
  inputButton.onclick = goToDate;
  // inputDay.classList.add('day-select');
  td3.appendChild(inputButton);
  tr.appendChild(td3);

  return tr;
}

function getPersianMonthName(monthNumber) {
  switch (monthNumber) {
    case 1:
      return "فروردین";
    case 2:
      return "اردیبهشت";
    case 3:
      return "خرداد";
    case 4:
      return "تیر";
    case 5:
      return "مرداد";
    case 6:
      return "شهریور";
    case 7:
      return "مهر";
    case 8:
      return "آبان";
    case 9:
      return "آذر";
    case 10:
      return "دی";
    case 11:
      return "بهمن";
    case 12:
      return "اسفند";
    default:
      return "";      
  }
}

function goToMonth(e) {
  let clickedMonth = e.target.dataset.date.split('/');
  clickedMonth = [parseInt(clickedMonth[0]),parseInt(clickedMonth[1]),1];
  let baseDate = new persianDate();
  baseDate = baseDate.date(1);
  baseDate = baseDate.month(clickedMonth[1]);
  baseDate = baseDate.years(clickedMonth[0]);

  makeCalendar(baseDate, holidays, new persianDate(new Date()), e.target.dataset.calendarid);
}

function goToYear(e) {
  let clickedYear = parseInt(e.target.dataset.date);
  let baseDate = new persianDate();
  baseDate = baseDate.date(1);
  baseDate = baseDate.month(1);
  baseDate = baseDate.years(clickedYear);

  makeMonthView(baseDate, e.target.dataset.calendarid);
}

function goToDate(e) {
  let baseDate = new persianDate();

  let inputYear = document.getElementById('calendarYear');
  let year = inputYear.value ? parseInt(inputYear.value) : baseDate.year();

  let inputMonth = document.getElementById('calendarMonth');
  let month = inputMonth.value ? parseInt(inputMonth.value) : baseDate.month();

  let inputDay = document.getElementById('calendarDay');
  let day = inputDay.value ? parseInt(inputDay.value) : baseDate.date();
  
  baseDate = baseDate.date(day);
  baseDate = baseDate.month(month);
  baseDate = baseDate.year(year);
  makeCalendar(baseDate, holidays, new persianDate(new Date()), e.target.dataset.calendarid);
}
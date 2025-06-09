/**
 * What does a tcal invite look like?
 *
 * `Description @ Day Of Week 10:15 pm`
 * `Description @ DD/MM/YY (HH:MM (am|pm)?)`
 *
 **/

const bodyText = document.body.innerText;
const tcals = /`([^`]+)@\s*(\d\d)\/(\d\d)\/(\d\d\d?\d?)\s*( \d\d\:\d\d( [aApP][mM])?)?`/g;

const allElements = document.querySelectorAll('p');

//let matches : any[] = [];
allElements.forEach(element => {
    let matches: RegExpExecArray[] | null = [...element?.innerText?.matchAll(tcals)];
    if ('innerText' in element && element?.innerText !== "" && matches) {
        console.log(matches);
        //console.log(element.innerHTML);
        for (let match of matches) {
            replace_element(element, match);
        }
        console.log(element);
    }
});

function replace_element(element, match) {
    console.log(match);

    let dd = match[2], mm = match[3], yy = match[4];
    let hr = "00", mn = "00";
    match[5] = match[5]?.trim();
    if (match[5] && -1 != match[5]?.search(/[pP][mM]/g)) {
        hr = String(parseInt(match[5].substring(0,2)) + 12);
        mn = match[5].substring(3,5);
    } else if (match[5]) {
        hr = match[5].substring(0,2);
        mn = match[5].substring(3,5);
    }
    let dt = date_time(dd, mm, yy, hr, mn);
    let dt_end = date_time(dd, mm, yy, "23", "59");

    const data = [
        "BEGIN:VCALENDAR\n",
        "VERSION:2.0\n",
        `PRODID:-//TCAL//TCAL//EN\n`,
        "BEGIN:VEVENT\n",
        `SUMMARY:${match[1].trim()}\n`,
        `UID:${crypto.randomUUID()}\n`,
        `DTSTART;TZID=America/New_York:${dt}\n`,
            "END:VEVENT\n",
        "END:VCALENDAR\n",
    ]
    const blob = new Blob(data, { type: 'text/calendar' });
    const fileURL = URL.createObjectURL(blob);
    //console.log(fileURL);

    element.innerHTML = element.innerHTML.replace(
        match[0],
        `<a download=\"tcal.ics\" href=\"${fileURL}\">` 
        + match[0].substring(1, match[0].length - 1) 
        + "</a>"
    )
}

function date_time(day : string, month : string, year : string, hour : string, min : string) : string {
    const currentYear = new Date().getFullYear();
    if (year.length == 2) year = Math.floor(currentYear / 100) + year;
    return year + month + day + "T" + hour + min + "00";
}

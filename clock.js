//Ryan Skelton, 2022
//you should refresh the page after using debug mode
let bubsSec = []; //seconds bubbles array
let bubsSecDone = []; //seconds Done bubbles array
let bubsMin = []; //minute Done bubbles array
let bubsHr = []; //hour Done bubbles array
let bubsAlarm = []; //alarm bubbles array
let firstRun = true; //init first run, function to run only on first load
let secCount; //init custom second timer
let minCount; //init custom min timer
let hrCount; //init custom hr timer
let secState; //t/f statement each second
let secStateDone; //t/f statement before each minute
let minStateDone; //t/f statement before each hr
let hrStateDone; //t/f statement before each day
let bubmovesec = 0; //init for slight main bubble movement
let bubmoveAlarm = 20; //init for x movement of bubbles in alarm
let rectmoveAlarm = 55; //init for Y movement of top rectangle for alarm
let oddOrEven; // init oddOrEven
let barOpac = 0; //init bar opacity

function draw_clock(obj) {
  let hours = obj.hours;
  let minutes = obj.minutes;
  let seconds = obj.seconds;
  let millis = obj.millis;
  let alarm = obj.seconds_until_alarm;
  let posShift = 40; //shifts x position of all bubbles
  let offsetSec = 3; //offset sec bubbles
  let offsetMin = 5; //offset min bubbles
  let offsetHr = 8; //offset hr bubbles
  let secsposX = width / 3 * 2 + 90 + posShift; //location of big sec bubble
  let secsposY = height / 2;
  let minsposX = width / 2 + posShift; //location of big min bubble
  let minsposY = height / 2;
  let hrsposX = width / 3 - 140 + posShift; //location of big hr bubble
  let hrsposY = height / 2;
  let secsFractSmooth = seconds + (millis / 1000.0); //fractions for seconds
  let minsFractSmooth = minutes + (seconds / 60.0); //fractions for minutes
  let hrsFractSmooth = hours + (minutes / 60.0) + (seconds / 3600.0); //fractions for hrs
  let secsSmoothAM = map(secsFractSmooth, 0, 58, 50, 150); //increase over 59 seconds
  let secsSmoothPM = map(secsFractSmooth, 58, 60, 250, 50); //decrease over 1 second
  let minsSmoothAM = map(minsFractSmooth, 0, 58, 100, 200); //increase over 59 mins
  let minsSmoothPM = map(minsFractSmooth, 58, 60, 300, 100); //decrease over 1 min
  let hrsSmoothAM = map(hrsFractSmooth, 0, 22, 150, 250); //increase over 23 hours
  let hrsSmoothPM = map(hrsFractSmooth, 22, 24, 350, 150); //decrease over 1 hour
  let rectAlarmY = map(alarm, 15, 1, 0, 50); //map for filling top rect, 15 default timer time

  let mainColor1 = color(247, 53, 254); //setting up colours for lerp and use later
  mainColor1.setAlpha(200); //set opacity of main colours
  let mainColor2 = color(255, 64, 54);
  mainColor2.setAlpha(200);
  let secColor1 = color(116, 255, 168);
  secColor1.setAlpha(200);
  let secColor2 = color(255, 242, 79);
  secColor2.setAlpha(200);
  let minuteLerpMap = map(minutes, 0, 59, 0, 1); //over 1 hr go from 0 to 1 for lerp
  let mainLerpColor = lerpColor(mainColor1, mainColor2, minuteLerpMap); // main lerp to night
  let mainLerpColor2 = lerpColor(mainColor2, mainColor1, minuteLerpMap);// main lerp to day
  let secLerpColor = lerpColor(secColor1, secColor2, minuteLerpMap);// secondary lerp to night
  let secLerpColor2 = lerpColor(secColor2, secColor1, minuteLerpMap); // secondary lerp to day

  if (firstRun) { //only run once at start
    secCount = obj.seconds + 1; //sec counter ahead by 1
    minCount = obj.minutes + 1; //min counter ahead by 1
    hrCount = obj.hours + 1; //hr counter ahead by 1
    firstRun = false;
  }
  //custom sec counter needed to run statement if 1 sec has passed
  if (secCount == 60) {
    secStateDone = true;
    secCount = 0; //reset custom timer to 0
  } else {
    secStateDone = false;
  }
  if (obj.seconds == secCount) { //if secs catches up
    secState = true;
    secCount++;
  } else {
    secState = false;
  }

  //custom min counter
  if (minCount == 60) {
    minStateDone = true;
    minCount = 0; //reset custom timer to 0
  } else {
    minStateDone = false;
  }
  if (minutes == minCount) { //if mins catches up
    minCount++;
  }
  //custom hour counter
  if (hrCount == 24) {
    hrStateDone = true;
    hrCount = 0; //reset custom timer to 0
  } else {
    hrStateDone = false;
  }
  if (hours == hrCount) { //if hrs catches up
    hrCount++;
  }
  noStroke();
  //slight bubbly movement for main bubbles
  if (millis > (999 / 2)) {
    bubmovesec = map(millis, 0, (999 / 2), 3, 2) //first half ms decrease 3 to 2
  } else {
    bubmovesec = map(millis, (999 / 2), 999, 2, 3) //second half ms increase 2 to 3
  }

  background(37); //  dark gray
  barOpac = map(millis, 0, 999, 0, 255); //opacity map for fading in bars and time
  barOpac2 = map(millis, 0, 999, 255, 0); //opacity map for fading out bars and time
  fill(100); //light gray
  rectMode(CORNER);
  push();
  let barwY = 3; //thickness of bars
  let barC = 60; //colour of bars 100 light gray
  let timeC = 100; //colour of text 150 lighter gray
  if (seconds == 0) {
    fill(barC, barC, barC, barOpac); //light gray fade in
  } else {
    fill(barC); //light gray
  }
  if (seconds < 59) {
    if (seconds < 15) {
      rect(secsposX + offsetSec, height / 2 + 39, 10, barwY); //15 seconds
    }
    if (seconds < 30) {
      rect(secsposX + offsetSec, height / 2 + 52, 30, barwY); //30 seconds
    }
    if (seconds < 45) {
      rect(secsposX + offsetSec, height / 2 + 65, 10, barwY); //45 seconds
    }
    if (seconds < 60) {
      rect(secsposX + offsetSec, height / 2 + 78, 30, barwY); //60 seconds
    }
    rect(secsposX + bubmovesec + offsetSec, secsposY + secsSmoothAM / 2 - bubmovesec + offsetSec, 40, barwY); //sec following bar
  } else {
    if (seconds == 59) {
      fill(barC, barC, barC, barOpac2); //light gray fade out
    }
    rect(secsposX + bubmovesec + offsetSec, secsposY + secsSmoothPM / 2 - bubmovesec + offsetSec, 40, barwY); //sec following bar
  }

  if (seconds == 0 && minutes == 0) { //if start of minute
    fill(barC, barC, barC, barOpac); //light gray fade in
  } else {
    fill(barC); // light gray
  }
  if (minutes < 59) {
    if (minutes < 15) {
      rect(minsposX + offsetMin, height / 2 + 67, 20, barwY); //15 minutes
    }
    if (minutes < 30) {
      rect(minsposX + offsetMin, height / 2 + 80, 40, barwY); //30 minutes
    }
    if (minutes < 45) {
      rect(minsposX + offsetMin, height / 2 + 93, 20, barwY); //45 minutes
    }
    if (minutes < 60) {
      rect(minsposX + offsetMin, height / 2 + 106, 40, barwY); //60 minutes
    }
    rect(minsposX + bubmovesec + offsetMin, minsposY + minsSmoothAM / 2 - bubmovesec + offsetMin, 60, barwY); //min following bar
  } else {
    if (seconds == 59) {
      fill(barC, barC, barC, barOpac2); //light gray fade out
    }
    rect(minsposX + bubmovesec + offsetMin, minsposY + minsSmoothPM / 2 - bubmovesec + offsetMin, 60, barwY); //min following bar
  }

  if (seconds == 0 && hours == 0) { //if start of hour
    fill(barC, barC, barC, barOpac); //light gray fade in
  } else {
    fill(barC); // light gray
  }
  if (hours < 23) {
    if (hours < 3) {
      rect(hrsposX + offsetHr, height / 2 + 88.5, 10, barwY); //3 am
    }
    if (hours < 6) {
      rect(hrsposX + offsetHr, height / 2 + 95.5, 40, barwY); //6 am
    }
    if (hours < 9) {
      rect(hrsposX + offsetHr, height / 2 + 102.5, 10, barwY); //9 am
    }
    if (hours < 12) {
      rect(hrsposX + offsetHr, height / 2 + 109.5, 60, barwY); //12 pm
    }
    if (hours < 15) {
      rect(hrsposX + offsetHr, height / 2 + 116.5, 10, barwY); //3 pm
    }
    if (hours < 18) {
      rect(hrsposX + offsetHr, height / 2 + 123.5, 40, barwY); //6 pm
    }
    if (hours < 21) {
      rect(hrsposX + offsetHr, height / 2 + 130.5, 10, barwY); //9 pm
    }
    if (hours < 24) {
      rect(hrsposX + offsetHr, height / 2 + 137.5, 60, barwY); //12 am
    }
    rect(hrsposX - bubmovesec + offsetHr, hrsposY + hrsSmoothAM / 2 - bubmovesec + offsetHr, 80, barwY); //hour following bar
  } else {
    if (seconds == 59) {
      fill(barC, barC, barC, barOpac2); //light gray fade out
    }
    rect(hrsposX - bubmovesec + offsetHr, hrsposY + hrsSmoothPM / 2 - bubmovesec + offsetHr, 80, barwY); //min following bar
  }
  pop();

  let txtY = 2.5;
  textSize(15);
  textAlign(CENTER, CENTER);

  if (seconds == 0) {
    fill(timeC, timeC, timeC, barOpac); //lighter gray fade in
  } else {
    fill(timeC); //lighter gray
  }
  if (seconds < 59) { //seconds moving text
    text(int(seconds), secsposX + 57, 2 + secsposY + secsSmoothAM / 2 - bubmovesec + offsetSec); //moving sec
  } else {
    if (seconds == 59) {
      fill(barC, barC, barC, barOpac2); //light gray fade out
    }
    text(int(seconds), secsposX + 57, 2 + secsposY + secsSmoothPM / 2 - bubmovesec + offsetSec); //moving sec
  }
  if (seconds == 0 && minutes == 0) {
    fill(timeC, timeC, timeC, barOpac); //lighter gray fade in
  } else {
    fill(timeC); //lighter gray
  }
  if (minutes < 59) { //minutes moving text
    text(int(minutes), minsposX + 80, 2 + minsposY + minsSmoothAM / 2 - bubmovesec + offsetMin); //moving min
  } else {
    if (seconds == 59) {
      fill(barC, barC, barC, barOpac2); //light gray fade out
    }
    text(int(minutes), minsposX + 80, 2 + minsposY + minsSmoothPM / 2 - bubmovesec + offsetMin); //moving min
  }
  if (seconds == 0 && hours == 0) {
    fill(timeC, timeC, timeC, barOpac); //lighter gray fade in
  } else {
    fill(timeC); //lighter gray
  }
  if (hours < 12) { //hours moving text
    text(int(hours) + " AM", hrsposX + 110, 2 + hrsposY + hrsSmoothAM / 2 - bubmovesec + offsetHr); //moving hr
  }
  if (hours == 12) { //hours moving text
    text(int(hours) + " PM", hrsposX + 110, 2 + hrsposY + hrsSmoothAM / 2 - bubmovesec + offsetHr); //moving hr
  }
  if (hours > 12 && hours < 23) { //convert from 24 hr time
    text(int(hours - 12) + " PM", hrsposX + 110, 2 + hrsposY + hrsSmoothAM / 2 - bubmovesec + offsetHr); //moving hr
  } else {
    if (seconds == 59) {
      fill(barC, barC, barC, barOpac2); //light gray fade out
    } 
    text(int(hours - 12) + " PM", hrsposX + 110, 2 + hrsposY + hrsSmoothPM / 2 - bubmovesec + offsetHr); //moving hr
  }

  //every second bubbles
  if (secState == true) { //checks if 1 second has passed
    let bubsec = new BubSec(width, height / 2); //add bubble to array at position
    bubsSec.push(bubsec);
  }
  for (let i = 0; i < bubsSec.length; i++) { //sec bubble show and move
    bubsSec[i].display();
    bubsSec[i].move();
  }
  for (let i = bubsSec.length - 1; i >= 0; i--) { // move backwards thru array
    if (bubsSec[i].x < secsposX) { //delete from array if at point
      bubsSec.splice(i, 1)
    }
  }
  //seconds done bubble
  if (secStateDone == true) { //checks if 1 minute has passed
    let bubsecdone = new BubSecDone(secsposX, secsposY); //add bubble to array at position
    bubsSecDone.push(bubsecdone);
  }
  for (let i = 0; i < bubsSecDone.length; i++) { //sec bubble show and move
    bubsSecDone[i].display();
    bubsSecDone[i].move();
  }
  for (let i = bubsSecDone.length - 1; i >= 0; i--) { // move backwards thru array
    if (bubsSecDone[i].x < minsposX) { //delete from array if at point
      bubsSecDone.splice(i, 1)
    }
  }
  //minutes done bubble
  if (minutes == 59) { //checks if 1 hr has passed
    if (secState == true) {
      let bubmin = new BubMin(minsposX, minsposY); //add bubble to array at position
      bubsMin.push(bubmin);
    }
  }
  for (let i = 0; i < bubsMin.length; i++) { //min bubble show and move
    bubsMin[i].display();
    bubsMin[i].move();
  }
  for (let i = bubsMin.length - 1; i >= 0; i--) { // move backwards thru array
    if (bubsMin[i].x < hrsposX) { //delete from array if at point
      bubsMin.splice(i, 1)
    }
  }
  //hours done bubble
  if (hours == 23) { //checks if 23 hr has passed
    if (secStateDone == true) {
      let bubhr = new BubHr(hrsposX, hrsposY); //add bubble to array at position
      bubsHr.push(bubhr);
    }
  }
  for (let i = 0; i < bubsHr.length; i++) { //hour bubble show and move
    bubsHr[i].display();
    bubsHr[i].move();
  }
  for (let i = bubsHr.length - 1; i >= 0; i--) { // move backwards thru array
    if (bubsHr[i].x < -80) { //delete from array if at point
      bubsHr.splice(i, 1)
    }
  }
  //alarm bubbles
  if (alarm == 0) { //checks if alarm is going off
    if (secState == true) {
      let bubsalarm = new BubsAlarm(bubmoveAlarm, 0); //add bubble to array at position
      let bubsalarm2 = new BubsAlarm(bubmoveAlarm, -120);
      let bubsalarm3 = new BubsAlarm(bubmoveAlarm + 100, -40);
      let bubsalarm4 = new BubsAlarm(bubmoveAlarm + 100, -160);
      let bubsalarm5 = new BubsAlarm(bubmoveAlarm + 220, -25);
      let bubsalarm6 = new BubsAlarm(bubmoveAlarm + 220, -145)
      bubsAlarm.push(bubsalarm);
      bubsAlarm.push(bubsalarm2);
      bubsAlarm.push(bubsalarm3);
      bubsAlarm.push(bubsalarm4);
      bubsAlarm.push(bubsalarm5);
      bubsAlarm.push(bubsalarm6);
      oddOrEven = int(obj.seconds) % 2;
      if (oddOrEven == 1) { //if odd/even change the space between bubbles
        bubmoveAlarm = bubmoveAlarm + 50;
      } else {
        bubmoveAlarm = bubmoveAlarm + 100;
      }
    }
    if (bubmoveAlarm > width) { //if space above width , set back to start
      bubmoveAlarm = 20;
    }
  }

  for (let i = 0; i < bubsAlarm.length; i++) { //alarm bubble show and move
    bubsAlarm[i].display();
    bubsAlarm[i].move();
  }
  for (let i = bubsAlarm.length - 1; i >= 0; i--) { // move backwards thru array
    if (bubsAlarm[i].y > height + 40) { //delete from array if at point
      bubsAlarm.splice(i, 1)
    }
  }

  //alarm stuff
  if (alarm > 0) { //as alarm timer is counting down
    rectmoveAlarm = 55; //reset moving rect back up to 55

    if (obj.hours == 19) { //if 7pm lerp to DAY mode
      fill(mainLerpColor2);
    }
    if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am DAY mode colors
      fill(mainColor1);
    }
    if (obj.hours == 7) { //if 7am lerp to NIGHT mode
      fill(mainLerpColor);
    }
    if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm NIGHT mode
      fill(mainColor2);
    }
    rectMode(CENTER);
    rect(width / 2, 0, width, rectAlarmY); //map is set to default timer - 15

  }
  if (alarm == 0) { //if alarm going off
    if (obj.hours == 19) { //if 7pm lerp to DAY mode
      fill(mainLerpColor2);
    }
    if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am DAY mode colors
      fill(mainColor1);
    }
    if (obj.hours == 7) { //if 7am lerp to NIGHT mode
      fill(mainLerpColor);
    }
    if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm NIGHT mode
      fill(mainColor2);
    }
    rectmoveAlarm = rectmoveAlarm - 0.075; //moves rect back up as alarm "finishes"
    rectMode(CENTER);
    rect(width / 2, 0, width, rectmoveAlarm); //map is set to default timer - 15
  }
  //HOURS MAIN BUBBLES
  if (hours <= 22) { //if before 11pm
    if (hours == 19) { //if 7pm lerp to night mode
      fill(secLerpColor);
    }
    if (hours > 19 || hours < 7) { // between 7pm and 7am night mode colors
      fill(secColor2);
    }
    if (hours == 7) { //if 7am lerp to day mode
      fill(secLerpColor2);
    }
    if (hours > 7 && hours < 19) { //between 7am and 7pm day mode
      fill(secColor1);
    }
    ellipse(hrsposX - bubmovesec - offsetHr, hrsposY + bubmovesec - offsetHr, hrsSmoothAM); //increase in size
    if (hours == 19) { //if 7pm lerp to night mode
      fill(mainLerpColor);
    }
    if (hours > 19 || hours < 7) { // between 7pm and 7am night mode colors
      fill(mainColor2);
    }
    if (hours == 7) { //if 7am lerp to day mode
      fill(mainLerpColor2);
    }
    if (hours > 7 && hours < 19) { //between 7am and 7pm day mode
      fill(mainColor1);
    }
    ellipse(hrsposX - bubmovesec + offsetHr, hrsposY - bubmovesec + offsetHr, hrsSmoothAM); //increase in size
  } else { //after 11pm
    fill(secColor2); //night mode sec
    ellipse(hrsposX + bubmovesec - offsetHr, hrsposY + bubmovesec - offsetHr, hrsSmoothPM); //decrease in size
    fill(mainColor2); //night mode main
    ellipse(hrsposX - bubmovesec + offsetHr, hrsposY - bubmovesec + offsetHr, hrsSmoothPM); //decrease in size
  }
  //MINUTES MAIN BUBBLES
  if (minutes <= 58) { //if before 58 minutes
    if (hours == 19) { //if 7pm lerp to night mode
      fill(secLerpColor);
    }
    if (hours > 19 || hours < 7) { // between 7pm and 7am night mode colors
      fill(secColor2);
    }
    if (hours == 7) { //if 7am lerp to day mode
      fill(secLerpColor2);
    }
    if (hours > 7 && hours < 19) { //between 7am and 7pm day mode
      fill(secColor1);
    }
    ellipse(minsposX + bubmovesec + offsetMin, minsposY - bubmovesec + offsetMin, minsSmoothAM); //increase in size
    if (hours == 19) { //if 7pm lerp to night mode
      fill(mainLerpColor);
    }
    if (hours > 19 || hours < 7) { // between 7pm and 7am night mode colors
      fill(mainColor2);
    }
    if (hours == 7) { //if 7am lerp to day mode
      fill(mainLerpColor2);
    }
    if (hours > 7 && hours < 19) { //between 7am and 7pm day mode
      fill(mainColor1);
    }
    ellipse(minsposX - bubmovesec - offsetMin, minsposY + bubmovesec - offsetMin, minsSmoothAM); //increase in size
  } else { //after 58 mins
    if (hours == 19) { //if 7pm lerp to night mode
      fill(secLerpColor);
    }
    if (hours > 19 || hours < 7) { // between 7pm and 7am night mode colors
      fill(secColor2);
    }
    if (hours == 7) { //if 7am lerp to day mode
      fill(secLerpColor2);
    }
    if (hours > 7 && hours < 19) { //between 7am and 7pm day mode
      fill(secColor1);
    }
    ellipse(minsposX + bubmovesec + offsetMin, minsposY - bubmovesec + offsetMin, minsSmoothPM); //increase in size
    if (hours == 19) { //if 7pm lerp to night mode
      fill(mainLerpColor);
    }
    if (hours > 19 || hours < 7) { // between 7pm and 7am night mode colors
      fill(mainColor2);
    }
    if (hours == 7) { //if 7am lerp to day mode
      fill(mainLerpColor2);
    }
    if (hours > 7 && hours < 19) { //between 7am and 7pm day mode
      fill(mainColor1);
    }
    ellipse(minsposX - bubmovesec - offsetMin, minsposY + bubmovesec - offsetMin, minsSmoothPM); //increase in size
  }
  //SECONDS MAIN BUBBLES
  if (seconds <= 58) { //if before 58 seconds
    if (hours == 19) { //if 7pm lerp to night mode
      fill(secLerpColor);
    }
    if (hours > 19 || hours < 7) { // between 7pm and 7am night mode colors
      fill(secColor2);
    }
    if (hours == 7) { //if 7am lerp to day mode
      fill(secLerpColor2);
    }
    if (hours > 7 && hours < 19) { //between 7am and 7pm day mode
      fill(secColor1);
    }
    ellipse(secsposX - bubmovesec - offsetSec, secsposY + bubmovesec - offsetSec, secsSmoothAM); //increase in size
    if (hours == 19) { //if 7pm lerp to night mode
      fill(mainLerpColor);
    }
    if (hours > 19 || hours < 7) { // between 7pm and 7am night mode colors
      fill(mainColor2);
    }
    if (hours == 7) { //if 7am lerp to day mode
      fill(mainLerpColor2);
    }
    if (hours > 7 && hours < 19) { //between 7am and 7pm day mode
      fill(mainColor1);
    }
    ellipse(secsposX + bubmovesec + offsetSec, secsposY - bubmovesec + offsetSec, secsSmoothAM); //increase in size
  } else { //if after 58 secs
    if (hours == 19) { //if 7pm lerp to night mode
      fill(secLerpColor);
    }
    if (hours > 19 || hours < 7) { // between 7pm and 7am night mode colors
      fill(secColor2);
    }
    if (hours == 7) { //if 7am lerp to day mode
      fill(secLerpColor2);
    }
    if (hours > 7 && hours < 19) { //between 7am and 7pm day mode
      fill(secColor1);
    }
    ellipse(secsposX - bubmovesec - offsetSec, secsposY + bubmovesec - offsetSec, secsSmoothPM); //increase in size
    if (hours == 19) { //if 7pm lerp to night mode
      fill(mainLerpColor);
    }
    if (hours > 19 || hours < 7) { // between 7pm and 7am night mode colors
      fill(mainColor2);
    }
    if (hours == 7) { //if 7am lerp to day mode
      fill(mainLerpColor2);
    }
    if (hours > 7 && hours < 19) { //between 7am and 7pm day mode
      fill(mainColor1);
    }
    ellipse(secsposX + bubmovesec + offsetSec, secsposY - bubmovesec + offsetSec, secsSmoothPM); //increase in size
  }
} //end of main function

class BubSec { //second bubble function
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    let mainColor1 = color(247, 53, 254);
    mainColor1.setAlpha(200);
    let mainColor2 = color(255, 64, 54);
    mainColor2.setAlpha(200);
    let secColor1 = color(116, 255, 168);
    secColor1.setAlpha(200);
    let secColor2 = color(255, 242, 79);
    secColor2.setAlpha(200);
    let minuteLerpMap = map(obj.minutes, 0, 59, 0, 1);
    let mainLerpColor = lerpColor(mainColor1, mainColor2, minuteLerpMap);
    let mainLerpColor2 = lerpColor(mainColor2, mainColor1, minuteLerpMap);
    let secLerpColor = lerpColor(secColor1, secColor2, minuteLerpMap);
    let secLerpColor2 = lerpColor(secColor2, secColor1, minuteLerpMap);
    oddOrEven = int(obj.seconds) % 2;
    push();
    strokeWeight(3);
    if (oddOrEven == 1) {
      if (obj.hours == 19) { //if 7pm lerp to night mode
        fill(mainLerpColor);
      }
      if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am night mode colors
        fill(mainColor2);
      }
      if (obj.hours == 7) { //if 7am lerp to day mode
        fill(mainLerpColor2);
      }
      if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm day mode
        fill(mainColor1);
      }
    } else {
      if (obj.hours == 19) { //if 7pm lerp to night mode
        fill(secLerpColor);
      }
      if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am night mode colors
        fill(secColor2);
      }
      if (obj.hours == 7) { //if 7am lerp to day mode
        fill(secLerpColor2);
      }
      if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm day mode
        fill(secColor1);
      }
    }
    ellipse(this.x, this.y, 10);
    pop();
  }

  move() {
    this.x = this.x - 2.6; //speed of bubble
    if (oddOrEven == 1) {
      this.y = this.y + 0.2; //slightly move down
    } else {
      this.y = this.y - 0.2; //slightly move up
    }
  }
}

class BubSecDone { //second done bubble function
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    let mainColor1 = color(247, 53, 254);
    mainColor1.setAlpha(200);
    let mainColor2 = color(255, 64, 54);
    mainColor2.setAlpha(200);
    let secColor1 = color(116, 255, 168);
    secColor1.setAlpha(200);
    let secColor2 = color(255, 242, 79);
    secColor2.setAlpha(200);
    let minuteLerpMap = map(obj.minutes, 0, 59, 0, 1);
    let mainLerpColor = lerpColor(mainColor1, mainColor2, minuteLerpMap);
    let mainLerpColor2 = lerpColor(mainColor2, mainColor1, minuteLerpMap);
    let secLerpColor = lerpColor(secColor1, secColor2, minuteLerpMap);
    let secLerpColor2 = lerpColor(secColor2, secColor1, minuteLerpMap);
    oddOrEven = int(obj.minutes) % 2
    push();
    if (oddOrEven == 1) {
      if (obj.hours == 19) { //if 7pm lerp to night mode
        fill(mainLerpColor);
      }
      if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am night mode colors
        fill(mainColor2);
      }
      if (obj.hours == 7) { //if 7am lerp to day mode
        fill(mainLerpColor2);
      }
      if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm day mode
        fill(mainColor1);
      }
    } else {
      if (obj.hours == 19) { //if 7pm lerp to night mode
        fill(secLerpColor);
      }
      if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am night mode colors
        fill(secColor2);
      }
      if (obj.hours == 7) { //if 7am lerp to day mode
        fill(secLerpColor2);
      }
      if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm day mode
        fill(secColor1);
      }
    }
    strokeWeight(3);
    ellipse(this.x, this.y, 40);
    pop();
  }

  move() {
    this.x = this.x - 2.9; //speed of bubble
    this.y = this.y;
  }
}

class BubMin { //minute done bubble function
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    let mainColor1 = color(247, 53, 254);
    mainColor1.setAlpha(200);
    let mainColor2 = color(255, 64, 54);
    mainColor2.setAlpha(200);
    let secColor1 = color(116, 255, 168);
    secColor1.setAlpha(200);
    let secColor2 = color(255, 242, 79);
    secColor2.setAlpha(200);
    let minuteLerpMap = map(obj.minutes, 0, 59, 0, 1);
    let mainLerpColor = lerpColor(mainColor1, mainColor2, minuteLerpMap);
    let mainLerpColor2 = lerpColor(mainColor2, mainColor1, minuteLerpMap);
    let secLerpColor = lerpColor(secColor1, secColor2, minuteLerpMap);
    let secLerpColor2 = lerpColor(secColor2, secColor1, minuteLerpMap);
    oddOrEven = int(obj.seconds) % 2
    push();
    if (oddOrEven == 1) {
      if (obj.hours == 19) { //if 7pm lerp to night mode
        fill(mainLerpColor);
      }
      if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am night mode colors
        fill(mainColor2);
      }
      if (obj.hours == 7) { //if 7am lerp to day mode
        fill(mainLerpColor2);
      }
      if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm day mode
        fill(mainColor1);
      }
    } else {
      if (obj.hours == 19) { //if 7pm lerp to night mode
        fill(secLerpColor);
      }
      if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am night mode colors
        fill(secColor2);
      }
      if (obj.hours == 7) { //if 7am lerp to day mode
        fill(secLerpColor2);
      }
      if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm day mode
        fill(secColor1);
      }
    }
    strokeWeight(3);
    ellipse(this.x, this.y, 40);
    pop();
  }

  move() {
    this.x = this.x - 2.6; //speed of bubble
    if (oddOrEven == 1) {
      this.y = this.y + 0.2; //slightly move down
    } else {
      this.y = this.y - 0.2; //slightly move up
    }
  }
}

class BubHr { //hrs done bubble function
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    let mainColor1 = color(247, 53, 254);
    mainColor1.setAlpha(200);
    let mainColor2 = color(255, 64, 54);
    mainColor2.setAlpha(200);
    let secColor1 = color(116, 255, 168);
    secColor1.setAlpha(200);
    let secColor2 = color(255, 242, 79);
    secColor2.setAlpha(200);
    let minuteLerpMap = map(obj.minutes, 0, 59, 0, 1);
    let mainLerpColor = lerpColor(mainColor1, mainColor2, minuteLerpMap);
    let mainLerpColor2 = lerpColor(mainColor2, mainColor1, minuteLerpMap);
    let secLerpColor = lerpColor(secColor1, secColor2, minuteLerpMap);
    let secLerpColor2 = lerpColor(secColor2, secColor1, minuteLerpMap);
    oddOrEven = int(obj.minutes) % 2
    push();
    if (oddOrEven == 1) {
      if (obj.hours == 19) { //if 7pm lerp to night mode
        fill(mainLerpColor);
      }
      if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am night mode colors
        fill(mainColor2);
      }
      if (obj.hours == 7) { //if 7am lerp to day mode
        fill(mainLerpColor2);
      }
      if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm day mode
        fill(mainColor1);
      }
    } else {
      if (obj.hours == 19) { //if 7pm lerp to night mode
        fill(secLerpColor);
      }
      if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am night mode colors
        fill(secColor2);
      }
      if (obj.hours == 7) { //if 7am lerp to day mode
        fill(secLerpColor2);
      }
      if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm day mode
        fill(secColor1);
      }
    }
    strokeWeight(3);
    ellipse(this.x, this.y, 80);
    pop();
  }

  move() {
    this.x = this.x - 2.5; //speed of bubble
    this.y = this.y;
  }
}

class BubsAlarm { //alarm going off bubbles
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    let mainColor1 = color(247, 53, 254);
    mainColor1.setAlpha(200);
    let mainColor2 = color(255, 64, 54);
    mainColor2.setAlpha(200);
    let secColor1 = color(116, 255, 168);
    secColor1.setAlpha(200);
    let secColor2 = color(255, 242, 79);
    secColor2.setAlpha(200);
    let minuteLerpMap = map(obj.minutes, 0, 59, 0, 1);
    let mainLerpColor = lerpColor(mainColor1, mainColor2, minuteLerpMap);
    let mainLerpColor2 = lerpColor(mainColor2, mainColor1, minuteLerpMap);
    let secLerpColor = lerpColor(secColor1, secColor2, minuteLerpMap);
    let secLerpColor2 = lerpColor(secColor2, secColor1, minuteLerpMap);
    oddOrEven = int(obj.seconds) % 2;
    push();
    if (oddOrEven == 1) {
      if (obj.hours == 19) { //if 7pm lerp to DAY mode
        fill(mainLerpColor2);
      }
      if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am DAY mode colors
        fill(mainColor1);
      }
      if (obj.hours == 7) { //if 7am lerp to NIGHT mode
        fill(mainLerpColor);
      }
      if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm NIGHT mode
        fill(mainColor2);
      }
    } else {
      if (obj.hours == 19) { //if 7pm lerp to DAY mode
        fill(secLerpColor2);
      }
      if (obj.hours > 19 || obj.hours < 7) { // between 7pm and 7am DAY mode colors
        fill(secColor1);
      }
      if (obj.hours == 7) { //if 7am lerp to NIGHT mode
        fill(secLerpColor);
      }
      if (obj.hours > 7 && obj.hours < 19) { //between 7am and 7pm NIGHT mode
        fill(secColor2);
      }
    }
    strokeWeight(3);
    ellipse(this.x, this.y, 40);
    pop();
  }

  move() {
    this.x = this.x; //speed of bubble
    this.y = this.y + 1; //move down
  }
}

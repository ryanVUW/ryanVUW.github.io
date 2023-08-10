const canvasWidth = 960;
const canvasHeight = 500;

let prevSec;
let millisRolloverTime;
let nextAlarm;
let debug_is_on = (typeof DEBUG !== 'undefined');

let alarmOverlayCheckbox;
let alarmOverlaySlider;
let defaultAlarmSliderValue=15;

function setup () {
  // create the drawing canvas, save the canvas element
  var main_canvas = createCanvas(canvasWidth, canvasHeight);
  main_canvas.parent('canvasContainer');

  alarmOverlaySlider = createSlider(0, 30, defaultAlarmSliderValue);
  alarmOverlaySlider.parent("slider1Container")
  alarmOverlaySlider.changed(sliderUpdated);
  alarmOverlaySlider.mouseMoved(sliderUpdated);
  alarmOverlaySlider.touchMoved(sliderUpdated);

  alarmOverlayCheckbox = createCheckbox('', false);
  alarmOverlayCheckbox.parent('checkContainer1');
  alarmOverlayCheckbox.changed(guideChangedEvent);

  alarmActiveCheckbox = createCheckbox('', false);
  alarmActiveCheckbox.parent('checkContainer2');
  alarmActiveCheckbox.attribute('disabled','');

  // this is true if debug.js is included
  if(debug_is_on) {
    debug_setup();
  }
  turn_off_alarm();
}

function sliderUpdated() {
  defaultAlarmSliderValue = alarmOverlaySlider.value();
  // print("Updated defaultAlarmSliderValue to " + defaultAlarmSliderValue)
}

function guideChangedEvent() {
  let alarmIsOn = alarmOverlayCheckbox.checked();
  if(alarmIsOn) {
    turn_on_alarm();
  }
  else {
    turn_off_alarm();    
  }

  redraw();
}

function turn_on_alarm() {
  // disable slider
  alarmOverlaySlider.attribute('disabled','');
  nextAlarm = millis() + defaultAlarmSliderValue * 1000;    
  print("Alarm on: T minus " + defaultAlarmSliderValue + " seconds");  
}

function turn_off_alarm() {
  // enable slider back to default
  alarmOverlaySlider.value(defaultAlarmSliderValue);
  alarmOverlaySlider.removeAttribute('disabled');
  alarmOverlayCheckbox.checked(false);
  alarmActiveCheckbox.checked(false);
  print("Alarm now off")
  nextAlarm = -1;
  print("Alarm turned off");  
}

function mouseClicked() {
  if (debug_is_on && debugCheckbox.checked()) {
    return;
  }
/*
  if (nextAlarm > 0) {
    turn_off_alarm();
  }
  else {
    turn_on_alarm();
  }
  */
}

// taking ideas from http://cmuems.com/2016/60212/deliverables/deliverables-02/
function draw () {
  var H, M, S, mils, alarm;

  if (debug_is_on && debugCheckbox.checked()) {
    hourSlider.removeAttribute('disabled');
    minSlider.removeAttribute('disabled');
    secSlider.removeAttribute('disabled');
    millisSlider.removeAttribute('disabled');
    // alarmCheckbox.removeAttribute('disabled');
    // alarmSlider.removeAttribute('disabled');

    H = hourSlider.value();
    M = minSlider.value();
    S = secSlider.value();
    mils = millisSlider.value();
    // if (alarmCheckbox.checked()) {
    //   alarm = alarmSlider.value();
    // }
    // else {
    //   alarm = -1;
    // }
  }
  else {
    // Fetch the current time
    H = hour();
    M = minute();
    S = second();
    if (nextAlarm > 0) {
      now = millis();
      var millis_offset = nextAlarm - now;
      if (millis_offset < -10000 ){
        // turn off alarm
        nextAlarm = -1;
        alarm = -1;
        turn_off_alarm();
      }
      else if (millis_offset < 0) {
        alarm = 0;
        alarmOverlaySlider.value(alarm);
        alarmActiveCheckbox.checked(true);
      }
      else {
        alarm = millis_offset / 1000.0;
        alarmOverlaySlider.value(alarm);
        alarmActiveCheckbox.checked(false);
      }
    }
    else {
      alarm = -1;
    }

    // Reckon the current millisecond, 
    // particularly if the second has rolled over.
    // Note that this is more correct than using millis()%1000;
    if (prevSec != S) {
      millisRolloverTime = millis();
    }
    prevSec = S;
    mils = floor(millis() - millisRolloverTime);

    if (debug_is_on) {
      hourSlider.attribute('disabled','');
      minSlider.attribute('disabled','');
      secSlider.attribute('disabled','');
      millisSlider.attribute('disabled','');
      // alarmCheckbox.attribute('disabled','');
      // alarmSlider.attribute('disabled','');

      hourSlider.value(H);
      minSlider.value(M);
      secSlider.value(S);
      millisSlider.value(mils);
      // alarmCheckbox.checked(alarm >= 0);
      // alarmSlider.value(alarm);
    }
  }

  obj = {};
  obj.hours = H;
  obj.minutes = M;
  obj.seconds = S;
  obj.millis = mils;
  obj.seconds_until_alarm = alarm;
  draw_clock(obj);
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
}

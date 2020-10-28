/* global flatpickr */

import { select, settings } from '../settings.js';
import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';


class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    
    thisWidget.initPlugin();
  }

  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);

    const maxDays = settings.datePicker.maxDaysInFuture;
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, maxDays);

    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      
      // start week on Monday
      'locale': {
        'firstDayOfWeek': 1 
      },
      
      // disable monday
      'disable': [
        function(date) {
          return (date.getDay() === 1 || date.getDay() === 1);
        }
      ],
      
      onChange: function(selectedDates, dateStr) {
        thisWidget.value = dateStr;
      },
      


    });
  }

  parseValue(value){
    return value; //Number(value)
  }

  isValid(){
    return true;
  }

  renderValue(){

  }

}

export default DatePicker;
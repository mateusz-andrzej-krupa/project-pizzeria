/* global rangeSlider */

import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';


class HourPicker extends BaseWidget{
  constructor(wrapper){
    super (wrapper, settings.hours.open);

    const thisWidget = this;   
    
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    console.log(thisWidget.dom.output);
    
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
  }

  initPlugin(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input.value;
    });

    rangeSlider.create(thisWidget.dom.input);
  }

  parseValue(value){
    let numberToHour = utils.numberToHour(value);
    console.log('value', numberToHour);
    return numberToHour;
  }

  isValid(){
    return true;
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.output.innerHTML = thisWidget.value;
    console.log(`renderValue ${ thisWidget.dom.output }`);
  }
}

export default HourPicker;
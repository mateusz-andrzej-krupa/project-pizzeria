import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';

class HourPicker extends BaseWidget{
  constructor(wrapper){
    super (wrapper, settings.hours.open);

    const thisWidget = this;   
    
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    
    thisWidget.initPlugin();
  }

  initPlugin(){
    //console.log('done');
  }

  parseValue(value){
    let numberToHour = utils.numberToHour(value);
    console.log('test', numberToHour);
    return numberToHour;
  }

  isValid(){
    return true;
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom = thisWidget.dom.output;
  }

}

export default HourPicker;
import { select, templates } from '../settings.js';
import utils from '../utils.js';
import amountWidget from './AmountWidget.js';

class Booking{
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidget();
  }

  render(element){
    const thisBooking = this;

    const generateHTML = templates.bookingWidget();
    thisBooking.dom = {};
    console.log(thisBooking.dom);
    console.log(thisBooking);
    thisBooking.dom.wrapper = element;
    thisBooking.generateDOM = utils.createDOMFromHTML(generateHTML);

    thisBooking.dom.peopleAmount = thisBooking.generateDOM.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.generateDOM.querySelector(select.booking.hoursAmount);
  }

  initWidget(){
    const thisBooking = this;

    thisBooking.peopleAmount = new amountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hourAmount = new amountWidget(thisBooking.dom.peopleAmount);
    
  }

}

export default Booking;
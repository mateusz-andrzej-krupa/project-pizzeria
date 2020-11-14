import { classNames, select, settings, templates } from '../settings.js';
import utils from '../utils.js';
import amountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking{
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element);  
    thisBooking.initWidget();
    thisBooking.getData();
    thisBooking.selectAvailableTable();  
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [ 
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
        
      ],
    };        

    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking 
                                     + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event
                                     + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event
                                     + '?' + params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        // console.log('rezerwacje pobrane z api', bookings);
        // console.log('wydarzenia jednorazowe', eventsCurrent);
        // console.log('wydarzenia cykliczne', eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
     
    for (let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
 
    // console.log('booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    if(typeof thisBooking.booked[date][startHour] == 'undefined'){
      thisBooking.booked[date][startHour] = [];
    }

    thisBooking.booked[date][startHour].push(table);

    for(let hourBlock = startHour; hourBlock < startHour+duration; hourBlock += 0.5){
      // console.log('loop', hourBlock);

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table); 
    }
  }

  updateDOM(){
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    thisBooking.people = thisBooking.peopleAmount.value;
    //console.log(thisBooking.people);
    thisBooking.duration = thisBooking.hoursAmount.value;
    //console.log(thisBooking.duration);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true; 
    }
    
    for (let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  selectAvailableTable(){
    const thisBooking = this;

    for (let table of thisBooking.dom.tables){
      table.addEventListener('click', function(){
        
        const tableClicked = table.getAttribute(settings.booking.tableIdAttribute);

        if( !table.classList.contains(classNames.booking.tableBooked) ){
          table.classList.add(classNames.booking.tableBooked);
          thisBooking.tablePick = tableClicked;
          console.log('zarezerwowano stolik nr', thisBooking.tablePick);
          return;
        } 
        
<<<<<<< HEAD
<<<<<<< HEAD
        const dateSelected = thisBooking.datePicker.value;
        const hourSelected = utils.hourToNumber(thisBooking.hourPicker.value);
        //console.log('kliknieto stolik nr', tableClicked);
        //console.log('czy klikniety stolik jest juz zarezerwowany przez api?', 
        //  thisBooking.booked[dateSelected][hourSelected].includes(tableClicked));

        if ( !thisBooking.booked[dateSelected][hourSelected].includes(tableClicked) ){
          console.log('Stolik niedostępny');
          alert('Stolik niedostępny');
        } else {
=======
=======
>>>>>>> 240900894e4e0d2975b89c47af09c53ca31047b3
        /* cel: zablokuj stoliki zarezerwowane już przez api*/
        // tablica rezerwacji z api to thisBooking.booked 
        // console.log('lista rezerwacjiz api- thisBooking.booked', thisBooking.booked);

        // sprawdz czy klikniety stolik(id) znajduje sie w thisBooking.booked - dla daty.godziny (okreslonej w pickerach)
        const dateSelected = thisBooking.datePicker.value;
        // console.log('datePicker', dateSelected);
        const hourSelected = utils.hourToNumber(thisBooking.hourPicker.value);
        // console.log('hourPicker', hourSelected);
        console.log('kliknieto stolik nr', tableClicked);
        console.log('czy klikniety stolik jest juz zarezerwowany przez api?', 
          thisBooking.booked[dateSelected][hourSelected].includes(tableClicked));

        if ( thisBooking.booked[dateSelected][hourSelected].includes(1) ){
          // jesli tak to return, (wyswietl komunikat - 'Stolik niedostępny')
          console.log('Stolik niedostępny');
          //alert('Stolik niedostępny');
          
        } else {
          // jesli nie to remove class booked;
<<<<<<< HEAD
>>>>>>> 240900894e4e0d2975b89c47af09c53ca31047b3
=======
>>>>>>> 240900894e4e0d2975b89c47af09c53ca31047b3
          table.classList.remove(classNames.booking.tableBooked);
          thisBooking.tablePick = 'undefined';
          console.log('usunieto rezerwacje stolika nr', tableClicked);     
        }
      });
    }
  }


  sendReservation(){
    const thisBooking = this;

    const allReservationData = {
      date: thisBooking.date,
      hour: thisBooking.hourPicker.value,
      table: parseInt(thisBooking.tablePick),
      people: thisBooking.people,
      duration: thisBooking.duration,
      starters: ['water', 'bread'], //to find checkboxes
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
    };
    // console.log(allReservationData);

    const url = `${ settings.db.url }/${ settings.db.booking}`;
    // console.log(url);

    const payload = allReservationData;

    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, option)
      .then(function(response){
        return response.json();
      })
      .then(function(parsedResponse){
        console.log('rezerwacja wyslana do serwera poprzez API', parsedResponse);
<<<<<<< HEAD
<<<<<<< HEAD
        alert('Rezerwacja wyslana');
=======
>>>>>>> 240900894e4e0d2975b89c47af09c53ca31047b3
=======
>>>>>>> 240900894e4e0d2975b89c47af09c53ca31047b3
        thisBooking.getData();
      });
      
    
  }
    
  render(reservation){
    const thisBooking = this;

    const generateHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = reservation;
    thisBooking.dom.wrapper.innerHTML = generateHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.cart.phone);
    //console.log(thisBooking.dom.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.cart.address);
    //console.log(thisBooking.dom.address);
  }

  initWidget(){
    const thisBooking = this;

    thisBooking.peopleAmount = new amountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new amountWidget(thisBooking.dom.hoursAmount);
    
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
  
    thisBooking.dom.wrapper.addEventListener('submit', function(event){
      event.preventDefault();
      //console.log('book clicked');
      thisBooking.sendReservation();
    });
  }
}

export default Booking;
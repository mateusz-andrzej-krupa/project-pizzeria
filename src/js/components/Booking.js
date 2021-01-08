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
    
    console.log('świeże rezerwacje z api', thisBooking.booked);
    
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }
    
    const startHour = utils.hourToNumber(hour);
 
    if ( typeof thisBooking.booked[date][startHour] == 'undefined') {
      thisBooking.booked[date][startHour] = [];
    }

    thisBooking.booked[date][startHour] = ([...new Set([...thisBooking.booked[date][startHour], ...table])]);

    for(let hourBlock = startHour; hourBlock < startHour+duration; hourBlock += 0.5){
      
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
    thisBooking.duration = thisBooking.hoursAmount.value;

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
      thisBooking.tablesStorage = [];
    }
  }

  selectAvailableTable(){
    const thisBooking = this;
    
    thisBooking.tablesStorage = [];

    for (let table of thisBooking.dom.tables){
      table.addEventListener('click', function(){
        
        const tableClicked = parseInt(table.getAttribute(settings.booking.tableIdAttribute));

        if( !table.classList.contains(classNames.booking.tableBooked) ){
          table.classList.add(classNames.booking.tableBooked);
          thisBooking.tablesStorage.push(tableClicked);                
          return;
        } 
        
        const dateSelected = thisBooking.datePicker.value;
        const hourSelected = utils.hourToNumber(thisBooking.hourPicker.value);

        const removeSelectionFromClickedTables = function(){
          table.classList.remove(classNames.booking.tableBooked);
          
          for( let i = 0; i < thisBooking.tablesStorage.length; i++ ){
            if(thisBooking.tablesStorage.includes(tableClicked)){
              const indexOfClicked = thisBooking.tablesStorage.indexOf(tableClicked);
              thisBooking.tablesStorage.splice(indexOfClicked, 1);
              console.log('usunieto rezerwacje stolika nr :', tableClicked);
              console.log('wyczyszczono storage',thisBooking.tablesStorage);
            }
          }
        };

        const reservationIfExistInApi = thisBooking.booked[dateSelected][hourSelected];
        
        if (reservationIfExistInApi) {
          const tableFromApiIsSelected = thisBooking.booked[dateSelected][hourSelected].includes(parseInt(tableClicked));

          if ( tableFromApiIsSelected ){
            console.log('Stolik niedostępny');
            alert('Stolik niedostępny');
          } else {
            removeSelectionFromClickedTables();
          }
        } else {
          removeSelectionFromClickedTables();
        }
      });
    }
  }

  sendReservation(){
    const thisBooking = this;
    
    const allReservationData = {
      date: thisBooking.date,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.tablesStorage,
      people: thisBooking.people,
      duration: thisBooking.duration,
      starters: ['water', 'bread'], //to find checkboxes
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
    };

    const url = `${ settings.db.url }/${ settings.db.booking}`;

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
        alert('Rezerwacja wyslana');
        
        thisBooking.getData();
        thisBooking.tablesStorage = [];
        console.log('wyczyszczono tablesStorage', thisBooking.tablesStorage);
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
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.cart.address);
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
      thisBooking.sendReservation();
    });
  }
}

export default Booking;
import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import HomePage from './components/HomePage.js';

const app = {

  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    
    const idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingHash = thisApp.pages[0].id;
    
    for (let page of thisApp.pages){
      if (page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);

        window.location.hash = `#/${ id }`;
      });
    }

  },

  initBooking: function(){
    const thisApp = this;

    const reservation = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(reservation);
  },

  activatePage: function(pageId){
    const thisApp = this;

    for (let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    for (let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == `#${ pageId }`
      );
    }
  },

  initMenu: function(){
    const thisApp = this;

    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('products throught api', parsedResponse);//test-api-response
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
      
    });
  },

  initHomePage: function(){
    const thisApp = this;

    const homePage = document.querySelector(select.containerOf.homePage);
    thisApp.HomePage = new HomePage(homePage);

    window.addEventListener('homeLinkClick', function(event){
      thisApp.activatePage(event.detail.id);
    });

  },

  init: function(){
    const thisApp = this;
    console.log('*** App starting ***');
    thisApp.initData();
    thisApp.initHomePage();
    thisApp.initPages();
    thisApp.initCart();
    thisApp.initBooking();
  },
};

app.init();
/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();

      thisProduct.getElements();

      thisProduct.initAccordion();

      thisProduct.initOrderFrom();

      thisProduct.initAmountWidget();

      thisProduct.processOrder();

      //console.log('new Product', thisProduct);
    }
    
    renderInMenu(){
      const thisProduct = this;

      /* generate HTMLbased on template*/
      const generateHTML = templates.menuProduct(thisProduct.data);
      /* create element using utils.createElemntFtomHtml */
      thisProduct.element = utils.createDOMFromHTML(generateHTML);
      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    
    }
    
    getElements(){
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelectorAll(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);

      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);

      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion(){
      const thisProduct = this;

      /* DONE find the clickable trigger (el. that should be react to clicking) */
      const allAcordions = thisProduct.accordionTrigger; //lub: const allAcordions = thisProduct.element.querySelectorAll(select.menuProduct.clickable);

      /* DONE START: click event listener to trigger */
      for (let oneAccordion of allAcordions){
        oneAccordion.addEventListener('click', function(event){
          console.log('target just has been clicked'); //potwierdzenie klikniecia

          /* DONE prevent default action for event */
          event.preventDefault();

          /* toogle active class on el. of thisProduct */
          const addClassActiveToClicked = thisProduct.element.classList.contains(classNames.menuProduct.wrapperActive);
          //console.log('element just clicked', addClassActiveToClicked);
          if (addClassActiveToClicked){
            thisProduct.element.classList.remove('active');
          } else {
            thisProduct.element.classList.add('active');
          }
          
          /* find all active products */
          const allActiveProducts = document.querySelectorAll(select.all.menuProductsActive);

          /* LOOP: for each actives product */
          for(const product of allActiveProducts){

            /* START: if the active product isn't the el. of thisProduct */
            if(product !== thisProduct.element){
        
              /* remove class active for the active product */
              product.classList.remove(classNames.menuProduct.wrapperActive);
              
              /* END: if  */
            }
          }
        /*END LOOP */
        });
      /* END click event listener to triggre */
      }
    }

    initOrderFrom(){
      const thisProduct = this;
      
      thisProduct.form.addEventListener('submit', function(event){  
        event.preventDefault();
        thisProduct.processOrder();
      });
      // DONE - improve yourself: 'submit || click'
      /*
      const test = function(event){
        event.preventDefault();
        thisProduct.processOrder();
      };
      thisProduct.form.addEventListener('submit', test);
      thisProduct.form.addEventListener('click', test);
      */

      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          event.preventDefault();
          thisProduct.processOrder();
        });
      }
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    processOrder(){
      const thisProduct = this; //console.log('processOrder',thisProduct);
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log(formData);

      /* DONE get default product's price and assign to const "price" */
      thisProduct.params = {};
      let price = thisProduct.data.price;
      //console.log('price', price);
      
      /* for1 each param in obj params do */
      const paramsAll = thisProduct.data.params;
      for (let paramId in thisProduct.data.params){
        const param = paramsAll[paramId];
        //console.log('param', param);

        /* DONE for2 each option in obj options do */
        for (let optionId in param.options){
          const option = param.options[optionId];
          //console.log('option', option);

          /* DONE option is marked */
          const optionMarked = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          //console.log('optMarked', optionMarked);

          /* DONE check if opt is marked and if it is not-default */
          
          if ( optionMarked && !option.default ) { 
            
            /* DONE sum priceDefault and price of option -increse */
            price += option.price;
            //console.log('dodano cene skladnika (',option.price, ') suma = ', price);
            
            /* DONE else if opt-def is unmarked - decrease price  */
          } else if ( !optionMarked && option.default ) {
            price -= option.price; 
            //console.log('odjeto cene skladnika (',option.price, ') suma = ', price);
            
          /* end if */
          }

          /* znajdz wszystkie obrazki dla tego accordeonu */
          const imgSelector = '.' + paramId + '-' + optionId;
          //console.log(imgSelector);
          const allImgs = thisProduct.imageWrapper.querySelectorAll(imgSelector);
          //console.log('allImgs', allImgs)
         
          /* jesli opcja jest zaznaczona to nadaj im klase active */
          if (optionMarked) {
            if (!thisProduct.params[paramId]) {
              thisProduct.params[paramId] = {
                label: param.label,
                options: {}
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label;

            for (let img of allImgs){
              img.classList.add(classNames.menuProduct.imageVisible);
            }
            /* jesli opcja jest odznaczona to usuń im klase active */
          } else {
            for (let img of allImgs){
              img.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        /* end for2 */
        }
      /* end for1 */
      }
      /* multiply price by amount */
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
      
      /* DONE display calculated price */
      thisProduct.priceElem.innerHTML = thisProduct.price;
      //done check the prices
      /* console.log(`
        priceSingle = ${ price }
        priceCalculated: ${ thisProduct.price }
        `
        );*/
      //console.log(thisProduct.params); 
    }

    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new amountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
        //console.log('listener in classProduct works');
      });
    }

    addToCart(){
      const thisProduct = this;

      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;

      /* //done console.log(`
        thisProduct.name >> ${ thisProduct.name }
        thisProduct.amount >> ${ thisProduct.amount }`);
      */

      app.cart.add(thisProduct);

    }
    
  }

  class amountWidget{
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);

      thisWidget.value = settings.amountWidget.defaultValue;
      //console.log('default value of input value', thisWidget.value);

      thisWidget.setValue(thisWidget.input.value);

      thisWidget.initActions();

      //console.log('AmountWidged', thisWidget);
      //console.log('constructor arguments', element);
    }
    getElements(element){
      const thisWidget = this;
    
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value){
      const thisWidget = this;
      
      //console.log('test-value-default-incomming', thisWidget.value);
      //console.log('test-value-solo', value);
      
      const newValue = Number(value);
      //console.log('test newValue', newValue);
      
      /* DONE change value if newValue is different or/and newValue >= defMin or/and newValue <= defmax */
      if( 
        newValue != thisWidget.value &&
        newValue >= settings.amountWidget.defaultMin &&
        newValue <= settings.amountWidget.defaultMax
      ){
        thisWidget.value = newValue;
        thisWidget.announce();
        //console.log('test-newValue-is:', newValue);
      }
      //thisWidgetValue is equal default value set in constructor;
      thisWidget.input.value = thisWidget.value;
    }

    initActions(){
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input.value);
        //console.log('changed');
      });
      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value -1);
        //console.log('decresed');
      });
      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value +1);
        //console.log('increased');
      });
    }

    announce(){
      const thisWidget= this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
      //console.log('event was called', event);
    }
    
  }

  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];
      //console.log(`produkty w koszyku: ${ thisCart.products }`);

      thisCart.getElements(element);
      
      thisCart.initActions();

      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

      
    }
    getElements(element){
      const thisCart = this;

      thisCart.dom = {};

      thisCart.dom.wrapper = element;
      thisCart.dom.cartAccordionTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      
      thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

      for(let key of thisCart.renderTotalsKeys){
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      }
    }

    initActions(){
      const thisCart = this;
      /* cart react to click*/
      /*thisCart.dom.cartAccordionTrigger.addEventListener('click', function(event){
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      */

      // other solution: cart mouseover || click
      
      const cartReact = function(event){
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive); 
      };
      thisCart.dom.cartAccordionTrigger.addEventListener('click', cartReact);
      //thisCart.dom.cartAccordionTrigger.addEventListener('mouseover', cartReact);
      
      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.update();
      });
      
      thisCart.dom.productList.addEventListener('remove', function(){
        //debugger;
        //console.log(`test remove-done`);
        thisCart.remove(event.detail.cartProduct);
      });
    }

    add(menuProduct){
      const thisCart = this;

      //console.log('this to: ', thisCart);
      //console.log('adding product', menuProduct);

      /* generate HTMLbased on template*/
      const generateHTML = templates.cartProduct(menuProduct);

      /* HTML save as const generatedDOM */
      const generatedDOM = utils.createDOMFromHTML(generateHTML);
      //console.log(`DOM ${ generatedDOM }`);

      /* add generatedDOM to thisCart.dom.productList */
      thisCart.dom.productList.appendChild(generatedDOM);

      /* add menuPeoduct and gen.DOM as new class */
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      console.log('produkty w koszyku', thisCart.products);

      thisCart.update();
    }

    update(){
      const thisCart = this;

      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;
            
      //console.log(`produkty: ${ thisCart.products }`);
      
      for (let product of thisCart.products) {
        
        thisCart.subtotalPrice += product.price;
        //console.log(`cena = ${ product.price } i sbutotalPirce ${ thisCart.subtotalPrice }`);
        thisCart.totalNumber += product.amount;
        //console.log(`amount ${ product.amount } totalNumber ${ thisCart.totalNumber }`);
      }

      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      /*
      console.log(`totale do koszyka:
      sumaryczna ilosc ${ thisCart.totalNumber }
      wartośc produktów ${ thisCart.subtotalPrice }
      całokowita wartość ${ thisCart.totalPrice }
      `);
      */

      for (let key of thisCart.renderTotalsKeys) {
        for (let elem of thisCart.dom[key]) {
          elem.innerHTML = thisCart[key];
        }
      }
    }
    
    remove(cartProduct){
      const thisCart = this;
      
      /* do stałej index przypisz wartosc indexu cartProduct w tabl thisCart.Product */
      //console.log('wyswielt tablice productow:', thisCart.products);
      //console.log('co to jest cartProduct:', cartProduct);
      const index = thisCart.products.indexOf(cartProduct);
      //console.log('wyswietl indexOf usuwanego produktu', index);
      //console.log('wyświetl value at this indexOf ', thisCart.products[index]);
      

      /* z tablicy thisCart.products usuń el. o tym indexie */
      thisCart.products.splice(index, 1);
      
      /* z DOM usun el. cartProduct.dom.wrapper */
      //console.log(`el DOM do usuniecia: ${ cartProduct.dom.wrapper }`);
      cartProduct.dom.wrapper.remove();

      /*DONE wywyłaj metodę update aby przeliczyc ceny */
      thisCart.update();
    }
  }

  class CartProduct{
    constructor(menuProduct, element){
      const thisCartProduct = this;
      
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));

      thisCartProduct.getElements(element);

      thisCartProduct.initAmountWidget();
      
      thisCartProduct.initActions();

      //console.log(`thisCartProduct: ${ thisCartProduct }`);
      //console.log('menuProduct', menuProduct);
    }

    getElements(element){
      const thisCartProduct = this;

      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidgetElem = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }

    initAmountWidget(){
      const thisCartProduct = this;

      thisCartProduct.dom.amountWidget = new amountWidget(thisCartProduct.dom.amountWidgetElem);

      
      thisCartProduct.dom.amountWidgetElem.addEventListener('updated', function(){
        thisCartProduct.dom.amount = thisCartProduct.dom.amountWidget.value;
        //console.log(`ilosc zmieniana w koszyku ${ thisCartProduct.dom.amount }`);
        //console.log(`cena jednej szt ${ thisCartProduct.priceSingle }`);
        
        thisCartProduct.price = thisCartProduct.priceSingle*thisCartProduct.dom.amount;
        /*console.log(
          `nazwa: ${ thisCartProduct.name } 
          cena: ${ thisCartProduct.priceSingle} $/szt 
          ilosc: ${ thisCartProduct.dom.amount } szt
          cena * ilosć = ${ thisCartProduct.dom.price }`);
        */
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      });
      
    }

    remove(){
      const thisCartProduct = this;
      
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });
      //console.log(`test remove click-done`);
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }

    initActions(){
      const thisCartProduct = this;

      thisCartProduct.dom.edit.addEventListener('click', function(event){
        event.preventDefault();
        //console.log(`test click to edit btn-done`);

      });
      thisCartProduct.dom.remove.addEventListener('click', function(event){
        event.preventDefault();
        //console.log(`test click to remove btn-done`);
        thisCartProduct.remove();
      });
    }
  }
  
  const app = {

    initMenu: function(){
      const thisApp = this;
      //console.log('thisApp.data', thisApp.data);

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
          console.log('parsedResponse', parsedResponse);
        
          /* save parsedResponse as thisApp.data.products */
          thisApp.data.products = parsedResponse;

          /* execute initMenu method */
          thisApp.initMenu();
        });
      console.log('thisApp.data=produkty pobrane z serwera: ', thisApp.data);
    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);
      thisApp.initData();
      thisApp.initCart();
    },
  };

  app.init();
}

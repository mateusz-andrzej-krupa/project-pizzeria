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

      /* generate HMLbased on template*/
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
      });
    }

    processOrder(){
      const thisProduct = this; //console.log('processOrder',thisProduct);
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log(formData);

      /* DONE get default product's price and assign to const "price" */
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
      price *= thisProduct.amountWidget.value;
      //console.log('price*amount = ', price);

      /* DONE display calculated price */
      thisProduct.priceElem.innerHTML = price;
      //console.log('priceCalculated', price);
    }

    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new amountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
        //console.log('listener in classProduct works');
      });
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

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
      //console.log('event was called', event);
    }
  }

  class cart{
    constructor(){

    }
    
  }

  class CartProduct{
    constructor(){

    }

  }
  
  const app = {
    initMenu: function(){
      const thisApp = this;
      //console.log('thisApp.data', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}

/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
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
      thisProduct.form.addEventListener('submit', function(event){ //'submit || click' 
        event.preventDefault();
        thisProduct.processOrder();
      });
      
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
      console.log(formData);
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

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

      thisProduct.initAccordion();

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
    initAccordion(){
      const thisProduct = this;
      /* DONE find the clickable trigger (el. that should be react to clicking) */
      const triggers = thisProduct.element.querySelectorAll(select.menuProduct.clickable);
      //DONE console.log('triggers', triggers);
      /* DONE START: click event listener to trigger */
      for(let trigger of triggers){
        trigger.addEventListener('click', function(){
          console.log('clicked');
          /* DONE prevent default action for event */
          event.preventDefault();
        });
        /* toogle active class on el. of thisProduct */
        thisProduct.element.classList.toggle(select.menuProduct.clickable);
        //console.log('toggleElement',thisProduct.element);
        /* find all active products */
        const productsActive =  document.querySelectorAll(select.all.menuProductsActive) ;
        //console.log('aktywne produkty', productsActive);
        /* LOOP: for each actives product */
        for(let active in productsActive){
        /* START: if the active product isn't the el. of thisProduct */
          if (active != thisProduct){
            /* remove class active for the active product */
            active.element.remove('active');
            console.log('shit', active);
            } else {
            thisProduct.classList.add('active');
        /* END: if  */
          }
        }
      /*END LOOP */
      }
      /* END click event listener to triggre */
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

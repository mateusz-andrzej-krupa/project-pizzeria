import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import amountWidget from './AmountWidget.js';

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
  }
    
  renderInMenu(){
    const thisProduct = this;

    const generateHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generateHTML);
    const menuContainer = document.querySelector(select.containerOf.menu);
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

    const allAcordions = thisProduct.accordionTrigger;

    for (let oneAccordion of allAcordions){
      oneAccordion.addEventListener('click', function(event){
        console.log('target just has been clicked'); //potwierdzenie klikniecia
        event.preventDefault();
        const addClassActiveToClicked = thisProduct.element.classList.contains(classNames.menuProduct.wrapperActive);
        if (addClassActiveToClicked){
          thisProduct.element.classList.remove('active');
        } else {
          thisProduct.element.classList.add('active');
        }
          
        const allActiveProducts = document.querySelectorAll(select.all.menuProductsActive);
        for(const product of allActiveProducts){
          if(product !== thisProduct.element){
            product.classList.remove(classNames.menuProduct.wrapperActive);
          }
        }
      });
    }
  }

  initOrderFrom(){
    const thisProduct = this;
      
    thisProduct.form.addEventListener('submit', function(event){  
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
      thisProduct.addToCart();
    });
  }

  processOrder(){
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);

    thisProduct.params = {};
    let price = thisProduct.data.price;
    const paramsAll = thisProduct.data.params;

    for (let paramId in thisProduct.data.params){
      const param = paramsAll[paramId];

      for (let optionId in param.options){
        const option = param.options[optionId];
        const optionMarked = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

        if ( optionMarked && !option.default ) { 
          price += option.price;

        } else if ( !optionMarked && option.default ) {
          price -= option.price; 
        }

        const imgSelector = '.' + paramId + '-' + optionId;
        const allImgs = thisProduct.imageWrapper.querySelectorAll(imgSelector);

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
        } else {
          for (let img of allImgs){
            img.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }

    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
    thisProduct.priceElem.innerHTML = thisProduct.price;
  }

  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new amountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  addToCart(){
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    const event = new CustomEvent('add-to-cart',{
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}
export default Product;
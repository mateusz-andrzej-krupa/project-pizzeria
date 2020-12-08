/* global Flickity */
import { select, templates, settings } from '../settings.js';
import utils from '../utils.js';

class homePage{
  constructor(){
    const thisHomePage = this;

    thisHomePage.getData();
  }

  getData(){
    const thisHomePage = this;

    thisHomePage.data = {};
    const url = settings.db.url + '/' + settings.db.coments;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('coments throught api:', parsedResponse);//test-api-response        
        thisHomePage.data.coments = parsedResponse;
        thisHomePage.renderHome();
        thisHomePage.wordsSlideUp();
        thisHomePage.carusel();
      });
      

  }

  renderHome(){
    const thisHomePage = this;

    const generateHTML = templates.homePage(thisHomePage.data);
    thisHomePage.element = utils.createDOMFromHTML(generateHTML);
    const homePageContainer = document.querySelector(select.containerOf.homePage);
    homePageContainer.appendChild(thisHomePage.element);
  }
  
  wordsSlideUp(){
    const thisHomePage = this;
    
    const panelBoxes = thisHomePage.element.querySelectorAll(select.home.box);

    for (let panel of panelBoxes){
      if (panel.dataset.animation && panel.dataset.animation == 'false'){
        continue;
      }

      panel.addEventListener('mouseover', function(event){
        event.preventDefault();
          
        const smallWord = this.querySelector(select.home.smallWords);
        smallWord.classList.add(select.home.slideUp1);
        smallWord.classList.add(select.home.slideUp2);
      });
    }
    
    for (let panel of panelBoxes){
      if (panel.dataset.animation && panel.dataset.animation == 'false'){
        continue;
      }
      
      panel.addEventListener('mouseleave', function(event){
        event.preventDefault();
        
        const smallWord = this.querySelector(select.home.smallWords);
        smallWord.classList.remove(select.home.slideUp1);
        smallWord.classList.remove(select.home.slideUp2);
      });
    }
  }

  carusel(){
    // const thisHomePage = this;
    
    const elem = document.querySelector('.main-carousel');
    // const flkty = 
    new Flickity( elem, {
      // options
      cellAlign: 'center',
      autoPlay: true,
    });
  }
}

export default homePage;
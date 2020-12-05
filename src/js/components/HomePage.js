import { select, templates } from '../settings.js';
import utils from '../utils.js';

class homePage{
  constructor(){
    const thisHomePage = this;

    thisHomePage.renderHome();
    thisHomePage.wordsSlideUp();
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
}

export default homePage;
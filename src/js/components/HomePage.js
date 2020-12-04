import { select, templates } from '../settings.js';
import utils from '../utils.js';

class homePage{
  constructor(){
    const thisHomePage = this;

    thisHomePage.renderHome();
    // thisHomePage.getelements();
    thisHomePage.wordsSlideUp();
  }

  renderHome(){
    const thisHomePage = this;

    const generateHTML = templates.homePage(thisHomePage.data);
    thisHomePage.element = utils.createDOMFromHTML(generateHTML);
    const homePageContainer = document.querySelector(select.containerOf.homePage);
    homePageContainer.appendChild(thisHomePage.element);
  }
  
  // getelements(){
  //   const thisHomePage = this;
    
  // }
  
  wordsSlideUp(){
    const thisHomePage = this;
    
    const panelBoxes = thisHomePage.element.querySelectorAll(select.home.box);
    console.log('boxes', panelBoxes);
    

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


    // const homeLinks = thisHomePage.links = thisHomePage.element.querySelectorAll(select.home.links);
    // console.log('linki w home page', homeLinks);
    
    
    // for (let homeLink of homeLinks){
    //   homeLink.addEventListener('mouseover', function(event){
    //     event.preventDefault();
    //     // console.log('__________');
    //     for (let smallWord of smallWords){
    //       smallWord.classList.add(select.home.slideUp1);
    //       smallWord.classList.add(select.home.slideUp2);
    //     }
    //   });
    // }
  }

}

export default homePage;
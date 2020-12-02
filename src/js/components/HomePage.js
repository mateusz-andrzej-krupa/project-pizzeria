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
    
    const homeLinks = thisHomePage.links = thisHomePage.element.querySelectorAll(select.home.links);
    // console.log('linki w home page', thisHomePage.links);
    const smallWords = thisHomePage.smallWords = thisHomePage.element.querySelectorAll(select.home.smallWords);
    // console.log('male wyrazy', thisHomePage.smallWords);
    
    for (let homeLink of homeLinks){
      homeLink.addEventListener('click', function(event){
        event.preventDefault();
        // console.log('__________');
        for (let smallWord of smallWords){
          smallWord.classList.toggle(select.home.slideUp);
          console.log('class added');
        }
      });
    }
  }

}

export default homePage;
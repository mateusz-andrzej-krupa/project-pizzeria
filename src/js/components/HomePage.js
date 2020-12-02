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
    console.log('linki w home page', thisHomePage.links);
    thisHomePage.smallWords = thisHomePage.element.querySelectorAll(select.home.smallWords);
    console.log('male wyrazy', thisHomePage.smallWords);
    
    homeLinks.links.addEventListener('click', function(event){
      thisHomePage.smallWords.classNames.add('animate__animated animate__backInUp');
      console.log('class added');
      event.preventDefault();
    });
  }

}

export default homePage;
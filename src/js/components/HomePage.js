import { classNames, select, templates } from '../settings.js';
import utils from '../utils.js';

class homePage{
  constructor(){
    const thisHomePage = this;

    thisHomePage.renderHome();
    thisHomePage.wordsUp();
  }

  renderHome(){
    const thisHomePage = this;

    const generateHTML = templates.homePage(thisHomePage.data);
    thisHomePage.element = utils.createDOMFromHTML(generateHTML);
    const homePageContainer = document.querySelector(select.containerOf.homePage);
    homePageContainer.appendChild(thisHomePage.element);
  }

  wordsUp(){
    const thisHomePage = this;

    thisHomePage.box = document.querySelectorAll(select.home.box);
    console.log('qqqqqq', thisHomePage.box);
    thisHomePage.box.addEventListener('click', function(){
      thisHomePage.box.classNames.add('animate__animated animate__backInUp');
      console.log('class added');
    });
  }

}

export default homePage;
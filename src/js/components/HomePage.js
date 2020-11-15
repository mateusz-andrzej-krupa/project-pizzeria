import { select, templates } from '../settings.js';
import utils from '../utils.js';

class homePage{
  constructor(){
    const thisHomePage = this;

    thisHomePage.renderHome();
  }

  renderHome(){
    const thisHomePage = this;

    const generateHTML = templates.homePage(thisHomePage.data);
    thisHomePage.element = utils.createDOMFromHTML(generateHTML);
    const homePageContainer = document.querySelector(select.containerOf.homePage);
    homePageContainer.appendChild(thisHomePage.element);
  }
}

export default homePage;
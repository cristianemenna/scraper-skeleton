import { Browser } from "puppeteer";
import { EntityManager } from "../database/entity-manager";
import { RepositoryType } from "../types/repository.type";
import { UserType } from "../types/user.type";

export class GithubProfileService {
  public browser: Browser;
  public entityManager: EntityManager;

  public constructor(browser: Browser, entityManager: EntityManager) {
    this.browser = browser;
    this.entityManager = entityManager;
  }

  public async scrap(url: string): Promise<UserType> {

    const page = await this.browser.newPage();
    console.log(`Navigating to ${url}...`);
    await page.goto(url)
    await page.waitForSelector('.application-main');

    // Get a Github User information from profile 
    const result: UserType = await page.evaluate(() => {

      const repositoriesLength = document.querySelectorAll('.pinned-item-list-item-content').length;
      let repositories: RepositoryType[] = [];

      // Loop through each repository item  
      for (let i = 0; i < repositoriesLength; i++) {

        try {
          const repositoryItem = document.querySelectorAll('.pinned-item-list-item-content')[i];
          const title = (repositoryItem.querySelector('.repo') as HTMLElement).innerText;
          const description = (repositoryItem.querySelector('.pinned-item-desc') as HTMLElement).innerText;

          const repository = {
            title,
            description
          } as RepositoryType

          repositories.push(repository);
        } catch (e) {
          console.log("Error on repositories scraping => ", e);
        }

      }

      // Get static profile informations  

      let fullName = '';
      let username = '';
      let city = '';
      let company = '';

      try {
        fullName = (document.querySelector('.p-name') as HTMLElement).innerText;
        username = (document.querySelector('.p-nickname') as HTMLElement).innerText;
        company = (document.querySelector('.p-org') as HTMLElement).innerText;
        city = (document.querySelector('li[itemprop="homeLocation"] span') as HTMLElement).innerText;

      } catch (e) {
        console.log("Error on user profile scraping => ", e);
      }

      return {
        fullName,
        username,
        city,
        company,
        repositories,
      } as UserType;

    });

    return result;
  }
}

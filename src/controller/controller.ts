import { Browser } from 'puppeteer';
import { Connection } from '../database/connection';
import { EntityManager } from '../database/entity-manager';
import { GithubProfileService } from '../service/github';

export class Controller {
  public browser: Browser;

  public constructor(browser: Browser) {
    this.browser = browser;
  }

  public async scrap(url: string): Promise<void> {
    try {
      const entityManager = new EntityManager(Connection.getInstance());
      entityManager.createTables();
      const githubProfileService = new GithubProfileService(this.browser, entityManager);
      const userProfile = await githubProfileService.scrap(url);
      await console.log(userProfile);
      entityManager.addProfileToDb(userProfile);
    } catch (err) {
      console.log("Scraping error => ", err);
    }
  }
}

import { RepositoryType } from "../types/repository.type";
import { UserType } from "../types/user.type";
import { Connection } from "./connection";

export class EntityManager {
  public connection: any;

  public constructor(connection: Connection) {
    this.connection = connection;
  }

  // Create Profile and Repository tables on DB
  public createTables(): void {
    const client = this.connection.getConnection();
    this.createProfileTable(client);
    this.createProfileRepository(client);
  }

  public createProfileTable(client: any): void {
    const query = `
      CREATE TABLE IF NOT EXISTS github_profile (
        id SERIAL PRIMARY KEY,
        full_name varchar,
        username varchar UNIQUE,
        company varchar,
        city varchar
      )
    `;

    client.query(query, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Table github_profile successfully created`);
    });
  }


  public createProfileRepository(client: any): void {
    const query = `
      CREATE TABLE IF NOT EXISTS github_repository (
        id SERIAL,
        title varchar,
        description varchar,
        profile_id integer REFERENCES github_profile(id),
        PRIMARY KEY (title)
      )
    `;

    client.query(query, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Table github_repository successfully created`);
    });
  }

  // Add an user profile and repositories (if exists) to DB 
  public async addProfileToDb(user: UserType) {
    const client = this.connection.getConnection();
    const userId = await this.addUserProfile(user, client);

    if (user.repositories) {
      for (let repository of user.repositories) {
        this.addUserRepository(userId, repository, client);
      }
    }
  }

  public async addUserProfile(user: UserType, client: any): Promise<string> {
    const query = {
      text: 'INSERT INTO github_profile (full_name, username, company, city) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [user.fullName, user.username, user.company, user.city],
    }

    try {
      await client.query('BEGIN');
      const result = await client.query(query);
      console.log(`User ${user.fullName} added to database`);
      await client.query('COMMIT')
      return result.rows[0].id;
    } catch (e) {
      console.error(e.detail);
      await client.query('ROLLBACK');
      throw e
    }
  }

  public async addUserRepository(userId: string, repository: RepositoryType, client: any) {
    const query = {
      text: 'INSERT INTO github_repository (title, description, profile_id) VALUES ($1, $2, $3)',
      values: [repository.title, repository.description, userId],
    }

    try {
      await client.query('BEGIN');
      await client.query(query);
      console.log(`User ${repository.title} added to database`);
      await client.query('COMMIT')
    } catch (e) {
      console.error(e.detail);
      await client.query('ROLLBACK');
      throw e
    }
    return;
  }
}
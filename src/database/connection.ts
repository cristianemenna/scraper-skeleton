const { Client } = require('pg');

export class Connection {
  private static instance: Connection;
  private connection: any;

  private constructor() { }

  public static getInstance(): Connection {
    if (!Connection.instance) {
      Connection.instance = new Connection();
    }
    return Connection.instance;
  }

  public getConnection() {
    if (!this.connection) {
      this.connection = new Client({
        user: 'scraper',
        host: 'localhost',
        database: 'scraper',
        password: 'password',
        port: 5431,
      });
      this.connection.connect();
    }
    return this.connection;
  }
}
import databaseConfig from './database.config';

describe('databaseConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return database configuration correctly', () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';
    process.env.DB_USER = 'test_user';
    process.env.DB_PASS = 'test_pass';
    process.env.DB_NAME = 'test_db';

    const databaseConfigValue = databaseConfig();
    expect(databaseConfigValue).toEqual({
      database: {
        host: 'localhost',
        port: 5432,
        user: 'test_user',
        password: 'test_pass',
        database: 'test_db',
      },
    });
  });
});

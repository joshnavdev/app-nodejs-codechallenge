export interface ConfigDatabase {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export default (): { database: ConfigDatabase } => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT!, 10) || 5432,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
  },
});

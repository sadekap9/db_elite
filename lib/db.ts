import mysql from "mysql2/promise";

// MySQL Connection Pool Setup
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

// Generic helper function to run queries
export async function query<T = unknown>(
  sql: string,
  params: (string | number | boolean | null | Date)[] = []
): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    console.error("MySQL Database Error:", error);
    throw error;
  }
}

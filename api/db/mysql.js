import mysql from 'mysql2/promise';
import pg from 'pg';
import dotenv from 'dotenv';

const { Pool: PgPool } = pg;

// Load .env file only if it exists (for local development)
try {
  dotenv.config();
} catch (error) {
  console.log('No .env file found, using environment variables');
}

const selectedDialect = (process.env.DB_DIALECT || '').toLowerCase();
export const dbDialect = selectedDialect === 'postgres' || process.env.SUPABASE_DB_URL ? 'postgres' : 'mysql';

const validateEnvVars = (requiredEnvVars) => {
  const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    return { valid: false, missingEnvVars };
  }

  return { valid: true, missingEnvVars: [] };
};

const createUnavailableDb = (reason) => {
  console.error('Database is unavailable:', reason);

  return {
    query: async () => {
      throw new Error(`Database unavailable: ${reason}`);
    },
    getConnection: async () => {
      throw new Error(`Database unavailable: ${reason}`);
    },
  };
};

const convertQuestionMarkParamsToPg = (sql) => {
  let paramIndex = 0;
  return sql.replace(/\?/g, () => `$${++paramIndex}`);
};

const normalizePgSql = (sql) => {
  return sql.replace(/DATE_SUB\(NOW\(\),\s*INTERVAL\s+7\s+DAY\)/gi, "NOW() - INTERVAL '7 days'");
};

const isInsertQuery = (sql) => /^\s*INSERT\s+INTO\s+/i.test(sql);
let db;

if (dbDialect === 'postgres') {
  const envValidation = validateEnvVars(['SUPABASE_DB_URL']);
  if (!envValidation.valid) {
    db = createUnavailableDb(`Missing environment variables: ${envValidation.missingEnvVars.join(', ')}`);
  } else {

    const pgPool = new PgPool({
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 10000,
    });

    const runPgQuery = async (executor, sql, params = []) => {
      let normalizedSql = normalizePgSql(sql);
      normalizedSql = convertQuestionMarkParamsToPg(normalizedSql);

      if (isInsertQuery(normalizedSql) && !/\bRETURNING\b/i.test(normalizedSql)) {
        normalizedSql = `${normalizedSql} RETURNING id`;
      }

      const result = await executor.query(normalizedSql, params);
      const normalizedResult = {
        affectedRows: result.rowCount || 0,
        insertId: result.rows?.[0]?.id || null,
      };

      if (/^\s*(SELECT|WITH)\s+/i.test(normalizedSql)) {
        return [result.rows];
      }

      return [normalizedResult];
    };

    console.log('Database config:', {
      dialect: 'postgres',
      database: 'Supabase',
    });

    db = {
      query: (sql, params = []) => runPgQuery(pgPool, sql, params),
      getConnection: async () => {
        const client = await pgPool.connect();
        return {
          query: (sql, params = []) => runPgQuery(client, sql, params),
          beginTransaction: async () => {
            await client.query('BEGIN');
          },
          commit: async () => {
            await client.query('COMMIT');
          },
          rollback: async () => {
            await client.query('ROLLBACK');
          },
          release: () => {
            client.release();
          },
        };
      },
    };
  }
} else {
  const envValidation = validateEnvVars(['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE', 'MYSQL_PORT']);
  if (!envValidation.valid) {
    db = createUnavailableDb(`Missing environment variables: ${envValidation.missingEnvVars.join(', ')}`);
  } else {

    console.log('Database config:', {
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT,
    });

    // Create the connection pool. The pool-specific settings are the defaults
    db = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT,
      waitForConnections: true,
      connectionLimit: 20,
      maxIdle: 20,
      idleTimeout: 20000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
}

export default db;
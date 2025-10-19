/**
 * Snowflake Export API
 * Handles exporting mood and conversation data to Snowflake Data Cloud
 */

const logger = require('../logger');

/**
 * Mock Snowflake export (for demo/development)
 * In production, this would use the Snowflake Node.js SDK
 */
async function exportToSnowflakeMock(data) {
  logger.info('Mock Snowflake export initiated', {
    userId: data.userId,
    moodCount: data.moodHistory?.length || 0,
    timestamp: data.timestamp
  });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    exportId: `mock-export-${Date.now()}`,
    rowsInserted: data.moodHistory?.length || 0,
    timestamp: new Date().toISOString(),
    warehouse: 'CLEARMIND_WH',
    database: 'MENTAL_HEALTH_DB',
    schema: 'PUBLIC',
    table: 'MOOD_HISTORY'
  };
}

/**
 * Real Snowflake export using Snowflake SDK
 * Requires environment variables: SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, etc.
 * Supports both password and PAT (Personal Access Token) authentication
 */
async function exportToSnowflakeReal(data) {
  // NOTE: This requires installing snowflake-sdk package
  // npm install snowflake-sdk
  
  try {
    const snowflake = require('snowflake-sdk');
    
    // Configure connection - support both password and PAT authentication
    const connectionConfig = {
      account: process.env.SNOWFLAKE_ACCOUNT,
      username: process.env.SNOWFLAKE_USER,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE || 'CLEARMIND_WH',
      database: process.env.SNOWFLAKE_DATABASE || 'MENTAL_HEALTH_DB',
      schema: process.env.SNOWFLAKE_SCHEMA || 'PUBLIC'
    };

    // Use PAT if available, otherwise fall back to password or private key
    if (process.env.SNOWFLAKE_PAT) {
      connectionConfig.token = process.env.SNOWFLAKE_PAT;
      connectionConfig.authenticator = 'OAUTH';
    } else if (process.env.SNOWFLAKE_PASSWORD) {
      connectionConfig.password = process.env.SNOWFLAKE_PASSWORD;
    } else if (process.env.SNOWFLAKE_PRIVATE_KEY) {
      connectionConfig.privateKey = process.env.SNOWFLAKE_PRIVATE_KEY;
    }

    const connection = snowflake.createConnection(connectionConfig);

    // Connect to Snowflake
    await new Promise((resolve, reject) => {
      connection.connect((err, conn) => {
        if (err) reject(err);
        else resolve(conn);
      });
    });

    // Prepare data for insertion
    const moodRecords = data.moodHistory.map(entry => ({
      USER_ID: data.userId,
      MOOD: entry.mood,
      TIMESTAMP: entry.timestamp,
      MESSAGE_PREVIEW: entry.message ? entry.message.substring(0, 100) : null,
      EXPORTED_AT: data.exportedAt
    }));

    // Insert into Snowflake table
    const insertQuery = `
      INSERT INTO MOOD_HISTORY (USER_ID, MOOD, TIMESTAMP, MESSAGE_PREVIEW, EXPORTED_AT)
      SELECT 
        PARSE_JSON(?)::STRING as USER_ID,
        PARSE_JSON(?)::STRING as MOOD,
        PARSE_JSON(?)::TIMESTAMP as TIMESTAMP,
        PARSE_JSON(?)::STRING as MESSAGE_PREVIEW,
        PARSE_JSON(?)::TIMESTAMP as EXPORTED_AT
    `;

    let rowsInserted = 0;
    for (const record of moodRecords) {
      await new Promise((resolve, reject) => {
        connection.execute({
          sqlText: insertQuery,
          binds: [
            JSON.stringify(record.USER_ID),
            JSON.stringify(record.MOOD),
            JSON.stringify(record.TIMESTAMP),
            JSON.stringify(record.MESSAGE_PREVIEW),
            JSON.stringify(record.EXPORTED_AT)
          ],
          complete: (err, stmt, rows) => {
            if (err) reject(err);
            else {
              rowsInserted += rows;
              resolve();
            }
          }
        });
      });
    }

    // Close connection
    connection.destroy();

    logger.info('Snowflake export successful', {
      userId: data.userId,
      rowsInserted
    });

    return {
      success: true,
      exportId: `snowflake-${Date.now()}`,
      rowsInserted,
      timestamp: new Date().toISOString(),
      warehouse: process.env.SNOWFLAKE_WAREHOUSE,
      database: process.env.SNOWFLAKE_DATABASE,
      schema: process.env.SNOWFLAKE_SCHEMA,
      table: 'MOOD_HISTORY'
    };

  } catch (error) {
    logger.error('Snowflake export failed', { error: error.message });
    throw new Error(`Snowflake export failed: ${error.message}`);
  }
}

/**
 * Export handler - chooses mock or real based on environment
 */
async function exportHandler(req, res) {
  try {
    const { userId, moodHistory, timestamp, exportedAt } = req.body;

    // Validate input
    if (!userId || !moodHistory || !Array.isArray(moodHistory)) {
      return res.status(400).json({
        error: 'Invalid export data',
        message: 'userId and moodHistory array are required'
      });
    }

    // Use mock if in mock mode or Snowflake credentials not configured
    const useMock = process.env.MOCK === 'true' || 
                    !process.env.SNOWFLAKE_ACCOUNT || 
                    !process.env.SNOWFLAKE_USER ||
                    (!process.env.SNOWFLAKE_PAT && !process.env.SNOWFLAKE_PASSWORD && !process.env.SNOWFLAKE_PRIVATE_KEY);

    const result = useMock 
      ? await exportToSnowflakeMock(req.body)
      : await exportToSnowflakeReal(req.body);

    logger.info('Export completed', {
      userId,
      mode: useMock ? 'mock' : 'real',
      rowsInserted: result.rowsInserted
    });

    res.json(result);

  } catch (error) {
    logger.error('Export handler error', { error: error.message });
    res.status(500).json({
      error: 'Export failed',
      message: error.message
    });
  }
}

module.exports = {
  exportHandler,
  exportToSnowflakeMock,
  exportToSnowflakeReal
};

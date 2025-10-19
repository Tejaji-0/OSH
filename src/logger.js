const pino = require('pino');

const isProd = process.env.NODE_ENV === 'production';
let transport;
if (!isProd) {
  try {
    // optional pretty transport for dev; ignore if not installed
    // eslint-disable-next-line global-require
    require.resolve('pino-pretty');
    transport = { target: 'pino-pretty', options: { colorize: true } };
  } catch (_) {
    transport = undefined;
  }
}

const logger = pino({ level: isProd ? 'info' : 'debug', transport });

module.exports = logger;

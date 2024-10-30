/*
---- WINSTON LOGGER ----
Winston logger is a generic JavaScript logger.
We can use it to log events and errors that happen on the backend.
It's possible to edit the logging formats and the logging levels.
NPM: https://www.npmjs.com/package//winston
*/
import { createLogger, format, transports } from 'winston';
// const LEVEL = 'level';

// Modifying the log for easier reading
const customFormat = format.combine(
  format.timestamp({ format: 'YYYYMMDD|HH:mm:ss' }),
  format.splat(),
  format.printf((info) => {
    return `${info.timestamp}|${info.level.toLocaleUpperCase()}|${
      info.message
    }`;
  }),
);

// Which log levels we want to show / see
function filterOnly(level: string) {
  const LEVEL = 'level';
  return format((info, http) => {
    if (info[LEVEL] === level) {
      return info;
    }
    if (http[LEVEL] === level) {
      return http;
    }
  })();
}

const logger = createLogger({
  format: customFormat,
  transports: [
    new transports.Console({ level: 'silly' }),
    // Chooses where to save each log.
    new transports.File({
      filename: './logs/app.log',
      level: 'verbose',
    }),
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    new transports.File({
      filename: './logs/http.log',
      level: 'http',
      format: filterOnly('http'),
    }),
  ],
});

export default logger;

'use strict';

let fs = require('fs'),
  path = require('path'),
  moment = require('moment'),
  CronJob = require('cron').CronJob,
  globalConfig = require('../../../config'),
  rotateFile = require('winston-daily-rotate-file');

let config,
  cronTask;

module.exports = {
  winstonTransport: rotateFile,
  configure: configure,
  get: get,
  getAll: getAll
};

function getLogFilesData (files, filenameStart, expirationDays) {
  let filenameStartLength = filenameStart.length;
  let expiration = expirationDays && moment().subtract(expirationDays, 'days');
  return files
    .reduce((filesData, filename) => {
      if (filename.startsWith(filenameStart)) {
        let dateString = filename.slice(filenameStartLength);
        let momentDate = moment(dateString, config.nodetoConfig.momentPattern, true);

        if (momentDate.isValid()) {

          if (!expiration || expiration.isAfter(momentDate)) {
            filesData.push({
              filename: filename,
              momentDate: momentDate,
              key: dateString
            });
          }
        }

      }

      return filesData;
    }, []);
}

function getAll () {
  return new Promise((resolve, reject) => {
    if (!config) {
      return reject({
        message: 'The logger was not configured yet.',
        code: 'BADREQUEST'
      });
    }

    fs.readdir(path.dirname(config.winstonConfig.filename), (err, files) => {
      if (err) {
        return reject(err);
      }

      if (!files || !files.length) {
        return resolve([]);
      }

      let filenameStart = path.basename(config.winstonConfig.filename);

      let toReturn = getLogFilesData(files, filenameStart)
        .sort((a, b) => {
          return a.momentDate.isBefore(b.momentDate);
        })
        .map(fileData => {
          return {
            key: fileData.key,
            label: fileData.momentDate.format(globalConfig.configuration.regional.dateFormat)
          };
        });

      return resolve(toReturn);
    });

  });
}

function get (key) {
  return new Promise((resolve, reject) => {
    if (!config) {
      return reject({
        message: 'The logger was not configured yet.',
        code: 'BADREQUEST'
      });
    }

    let momentDate = moment(key, config.nodetoConfig.momentPattern, true);
    if (!momentDate.isValid()) {
      return reject({
        message: 'Invalid log key.',
        code: 'BADREQUEST'
      });
    }

    fs.readFile(config.winstonConfig.filename + key, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve({
        key: key,
        label: momentDate.format(globalConfig.configuration.regional.dateFormat),
        logs: data
          .split(/\r?\n/)
          .filter(line => line.trim())
          .map(line => JSON.parse(line))
      });
    });

  });
}

function configure (configuration) {
  config = configuration;
  if (!cronTask && globalConfig.configuration.logging.cleaningSchedule) {
    cronTask = new CronJob(globalConfig.configuration.logging.cleaningSchedule, deleteOldFiles).start();
  }
}

function deleteOldFiles () {
  if (!config) {
    return;
  }

  let dirname = path.dirname(config.winstonConfig.filename);
  log('info', 'Removing log files longer than ' + globalConfig.configuration.logging.expirationDays + ' days');
  fs.readdir(dirname, (err, files) => {
    if (err) {
      log('error', 'Error reading log files folder ' + dirname, err);
      return;
    }

    let basename = path.basename(config.winstonConfig.filename);
    let logFiles = getLogFilesData(files, basename, globalConfig.configuration.logging.expirationDays);

    logFiles
      .forEach(logFile => logFile.filename = dirname + '/' + logFile.filename);

    if (logFiles.length) {
      log('info', logFiles.length + ' old log files to remove');

      let logFilesPromises = logFiles.map(logFile => {
        return new Promise((resolve, reject) => {
          fs.unlink(logFile.filename, err => {
            if (err) {
              log('error', 'Error removing log file ' + logFile.filename, JSON.stringify(err));
              return reject();
            }
            resolve();
          });
        });
      });

      Promise.all(logFilesPromises)
        .then(() => log('info', 'Log files removed successfully'));
    } else {
      log('info', 'No old log files to remove');
    }
  });
}

function log (level, text, metadata) {
  return config && config.logMethod && config.logMethod(level, text, metadata);
}
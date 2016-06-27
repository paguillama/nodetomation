'use strict';

var fs = require('fs'),
    path = require('path'),
    moment = require('moment'),
    CronJob = require('cron').CronJob,
    globalConfig = require('../../../config'),
    rotateFile = require('winston-daily-rotate-file');

var config = void 0,
    cronTask = void 0;

module.exports = {
  winstonTransport: rotateFile,
  configure: configure,
  get: get,
  getAll: getAll
};

function getLogFilesData(files, filenameStart, expirationDays) {
  var filenameStartLength = filenameStart.length;
  var expiration = expirationDays && moment().subtract(expirationDays, 'days');
  return files.reduce(function (filesData, filename) {
    if (filename.startsWith(filenameStart)) {
      var dateString = filename.slice(filenameStartLength);
      var momentDate = moment(dateString, config.nodetoConfig.momentPattern, true);

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

function getAll() {
  return new Promise(function (resolve, reject) {
    if (!config) {
      return reject({
        message: 'The logger was not configured yet.',
        code: 'BADREQUEST'
      });
    }

    fs.readdir(path.dirname(config.winstonConfig.filename), function (err, files) {
      if (err) {
        return reject(err);
      }

      if (!files || !files.length) {
        return resolve([]);
      }

      var filenameStart = path.basename(config.winstonConfig.filename);

      var toReturn = getLogFilesData(files, filenameStart).sort(function (a, b) {
        return a.momentDate.isBefore(b.momentDate);
      }).map(function (fileData) {
        return {
          key: fileData.key,
          label: fileData.momentDate.format(globalConfig.configuration.regional.dateFormat)
        };
      });

      return resolve(toReturn);
    });
  });
}

function get(key) {
  return new Promise(function (resolve, reject) {
    if (!config) {
      return reject({
        message: 'The logger was not configured yet.',
        code: 'BADREQUEST'
      });
    }

    var momentDate = moment(key, config.nodetoConfig.momentPattern, true);
    if (!momentDate.isValid()) {
      return reject({
        message: 'Invalid log key.',
        code: 'BADREQUEST'
      });
    }

    fs.readFile(config.winstonConfig.filename + key, 'utf8', function (err, data) {
      if (err) {
        return reject(err);
      }
      resolve({
        key: key,
        label: momentDate.format(globalConfig.configuration.regional.dateFormat),
        logs: data.split(/\r?\n/).filter(function (line) {
          return line.trim();
        }).map(function (line) {
          return JSON.parse(line);
        })
      });
    });
  });
}

function configure(configuration) {
  config = configuration;
  if (!cronTask && globalConfig.configuration.logging.cleaningSchedule) {
    cronTask = new CronJob(globalConfig.configuration.logging.cleaningSchedule, deleteOldFiles).start();
  }
}

function deleteOldFiles() {
  if (!config) {
    return;
  }

  var dirname = path.dirname(config.winstonConfig.filename);
  log('info', 'Removing log files longer than ' + globalConfig.configuration.logging.expirationDays + ' days');
  fs.readdir(dirname, function (err, files) {
    if (err) {
      log('error', 'Error reading log files folder ' + dirname, err);
      return;
    }

    var basename = path.basename(config.winstonConfig.filename);
    var logFiles = getLogFilesData(files, basename, globalConfig.configuration.logging.expirationDays);

    logFiles.forEach(function (logFile) {
      return logFile.filename = dirname + '/' + logFile.filename;
    });

    if (logFiles.length) {
      log('info', logFiles.length + ' old log files to remove');

      var logFilesPromises = logFiles.map(function (logFile) {
        return new Promise(function (resolve, reject) {
          fs.unlink(logFile.filename, function (err) {
            if (err) {
              log('error', 'Error removing log file ' + logFile.filename, JSON.stringify(err));
              return reject();
            }
            resolve();
          });
        });
      });

      Promise.all(logFilesPromises).then(function () {
        return log('info', 'Log files removed successfully');
      });
    } else {
      log('info', 'No old log files to remove');
    }
  });
}

function log(level, text, metadata) {
  return config && config.logMethod && config.logMethod(level, text, metadata);
}
//# sourceMappingURL=rotate-file.js.map

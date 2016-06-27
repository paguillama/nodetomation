'use strict';

var path = require('path');

var buildConfig = require('../../../build.config');

var settings = {
  default: {
    dataAccess: {
      host: 'mongodb://localhost:27017/nodetomation-db'
    },
    routing: {
      apiBaseUrl: '/api',
      streamingBaseUrl: '/streaming'
    },
    logging: {
      expirationDays: 7,
      cleaningSchedule: '0 0 1 * * 7'
    },
    regional: {
      dateFormat: 'YYYY-MM-DD',
      instantTimeFormat: 'HH:mm:ss.SSS',
      units: {
        temperature: 'celsius'
      }
    }
  },
  development: {
    auth: {
      secret: 'M?*HX{?xe0"9|\'k[\'8v_:s28F&)vc3',
      salt: 'JZq<&!9GO-!FEPPp|2Me>i]2j0ZrpK'
    },
    shutdown: {
      username: 'pi',
      password: 'raspberry'
    },
    routing: {
      staticPath: '../../' + buildConfig.webClient.build_dir
    },
    logging: {
      transports: [{
        type: 'rotate-file',
        winstonConfig: {
          level: 'debug',
          datePattern: 'yyyy-MM-dd',
          filename: path.join(buildConfig.server.dist_dir, '..', 'logs', 'nodetomation.log.')
        },
        nodetoConfig: {
          momentPattern: 'YYYY-MM-DD',
          timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
        }
      }, {
        type: 'console',
        winstonConfig: {
          level: 'debug'
        }
      }]
    }
  },
  production: {
    auth: {
      secret: process.env.NODETO_AUTH_SECRET,
      salt: process.env.NODETO_AUTH_SALT
    },
    shutdown: {
      username: process.env.NODETO_SHUTDOWN_USERNAME,
      password: process.env.NODETO_SHUTDOWN_PASSWORD
    },
    routing: {
      staticPath: '../../' + buildConfig.webClient.dist_dir
    },
    logging: {
      transports: [{
        type: 'rotate-file',
        winstonConfig: {
          level: 'debug',
          datePattern: 'yyyy-MM-dd',
          filename: path.join(buildConfig.server.dist_dir, '..', 'logs', 'nodetomation.log.')
        },
        nodetoConfig: {
          momentPattern: 'YYYY-MM-DD',
          timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
        }
      }]
    }
  }
};

module.exports = settings;
//# sourceMappingURL=settings.js.map

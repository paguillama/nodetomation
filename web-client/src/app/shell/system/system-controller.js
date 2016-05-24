import moment from 'moment';

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export default class NodetoSystemController {
  constructor($scope, $timeout, NodetoSystemService, NodetoLogsService) {
    this.NodetoLogsService = NodetoLogsService;
    this.$timeout = $timeout;

    this.shutdown = () => NodetoSystemService.shutdown();

    NodetoSystemService.getStatus().then(status => {
      this.status = status;
      this.systemTime = moment.parseZone(status.systemTime);
      this.refresh();
    });

    $scope.$on('$destroy', () => {
      if (this.clockTimeout) {
        $timeout.cancel(this.clockTimeout);
      }
    });

    NodetoLogsService.getAll()
      .then(logs => {
        this.logs = logs;
        this.logIndex = 0;
        this.nextDisabled = this.logIndex === this.logs.length - 1;
        this.getLog();
      });

    this.logIndex = 1;
  }

  nextLog () {
    if (this.logIndex < this.logs.length - 1) {
      this.logIndex++;
      this.nextDisabled = this.logIndex === this.logs.length - 1;
      this.getLog();
    }
  }

  previousLog () {
    if (this.logIndex > 0) {
      this.logIndex--;
      this.nextDisabled = false;
      this.getLog();
    }
  }

  getLog() {
    this.NodetoLogsService
      .get(this.logs[this.logIndex].key)
      .then(logData => this.log = logData);
  }

  refresh () {
    this.systemTime.add(1, 'second');
    this.status.formattedTime = this.systemTime.format(TIME_FORMAT);
    this.clockTimeout = this.$timeout(() => this.refresh(), 1000);
  }
}
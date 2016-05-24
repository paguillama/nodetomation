export default class NodetoSchedulesController {
  constructor (NodetoScheduleService, NodetoMessageService) {
    this.NodetoScheduleService = NodetoScheduleService;
    this.NodetoMessageService = NodetoMessageService;

    this.refreshSchedules();
  }

  refreshSchedules() {
    this.NodetoScheduleService.getAll()
      .then(schedules => this.schedules = schedules);
  }

  updateSchedule(schedule) {
    this.NodetoScheduleService.update(schedule).then(() => {
      this.NodetoMessageService.add('Schedule updated');
      this.refreshSchedules();
    });
  }

  removeSchedule (scheduleKey) {
    this.NodetoScheduleService.remove(scheduleKey).then(() => {
      this.NodetoMessageService.add('Schedule removed');
      this.refreshSchedules();
    });
  }
}
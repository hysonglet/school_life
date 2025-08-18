

function indexToWeekDay(index) {
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  return weekDays[index];
}

module.exports = {
  indexToWeekDay: indexToWeekDay
}
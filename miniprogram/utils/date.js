
/**
 * 根据 * @param {String} startDate 学期开始日期，格式为 'YYYY-MM-DD'
 * @param {Number} weekNum 第N周（从1开始）
 * @param {Boolean} weekStartsOnMonday 是否以周一为一周的开始（默认true）
 * @returns {Object} 包含该周开始和结束日期的对象
 */
function getWeekDate(startDate, weekNum, weekStartsOnMonday = true) {
  // 解析开始日期
  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    throw new Error('无效的开始日期格式，请使用 "YYYY-MM-DD"');
  }

  // 计算第N周的起始日期（第1周从开始日期所在周算起）
  // 1. 计算开始日期是周几（0=周日，6=周六）
  let startDay = start.getDay();
  
  // 2. 调整为以周一为一周的第一天（如果需要）
  if (weekStartsOnMonday) {
    // 周一到周日分别对应 0-6
    startDay = startDay === 0 ? 6 : startDay - 1;
  }

  // 3. 计算第1周的第一天（周几）
  const firstWeekFirstDay = new Date(start);
  firstWeekFirstDay.setDate(start.getDate() - startDay);

  // 4. 计算第N周的第一天（第1周加 (N-1)*7 天）
  const targetWeekFirstDay = new Date(firstWeekFirstDay);
  targetWeekFirstDay.setDate(firstWeekFirstDay.getDate() + (weekNum - 1) * 7);

  // 5. 计算第N周的最后一天（加6天）
  const targetWeekLastDay = new Date(targetWeekFirstDay);
  targetWeekLastDay.setDate(targetWeekFirstDay.getDate() + 6);

  // // 格式化日期为 'YYYY-MM-DD'
  // const format = (date) => {
  //   return [
  //     date.getFullYear(),
  //     String(date.getMonth() + 1).padStart(2, '0'),
  //     String(date.getDate()).padStart(2, '0')
  //   ].join('-');
  // };

  let rst = Array.from({
    length: 7
  },
  (_, i) => {
    const first = new Date(targetWeekFirstDay);
    first.setDate(targetWeekFirstDay.getDate() + i);
    return first;
  });

  return rst;
}

/**
 * 根据日期获取星期几
 * @param {string|Date} date 目标日期（如 '2025-08-17' 或 Date 对象）
 * @returns {string} 星期几
 */
function getWeekday(date) {
  // 处理输入为字符串的情况，转换为 Date 对象
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  // 验证日期有效性
  if (isNaN(targetDate.getTime())) {
    throw new Error('无效的日期格式');
  }
  
  // 获取 0-6 的数字（0=周日，6=周六）
  const dayNum = targetDate.getDay();
  
  // 映射为星期名称
  const chineseWeekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return chineseWeekdays[dayNum];
}

/**
 * 根据起始日期计算目标日期是第几周
 * @param {string} startDateStr - 起始日期（格式：yyyy-mm-dd，如 "2024-09-01"）
 * @param {string} targetDateStr - 目标日期（格式同上）
 * @returns {number} 目标日期相对于起始日期的周数（起始日期为第1周）
 */
function getWeekNumber(startDateStr, targetDateStr) {
  // 1. 转换为Date对象（处理无效日期）
  const startDate = new Date(startDateStr);
  const targetDate = new Date(targetDateStr);
  if (isNaN(startDate.getTime()) || isNaN(targetDate.getTime())) {
    throw new Error("日期格式错误，请使用 yyyy-mm-dd 格式");
  }

  // 2. 计算UTC时间差（避免时区偏移导致的日期偏差）
  // 仅保留年月日，忽略时分秒（统一按UTC的0点计算）
  const startUTC = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const targetUTC = Date.UTC(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  // 3. 计算天数差（毫秒差 → 天数）
  const dayDiff = Math.floor((targetUTC - startUTC) / (1000 * 60 * 60 * 24));

  // 4. 处理目标日期在起始日期之前的情况（返回0或负数，根据需求调整）
  if (dayDiff < 0) {
    return 0; // 或 return Math.floor(dayDiff / 7) - 1;（负周数）
  }

  // 5. 计算周数：天数差 ÷7 取整后 +1（起始日期为第1周）
  return Math.floor(dayDiff / 7) + 1;
}

function indexToWeekDay(index) {
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  return weekDays[index];
}

module.exports = {
  getWeekDate: getWeekDate,
  getWeekday: getWeekday,
  getWeekNumber: getWeekNumber,
  indexToWeekDay: indexToWeekDay,
}
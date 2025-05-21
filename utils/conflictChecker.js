module.exports = function isOverlapping(bookings, start, end) {
  return bookings.some(b => {
    const existingStart = new Date(b.startTime);
    const existingEnd = new Date(b.endTime);
    return start < existingEnd && end > existingStart;
  });
};

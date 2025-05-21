const express = require('express');
const app = express();
app.use(express.json());

let bookings = [];
let nextId = 1;

// Helper: Check if two time intervals overlap
function isOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

// GET /bookings - get all bookings
app.get('/bookings', (req, res) => {
  res.json(bookings);
});

// GET /bookings/:id - get booking by id
app.get('/bookings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const booking = bookings.find(b => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
});

// POST /bookings - create a new booking with conflict check
app.post('/bookings', (req, res) => {
  const { userId, startTime, endTime } = req.body;

  // Validate inputs
  if (!userId || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start) || isNaN(end) || start >= end) {
    return res.status(400).json({ error: 'Invalid startTime or endTime' });
  }

  // Conflict check: ensure no overlap with existing bookings
  const conflict = bookings.some(b =>
    isOverlap(start, end, new Date(b.startTime), new Date(b.endTime))
  );

  if (conflict) {
    return res.status(409).json({ error: 'Booking time conflicts with existing booking' });
  }

  const newBooking = {
    id: nextId++,
    userId,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// PUT /bookings/:id - update a booking with conflict check
app.put('/bookings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookingIndex = bookings.findIndex(b => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const { userId, startTime, endTime } = req.body;

  if (!userId || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start) || isNaN(end) || start >= end) {
    return res.status(400).json({ error: 'Invalid startTime or endTime' });
  }

  // Conflict check excluding current booking
  const conflict = bookings.some((b) =>
    b.id !== id && isOverlap(start, end, new Date(b.startTime), new Date(b.endTime))
  );

  if (conflict) {
    return res.status(409).json({ error: 'Booking time conflicts with existing booking' });
  }

  bookings[bookingIndex] = {
    id,
    userId,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };

  res.json(bookings[bookingIndex]);
});

// DELETE /bookings/:id - delete a booking
app.delete('/bookings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookingIndex = bookings.findIndex(b => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  bookings.splice(bookingIndex, 1);
  res.status(204).send();
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

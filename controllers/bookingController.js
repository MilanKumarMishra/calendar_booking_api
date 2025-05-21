let bookings = []; // In-memory storage for simplicity

// Create a booking
exports.createBooking = (req, res) => {
  const { userId, roomId, startTime, endTime, title } = req.body;

  if (!userId || !roomId || !startTime || !endTime || !title) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newBooking = {
    id: Date.now().toString(),
    userId,
    roomId,
    startTime,
    endTime,
    title,
  };

  bookings.push(newBooking);
  res.status(201).json(newBooking);
};

// Get all bookings
exports.getBookings = (req, res) => {
  res.status(200).json(bookings);
};

// Update a booking
exports.updateBooking = (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, title } = req.body;

  const bookingIndex = bookings.findIndex((b) => b.id === id);
  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking not found." });
  }

  bookings[bookingIndex] = {
    ...bookings[bookingIndex],
    startTime,
    endTime,
    title,
  };

  res.status(200).json(bookings[bookingIndex]);
};

// Delete a booking
exports.deleteBooking = (req, res) => {
  const { id } = req.params;
  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking not found." });
  }

  bookings.splice(bookingIndex, 1);
  res.status(204).send();
};

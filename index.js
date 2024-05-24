const express = require("express");
const app = express();
app.use(express.json());
require('dotenv').config();
const PORT = 8000;

// Define facility configurations
const facilities = {
  "clubhouse": [
    { start: 10, end: 16, rate: 100 },
    { start: 16, end: 22, rate: 500 }
  ],
  "tennis_court": [
    { start: 0, end: 24, rate: 50 }
  ]
};

// In-memory storage for bookings
const bookings = {};

// Utility function to calculate booking cost
const calculateCost = (facility, startHour, endHour) => {
  const slots = facilities[facility];
  let totalCost = 0;

  for (let i = startHour; i < endHour; i++) {
    for (const slot of slots) {
      if (i >= slot.start && i < slot.end) {
        totalCost += slot.rate;
      }
    }
  }

  return totalCost;
};

// Utility function to check availability
const isAvailable = (facility, date, startHour, endHour) => {
  if (!bookings[facility] || !bookings[facility][date]) {
    return true;
  }

  const bookedSlots = bookings[facility][date];
  for (let i = startHour; i < endHour; i++) {
    if (bookedSlots[i]) {
      return false;
    }
  }

  return true;
};

// Endpoint to handle booking requests
app.post("/book", (req, res) => {
  const { facility, date, startHour, endHour } = req.body;

  if (!facilities[facility]) {
    return res.status(400).send("Invalid facility");
  }

  if (!isAvailable(facility, date, startHour, endHour)) {
    return res.send(`Booking Failed, Already Booked`);
  }

  if (!bookings[facility]) {
    bookings[facility] = {};
  }

  if (!bookings[facility][date]) {
    bookings[facility][date] = {};
  }

  for (let i = startHour; i < endHour; i++) {
    bookings[facility][date][i] = true;
  }

  const cost = calculateCost(facility, startHour, endHour);
  res.send(`Booked, Rs. ${cost}`);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(process.env.NODE_ENV)
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { app, bookings }; // Exporting app and bookings object

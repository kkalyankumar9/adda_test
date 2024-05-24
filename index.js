const express = require("express");
const app = express();
app.use(express.json());
require('dotenv').config();
const PORT = 8000;

class BookingSystem {
  constructor() {
    this.facilities = {
      "Clubhouse": [
        { start: 10, end: 16, rate: 100 },
        { start: 16, end: 22, rate: 500 }
      ],
      "Tennis Court": [
        { start: 0, end: 24, rate: 50 }
      ]
    };
    this.bookings = {};
  }

  calculateCost(facility, startHour, endHour) {
    const slots = this.facilities[facility];
    let totalCost = 0;

    for (let i = startHour; i < endHour; i++) {
      for (const slot of slots) {
        if (i >= slot.start && i < slot.end) {
          totalCost += slot.rate;
        }
      }
    }

    return totalCost;
  }

  isAvailable(facility, date, startHour, endHour) {
    if (!this.bookings[facility] || !this.bookings[facility][date]) {
      return true;
    }

    const bookedSlots = this.bookings[facility][date];
    for (let i = startHour; i < endHour; i++) {
      if (bookedSlots[i]) {
        return false;
      }
    }

    return true;
  }

  bookFacility(facility, date, startHour, endHour) {
    if (!this.facilities[facility]) {
      return "Invalid facility";
    }

    if (!this.isAvailable(facility, date, startHour, endHour)) {
      return "Booking Failed, Already Booked";
    }

    if (!this.bookings[facility]) {
      this.bookings[facility] = {};
    }

    if (!this.bookings[facility][date]) {
      this.bookings[facility][date] = {};
    }

    for (let i = startHour; i < endHour; i++) {
      this.bookings[facility][date][i] = true;
    }

    const cost = this.calculateCost(facility, startHour, endHour);
    return `Booked, Rs. ${cost}`;
  }
}

// Create an instance of the BookingSystem class
const bookingSystem = new BookingSystem();

// Endpoint to handle booking requests
app.post("/book", (req, res) => {
  const { facility, date, startHour, endHour } = req.body;

  if (!bookingSystem.facilities[facility]) { 
    return res.status(400).send("Invalid facility"); 
  }
  
  const result = bookingSystem.bookFacility(facility, date, startHour, endHour);
  res.send(result);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
   
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { app, bookingSystem }; 

const readline = require("readline");

class BookingSystem {
  constructor() {
    this.facilities = {
      Clubhouse: [
        { start: 10, end: 16, rate: 100 },
        { start: 16, end: 22, rate: 500 },
      ],
      "Tennis Court": [{ start: 0, end: 24, rate: 50 }],
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

  async bookFacility() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question("Enter facility name: ", (facility) => {
        if (!this.facilities[facility]) {
          console.log("Invalid facility");
          rl.close();
          resolve("Invalid facility");
          return;
        }

        rl.question("Enter date (YYYY-MM-DD): ", (date) => {
          if (!this.isValidDateFormat(date)) {
            console.log(
              "Invalid date format. Please enter date in YYYY-MM-DD format."
            );
            rl.close();
            resolve("Invalid date format");
            return;
          }

          const currentDate = new Date();
          const inputDate = new Date(date);

          if (inputDate <= currentDate) {
            console.log("Date must be greater than the current date");
            rl.close();
            resolve("Date must be greater than the current date");
            return;
          }

          rl.question("Enter start hour: ", (startHour) => {
            startHour = parseInt(startHour);
            if (!this.isValidHour(startHour)) {
              console.log("Invalid start hour");
              rl.close();
              resolve("Invalid start hour");
              return;
            }

            rl.question("Enter end hour: ", (endHour) => {
              endHour = parseInt(endHour);
              if (!this.isValidHour(endHour) || endHour <= startHour) {
                console.log(
                  "Invalid end hour or end hour must be greater than start hour"
                );
                rl.close();
                resolve(
                  "Invalid end hour or end hour must be greater than start hour"
                );
                return;
              }

              const result = this.bookFacilitySync(
                facility,
                date,
                startHour,
                endHour
              );
              rl.close();
              resolve(result);
            });
          });
        });
      });
    });
  }

  bookFacilitySync(facility, date, startHour, endHour) {
    if (!this.facilities[facility]) {
      return "Invalid facility";
    }

    if (
      !this.isValidDateFormat(date) ||
      !this.isValidHour(startHour) ||
      !this.isValidHour(endHour) ||
      endHour <= startHour
    ) {
      return "Invalid input";
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

  isValidDateFormat(dateString) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dateString);
  }

  isValidHour(hour) {
    return Number.isInteger(hour) && hour >= 0 && hour < 24;
  }
}

module.exports = BookingSystem;

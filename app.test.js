// app.test.js
const BookingSystem = require("./index.js");

describe("BookingSystem", () => {
  let bookingSystem;

  beforeEach(() => {
    bookingSystem = new BookingSystem();
  });

  it('should return "Booked, Rs. 200" if booking is successful', async () => {
    const result = await bookingSystem.bookFacilitySync(
      "Clubhouse",
      "2024-12-01",
      10,
      12
    );
    expect(result).toBe("Booked, Rs. 200");
  });

  it('should return "Invalid facility" if facility is invalid', async () => {
    const result = await bookingSystem.bookFacilitySync(
      "Invalid Facility",
      "2024-12-01",
      10,
      12
    );
    expect(result).toBe("Invalid facility");
  });
});

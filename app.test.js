const request = require('supertest');
const { app, bookingSystem } = require('./index');

describe('POST /book', () => {
  beforeEach(() => {
    // Clear the bookings object before each test
    for (let key in bookingSystem.bookings) {
      delete bookingSystem.bookings[key];
    }
  });

  it('should book a facility if available', async () => {
    const response = await request(app)
      .post('/book')
      .send({ facility: 'clubhouse', date: '2023-12-01', startHour: 10, endHour: 12 });
    expect(response.text).toBe('Booked, Rs. 200');
  });

  it('should return an error if facility is invalid', async () => {
    const response = await request(app)
      .post('/book')
      .send({ facility: 'invalid_facility', date: '2023-12-01', startHour: 10, endHour: 12 });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid facility');
  });

  it('should return an error if facility is already booked', async () => {
    await request(app)
      .post('/book')
      .send({ facility: 'clubhouse', date: '2023-12-01', startHour: 10, endHour: 12 });
    const response = await request(app)
      .post('/book')
      .send({ facility: 'clubhouse', date: '2023-12-01', startHour: 11, endHour: 13 });
    expect(response.text).toBe('Booking Failed, Already Booked');
  });

  it('should calculate the correct cost for a booking', async () => {
    const response = await request(app)
      .post('/book')
      .send({ facility: 'clubhouse', date: '2023-12-01', startHour: 16, endHour: 18 });
    expect(response.text).toBe('Booked, Rs. 1000');
  });
});

const BookingSystem = require('./index');

const bookingSystem = new BookingSystem();

bookingSystem.bookFacility()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });

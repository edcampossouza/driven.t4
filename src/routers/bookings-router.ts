import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas/bookings-schemas';
import { postBooking, getBooking, putBooking } from '@/controllers/booking-controllers';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(bookingSchema), postBooking)
  .get('/', getBooking)
  .put('/', validateBody(bookingSchema), putBooking);
export { bookingsRouter };

import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas/bookings-schemas';
import { postBooking } from '@/controllers/booking-controllers';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).post('/', validateBody(bookingSchema), postBooking);
export { bookingsRouter };

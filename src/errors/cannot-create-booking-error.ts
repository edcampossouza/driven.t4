import { ApplicationError } from '@/protocols';

export function cannotCreateBooking(message = 'Cannot create booking'): ApplicationError {
  return {
    name: 'CannotCreateBookingError',
    message,
  };
}

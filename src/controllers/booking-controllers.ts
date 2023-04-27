import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/booking-service';

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const roomId = Number(req.body.roomId);
    const result = await bookingsService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const result = await bookingsService.getBookingByUserId(userId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const roomId = Number(req.body.roomId);
    const bookingId = Number(req.params.bookingId);
    const result = await bookingsService.updateBooking(userId, bookingId, roomId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}

import { Room } from '@prisma/client';
import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError, cannotCreateBooking } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';

async function createBooking(userId: number, roomId: number): Promise<{ bookingId: number }> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw cannotCreateBooking('No enrollment found for user');
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotCreateBooking('Invalid ticket');
  }

  const room = await hotelRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }

  if (!(room.capacity > room.occupied)) {
    throw cannotCreateBooking('No vancancies for selected room');
  }

  const booking = await hotelRepository.bookRoom(userId, roomId);

  return { bookingId: booking.id };
}

async function getBookingByUserId(userId: number): Promise<{ id: number; Room: Room }> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const result = await hotelRepository.getBookingByUserId(userId);
  if (!result) throw notFoundError();
  return result;
}

async function updateBooking(userId: number, roomId: number): Promise<{ bookingId: number }> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw cannotCreateBooking('No enrollment found for user');
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotCreateBooking('Invalid ticket');
  }

  const booking = await hotelRepository.getBookingByUserId(userId);
  if (!booking) throw cannotCreateBooking('No previous booking');
  const newRoom = await hotelRepository.findRoomById(roomId);
  if (!newRoom) throw notFoundError();
  if (!(newRoom.occupied < newRoom.capacity)) throw cannotCreateBooking('No vancancies for selected room');

  await hotelRepository.updateBookingRoom(booking.id, newRoom.id);

  return { bookingId: booking.id };
}

export default {
  createBooking,
  getBookingByUserId,
  updateBooking,
};

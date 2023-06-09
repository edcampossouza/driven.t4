import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

// returns the room information and the number of occupied spots
async function findRoomById(roomId: number): Promise<Room & { occupied: number }> {
  const occupied = await prisma.booking.count({
    where: {
      roomId,
    },
  });

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  return room ? { ...room, occupied } : null;
}

async function bookRoom(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function getBookingByUserId(userId: number): Promise<{ Room: Room; id: number }> {
  const booking = await prisma.booking.findFirst({ select: { id: true, Room: true }, where: { userId } });

  return booking;
}

async function getBookingById(bookingId: number): Promise<{ Room: Room; id: number }> {
  const booking = await prisma.booking.findFirst({ select: { id: true, Room: true }, where: { id: bookingId } });

  return booking;
}

async function updateBookingRoom(bookingId: number, roomId: number): Promise<void> {
  await prisma.booking.update({ where: { id: bookingId }, data: { roomId } });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findRoomById,
  bookRoom,
  getBookingByUserId,
  updateBookingRoom,
  getBookingById,
};

export default hotelRepository;

import faker from '@faker-js/faker';
import { Room } from '@prisma/client';
import { prisma } from '@/config';

//Sabe criar objetos - Hotel do banco
export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number, room: Partial<Room> = {}) {
  return prisma.room.create({
    data: {
      name: room.name || '1020',
      capacity: room.capacity === undefined ? faker.datatype.number({ min: 1, precision: 1 }) : room.capacity,
      hotelId: hotelId,
    },
  });
}

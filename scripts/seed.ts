import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create a sample user
  const user = await prisma.user.create({
    data: {
      clerkId: 'user_35yGoVifKa2eaJ1vL4540dbNNmW',
      email: 'devcompulink@gmail.com',
      firstName: 'Spuer',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
    },
  })

  // Create a sample merchant
  const merchant = await prisma.merchant.create({
    data: {
      clerkId: 'sample_merchant_1-2',
      email: 'lloydm@compulink.co.zw',
      businessName: 'Musika',
      role: 'MERCHANT',
    },
  })

  // Create a sample place
  const place = await prisma.place.create({
    data: {
      name: 'The Urban Grill House',
      description: 'A modern grill house offering premium steaks and craft beers',
      type: 'GRILL_PUB',
      address: '123 City Center, Harare',
      coordinates: { lat: -17.824858, lng: 31.053028 },
      phone: '+263 123 456 789',
      priceRange: 'MEDIUM',
      merchantId: merchant.id,
      images: {
        create: [
          {
            url: '/api/placeholder/400/300',
            alt: 'Urban Grill House',
            order: 0,
          },
        ],
      },
      amenities: {
        create: [
          { name: 'Live Music' },
          { name: 'Outdoor Seating' },
          { name: 'WiFi' },
        ],
      },
      hours: {
        create: [
          { day: 'Monday', openTime: '11:00', closeTime: '23:00' },
          { day: 'Tuesday', openTime: '11:00', closeTime: '23:00' },
          { day: 'Wednesday', openTime: '11:00', closeTime: '23:00' },
          { day: 'Thursday', openTime: '11:00', closeTime: '00:00' },
          { day: 'Friday', openTime: '11:00', closeTime: '01:00' },
          { day: 'Saturday', openTime: '10:00', closeTime: '01:00' },
          { day: 'Sunday', openTime: '10:00', closeTime: '22:00' },
        ],
      },
    },
  })

  // Create a sample booking
  const booking = await prisma.booking.create({
    data: {
      date: new Date('2024-01-20'),
      time: '19:30',
      guests: 4,
      status: 'CONFIRMED',
      totalAmount: 160.00,
      userId: user.id,
      placeId: place.id,
    },
  })

  // Create a sample review
  const review = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Amazing food and great atmosphere!',
      userId: user.id,
      placeId: place.id,
    },
  })

  console.log('Seeding finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { PrismaClient, UserRole, AuctionStatus, AuctionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.order.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@aligone.com',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      verified: true,
      emailVerified: true,
    },
  });

  console.log('👤 Created admin user');

  // Create regular users
  const userPassword = await bcrypt.hash('password123', 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: userPassword,
        firstName: 'John',
        lastName: 'Doe',
        verified: true,
        emailVerified: true,
        rating: 4.8,
        ratingCount: 25,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        username: 'janesmith',
        password: userPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        verified: true,
        emailVerified: true,
        rating: 4.5,
        ratingCount: 18,
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob.wilson@example.com',
        username: 'bobwilson',
        password: userPassword,
        firstName: 'Bob',
        lastName: 'Wilson',
        verified: false,
        emailVerified: true,
        rating: 4.2,
        ratingCount: 12,
      },
    }),
  ]);

  console.log('👥 Created test users');

  // Create categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      icon: '📱',
    },
  });

  const computers = await prisma.category.create({
    data: {
      name: 'Computers',
      slug: 'computers',
      description: 'Laptops, desktops, and accessories',
      icon: '💻',
      parentId: electronics.id,
    },
  });

  const phones = await prisma.category.create({
    data: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and accessories',
      icon: '📱',
      parentId: electronics.id,
    },
  });

  const fashion = await prisma.category.create({
    data: {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Clothing and accessories',
      icon: '👔',
    },
  });

  const home = await prisma.category.create({
    data: {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home decor and gardening',
      icon: '🏠',
    },
  });

  const sports = await prisma.category.create({
    data: {
      name: 'Sports',
      slug: 'sports',
      description: 'Sports equipment and gear',
      icon: '⚽',
    },
  });

  console.log('📦 Created categories');

  // Create auctions
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const auctions = await Promise.all([
    prisma.auction.create({
      data: {
        title: 'iPhone 14 Pro Max 256GB - Space Black',
        description: 'Brand new iPhone 14 Pro Max in perfect condition. Comes with original box and accessories. Never used, still sealed.',
        type: AuctionType.BOTH,
        status: AuctionStatus.ACTIVE,
        startingPrice: 800,
        currentPrice: 850,
        buyNowPrice: 1200,
        quantity: 1,
        condition: 'New',
        location: 'New York, NY',
        shippingCost: 15,
        shippingInfo: 'Free shipping on orders over $100',
        images: [],
        startDate: now,
        endDate: nextWeek,
        sellerId: users[0].id,
        categoryId: phones.id,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'MacBook Pro 16" M2 Max 32GB RAM 1TB SSD',
        description: 'Excellent condition MacBook Pro with M2 Max chip. Lightly used for 6 months. No scratches or dents. Comes with original charger.',
        type: AuctionType.AUCTION,
        status: AuctionStatus.ACTIVE,
        startingPrice: 2000,
        currentPrice: 2200,
        quantity: 1,
        condition: 'Like New',
        location: 'San Francisco, CA',
        shippingCost: 25,
        images: [],
        startDate: now,
        endDate: nextWeek,
        sellerId: users[1].id,
        categoryId: computers.id,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Sony PlayStation 5 Console + 2 Controllers',
        description: 'PS5 console in great condition with 2 DualSense controllers. Includes all cables and original box.',
        type: AuctionType.BUY_NOW,
        status: AuctionStatus.ACTIVE,
        startingPrice: 500,
        currentPrice: 500,
        buyNowPrice: 550,
        quantity: 1,
        condition: 'Used - Good',
        location: 'Los Angeles, CA',
        shippingCost: 20,
        images: [],
        startDate: now,
        endDate: nextWeek,
        sellerId: users[2].id,
        categoryId: electronics.id,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Vintage Leather Jacket - Size M',
        description: 'Genuine leather jacket from the 90s. Excellent vintage condition. Perfect for collectors.',
        type: AuctionType.AUCTION,
        status: AuctionStatus.ACTIVE,
        startingPrice: 100,
        currentPrice: 150,
        quantity: 1,
        condition: 'Used - Very Good',
        location: 'Chicago, IL',
        shippingCost: 10,
        images: [],
        startDate: now,
        endDate: nextWeek,
        sellerId: users[0].id,
        categoryId: fashion.id,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Modern Office Chair - Ergonomic Design',
        description: 'High-quality ergonomic office chair. Perfect for home office or workspace. Adjustable height and armrests.',
        type: AuctionType.BUY_NOW,
        status: AuctionStatus.ACTIVE,
        startingPrice: 200,
        currentPrice: 200,
        buyNowPrice: 250,
        quantity: 3,
        condition: 'New',
        location: 'Seattle, WA',
        shippingCost: 30,
        images: [],
        startDate: now,
        endDate: nextWeek,
        sellerId: users[1].id,
        categoryId: home.id,
      },
    }),
  ]);

  console.log('🎯 Created auctions');

  // Create some bids
  await Promise.all([
    prisma.bid.create({
      data: {
        auctionId: auctions[0].id,
        bidderId: users[1].id,
        amount: 850,
      },
    }),
    prisma.bid.create({
      data: {
        auctionId: auctions[1].id,
        bidderId: users[0].id,
        amount: 2200,
      },
    }),
    prisma.bid.create({
      data: {
        auctionId: auctions[3].id,
        bidderId: users[2].id,
        amount: 150,
      },
    }),
  ]);

  console.log('💰 Created bids');

  // Create some messages
  await Promise.all([
    prisma.message.create({
      data: {
        senderId: users[0].id,
        receiverId: users[1].id,
        content: 'Hi, is the MacBook still available?',
      },
    }),
    prisma.message.create({
      data: {
        senderId: users[1].id,
        receiverId: users[0].id,
        content: 'Yes, it is! Are you interested?',
        read: true,
      },
    }),
  ]);

  console.log('💬 Created messages');

  // Create some reviews
  await Promise.all([
    prisma.review.create({
      data: {
        reviewerId: users[0].id,
        reviewedId: users[1].id,
        rating: 5,
        comment: 'Great seller! Fast shipping and item as described.',
      },
    }),
    prisma.review.create({
      data: {
        reviewerId: users[1].id,
        reviewedId: users[0].id,
        rating: 4,
        comment: 'Good communication, would buy again.',
      },
    }),
  ]);

  console.log('⭐ Created reviews');

  console.log('✅ Seed completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('Admin: admin@aligone.com / admin123');
  console.log('User 1: john.doe@example.com / password123');
  console.log('User 2: jane.smith@example.com / password123');
  console.log('User 3: bob.wilson@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

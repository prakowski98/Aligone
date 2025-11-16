import { PrismaClient, UserRole, AuctionStatus, AuctionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Rozpoczynam seed...');

  // Czyszczenie istniejących danych
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

  console.log('🧹 Wyczyszczono istniejące dane');

  // Tworzenie użytkownika admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@aligone.pl',
      username: 'admin',
      password: adminPassword,
      firstName: 'Administrator',
      lastName: 'Systemu',
      role: UserRole.ADMIN,
      verified: true,
      emailVerified: true,
      city: 'Warszawa',
      country: 'Polska',
    },
  });

  console.log('👤 Utworzono użytkownika admin');

  // Tworzenie zwykłych użytkowników
  const userPassword = await bcrypt.hash('haslo123', 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'jan.kowalski@example.pl',
        username: 'jankowalski',
        password: userPassword,
        firstName: 'Jan',
        lastName: 'Kowalski',
        verified: true,
        emailVerified: true,
        rating: 4.8,
        ratingCount: 145,
        city: 'Kraków',
        country: 'Polska',
      },
    }),
    prisma.user.create({
      data: {
        email: 'anna.nowak@example.pl',
        username: 'annanowak',
        password: userPassword,
        firstName: 'Anna',
        lastName: 'Nowak',
        verified: true,
        emailVerified: true,
        rating: 4.9,
        ratingCount: 234,
        city: 'Warszawa',
        country: 'Polska',
      },
    }),
    prisma.user.create({
      data: {
        email: 'piotr.wisniewski@example.pl',
        username: 'piotrwisniewski',
        password: userPassword,
        firstName: 'Piotr',
        lastName: 'Wiśniewski',
        verified: true,
        emailVerified: true,
        rating: 4.6,
        ratingCount: 87,
        city: 'Gdańsk',
        country: 'Polska',
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria.lewandowska@example.pl',
        username: 'marialewandowska',
        password: userPassword,
        firstName: 'Maria',
        lastName: 'Lewandowska',
        verified: false,
        emailVerified: true,
        rating: 4.7,
        ratingCount: 56,
        city: 'Poznań',
        country: 'Polska',
      },
    }),
  ]);

  console.log('👥 Utworzono użytkowników testowych');

  // Tworzenie kategorii
  const elektronika = await prisma.category.create({ data: { name: 'Elektronika', slug: 'elektronika', description: 'Telefony, komputery, AGD i RTV', icon: '📱' } });
  const telefony = await prisma.category.create({ data: { name: 'Telefony i akcesoria', slug: 'telefony', description: 'Smartfony, telefony komórkowe i akcesoria', icon: '📱', parentId: elektronika.id } });
  const komputery = await prisma.category.create({ data: { name: 'Komputery', slug: 'komputery', description: 'Laptopy, komputery stacjonarne, tablety', icon: '💻', parentId: elektronika.id } });
  const gaming = await prisma.category.create({ data: { name: 'Konsole i gry', slug: 'konsole-gry', description: 'PlayStation, Xbox, Nintendo, gry', icon: '🎮', parentId: elektronika.id } });
  
  const moda = await prisma.category.create({ data: { name: 'Moda', slug: 'moda', description: 'Odzież, obuwie i dodatki', icon: '👔' } });
  const odziez = await prisma.category.create({ data: { name: 'Odzież', slug: 'odziez', description: 'Ubrania damskie, męskie i dziecięce', icon: '👕', parentId: moda.id } });
  const obuwie = await prisma.category.create({ data: { name: 'Obuwie', slug: 'obuwie', description: 'Buty sportowe, eleganckie, codzienne', icon: '👟', parentId: moda.id } });
  
  const domOgrod = await prisma.category.create({ data: { name: 'Dom i Ogród', slug: 'dom-ogrod', description: 'Meble, dekoracje, narzędzia ogrodowe', icon: '🏠' } });
  const meble = await prisma.category.create({ data: { name: 'Meble', slug: 'meble', description: 'Meble do salonu, sypialni, kuchni', icon: '🛋️', parentId: domOgrod.id } });
  
  const motoryzacja = await prisma.category.create({ data: { name: 'Motoryzacja', slug: 'motoryzacja', description: 'Samochody, motocykle, części', icon: '🚗' } });
  const opony = await prisma.category.create({ data: { name: 'Opony i felgi', slug: 'opony-felgi', description: 'Opony letnie, zimowe, felgi', icon: '⚙️', parentId: motoryzacja.id } });
  
  const sport = await prisma.category.create({ data: { name: 'Sport i turystyka', slug: 'sport-turystyka', description: 'Sprzęt sportowy, rowery, turystyka', icon: '⚽' } });
  const rowery = await prisma.category.create({ data: { name: 'Rowery', slug: 'rowery', description: 'Rowery miejskie, górskie, elektryczne', icon: '🚴', parentId: sport.id } });
  
  const dziecko = await prisma.category.create({ data: { name: 'Dziecko', slug: 'dziecko', description: 'Zabawki, ubranka, wózki', icon: '👶' } });
  const zabawki = await prisma.category.create({ data: { name: 'Zabawki', slug: 'zabawki', description: 'Zabawki dla dzieci w każdym wieku', icon: '🧸', parentId: dziecko.id } });
  
  const kultura = await prisma.category.create({ data: { name: 'Kultura i rozrywka', slug: 'kultura-rozrywka', description: 'Książki, filmy, muzyka', icon: '📚' } });
  const ksiazki = await prisma.category.create({ data: { name: 'Książki i komiksy', slug: 'ksiazki', description: 'Książki, komiksy, audiobooki', icon: '📖', parentId: kultura.id } });
  
  const zwierzeta = await prisma.category.create({ data: { name: 'Zwierzęta', slug: 'zwierzeta', description: 'Karma, akcesoria dla zwierząt', icon: '🐾' } });
  await prisma.category.create({ data: { name: 'Uroda', slug: 'uroda', description: 'Kosmetyki, perfumy, pielęgnacja', icon: '💄' } });
  await prisma.category.create({ data: { name: 'Zdrowie', slug: 'zdrowie', description: 'Suplementy, sprzęt medyczny', icon: '⚕️' } });

  console.log('📦 Utworzono kategorie');

  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Tworzenie aukcji
  const auctions = await Promise.all([
    prisma.auction.create({
      data: {
        title: 'iPhone 14 Pro Max 256GB - Fioletowy - NOWY - Gwarancja Apple',
        description: 'Zupełnie nowy iPhone 14 Pro Max w kolorze Deep Purple.\n\n✓ Oryginalnie zapakowany\n✓ Gwarancja producenta 24 miesiące\n✓ Darmowa dostawa',
        type: AuctionType.BOTH, status: AuctionStatus.ACTIVE,
        startingPrice: 4500, currentPrice: 4850, buyNowPrice: 5499, quantity: 1,
        condition: 'Nowe', location: 'Warszawa, mazowieckie', shippingCost: 0,
        shippingInfo: 'Darmowa dostawa z Allegro Smart!', images: [],
        startDate: now, endDate: nextWeek, sellerId: users[0].id, categoryId: telefony.id, featured: true,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Samsung Galaxy S23 Ultra 512GB - Stan idealny',
        description: 'Samsung Galaxy S23 Ultra w kolorze Phantom Black. Używany 3 miesiące. Stan idealny!',
        type: AuctionType.AUCTION, status: AuctionStatus.ACTIVE,
        startingPrice: 3800, currentPrice: 4200, quantity: 1,
        condition: 'Używane', location: 'Kraków, małopolskie', shippingCost: 15.99,
        images: [], startDate: now, endDate: nextWeek, sellerId: users[1].id, categoryId: telefony.id,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Laptop ASUS ROG Strix G16 i7-13650HX RTX4060 16GB - GAMING',
        description: 'Potężny laptop gamingowy!\n\nProcesor: Intel i7-13650HX\nKarta: RTX 4060 8GB\nRAM: 16GB DDR5\nDysk: 1TB SSD',
        type: AuctionType.BUY_NOW, status: AuctionStatus.ACTIVE,
        startingPrice: 6999, currentPrice: 6999, buyNowPrice: 6999, quantity: 2,
        condition: 'Nowe', location: 'Poznań, wielkopolskie', shippingCost: 0,
        images: [], startDate: now, endDate: nextWeek, sellerId: users[0].id, categoryId: komputery.id, featured: true,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Sony PlayStation 5 Slim 1TB + 2 pady + FIFA 24',
        description: 'PlayStation 5 Slim - najnowsza wersja! Zestaw z grą i dwoma padami.',
        type: AuctionType.BOTH, status: AuctionStatus.ACTIVE,
        startingPrice: 2300, currentPrice: 2450, buyNowPrice: 2799, quantity: 1,
        condition: 'Używane', location: 'Gdańsk, pomorskie', shippingCost: 19.99,
        images: [], startDate: now, endDate: nextWeek, sellerId: users[2].id, categoryId: gaming.id,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Kurtka Nike Tech Fleece Windrunner - Rozmiar M - NOWA',
        description: 'Oryginalna kurtka Nike Tech Fleece. Rozmiar M. Nowa z metkami!',
        type: AuctionType.BUY_NOW, status: AuctionStatus.ACTIVE,
        startingPrice: 349, currentPrice: 349, buyNowPrice: 349, quantity: 1,
        condition: 'Nowe', location: 'Wrocław, dolnośląskie', shippingCost: 12.99,
        images: [], startDate: now, endDate: nextWeek, sellerId: users[3].id, categoryId: odziez.id,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Adidas Ultraboost 22 - Rozmiar 42 2/3 - Buty do biegania',
        description: 'Buty do biegania Adidas Ultraboost 22. Nowe, oryginalne pudełko!',
        type: AuctionType.BOTH, status: AuctionStatus.ACTIVE,
        startingPrice: 480, currentPrice: 520, buyNowPrice: 599, quantity: 3,
        condition: 'Nowe', location: 'Łódź, łódzkie', shippingCost: 0,
        images: [], startDate: now, endDate: nextWeek, sellerId: users[0].id, categoryId: obuwie.id, featured: true,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Fotel gamingowy Diablo X-One 2.0 - WYPRZEDAŻ',
        description: 'Profesjonalny fotel gamingowy! Maksymalne obciążenie: 150 kg. Nowy!',
        type: AuctionType.BUY_NOW, status: AuctionStatus.ACTIVE,
        startingPrice: 799, currentPrice: 799, buyNowPrice: 799, quantity: 5,
        condition: 'Nowe', location: 'Katowice, śląskie', shippingCost: 29.99,
        images: [], startDate: now, endDate: nextWeek, sellerId: users[1].id, categoryId: meble.id,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Opony zimowe Michelin Alpin 6 205/55 R16 - Komplet 4 szt.',
        description: 'Opony zimowe Michelin Alpin 6 - NOWE! Rok produkcji: 2024. Montaż gratis!',
        type: AuctionType.BOTH, status: AuctionStatus.ACTIVE,
        startingPrice: 1200, currentPrice: 1350, buyNowPrice: 1499, quantity: 10,
        condition: 'Nowe', location: 'Warszawa, mazowieckie', shippingCost: 39.99,
        images: [], startDate: now, endDate: nextWeek, sellerId: users[2].id, categoryId: opony.id,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Rower górski Trek Marlin 7 - Rozmiar M - MTB 29"',
        description: 'Rower górski Trek Marlin 7. Stan bardzo dobry. Przebieg ~500 km.',
        type: AuctionType.AUCTION, status: AuctionStatus.ACTIVE,
        startingPrice: 2800, currentPrice: 3100, quantity: 1,
        condition: 'Używane', location: 'Kraków, małopolskie', shippingCost: 49.99,
        images: [], startDate: now, endDate: nextWeek, sellerId: users[3].id, categoryId: rowery.id,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'Wiedźmin - Andrzej Sapkowski - Komplet 8 książek',
        description: 'Pełna saga o Wiedźminie! Twarda oprawa. SuperNOWA edycja!',
        type: AuctionType.BUY_NOW, status: AuctionStatus.ACTIVE,
        startingPrice: 249, currentPrice: 249, buyNowPrice: 249, quantity: 12,
        condition: 'Nowe', location: 'Gdańsk, pomorskie', shippingCost: 0,
        images: [], startDate: now, endDate: nextWeek, sellerId: users[0].id, categoryId: ksiazki.id, featured: true,
      },
    }),
    prisma.auction.create({
      data: {
        title: 'LEGO Technic Lamborghini Sián 42115 - 3696 elementów',
        description: 'LEGO Technic Lamborghini Sián FKP 37. Nowy, zapakowany fabrycznie!',
        type: AuctionType.BOTH, status: AuctionStatus.ACTIVE,
        startingPrice: 1800, currentPrice: 1900, buyNowPrice: 2099, quantity: 2,
        condition: 'Nowe', location: 'Warszawa, mazowieckie', shippingCost: 15.99,
        images: [], startDate: now, endDate: nextWeek, sellerId: users[1].id, categoryId: zabawki.id,
      },
    }),
  ]);

  console.log('🎯 Utworzono aukcje');

  await Promise.all([
    prisma.bid.create({ data: { auctionId: auctions[0].id, bidderId: users[1].id, amount: 4850 } }),
    prisma.bid.create({ data: { auctionId: auctions[1].id, bidderId: users[0].id, amount: 4000 } }),
    prisma.bid.create({ data: { auctionId: auctions[1].id, bidderId: users[2].id, amount: 4200 } }),
    prisma.bid.create({ data: { auctionId: auctions[3].id, bidderId: users[0].id, amount: 2450 } }),
  ]);

  console.log('💰 Utworzono oferty');

  await Promise.all([
    prisma.message.create({ data: { senderId: users[0].id, receiverId: users[1].id, content: 'Dzień dobry, czy iPhone jest nadal dostępny?' } }),
    prisma.message.create({ data: { senderId: users[1].id, receiverId: users[0].id, content: 'Tak, telefon jest dostępny. Mogę wysłać jeszcze dziś!', read: true } }),
  ]);

  console.log('💬 Utworzono wiadomości');

  await Promise.all([
    prisma.review.create({ data: { reviewerId: users[0].id, reviewedId: users[1].id, rating: 5, comment: 'Super sprzedawca! Szybka wysyłka, produkt zgodny z opisem. Polecam!' } }),
    prisma.review.create({ data: { reviewerId: users[1].id, reviewedId: users[0].id, rating: 5, comment: 'Świetny kontakt, szybka płatność. Bardzo dobry kupujący!' } }),
    prisma.review.create({ data: { reviewerId: users[2].id, reviewedId: users[0].id, rating: 4, comment: 'Wszystko OK, towar zgodny z opisem.' } }),
  ]);

  console.log('⭐ Utworzono oceny');
  console.log('✅ Seed zakończony pomyślnie!');
  console.log('\n📝 Dane testowe:');
  console.log('Admin: admin@aligone.pl / admin123');
  console.log('Użytkownik 1: jan.kowalski@example.pl / haslo123');
  console.log('Użytkownik 2: anna.nowak@example.pl / haslo123');
  console.log('Użytkownik 3: piotr.wisniewski@example.pl / haslo123');
  console.log('Użytkownik 4: maria.lewandowska@example.pl / haslo123');
}

main()
  .catch((e) => {
    console.error('❌ Błąd podczas seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Truck,
  Star,
  Flame,
  Sparkles,
  Clock,
  Heart,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AuctionCard } from '@/components/AuctionCard';
import { Spinner } from '@/components/ui/Spinner';
import { Auction, Category } from '@/types';
import api from '@/lib/api';

export default function HomePage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auctionsRes, categoriesRes] = await Promise.all([
          api.get('/auctions?limit=12&status=ACTIVE'),
          api.get('/categories'),
        ]);

        setAuctions(auctionsRes.data.auctions || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Main categories with icons (matching backend seed data)
  const mainCategories = [
    { icon: '📱', name: 'Elektronika', slug: 'elektronika', color: 'from-blue-500 to-blue-600' },
    { icon: '👔', name: 'Moda', slug: 'moda', color: 'from-pink-500 to-pink-600' },
    { icon: '🏠', name: 'Dom i Ogród', slug: 'dom-i-ogrod', color: 'from-green-500 to-green-600' },
    { icon: '🚗', name: 'Motoryzacja', slug: 'motoryzacja', color: 'from-red-500 to-red-600' },
    { icon: '⚽', name: 'Sport i Turystyka', slug: 'sport', color: 'from-orange-500 to-orange-600' },
    { icon: '🍼', name: 'Dziecko', slug: 'dziecko', color: 'from-purple-500 to-purple-600' },
    { icon: '🎮', name: 'Kultura i Rozrywka', slug: 'kultura', color: 'from-indigo-500 to-indigo-600' },
    { icon: '🐕', name: 'Zwierzęta', slug: 'zwierzeta', color: 'from-yellow-500 to-yellow-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search - Allegro Style */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-muted/20 border-b border-border">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Promotional Banner */}
          <div className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-bold text-lg">Aligone Smart! - Darmowa dostawa</h3>
                  <p className="text-sm text-muted-foreground">Kup Smart! już za 10,99 zł miesięcznie</p>
                </div>
              </div>
              <Button variant="default" size="sm">
                Sprawdź <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-background rounded-lg border border-border">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {auctions.length}+
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Aktywnych aukcji
              </div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border border-border">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                1000+
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Sprzedających
              </div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border border-border">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                50K+
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Zadowolonych kupujących
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Grid - Allegro Style */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Kategorie główne</h2>
            <Link href="/kategorie">
              <Button variant="ghost" size="sm">
                Zobacz wszystkie <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {mainCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/kategoria/${category.slug}`}
                className="group relative overflow-hidden rounded-xl border border-border hover:border-primary transition-all hover:shadow-lg"
              >
                <div className="aspect-square p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-muted/50 to-background group-hover:from-muted group-hover:to-muted/50 transition-all">
                  <div className="text-4xl md:text-5xl mb-2 transform group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-sm md:text-base leading-tight">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="py-8 bg-gradient-to-br from-red-500/5 to-orange-500/5 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full">
              <Flame className="h-5 w-5" />
              <h2 className="text-xl font-bold">Gorące oferty</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Limitowana liczba sztuk!</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {auctions.slice(0, 6).map((auction) => (
                <AuctionCard key={auction.id} auction={auction} compact />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section - Allegro Style */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-4 p-6 bg-background rounded-lg border border-border">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Darmowa dostawa</h3>
                <p className="text-sm text-muted-foreground">
                  z Aligone Smart! od 10,99 zł/mies.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-background rounded-lg border border-border">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Bezpieczeństwo</h3>
                <p className="text-sm text-muted-foreground">
                  Ochrona kupujących i sprzedających
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-background rounded-lg border border-border">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Oceny sprzedawców</h3>
                <p className="text-sm text-muted-foreground">
                  System weryfikacji i opinii
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-background rounded-lg border border-border">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Licytacje na żywo</h3>
                <p className="text-sm text-muted-foreground">
                  Powiadomienia w czasie rzeczywistym
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Auctions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Polecane dla Ciebie</h2>
              <p className="text-muted-foreground">Wybrane najlepsze oferty z różnych kategorii</p>
            </div>
            <Link href="/aukcje">
              <Button variant="outline">
                Wszystkie aukcje
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : auctions.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Brak dostępnych aukcji w tym momencie</p>
              <Link href="/sprzedaj">
                <Button className="mt-4" variant="outline">
                  Wystaw pierwszą aukcję
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Electronics Section */}
      <section className="py-12 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📱</span>
              <h2 className="text-2xl font-bold">Elektronika</h2>
            </div>
            <Link href="/kategoria/elektronika">
              <Button variant="ghost" size="sm">
                Zobacz więcej <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {auctions.slice(0, 6).map((auction) => (
              <AuctionCard key={auction.id} auction={auction} compact />
            ))}
          </div>
        </div>
      </section>

      {/* Fashion Section */}
      <section className="py-12 bg-gradient-to-br from-pink-500/5 to-purple-500/5 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👔</span>
              <h2 className="text-2xl font-bold">Moda</h2>
            </div>
            <Link href="/kategoria/moda">
              <Button variant="ghost" size="sm">
                Zobacz więcej <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {auctions.slice(0, 6).map((auction) => (
              <AuctionCard key={auction.id} auction={auction} compact />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gotowy, aby zacząć sprzedawać?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Dołącz do tysięcy sprzedawców na Aligone. Wystawianie ofert jest darmowe!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Załóż konto za darmo
                </Button>
              </Link>
              <Link href="/jak-sprzedawac">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Dowiedz się więcej
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Dlaczego Aligone?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Społeczność</h3>
              <p className="text-muted-foreground">
                Ponad 50 000 użytkowników kupuje i sprzedaje codziennie. Dołącz do nas!
              </p>
            </div>

            <div className="text-center p-8 rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bezpieczeństwo</h3>
              <p className="text-muted-foreground">
                Program Ochrony Kupujących zabezpiecza każdą transakcję. Kupuj bez obaw!
              </p>
            </div>

            <div className="text-center p-8 rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Łatwość użycia</h3>
              <p className="text-muted-foreground">
                Intuicyjny interfejs sprawia, że kupowanie i sprzedawanie jest dziecinnie proste.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Menu,
  Sun,
  Moon,
  LogOut,
  Settings,
  Package,
  Heart,
  MessageSquare,
  PlusCircle,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { icon: '📱', name: 'Elektronika', slug: 'elektronika',
      sub: ['Telefony i akcesoria', 'Komputery', 'RTV i AGD', 'Konsole i gry'] },
    { icon: '👔', name: 'Moda', slug: 'moda',
      sub: ['Odzież damska', 'Odzież męska', 'Obuwie', 'Biżuteria i zegarki'] },
    { icon: '🏠', name: 'Dom i Ogród', slug: 'dom-ogrod',
      sub: ['Meble', 'Dekoracje', 'Ogród', 'Narzędzia'] },
    { icon: '🚗', name: 'Motoryzacja', slug: 'motoryzacja',
      sub: ['Części samochodowe', 'Opony i felgi', 'Akcesoria', 'Motocykle'] },
    { icon: '⚽', name: 'Sport i turystyka', slug: 'sport-turystyka',
      sub: ['Rowery', 'Fitness', 'Sporty zimowe', 'Turystyka'] },
    { icon: '👶', name: 'Dziecko', slug: 'dziecko',
      sub: ['Zabawki', 'Ubranka', 'Wózki', 'Pokój dziecka'] },
    { icon: '📚', name: 'Kultura i rozrywka', slug: 'kultura-rozrywka',
      sub: ['Książki', 'Filmy', 'Muzyka', 'Gry planszowe'] },
    { icon: '🐾', name: 'Zwierzęta', slug: 'zwierzeta',
      sub: ['Psy', 'Koty', 'Akwaria', 'Gryzonie'] },
    { icon: '💄', name: 'Uroda', slug: 'uroda',
      sub: ['Kosmetyki', 'Perfumy', 'Pielęgnacja', 'Fryzjerstwo'] },
    { icon: '⚕️', name: 'Zdrowie', slug: 'zdrowie',
      sub: ['Suplementy', 'Sprzęt medyczny', 'Optyka', 'Rehabilitacja'] },
  ];

  return (
    <>
      {/* Top Bar - styl Allegro */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex h-9 items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <Link href="/pomoc" className="text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
                Pomoc
              </Link>
              <Link href="/kontakt" className="text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
                Kontakt
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                    Zaloguj się
                  </Link>
                  <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Załóż konto
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/wiadomosci" className="relative text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
                    Wiadomości
                  </Link>
                  <Link href="/powiadomienia" className="relative text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
                    Powiadomienia
                    <span className="absolute -top-1 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      3
                    </span>
                  </Link>
                </div>
              )}
              <button
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title={theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - styl Allegro */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                aligone
              </div>
            </Link>

            {/* Search Bar - główny element jak w Allegro */}
            <div className="hidden md:flex flex-1 max-w-3xl mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Czego szukasz?"
                  className="w-full h-12 pl-4 pr-12 rounded-lg border-2 border-primary/20 focus:border-primary bg-background text-base focus:outline-none transition-colors"
                />
                <button className="absolute right-0 top-0 h-12 px-6 bg-primary text-primary-foreground rounded-r-lg hover:bg-primary/90 transition-colors font-medium">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {/* Sprzedaj */}
                  <Link href="/sprzedaj" className="hidden lg:flex">
                    <Button variant="outline" className="gap-2 font-medium">
                      <PlusCircle className="h-4 w-4" />
                      Sprzedaj
                    </Button>
                  </Link>

                  {/* Obserwowane */}
                  <Link href="/obserwowane" className="hidden lg:flex">
                    <Button variant="ghost" size="icon" title="Obserwowane">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>

                  {/* Koszyk */}
                  <Link href="/koszyk">
                    <Button variant="ghost" size="icon" className="relative" title="Koszyk">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        2
                      </span>
                    </Button>
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="gap-2"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden lg:inline max-w-32 truncate">{user?.username}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>

                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-72 rounded-lg border border-border bg-background shadow-2xl z-50">
                          <div className="p-4 border-b border-border bg-muted/50">
                            <p className="font-semibold text-lg">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-yellow-500 text-lg">⭐</span>
                              <span className="font-semibold">{user?.rating.toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground">({user?.ratingCount} ocen)</span>
                            </div>
                          </div>
                          <div className="py-2">
                            <Link
                              href="/moje-konto"
                              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <User className="h-4 w-4" />
                              Moje konto
                            </Link>
                            <Link
                              href="/moje-aukcje"
                              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Package className="h-4 w-4" />
                              Moje aukcje
                            </Link>
                            <Link
                              href="/zakupy"
                              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Zakupy
                            </Link>
                            <Link
                              href="/obserwowane"
                              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Heart className="h-4 w-4" />
                              Obserwowane
                            </Link>
                            <Link
                              href="/wiadomosci"
                              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <MessageSquare className="h-4 w-4" />
                              Wiadomości
                            </Link>
                            <Link
                              href="/ustawienia"
                              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings className="h-4 w-4" />
                              Ustawienia
                            </Link>
                            {user?.role === 'ADMIN' && (
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors border-t border-border"
                                onClick={() => setShowUserMenu(false)}
                              >
                                <Settings className="h-4 w-4 text-primary" />
                                <span className="text-primary font-medium">Panel admina</span>
                              </Link>
                            )}
                            <button
                              onClick={() => {
                                logout();
                                setShowUserMenu(false);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors border-t border-border"
                            >
                              <LogOut className="h-4 w-4" />
                              Wyloguj się
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden md:flex">
                    <Button variant="outline">Zaloguj się</Button>
                  </Link>
                  <Link href="/register" className="hidden md:flex">
                    <Button className="font-medium">Załóż konto</Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Czego szukasz?"
                className="w-full h-11 pl-4 pr-12 rounded-lg border-2 border-primary/20 focus:border-primary bg-background text-sm focus:outline-none"
              />
              <button className="absolute right-0 top-0 h-11 px-4 bg-primary text-primary-foreground rounded-r-lg">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Categories Bar - Mega Menu */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-12 gap-6 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              <Menu className="h-4 w-4" />
              Kategorie
              <ChevronDown className={cn("h-4 w-4 transition-transform", showCategoriesMenu && "rotate-180")} />
            </button>
            <div className="h-6 w-px bg-border" />
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategoria/${cat.slug}`}
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors whitespace-nowrap"
              >
                <span>{cat.icon}</span>
                <span className="hidden lg:inline">{cat.name}</span>
              </Link>
            ))}
            <Link
              href="/promocje"
              className="text-sm font-bold text-destructive hover:text-destructive/80 transition-colors whitespace-nowrap ml-auto"
            >
              🔥 Promocje
            </Link>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {showCategoriesMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowCategoriesMenu(false)}
          />
          <div className="absolute left-0 right-0 bg-background border-b border-border shadow-2xl z-50 animate-in slide-in-from-top-2">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {categories.map((cat) => (
                  <div key={cat.slug}>
                    <Link
                      href={`/kategoria/${cat.slug}`}
                      className="flex items-center gap-2 font-bold text-base mb-4 hover:text-primary transition-colors group"
                      onClick={() => setShowCategoriesMenu(false)}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                      {cat.name}
                    </Link>
                    <ul className="space-y-2.5">
                      {cat.sub.map((subcat) => (
                        <li key={subcat}>
                          <Link
                            href={`/kategoria/${cat.slug}/${subcat.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                            onClick={() => setShowCategoriesMenu(false)}
                          >
                            {subcat}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-background shadow-2xl overflow-y-auto">
            <div className="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
              <h2 className="font-bold text-lg">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            {isAuthenticated && (
              <div className="p-4 border-b border-border">
                <p className="font-semibold">{user?.username}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            )}

            <div className="p-4">
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Kategorie</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/kategoria/${cat.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {isAuthenticated && (
              <div className="p-4 border-t border-border space-y-1">
                <Link
                  href="/moje-aukcje"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Package className="h-5 w-5" />
                  Moje aukcje
                </Link>
                <Link
                  href="/zakupy"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Zakupy
                </Link>
                <Link
                  href="/obserwowane"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Heart className="h-5 w-5" />
                  Obserwowane
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

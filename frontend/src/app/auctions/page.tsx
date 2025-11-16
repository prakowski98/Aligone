'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuctionCard } from '@/components/AuctionCard';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Auction, Category } from '@/types';
import api from '@/lib/api';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Grid3x3,
  List,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';

type SortOption = 'newest' | 'ending' | 'price_asc' | 'price_desc' | 'popular';
type ViewMode = 'grid' | 'list';

export default function AuctionsPage() {
  const searchParams = useSearchParams();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(true);

  // Price filters
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [condition, setCondition] = useState<string[]>([]);
  const [auctionType, setAuctionType] = useState<string[]>([]);
  const [freeShipping, setFreeShipping] = useState(false);

  useEffect(() => {
    fetchAuctions();
  }, [page, selectedCategory, sortBy]);

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '24',
        status: 'ACTIVE',
      });

      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (search) params.append('search', search);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const [auctionsRes, categoriesRes] = await Promise.all([
        api.get(`/auctions?${params}`),
        api.get('/categories'),
      ]);

      let filteredAuctions = auctionsRes.data.auctions || [];

      // Client-side filtering
      if (condition.length > 0) {
        filteredAuctions = filteredAuctions.filter((a: Auction) =>
          condition.includes(a.condition)
        );
      }
      if (auctionType.length > 0) {
        filteredAuctions = filteredAuctions.filter((a: Auction) =>
          auctionType.includes(a.type)
        );
      }
      if (freeShipping) {
        filteredAuctions = filteredAuctions.filter((a: Auction) =>
          a.shippingInfo?.includes('Darmowa')
        );
      }

      // Client-side sorting
      switch (sortBy) {
        case 'ending':
          filteredAuctions.sort((a: Auction, b: Auction) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
          );
          break;
        case 'price_asc':
          filteredAuctions.sort((a: Auction, b: Auction) =>
            a.currentPrice - b.currentPrice
          );
          break;
        case 'price_desc':
          filteredAuctions.sort((a: Auction, b: Auction) =>
            b.currentPrice - a.currentPrice
          );
          break;
        case 'popular':
          filteredAuctions.sort((a: Auction, b: Auction) =>
            (b.views || 0) - (a.views || 0)
          );
          break;
      }

      setAuctions(filteredAuctions);
      setTotalPages(auctionsRes.data.pagination?.pages || 1);
      setTotalResults(filteredAuctions.length);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAuctions();
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setCondition([]);
    setAuctionType([]);
    setFreeShipping(false);
    setSelectedCategory('');
    setSearch('');
    setPage(1);
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (minPrice || maxPrice) count++;
    if (condition.length > 0) count++;
    if (auctionType.length > 0) count++;
    if (freeShipping) count++;
    if (selectedCategory) count++;
    return count;
  };

  const sortOptions = [
    { value: 'newest', label: 'Najnowsze', icon: Clock },
    { value: 'ending', label: 'Kończące się', icon: Clock },
    { value: 'price_asc', label: 'Cena: od najniższej', icon: DollarSign },
    { value: 'price_desc', label: 'Cena: od najwyższej', icon: DollarSign },
    { value: 'popular', label: 'Najpopularniejsze', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <a href="/" className="hover:text-primary">Strona główna</a>
            <span className="mx-2">/</span>
            <span className="text-foreground">Wszystkie aukcje</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Przeglądaj aukcje</h1>
          <p className="text-muted-foreground">
            {totalResults} {totalResults === 1 ? 'oferta' : 'ofert'} spełnia Twoje kryteria
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Szukaj wśród aukcji..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button type="submit" className="h-12 px-6">
              Szukaj
            </Button>
          </div>
        </form>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`${
              showFilters ? 'w-72 flex-shrink-0' : 'w-0 overflow-hidden'
            } transition-all duration-300`}
          >
            <div className="sticky top-4 space-y-4">
              {/* Filter Header */}
              <div className="bg-background rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtry
                  </h2>
                  {activeFiltersCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Wyczyść
                    </Button>
                  )}
                </div>

                {activeFiltersCount() > 0 && (
                  <Badge variant="secondary" className="mb-4">
                    {activeFiltersCount()} aktywnych filtrów
                  </Badge>
                )}

                {/* Categories Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-sm">Kategoria</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === ''
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      Wszystkie kategorie
                    </button>
                    {categories.filter((c) => !c.parentId).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                          selectedCategory === category.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6 pb-6 border-b border-border">
                  <h3 className="font-semibold mb-3 text-sm">Cena</h3>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Od"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="flex-1"
                    />
                    <span className="flex items-center text-muted-foreground">-</span>
                    <Input
                      type="number"
                      placeholder="Do"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <Button
                    onClick={() => fetchAuctions()}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                  >
                    Zastosuj
                  </Button>
                </div>

                {/* Condition Filter */}
                <div className="mb-6 pb-6 border-b border-border">
                  <h3 className="font-semibold mb-3 text-sm">Stan</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'NEW', label: 'Nowe' },
                      { value: 'USED_LIKE_NEW', label: 'Jak nowe' },
                      { value: 'USED_GOOD', label: 'Używane - dobre' },
                      { value: 'USED_ACCEPTABLE', label: 'Używane - akceptowalne' },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={condition.includes(opt.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCondition([...condition, opt.value]);
                            } else {
                              setCondition(condition.filter((c) => c !== opt.value));
                            }
                            setPage(1);
                          }}
                          className="rounded border-input text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Auction Type Filter */}
                <div className="mb-6 pb-6 border-b border-border">
                  <h3 className="font-semibold mb-3 text-sm">Typ oferty</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'AUCTION', label: 'Licytacja' },
                      { value: 'BUY_NOW', label: 'Kup Teraz' },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={auctionType.includes(opt.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAuctionType([...auctionType, opt.value]);
                            } else {
                              setAuctionType(auctionType.filter((t) => t !== opt.value));
                            }
                            setPage(1);
                          }}
                          className="rounded border-input text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Shipping Filter */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-3 text-sm">Dostawa</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={freeShipping}
                      onChange={(e) => {
                        setFreeShipping(e.target.checked);
                        setPage(1);
                      }}
                      className="rounded border-input text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm">📦 Darmowa dostawa</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-background rounded-lg border border-border p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtry
                  </Button>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-background shadow-sm'
                        : 'hover:bg-background/50'
                    }`}
                    title="Widok siatki"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-background shadow-sm'
                        : 'hover:bg-background/50'
                    }`}
                    title="Widok listy"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Auctions Grid/List */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : auctions.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                      : 'space-y-4'
                  }
                >
                  {auctions.map((auction) => (
                    <AuctionCard
                      key={auction.id}
                      auction={auction}
                      compact={viewMode === 'grid'}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Poprzednia
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? 'default' : 'outline'}
                            onClick={() => setPage(pageNum)}
                            size="sm"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Następna
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-background rounded-lg border border-border">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nie znaleziono aukcji</h3>
                <p className="text-muted-foreground mb-4">
                  Spróbuj zmienić kryteria wyszukiwania lub filtry
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Wyczyść wszystkie filtry
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

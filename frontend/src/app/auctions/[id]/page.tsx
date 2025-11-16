'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, Package, Heart, Share2, User } from 'lucide-react';
import { Auction, Bid as BidType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/store/useAuthStore';
import { formatPrice, formatDateTime, getTimeRemaining, getImageUrl } from '@/lib/utils';
import api from '@/lib/api';

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidding, setBidding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchAuction();
    const interval = setInterval(fetchAuction, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [params.id]);

  const fetchAuction = async () => {
    try {
      const response = await api.get(`/auctions/${params.id}`);
      setAuction(response.data);
      if (!bidAmount) {
        setBidAmount((response.data.currentPrice * 1.05).toFixed(2));
      }
    } catch (error) {
      console.error('Error fetching auction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setBidding(true);
    try {
      await api.post(`/auctions/${params.id}/bids`, {
        amount: parseFloat(bidAmount),
      });
      fetchAuction();
      setBidAmount('');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to place bid');
    } finally {
      setBidding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push(`/checkout/${params.id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Auction not found</h1>
        <Link href="/auctions">
          <Button className="mt-4">Browse Auctions</Button>
        </Link>
      </div>
    );
  }

  const timeRemaining = getTimeRemaining(auction.endDate);
  const hasEnded = timeRemaining.total <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={getImageUrl(auction.images[selectedImage])}
              alt={auction.title}
              fill
              className="object-cover"
            />
          </div>
          {auction.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {auction.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-md overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${auction.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auction Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{auction.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Listed {formatDateTime(auction.createdAt)}</span>
              <span>•</span>
              <span>{auction.views} views</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant={hasEnded ? 'destructive' : 'success'}>
              {auction.status}
            </Badge>
            <Badge variant="secondary">{auction.type.replace('_', ' ')}</Badge>
            {auction.condition && <Badge variant="outline">{auction.condition}</Badge>}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Current Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-4">
                {formatPrice(auction.currentPrice)}
              </div>

              {!hasEnded && (
                <div className="space-y-4">
                  {auction.type !== 'BUY_NOW' && (
                    <form onSubmit={handleBid} className="space-y-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter your bid"
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={bidding || !isAuthenticated}
                      >
                        {bidding ? 'Placing Bid...' : 'Place Bid'}
                      </Button>
                    </form>
                  )}

                  {auction.buyNowPrice && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Buy Now Price: {formatPrice(auction.buyNowPrice)}
                      </p>
                      <Button
                        onClick={handleBuyNow}
                        variant="secondary"
                        className="w-full"
                      >
                        Buy Now
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 p-4 bg-secondary/20 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  {hasEnded ? (
                    <span className="text-destructive font-medium">Auction Ended</span>
                  ) : (
                    <span>
                      {timeRemaining.days}d {timeRemaining.hours}h{' '}
                      {timeRemaining.minutes}m remaining
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Heart className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Seller Info */}
          {auction.seller && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/users/${auction.seller.id}`}
                  className="flex items-center gap-3 hover:bg-accent p-2 rounded-md transition-colors"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{auction.seller.username}</p>
                    <p className="text-sm text-muted-foreground">
                      ⭐ {auction.seller.rating.toFixed(1)} ({auction.seller.ratingCount} reviews)
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Description and Details */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{auction.description}</p>
            </CardContent>
          </Card>

          {auction.bids && auction.bids.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Bid History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auction.bids.map((bid: BidType) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="font-medium">{bid.bidder?.username}</span>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(bid.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(bid.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {auction.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{auction.location}</span>
                </div>
              )}
              {auction.shippingCost !== undefined && (
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Shipping: {formatPrice(auction.shippingCost)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{auction.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{auction.category?.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

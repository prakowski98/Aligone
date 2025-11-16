import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Heart, ShoppingCart, Zap } from 'lucide-react';
import { Auction } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, getTimeRemaining, getImageUrl } from '@/lib/utils';

interface AuctionCardProps {
  auction: Auction;
  compact?: boolean;
}

export function AuctionCard({ auction, compact = false }: AuctionCardProps) {
  const timeRemaining = getTimeRemaining(auction.endDate);
  const isEnding = timeRemaining.total > 0 && timeRemaining.total < 24 * 60 * 60 * 1000;
  const hasEnded = timeRemaining.total <= 0;

  if (compact) {
    return (
      <Link href={`/aukcje/${auction.id}`}>
        <Card className="overflow-hidden transition-all hover:shadow-md group">
          <div className="relative aspect-square">
            <Image
              src={getImageUrl(auction.images[0])}
              alt={auction.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {auction.featured && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                ⭐ TOP
              </div>
            )}
            {isEnding && !hasEnded && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md animate-pulse">
                🔥 KOŃCZY SIĘ
              </div>
            )}
            <button className="absolute bottom-2 right-2 p-1.5 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors opacity-0 group-hover:opacity-100">
              <Heart className="h-3.5 w-3.5" />
            </button>
          </div>

          <CardContent className="p-3">
            <div className="space-y-1.5">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                {auction.title}
              </h3>

              <div className="flex flex-col gap-1">
                {auction.type === 'BUY_NOW' ? (
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-primary" />
                    <p className="text-lg font-bold text-foreground">
                      {formatPrice(auction.buyNowPrice || auction.currentPrice)}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground">Aktualna cena</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatPrice(auction.currentPrice)}
                    </p>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {!hasEnded && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className={isEnding ? 'text-red-600 font-medium' : ''}>
                      {timeRemaining.days > 0
                        ? `${timeRemaining.days}d ${timeRemaining.hours}h`
                        : `${timeRemaining.hours}h ${timeRemaining.minutes}m`}
                    </span>
                  </div>
                )}
                {auction.shippingInfo?.includes('Darmowa') && (
                  <Badge variant="secondary" className="text-xs py-0 px-1">
                    Darmowa dostawa
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/aukcje/${auction.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] group">
        <div className="relative aspect-square">
          <Image
            src={getImageUrl(auction.images[0])}
            alt={auction.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {auction.featured && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
              ⭐ WYRÓŻNIONE
            </div>
          )}
          {isEnding && !hasEnded && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-pulse">
              🔥 Kończy się!
            </div>
          )}
          {hasEnded && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white text-black font-bold px-4 py-2 rounded-lg">
                Aukcja zakończona
              </div>
            </div>
          )}
          <button className="absolute bottom-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors shadow-md opacity-0 group-hover:opacity-100">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]">
              {auction.title}
            </h3>

            <div className="flex items-baseline justify-between">
              <div>
                {auction.type === 'BUY_NOW' ? (
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Kup Teraz</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatPrice(auction.buyNowPrice || auction.currentPrice)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground">Aktualna cena</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(auction.currentPrice)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {auction._count?.bids || 0} {auction._count?.bids === 1 ? 'licytacja' : 'licytacji'}
                    </p>
                  </div>
                )}
              </div>
              {auction.buyNowPrice && auction.type === 'AUCTION' && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">lub Kup Teraz</p>
                  <p className="text-lg font-semibold flex items-center gap-1">
                    <Zap className="h-4 w-4 text-primary" />
                    {formatPrice(auction.buyNowPrice)}
                  </p>
                </div>
              )}
            </div>

            {!hasEnded && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className={isEnding ? 'text-red-600 font-semibold' : ''}>
                    {timeRemaining.days > 0
                      ? `${timeRemaining.days} dni ${timeRemaining.hours}h`
                      : timeRemaining.hours > 0
                      ? `${timeRemaining.hours}h ${timeRemaining.minutes}m`
                      : `${timeRemaining.minutes}m ${timeRemaining.seconds}s`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{auction.views} wyświetleń</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                {auction.condition === 'NEW' && (
                  <Badge variant="success" className="text-xs">
                    ✓ Nowy
                  </Badge>
                )}
                {auction.condition === 'USED_LIKE_NEW' && (
                  <Badge variant="secondary" className="text-xs">
                    Jak nowy
                  </Badge>
                )}
                {auction.condition === 'USED_GOOD' && (
                  <Badge variant="secondary" className="text-xs">
                    Używany
                  </Badge>
                )}
                {auction.shippingInfo?.includes('Darmowa') && (
                  <Badge variant="secondary" className="text-xs">
                    📦 Darmowa dostawa
                  </Badge>
                )}
              </div>
              {auction.location && (
                <span className="text-xs text-muted-foreground truncate">
                  📍 {auction.location.split(',')[0]}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

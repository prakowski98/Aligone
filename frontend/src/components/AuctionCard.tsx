import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Heart } from 'lucide-react';
import { Auction } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, getTimeRemaining, getImageUrl } from '@/lib/utils';

interface AuctionCardProps {
  auction: Auction;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const timeRemaining = getTimeRemaining(auction.endDate);
  const isEnding = timeRemaining.total > 0 && timeRemaining.total < 24 * 60 * 60 * 1000;

  return (
    <Link href={`/auctions/${auction.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
        <div className="relative aspect-square">
          <Image
            src={getImageUrl(auction.images[0])}
            alt={auction.title}
            fill
            className="object-cover"
          />
          {auction.featured && (
            <Badge className="absolute top-2 left-2" variant="success">
              Featured
            </Badge>
          )}
          <button className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
              {auction.title}
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-xl font-bold text-primary">
                  {formatPrice(auction.currentPrice)}
                </p>
              </div>
              {auction.buyNowPrice && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Buy Now</p>
                  <p className="text-lg font-semibold">
                    {formatPrice(auction.buyNowPrice)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span className={isEnding ? 'text-destructive font-medium' : ''}>
                  {timeRemaining.total > 0
                    ? `${timeRemaining.days}d ${timeRemaining.hours}h`
                    : 'Ended'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{auction.views}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Badge variant="secondary">{auction.condition}</Badge>
              <span className="text-muted-foreground">
                {auction._count?.bids || 0} bids
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

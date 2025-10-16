'use client';

import { useState, useEffect } from 'react';
import type { Artwork, Bid } from '@/lib/data';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Gavel, Timer, User } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { findImageById } from '@/lib/data';

interface BiddingPanelProps {
  artwork: Artwork;
}

export default function BiddingPanel({ artwork: initialArtwork }: BiddingPanelProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [artwork, setArtwork] = useState(initialArtwork);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  const highestBid = artwork.currentBid ?? artwork.startPrice ?? 0;
  const minBid = highestBid + 1;

  useEffect(() => {
    if (!artwork.auctionEndDate) return;

    const interval = setInterval(() => {
      const endDate = parseISO(artwork.auctionEndDate!);
      if (new Date() > endDate) {
        setTimeLeft('Auction ended');
        clearInterval(interval);
      } else {
        setTimeLeft(formatDistanceToNow(endDate, { addSuffix: true }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [artwork.auctionEndDate]);

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= highestBid) {
      toast({
        variant: 'destructive',
        title: 'Invalid Bid',
        description: `Your bid must be higher than the current bid of $${highestBid.toFixed(2)}.`,
      });
      return;
    }

    if (user.role === 'guest') {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'You must be logged in to place a bid.',
      });
      return;
    }
    
    // This is a mock implementation. In a real app, this would be a server call.
    const newBid: Bid = {
        id: `bid-${Date.now()}`,
        artworkId: artwork.id,
        userId: user.id,
        userName: user.name,
        userAvatarId: user.avatarId,
        amount,
        timestamp: new Date().toISOString(),
    };

    const updatedBids = [newBid, ...(artwork.bids ?? [])];
    const updatedArtwork = { ...artwork, currentBid: amount, bids: updatedBids };
    setArtwork(updatedArtwork);
    
    setBidAmount('');
    toast({
      title: 'Bid Placed!',
      description: `You successfully bid $${amount.toFixed(2)} on "${artwork.title}".`,
    });
  };

  const highestBidder = artwork.bids?.find(bid => bid.amount === artwork.currentBid);

  return (
    <div className="rounded-lg bg-card border p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Current Bid</p>
          <p className="text-3xl font-bold text-accent">${highestBid.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground flex items-center justify-end gap-2">
            <Timer className="h-4 w-4" />
            Auction ends
          </p>
          <p className="font-semibold text-accent">{timeLeft}</p>
        </div>
      </div>
      
       {highestBidder && (
        <div className="flex items-center gap-3 bg-primary/10 p-3 rounded-md">
            <Avatar className="h-8 w-8">
                <AvatarImage src={findImageById(highestBidder.userAvatarId)?.imageUrl} />
                <AvatarFallback>{highestBidder.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-sm">
                Highest bid by <span className="font-semibold">{highestBidder.userName}</span>
            </p>
        </div>
      )}

      <div className="space-y-2">
         <div className="flex gap-2">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-muted-foreground sm:text-sm">$</span>
            </div>
            <Input
              type="number"
              placeholder={`min. $${minBid.toFixed(2)}`}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="pl-7"
              disabled={timeLeft === 'Auction ended'}
            />
          </div>
          <Button onClick={handlePlaceBid} className="bg-accent hover:bg-accent/90" disabled={timeLeft === 'Auction ended'}>
            <Gavel className="mr-2 h-5 w-5" />
            Place Bid
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
            {artwork.bids?.length ?? 0} bids placed so far.
        </p>
      </div>

       {artwork.bids && artwork.bids.length > 0 && (
         <div>
            <h4 className="font-semibold mb-3">Bid History</h4>
            <ul className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {artwork.bids.map(bid => {
                    const userImage = findImageById(bid.userAvatarId);
                    return (
                        <li key={bid.id} className="flex items-center justify-between text-sm">
                            <div className='flex items-center gap-2'>
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={userImage?.imageUrl} />
                                    <AvatarFallback>{bid.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{bid.userName}</span>
                            </div>
                           <div className='text-right'>
                             <span className="font-semibold text-foreground">${bid.amount.toFixed(2)}</span>
                             <p className='text-xs text-muted-foreground'>{formatDistanceToNow(parseISO(bid.timestamp), { addSuffix: true })}</p>
                           </div>
                        </li>
                    )
                })}
            </ul>
         </div>
       )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Gavel, CalendarIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export default function UploadPage() {
  const [isAuction, setIsAuction] = useState(false);
  const [auctionEndDate, setAuctionEndDate] = useState<Date>();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-3">
            <UploadCloud className="h-8 w-8 text-primary" />
            Upload New Artwork
          </CardTitle>
          <CardDescription>
            Share your creation with the world. Fill out the details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="artwork-file">Artwork File</Label>
              <Input id="artwork-file" type="file" />
              <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g., 'Sunset Over the Digital Sea'" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your artwork, its inspiration, and meaning."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abstract">Abstract</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="surrealism">Surrealism</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Card className="p-4 bg-primary/5">
                <div className="flex items-center justify-between">
                    <Label htmlFor="auction-mode" className="flex items-center gap-2 font-semibold">
                       <Gavel className="h-5 w-5 text-accent" />
                        Enable Auction Mode
                    </Label>
                    <Switch
                        id="auction-mode"
                        checked={isAuction}
                        onCheckedChange={setIsAuction}
                    />
                </div>
                {isAuction && (
                    <div className="mt-4 space-y-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="start-price">Starting Price (USD)</Label>
                                 <div className='relative'>
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-muted-foreground sm:text-sm">$</span>
                                    </div>
                                    <Input id="start-price" type="number" placeholder="100.00" className='pl-7' />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="auction-end-date">Auction End Date</Label>
                                 <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !auctionEndDate && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {auctionEndDate ? format(auctionEndDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={auctionEndDate}
                                        onSelect={setAuctionEndDate}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {!isAuction && (
               <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <div className='relative'>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-muted-foreground sm:text-sm">$</span>
                        </div>
                        <Input id="price" type="number" placeholder="250.00" className='pl-7' />
                    </div>
                </div>
            )}
            
            <Button type="submit" size="lg" className="w-full">
              {isAuction ? 'List for Auction' : 'Upload Artwork'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

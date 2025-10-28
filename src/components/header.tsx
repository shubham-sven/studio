'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Palette,
  Search,
  Heart,
  User,
  LogIn,
  LogOut,
  UserPlus,
  UploadCloud,
  Gavel,
  Menu,
  X,
  Users,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { findImageById } from '@/lib/data';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userImage = findImageById(user.avatarId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Palette className="h-6 w-6 text-primary" />
          <span className="font-headline text-2xl font-bold">Artify</span>
        </Link>
        <nav className="hidden flex-1 items-center space-x-4 md:flex">
          <Link href="/auctions">
            <Button variant="ghost">
              <Gavel className="mr-2" />
              Auctions
            </Button>
          </Link>
          <Link href="/artists">
            <Button variant="ghost">
              <Users className="mr-2" />
              Artists
            </Button>
          </Link>
          <Link href="/favorites">
            <Button variant="ghost">
              <Heart className="mr-2" />
              Favorites
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">
              About
            </Button>
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artwork..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {user.role !== 'guest' && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart?.items?.length || 0}
                </span>
              )}
            </Button>
          </Link>
          {user.role === 'artist' && (
            <Link href="/upload" passHref>
              <Button className="bg-accent hover:bg-accent/90">
                <UploadCloud className="mr-2" />
                Upload Art
              </Button>
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar>
                   {userImage && <AvatarImage src={userImage.imageUrl} alt={user.name} />}
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user.role === 'guest' ? 'My Account' : user.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.role === 'guest' ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <LogIn className="mr-2" />
                      <span>Log In</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup">
                      <UserPlus className="mr-2" />
                      <span>Sign Up</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <User className="mr-2" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'artist' && (
                     <DropdownMenuItem asChild>
                       <Link href="/upload">
                         <UploadCloud className="mr-2" />
                         <span>Upload Artwork</span>
                       </Link>
                     </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artwork..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <nav className="flex flex-col space-y-2">
              <Link href="/auctions" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Gavel className="mr-2" />
                  Auctions
                </Button>
              </Link>
              <Link href="/favorites" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="mr-2" />
                  Favorites
                </Button>
              </Link>
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="mr-2" />
                  Cart
                </Button>
              </Link>
              <Link href="/search" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Search className="mr-2" />
                  Search
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

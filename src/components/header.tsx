'use client';

import Link from 'next/link';
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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { findImageById } from '@/lib/data';

export function Header() {
  const { user, logout } = useAuth();
  const userImage = findImageById(user.avatarId);

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
          <Link href="/favorites">
            <Button variant="ghost">
              <Heart className="mr-2" />
              Favorites
            </Button>
          </Link>
          {user.role === 'artist' && (
            <Link href="/upload">
              <Button variant="ghost">
                <UploadCloud className="mr-2" />
                Upload Art
              </Button>
            </Link>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search artwork..." className="pl-10" />
          </div>
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
        </div>
      </div>
    </header>
  );
}

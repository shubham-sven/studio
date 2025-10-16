'use client';

import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { findImageById } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const PREFERENCES_KEY = 'artify-user-preferences';

export default function AccountPage() {
  const { user } = useAuth();
  const userImage = findImageById(user.avatarId);
  const { toast } = useToast();

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const preferences = formData.get('preferences') as string;
    localStorage.setItem(PREFERENCES_KEY, preferences);
    toast({
      title: 'Preferences Saved',
      description: 'Your AI recommendations will now be updated.',
    });
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8 flex items-center gap-6">
        <Avatar className="h-24 w-24 border-4 border-primary">
          {userImage && <AvatarImage src={userImage.imageUrl} alt={user.name} />}
          <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-headline text-4xl font-bold">{user.name}</h1>
          <p className="text-lg text-muted-foreground capitalize">{user.role}</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                     <Button>Save Changes</Button>
                </CardContent>
            </Card>
        </div>
        
        <div>
            <Card>
                 <form onSubmit={handleSave}>
                    <CardHeader>
                        <CardTitle>Art Preferences</CardTitle>
                        <CardDescription>Help our AI recommend art you'll love. Describe your taste.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="preferences">Your Preferences</Label>
                            <Textarea 
                                id="preferences" 
                                name="preferences"
                                placeholder="e.g., I love colorful abstract art, surreal landscapes, and modern digital art." 
                                rows={5}
                                defaultValue={typeof window !== 'undefined' ? localStorage.getItem(PREFERENCES_KEY) ?? '' : ''}
                            />
                        </div>
                         <Button type="submit" className="w-full">Save Preferences</Button>
                    </CardContent>
                </form>
            </Card>
        </div>
      </div>
    </div>
  );
}

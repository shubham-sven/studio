'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Plus, Edit, Trash2, Loader2, Star } from 'lucide-react';
import { Address } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface AddressBookProps {
  userId?: string; // Optional, defaults to 'user-123' for demo
}

export default function AddressBook({ userId = 'user-123' }: AddressBookProps) {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'home',
    name: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  // Load addresses from API
  useEffect(() => {
    loadAddresses();
  }, [userId]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/addresses?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setSavedAddresses(data.addresses);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load addresses',
        });
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load addresses',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateAddress = (address: Partial<Address>): string | null => {
    if (!address.name?.trim()) return 'Full name is required';
    if (!address.phone?.trim()) return 'Phone number is required';
    if (!address.addressLine1?.trim()) return 'Address line 1 is required';
    if (!address.city?.trim()) return 'City is required';
    if (!address.state?.trim()) return 'State is required';
    if (!address.pincode?.trim()) return 'Pincode is required';
    if (!address.country?.trim()) return 'Country is required';

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(address.phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }

    // Email validation (if provided)
    if (address.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      return 'Please enter a valid email address';
    }

    // Pincode validation (Indian format)
    if (!/^\d{6}$/.test(address.pincode)) {
      return 'Please enter a valid 6-digit pincode';
    }

    return null;
  };

  const handleSaveAddress = async () => {
    const validationError = validateAddress(newAddress);
    if (validationError) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: validationError,
      });
      return;
    }

    try {
      const method = editingAddress ? 'PUT' : 'POST';
      const body = editingAddress
        ? { ...newAddress, id: editingAddress.id, userId }
        : { ...newAddress, userId };

      const response = await fetch('/api/addresses', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        if (editingAddress) {
          setSavedAddresses(prev => prev.map(addr =>
            addr.id === editingAddress.id ? data.address : addr
          ));
        } else {
          setSavedAddresses(prev => [...prev, data.address]);
        }

        setNewAddress({
          type: 'home',
          name: '',
          phone: '',
          email: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
        });
        setShowNewAddressForm(false);
        setEditingAddress(null);

        toast({
          title: 'Success',
          description: `Address ${editingAddress ? 'updated' : 'added'} successfully`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to save address',
        });
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save address',
      });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await fetch(`/api/addresses?id=${addressId}&userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
        toast({
          title: 'Success',
          description: 'Address deleted successfully',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete address',
        });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete address',
      });
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setShowNewAddressForm(true);
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch('/api/addresses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: addressId,
          userId,
          isDefault: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSavedAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        })));
        toast({
          title: 'Success',
          description: 'Default address updated',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to set default address',
        });
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to set default address',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading addresses...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Address Book</h2>
          <p className="text-muted-foreground">Manage your delivery addresses</p>
        </div>
        <Button
          onClick={() => setShowNewAddressForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {/* Saved Addresses */}
      <div className="grid gap-4 md:grid-cols-2">
        {savedAddresses.map((address) => (
          <Card
            key={address.id}
            className={`relative ${address.isDefault ? 'ring-2 ring-primary' : ''}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-lg capitalize">{address.type}</CardTitle>
                  {address.isDefault && (
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  )}
                </div>
                <div className="flex gap-1">
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      title="Set as default"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{address.name}</p>
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>{address.city}, {address.state} {address.pincode}</p>
                <p>{address.country}</p>
                <p>Phone: {address.phone}</p>
                {address.email && <p>Email: {address.email}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {savedAddresses.length === 0 && !showNewAddressForm && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
          <p className="text-muted-foreground mb-4">Add your first delivery address to get started</p>
          <Button onClick={() => setShowNewAddressForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>
      )}

      {/* New Address Form */}
      {showNewAddressForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Address Type</Label>
                <RadioGroup
                  value={newAddress.type}
                  onValueChange={(value: 'home' | 'work' | 'other') =>
                    setNewAddress(prev => ({ ...prev, type: value }))
                  }
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home">Home</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="work" id="work" />
                    <Label htmlFor="work">Work</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAddress.email}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                placeholder="Street address, building name"
              />
            </div>

            <div>
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="addressLine2"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="State"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                  placeholder="Pincode"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSaveAddress} className="flex-1">
                {editingAddress ? 'Update Address' : 'Save Address'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewAddressForm(false);
                  setEditingAddress(null);
                  setNewAddress({
                    type: 'home',
                    name: '',
                    phone: '',
                    email: '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India',
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

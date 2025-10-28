'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Address } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface AddressStepProps {
  selectedAddress: Address | null;
  onAddressSelect: (address: Address) => void;
  onNext: () => void;
}

export default function AddressStep({ selectedAddress, onAddressSelect, onNext }: AddressStepProps) {
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
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/addresses?userId=user-123'); // In real app, get userId from auth context
      const data = await response.json();

      if (data.success) {
        setSavedAddresses(data.addresses);

        // Set default address if none selected
        if (!selectedAddress && data.addresses.length > 0) {
          const defaultAddr = data.addresses.find((addr: Address) => addr.isDefault);
          if (defaultAddr) {
            onAddressSelect(defaultAddr);
          }
        }
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

  const handleSaveAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.pincode) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in all required fields',
      });
      return;
    }

    try {
      const method = editingAddress ? 'PUT' : 'POST';
      const body = editingAddress
        ? { ...newAddress, id: editingAddress.id, userId: 'user-123' }
        : { ...newAddress, userId: 'user-123' };

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
    try {
      const response = await fetch(`/api/addresses?id=${addressId}&userId=user-123`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
        if (selectedAddress?.id === addressId) {
          // Find another address to select, or set to null
          const remainingAddresses = savedAddresses.filter(addr => addr.id !== addressId);
          onAddressSelect(remainingAddresses.length > 0 ? remainingAddresses[0] : null);
        }
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
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Delivery Address</h3>

        {/* Saved Addresses */}
        <div className="space-y-4 mb-6">
          {savedAddresses.map((address) => (
            <Card
              key={address.id}
              className={`cursor-pointer transition-all ${
                selectedAddress?.id === address.id
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onAddressSelect(address)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <RadioGroup value={selectedAddress?.id || ''}>
                      <RadioGroupItem value={address.id} />
                    </RadioGroup>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium capitalize">{address.type}</span>
                        {address.isDefault && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p className="font-medium">{address.name}</p>
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{address.city}, {address.state} {address.pincode}</p>
                        <p>{address.country}</p>
                        <p>Phone: {address.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Address Button */}
        {!showNewAddressForm && (
          <Button
            variant="outline"
            onClick={() => setShowNewAddressForm(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
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
                  <select
                    id="type"
                    className="w-full p-2 border rounded-md"
                    value={newAddress.type}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value as 'home' | 'work' | 'other' }))}
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="name">Full Name</Label>
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
                  <Label htmlFor="phone">Phone Number</Label>
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
                <Label htmlFor="addressLine1">Address Line 1</Label>
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
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
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

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selectedAddress}
          size="lg"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}

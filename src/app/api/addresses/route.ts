import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production, replace with real database
let addresses: any[] = [
  {
    id: 'addr-1',
    userId: 'user-123',
    type: 'home',
    name: 'John Doe',
    phone: '+91-9876543210',
    email: 'john@example.com',
    addressLine1: '123 Main Street',
    addressLine2: 'Apartment 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'addr-2',
    userId: 'user-123',
    type: 'work',
    name: 'John Doe',
    phone: '+91-9876543210',
    email: 'john@company.com',
    addressLine1: '456 Business Park',
    addressLine2: 'Floor 15, Tower A',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400002',
    country: 'India',
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/addresses - Get all addresses for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userAddresses = addresses.filter(addr => addr.userId === userId);

    return NextResponse.json({
      success: true,
      addresses: userAddresses,
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

// POST /api/addresses - Create a new address
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      type,
      name,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault = false,
    } = body;

    // Validation
    if (!userId || !type || !name || !phone || !addressLine1 || !city || !state || !pincode || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults for this user
    if (isDefault) {
      addresses = addresses.map(addr =>
        addr.userId === userId ? { ...addr, isDefault: false } : addr
      );
    }

    const newAddress = {
      id: `addr-${Date.now()}`,
      userId,
      type,
      name,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addresses.push(newAddress);

    return NextResponse.json({
      success: true,
      address: newAddress,
    });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    );
  }
}

// PUT /api/addresses - Update an address
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      userId,
      type,
      name,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault,
    } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Address ID and User ID are required' },
        { status: 400 }
      );
    }

    const addressIndex = addresses.findIndex(addr => addr.id === id && addr.userId === userId);

    if (addressIndex === -1) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults for this user
    if (isDefault) {
      addresses = addresses.map(addr =>
        addr.userId === userId ? { ...addr, isDefault: false } : addr
      );
    }

    addresses[addressIndex] = {
      ...addresses[addressIndex],
      type,
      name,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      address: addresses[addressIndex],
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE /api/addresses - Delete an address
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Address ID and User ID are required' },
        { status: 400 }
      );
    }

    const addressIndex = addresses.findIndex(addr => addr.id === id && addr.userId === userId);

    if (addressIndex === -1) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    const deletedAddress = addresses.splice(addressIndex, 1)[0];

    return NextResponse.json({
      success: true,
      address: deletedAddress,
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}

import { Metadata } from 'next';
import AddressBook from '@/components/address-book';

export const metadata: Metadata = {
  title: 'Address Book | Artify',
  description: 'Manage your delivery addresses',
};

export default function AddressesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AddressBook />
    </div>
  );
}

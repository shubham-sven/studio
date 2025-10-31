'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderStatus: string;
  onOrderCancelled: () => void;
}

const cancellationReasons = [
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'found_better_price', label: 'Found better price elsewhere' },
  { value: 'delayed_delivery', label: 'Delivery taking too long' },
  { value: 'wrong_item', label: 'Ordered wrong item' },
  { value: 'duplicate_order', label: 'Duplicate order' },
  { value: 'other', label: 'Other reason' },
];

export default function CancelOrderModal({
  isOpen,
  onClose,
  orderId,
  orderStatus,
  onOrderCancelled,
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const canCancel = ['placed', 'confirmed'].includes(orderStatus);

  const handleCancelOrder = async () => {
    if (!selectedReason) {
      toast({
        variant: 'destructive',
        title: 'Reason Required',
        description: 'Please select a reason for cancellation.',
      });
      return;
    }

    if (!canCancel) {
      toast({
        variant: 'destructive',
        title: 'Cannot Cancel',
        description: 'This order cannot be cancelled at this stage.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user-123', // In real app, get from auth context
          status: 'cancelled',
          cancellationReason: selectedReason,
          cancellationComments: additionalComments,
          notes: `Cancellation Reason: ${selectedReason}${additionalComments ? ` - ${additionalComments}` : ''}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Order Cancelled',
          description: 'Your order has been cancelled successfully. Any payment will be refunded within 5-7 business days.',
        });
        onOrderCancelled();
        onClose();
      } else {
        toast({
          variant: 'destructive',
          title: 'Cancellation Failed',
          description: data.error || 'Failed to cancel order. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to cancel order. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedReason('');
      setAdditionalComments('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Cancel Order
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel order #{orderId}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {!canCancel ? (
          <div className="py-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive">
                This order cannot be cancelled because it has already been {orderStatus}.
                Orders can only be cancelled before they are packed and shipped.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Reason for cancellation</Label>
              <RadioGroup
                value={selectedReason}
                onValueChange={setSelectedReason}
                className="mt-3"
              >
                {cancellationReasons.map((reason) => (
                  <div key={reason.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.value} id={reason.value} />
                    <Label htmlFor={reason.value} className="text-sm">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="comments">Additional Comments (Optional)</Label>
              <Textarea
                id="comments"
                placeholder="Please provide any additional details..."
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Cancellation Policy</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Orders can be cancelled before packing and shipping</li>
                <li>• Full refund will be processed within 5-7 business days</li>
                <li>• Refund will be credited to the original payment method</li>
                <li>• No cancellation fee applies</li>
              </ul>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            {canCancel ? 'Keep Order' : 'Close'}
          </Button>
          {canCancel && (
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={loading || !selectedReason}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Cancel Order
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

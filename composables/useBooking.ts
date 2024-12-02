import { defineStore } from 'pinia';

interface Booking {
  id: string;
  journeyId: string;
  userId: string;
  passengers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [] as Booking[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async createBooking(bookingData: Partial<Booking>): Promise<Booking | null> {
      this.loading = true;
      this.error = null;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newBooking: Booking = {
          id: Math.random().toString(36).substr(2, 9),
          journeyId: bookingData.journeyId!,
          userId: bookingData.userId!,
          passengers: bookingData.passengers!,
          totalPrice: bookingData.totalPrice!,
          status: 'confirmed',
          createdAt: new Date()
        };

        this.bookings.push(newBooking);
        return newBooking;
      } catch (error) {
        this.error = 'Failed to create booking';
        console.error('Error creating booking:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async getUserBookings(userId: string): Promise<Booking[]> {
      return this.bookings.filter(booking => booking.userId === userId);
    }
  }
});
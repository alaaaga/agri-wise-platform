
export interface BookingDetails {
  id: string;
  title: string;
  description?: string;
  booking_date: string;
  booking_time: string;
  service_type: string;
  status: string;
  price?: number;
  duration?: number;
  notes?: string;
  created_at: string;
  client_profile?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  consultant_profile?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

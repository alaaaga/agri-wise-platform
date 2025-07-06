import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, Phone, Video, MapPin, FileText, DollarSign } from 'lucide-react';
import { BookingDetails } from '@/types/booking';

interface BookingDetailsModalProps {
  booking: BookingDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingDetailsModal = ({ booking, isOpen, onClose }: BookingDetailsModalProps) => {
  const { language } = useLanguage();

  if (!booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return language === 'en' ? 'Confirmed' : 'مؤكد';
      case 'pending':
        return language === 'en' ? 'Pending' : 'معلق';
      case 'cancelled':
        return language === 'en' ? 'Cancelled' : 'ملغي';
      case 'completed':
        return language === 'en' ? 'Completed' : 'مكتمل';
      default:
        return status;
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'field_visit':
        return <MapPin className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getServiceText = (serviceType: string) => {
    switch (serviceType) {
      case 'phone':
        return language === 'en' ? 'Phone Consultation' : 'استشارة هاتفية';
      case 'video':
        return language === 'en' ? 'Video Consultation' : 'استشارة مرئية';
      case 'field_visit':
        return language === 'en' ? 'Field Visit' : 'زيارة ميدانية';
      default:
        return serviceType;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{language === 'en' ? 'Booking Details' : 'تفاصيل الحجز'}</span>
            <Badge className={getStatusColor(booking.status)}>
              {getStatusText(booking.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلومات أساسية */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {language === 'en' ? 'Basic Information' : 'المعلومات الأساسية'}
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">{booking.title}</p>
                  {booking.description && (
                    <p className="text-sm text-muted-foreground mt-1">{booking.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  {getServiceIcon(booking.service_type)}
                  <span>{getServiceText(booking.service_type)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* التوقيت والمدة */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {language === 'en' ? 'Schedule' : 'التوقيت'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(booking.booking_date).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.booking_time}</span>
                </div>
                {booking.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {booking.duration} {language === 'en' ? 'minutes' : 'دقيقة'}
                    </span>
                  </div>
                )}
                {booking.price && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.price} جنيه</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* معلومات العميل */}
          {booking.client_profile && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {language === 'en' ? 'Client Information' : 'معلومات العميل'}
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">
                      {language === 'en' ? 'Name: ' : 'الاسم: '}
                    </span>
                    {booking.client_profile.first_name} {booking.client_profile.last_name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">
                      {language === 'en' ? 'Email: ' : 'البريد الإلكتروني: '}
                    </span>
                    {booking.client_profile.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* معلومات المستشار */}
          {booking.consultant_profile && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {language === 'en' ? 'Consultant Information' : 'معلومات المستشار'}
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">
                      {language === 'en' ? 'Name: ' : 'الاسم: '}
                    </span>
                    {booking.consultant_profile.first_name} {booking.consultant_profile.last_name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">
                      {language === 'en' ? 'Email: ' : 'البريد الإلكتروني: '}
                    </span>
                    {booking.consultant_profile.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ملاحظات */}
          {booking.notes && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {language === 'en' ? 'Notes' : 'ملاحظات'}
                </h3>
                <p className="text-sm whitespace-pre-wrap">{booking.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;

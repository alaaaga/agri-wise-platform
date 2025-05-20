import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { LoginPromptModal } from '@/components/LoginPromptModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const CaseStudies = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const titleRef = useScrollAnimation();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any>(null);
  const [caseStudyDialogOpen, setCaseStudyDialogOpen] = useState(false);

  // Mock case study data - would typically come from an API
  const caseStudies = [
    {
      id: 1,
      title: language === 'en' ? 'Increasing Yield by 40% with Precision Irrigation' : 'زيادة المحصول بنسبة 40٪ باستخدام الري الدقيق',
      location: language === 'en' ? 'Al-Qassim Region, Saudi Arabia' : 'منطقة القصيم، المملكة العربية السعودية',
      image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      summary: language === 'en' 
        ? 'How a 500-acre farm implemented smart irrigation technology to dramatically reduce water usage while increasing crop yield.' 
        : 'كيف قامت مزرعة مساحتها 500 فدان بتنفيذ تقنية الري الذكي لتقليل استخدام المياه بشكل كبير مع زيادة المحصول.',
      category: language === 'en' ? 'Water Management' : 'إدارة المياه',
      results: [
        language === 'en' ? '40% increase in overall yield' : 'زيادة بنسبة 40٪ في المحصول الإجمالي',
        language === 'en' ? '35% reduction in water consumption' : 'انخفاض بنسبة 35٪ في استهلاك المياه',
        language === 'en' ? 'ROI achieved within 18 months' : 'تحقق عائد الاستثمار خلال 18 شهرًا'
      ]
    },
    {
      id: 2,
      title: language === 'en' ? 'Transitioning to Organic Farming: A 3-Year Journey' : 'التحول إلى الزراعة العضوية: رحلة 3 سنوات',
      location: language === 'en' ? 'Asir Region, Saudi Arabia' : 'منطقة عسير، المملكة العربية السعودية',
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      summary: language === 'en' 
        ? 'Documenting the challenges and rewards of converting a conventional farm to certified organic production.' 
        : 'توثيق تحديات ومكافآت تحويل مزرعة تقليدية إلى إنتاج عضوي معتمد.',
      category: language === 'en' ? 'Organic Farming' : 'الزراعة العضوية',
      results: [
        language === 'en' ? 'Successful organic certification achieved' : 'تحقيق شهادة المنتجات العضوية بنجاح',
        language === 'en' ? '25% premium on produce prices' : 'علاوة 25٪ على أسعار المنتجات',
        language === 'en' ? '80% reduction in synthetic inputs' : 'انخفاض بنسبة 80٪ في المدخلات الاصطناعية'
      ]
    },
    {
      id: 3,
      title: language === 'en' ? 'Revitalizing Degraded Soil Through Regenerative Practices' : 'إحياء التربة المتدهورة من خلال الممارسات التجديدية',
      location: language === 'en' ? 'Riyadh Region, Saudi Arabia' : 'منطقة الرياض، المملكة العربية السعودية',
      image: 'https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      summary: language === 'en' 
        ? 'How cover cropping, no-till methods, and composting transformed depleted soil into productive farmland in just 4 years.' 
        : 'كيف حولت المحاصيل الغطائية وطرق عدم الحرث والتسميد التربة المستنفدة إلى أرض زراعية منتجة في 4 سنوات فقط.',
      category: language === 'en' ? 'Soil Health' : 'صحة التربة',
      results: [
        language === 'en' ? '300% increase in soil organic matter' : 'زيادة بنسبة 300٪ في المواد العضوية في التربة',
        language === 'en' ? 'Significantly improved water retention' : 'تحسين احتباس المياه بشكل كبير',
        language === 'en' ? 'Enhanced resilience to drought conditions' : 'تعزيز المرونة في ظروف الجفاف'
      ]
    },
    {
      id: 4,
      title: language === 'en' ? 'Modern Technology Integration in Traditional Dairy Farming' : 'دمج التكنولوجيا الحديثة في مزارع الألبان التقليدية',
      location: language === 'en' ? 'Eastern Province, Saudi Arabia' : 'المنطقة الشرقية، المملكة العربية السعودية',
      image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      summary: language === 'en' 
        ? 'A family-run dairy operation improved efficiency and animal welfare through strategic technology adoption.' 
        : 'حسنت عملية ألبان تديرها عائلة كفاءتها ورفاهية الحيوانات من خلال تبني استراتيجي للتكنولوجيا.',
      category: language === 'en' ? 'Livestock Management' : 'إدارة الثروة الحيوانية',
      results: [
        language === 'en' ? '30% increase in milk production' : 'زيادة بنسبة 30٪ في إنتاج الحليب',
        language === 'en' ? '40% reduction in veterinary costs' : 'انخفاض بنسبة 40٪ في تكاليف الطب البيطري',
        language === 'en' ? 'Improved animal health metrics' : 'تحسين مقاييس صحة الحيوان'
      ]
    },
    {
      id: 5,
      title: language === 'en' ? 'Pest Management with Beneficial Insects' : 'إدارة الآفات باستخدام الحشرات المفيدة',
      location: language === 'en' ? 'Makkah Region, Saudi Arabia' : 'منطقة مكة المكرمة، المملكة العربية السعودية',
      image: 'https://images.unsplash.com/photo-1533636721434-0e2d61030955?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      summary: language === 'en' 
        ? 'How introducing predatory insects reduced pest pressure and eliminated the need for chemical pesticides in a vegetable operation.' 
        : 'كيف أدى إدخال الحشرات المفترسة إلى تقليل ضغط الآفات والقضاء على الحاجة إلى المبيدات الكيميائية في عملية الخضروات.',
      category: language === 'en' ? 'Pest Control' : 'مكافحة الآفات',
      results: [
        language === 'en' ? '90% reduction in chemical pesticide use' : 'انخفاض بنسبة 90٪ في استخدام المبيدات الكيميائية',
        language === 'en' ? 'Improved produce quality and shelf life' : 'تحسين جودة المنتج وعمره الافتراضي',
        language === 'en' ? 'Lower production costs' : 'خفض تكاليف الإنتاج'
      ]
    },
    {
      id: 6,
      title: language === 'en' ? 'Diversification for Economic Resilience' : 'التنويع من أجل المرونة الاقتصادية',
      location: language === 'en' ? 'Madinah Region, Saudi Arabia' : 'منطقة المدينة المنورة، المملكة العربية السعودية',
      image: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      summary: language === 'en' 
        ? 'A strategy of crop diversification and value-added products helped a small farm thrive through market fluctuations.' 
        : 'ساعدت استراتيجية تنويع المحاصيل والمنتجات ذات القيمة المضافة مزرعة صغيرة على الازدهار من خلال تقلبات السوق.',
      category: language === 'en' ? 'Farm Business' : 'أعمال المزرعة',
      results: [
        language === 'en' ? 'Revenue growth of 55% over 3 years' : 'نمو الإيرادات بنسبة 55٪ على مدى 3 سنوات',
        language === 'en' ? 'Reduced revenue volatility' : 'انخفاض تقلب الإيرادات',
        language === 'en' ? 'Creation of 5 new full-time jobs' : 'إنشاء 5 وظائف جديدة بدوام كامل'
      ]
    }
  ];

  const categories = [
    { name: language === 'en' ? 'Water Management' : 'إدارة المياه', color: 'bg-blue-100 text-blue-800' },
    { name: language === 'en' ? 'Organic Farming' : 'الزراعة العضوية', color: 'bg-green-100 text-green-800' },
    { name: language === 'en' ? 'Soil Health' : 'صحة التربة', color: 'bg-amber-100 text-amber-800' },
    { name: language === 'en' ? 'Livestock Management' : 'إدارة الثروة الحيوانية', color: 'bg-purple-100 text-purple-800' },
    { name: language === 'en' ? 'Pest Control' : 'مكافحة الآفات', color: 'bg-red-100 text-red-800' },
    { name: language === 'en' ? 'Farm Business' : 'أعمال المزرعة', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const getCategoryColor = (category: string) => {
    const found = categories.find(c => c.name === category);
    return found ? found.color : 'bg-gray-100 text-gray-800';
  };

  const handleReadCaseStudy = (caseStudy: any) => {
    if (isAuthenticated) {
      setSelectedCaseStudy(caseStudy);
      setCaseStudyDialogOpen(true);
    } else {
      setSelectedCaseStudy(caseStudy);
      setLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    // This will be called after successful login
    if (selectedCaseStudy) {
      setCaseStudyDialogOpen(true);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'en' ? 'Farming Case Studies' : 'دراسات حالة زراعية'}
            </h1>
            <p className="text-xl mb-4">
              {language === 'en'
                ? 'Real-world success stories from farms we\'ve worked with'
                : 'قصص نجاح واقعية من المزارع التي عملنا معها'}
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="rounded-full">
              {language === 'en' ? 'All Categories' : 'جميع الفئات'}
            </Button>
            
            {categories.map((category, index) => (
              <Button key={index} variant="outline" className={`rounded-full ${category.color.split(' ')[0]} border-0`}>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <Card key={study.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="relative h-48">
                  <img 
                    src={study.image} 
                    alt={study.title}
                    className="object-cover w-full h-full"
                  />
                  <div className={`absolute top-4 ${language === 'en' ? 'right-4' : 'left-4'} ${getCategoryColor(study.category)} px-3 py-1 rounded-full text-sm font-medium`}>
                    {study.category}
                  </div>
                </div>
                <CardContent className="p-6 flex-grow">
                  <div className="text-sm text-gray-500 mb-2">{study.location}</div>
                  <h3 className="font-bold text-xl mb-3">{study.title}</h3>
                  <p className="text-gray-700 mb-4">{study.summary}</p>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">
                      {language === 'en' ? 'KEY RESULTS:' : 'النتائج الرئيسية:'}
                    </h4>
                    <ul className="list-disc ml-5 rtl:mr-5 rtl:ml-0 text-sm text-gray-600 space-y-1">
                      {study.results.map((result: string, idx: number) => (
                        <li key={idx}>{result}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-gray-50 border-t">
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => handleReadCaseStudy(study)}
                  >
                    {language === 'en' ? 'Read Full Case Study' : 'قراءة دراسة الحالة كاملة'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
              {language === 'en' ? 'Load More Case Studies' : 'تحميل المزيد من دراسات الحالة'}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' 
              ? 'Want similar results for your farm?' 
              : 'هل تريد نتائج مماثلة لمزرعتك؟'}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {language === 'en'
              ? 'Our agricultural consultants can develop a customized plan for your specific farming operation.'
              : 'يمكن لمستشارينا الزراعيين تطوير خطة مخصصة لعملية الزراعة الخاصة بك.'}
          </p>
          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            <Link to="/book">
              <Button size="lg" className="bg-white text-indigo-800 hover:bg-gray-100">
                {language === 'en' ? 'Schedule a Consultation' : 'جدولة استشارة'}
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-indigo-700">
                {language === 'en' ? 'View Services' : 'عرض الخدمات'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' 
                ? 'Get New Case Studies in Your Inbox' 
                : 'احصل على دراسات حالة جديدة في بريدك الوارد'}
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Subscribe to receive our latest case studies, farming tips, and agricultural insights.'
                : 'اشترك لتلقي أحدث دراسات الحالة لدينا، ونصائح الزراعة، والرؤى الزراعية.'}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder={language === 'en' ? 'Your email address' : 'عنوان بريدك الإلكتروني'} 
                className="px-4 py-2 border rounded-md flex-1"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                {language === 'en' ? 'Subscribe' : 'اشترك'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        message={language === 'en'
          ? 'You need to login to read the full case study.'
          : 'تحتاج إلى تسجيل الدخول لقراءة دراسة الحالة كاملة.'}
      />

      {/* Case Study Full Dialog */}
      {selectedCaseStudy && (
        <Dialog open={caseStudyDialogOpen} onOpenChange={setCaseStudyDialogOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedCaseStudy.title}</DialogTitle>
              <DialogDescription className="text-sm">
                {selectedCaseStudy.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="h-64 md:h-80 overflow-hidden rounded-lg mb-6">
                <img 
                  src={selectedCaseStudy.image} 
                  alt={selectedCaseStudy.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className={`inline-block ${getCategoryColor(selectedCaseStudy.category)} px-3 py-1 rounded-full text-sm font-medium mb-4`}>
                {selectedCaseStudy.category}
              </div>
              
              <h2 className="text-2xl font-bold mb-4">{selectedCaseStudy.title}</h2>
              
              <div className="prose max-w-none">
                <p className="text-gray-800 mb-6">{selectedCaseStudy.summary}</p>
                
                <h3 className="text-xl font-semibold mb-3">
                  {language === 'en' ? 'Challenge' : 'التحدي'}
                </h3>
                <p className="text-gray-700 mb-6">
                  {language === 'en'
                    ? `The ${selectedCaseStudy.title.toLowerCase()} project faced significant challenges including resource constraints, environmental factors, and the need to maintain productivity while implementing new methods.`
                    : `واجه مشروع ${selectedCaseStudy.title} تحديات كبيرة بما في ذلك قيود الموارد والعوامل البيئية والحاجة إلى الحفاظ على الإنتاجية أثناء تنفيذ طرق جديدة.`}
                </p>
                
                <h3 className="text-xl font-semibold mb-3">
                  {language === 'en' ? 'Solution' : 'الحل'}
                </h3>
                <p className="text-gray-700 mb-6">
                  {language === 'en'
                    ? `Through careful planning and expert consultation, we implemented a comprehensive approach that addressed the specific needs of the farm while considering long-term sustainability.`
                    : `من خلال التخطيط الدقيق والاستشارة الخبيرة، قمنا بتنفيذ نهج شامل يلبي الاحتياجات المحددة للمزرعة مع مراعاة الاستدامة على المدى الطويل.`}
                </p>
                
                <h3 className="text-xl font-semibold mb-3">
                  {language === 'en' ? 'Implementation' : 'التنفيذ'}
                </h3>
                <p className="text-gray-700 mb-6">
                  {language === 'en'
                    ? `The implementation was conducted in phases over the course of several growing seasons, with careful monitoring of outcomes at each stage to allow for adjustments.`
                    : `تم تنفيذ المشروع على مراحل على مدار عدة مواسم نمو، مع مراقبة دقيقة للنتائج في كل مرحلة للسماح بإجراء التعديلات.`}
                </p>
                
                <h3 className="text-xl font-semibold mb-3">
                  {language === 'en' ? 'Results' : 'النتائج'}
                </h3>
                <ul className="list-disc pl-5 rtl:pr-5 rtl:pl-0 text-gray-700 space-y-2 mb-6">
                  {selectedCaseStudy.results.map((result: string, idx: number) => (
                    <li key={idx} className="text-base">{result}</li>
                  ))}
                </ul>
                
                <h3 className="text-xl font-semibold mb-3">
                  {language === 'en' ? 'Conclusion' : 'الخلاصة'}
                </h3>
                <p className="text-gray-700">
                  {language === 'en'
                    ? `This case study demonstrates how targeted agricultural interventions can lead to significant improvements in productivity, sustainability, and profitability. The methodologies developed can be adapted for similar farming operations facing comparable challenges.`
                    : `توضح دراسة الحالة هذه كيف يمكن للتدخلات الزراعية المستهدفة أن تؤدي إلى تحسينات كبيرة في الإنتاجية والاستدامة والربحية. يمكن تكييف المنهجيات المطورة للعمليات الزراعية المماثلة التي تواجه تحديات مماثلة.`}
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setCaseStudyDialogOpen(false)}>
                {language === 'en' ? 'Close' : 'إغلاق'}
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                {language === 'en' ? 'Book a Consultation' : 'حجز استشارة'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default CaseStudies;

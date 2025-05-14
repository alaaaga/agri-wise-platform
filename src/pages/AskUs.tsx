
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

const AskUs = () => {
  const { language } = useLanguage();
  const titleRef = useScrollAnimation();

  // Mock FAQ data - would typically come from an API
  const faqs = [
    {
      question: language === 'en' 
        ? 'What are the best crops to grow in arid regions?' 
        : 'ما هي أفضل المحاصيل للزراعة في المناطق القاحلة؟',
      answer: language === 'en'
        ? 'Drought-resistant crops such as dates, olives, pomegranates, and certain varieties of wheat and barley work well in arid regions. Additionally, vegetables like okra, eggplant, and peppers can thrive with proper water management. Consider also drought-tolerant herbs like rosemary, sage, and thyme.'
        : 'المحاصيل المقاومة للجفاف مثل التمور والزيتون والرمان وأصناف معينة من القمح والشعير تعمل بشكل جيد في المناطق القاحلة. بالإضافة إلى ذلك، يمكن للخضروات مثل البامية والباذنجان والفلفل أن تزدهر مع إدارة المياه بشكل صحيح. فكر أيضًا في الأعشاب المقاومة للجفاف مثل إكليل الجبل والمريمية والزعتر.'
    },
    {
      question: language === 'en' 
        ? 'How can I improve soil fertility naturally?' 
        : 'كيف يمكنني تحسين خصوبة التربة بشكل طبيعي؟',
      answer: language === 'en'
        ? 'To improve soil fertility naturally, incorporate compost and organic matter, practice crop rotation, use cover crops, apply mulch, introduce beneficial microorganisms, and consider using organic fertilizers like manure, bone meal, or fish emulsion. Regular soil testing can help monitor progress and identify specific deficiencies to address.'
        : 'لتحسين خصوبة التربة بشكل طبيعي، قم بدمج السماد العضوي والمواد العضوية، وممارسة تناوب المحاصيل، واستخدام المحاصيل الغطائية، وتطبيق الغطاء العضوي، وإدخال الكائنات الحية الدقيقة المفيدة، والنظر في استخدام الأسمدة العضوية مثل السماد الحيواني أو مسحوق العظام أو مستحلب السمك. يمكن أن يساعد اختبار التربة المنتظم في مراقبة التقدم وتحديد أوجه القصور المحددة لمعالجتها.'
    },
    {
      question: language === 'en' 
        ? 'When is the best time to prune fruit trees?' 
        : 'ما هو أفضل وقت لتقليم أشجار الفاكهة؟',
      answer: language === 'en'
        ? 'The best time to prune most fruit trees is during their dormant season, typically late winter to early spring before new growth appears. This timing minimizes stress on the trees and reduces the risk of disease. However, specific timing can vary by species - stone fruits like peaches are usually pruned after flowering, while apples and pears benefit from winter pruning.'
        : 'أفضل وقت لتقليم معظم أشجار الفاكهة هو خلال موسم السكون، عادة من أواخر الشتاء إلى أوائل الربيع قبل ظهور النمو الجديد. يقلل هذا التوقيت من الإجهاد على الأشجار ويقلل من مخاطر الإصابة بالأمراض. ومع ذلك، يمكن أن يختلف التوقيت المحدد حسب الأنواع - عادة ما يتم تقليم فاكهة النواة مثل الخوخ بعد الإزهار، بينما تستفيد التفاح والكمثرى من التقليم الشتوي.'
    },
    {
      question: language === 'en' 
        ? 'How do I control pests without chemical pesticides?' 
        : 'كيف أسيطر على الآفات بدون المبيدات الكيميائية؟',
      answer: language === 'en'
        ? 'To control pests without chemicals, focus on prevention by maintaining healthy soil and plants, practicing crop rotation, and using physical barriers like row covers. Introduce beneficial insects like ladybugs, lacewings, and predatory mites. Apply organic deterrents such as neem oil, diatomaceous earth, or homemade soap sprays. Implement companion planting with pest-repelling herbs like basil and marigolds.'
        : 'للسيطرة على الآفات بدون مواد كيميائية، ركز على الوقاية من خلال الحفاظ على تربة ونباتات صحية، وممارسة تناوب المحاصيل، واستخدام حواجز مادية مثل أغطية الصفوف. قم بإدخال الحشرات المفيدة مثل الخنافس والمن الأخضر والعث المفترس. ضع رادعات عضوية مثل زيت النيم، والتراب الدياتومي، أو رذاذات الصابون محلية الصنع. قم بتنفيذ الزراعة المصاحبة مع الأعشاب الطاردة للآفات مثل الريحان وأزهار القطيفة.'
    },
    {
      question: language === 'en' 
        ? 'What are signs of nutrient deficiency in crops?' 
        : 'ما هي علامات نقص المغذيات في المحاصيل؟',
      answer: language === 'en'
        ? 'Common signs of nutrient deficiency include yellowing leaves (nitrogen), purple leaf edges (phosphorus), brown leaf margins (potassium), deformed new growth (calcium), and interveinal yellowing (magnesium, iron). Stunted growth, poor flowering or fruiting, and unusual leaf patterns often indicate specific deficiencies. Soil testing is the most accurate method to identify exactly which nutrients your crops need.'
        : 'تشمل العلامات الشائعة لنقص المغذيات اصفرار الأوراق (النيتروجين)، وحواف الأوراق البنفسجية (الفوسفور)، وحواف الأوراق البنية (البوتاسيوم)، والنمو الجديد المشوه (الكالسيوم)، والاصفرار بين عروق الورق (المغنيسيوم، الحديد). غالبًا ما يشير النمو المتعثر، وضعف الإزهار أو الإثمار، وأنماط الأوراق غير العادية إلى نقص محدد. اختبار التربة هو الطريقة الأكثر دقة لتحديد المغذيات التي تحتاجها محاصيلك بالضبط.'
    },
    {
      question: language === 'en' 
        ? 'How can I increase milk production in my dairy herd?' 
        : 'كيف يمكنني زيادة إنتاج الحليب في قطيع الألبان لدي؟',
      answer: language === 'en'
        ? 'To increase milk production, focus on nutrition by providing a balanced diet with quality forages, appropriate grain concentrates, and proper mineral supplementation. Ensure consistent feeding schedules and abundant clean water. Maintain comfortable housing with adequate space, ventilation, and clean bedding. Implement regular health checks and preventive care. Consider genetic selection for higher milk production traits and employ modern milking practices with well-maintained equipment.'
        : 'لزيادة إنتاج الحليب، ركز على التغذية من خلال توفير نظام غذائي متوازن مع أعلاف ذات جودة، ومركزات حبوب مناسبة، ومكملات معدنية مناسبة. تأكد من جداول تغذية متسقة ووفرة المياه النظيفة. حافظ على سكن مريح مع مساحة كافية وتهوية وفراش نظيف. قم بتنفيذ فحوصات صحية منتظمة ورعاية وقائية. فكر في الاختيار الوراثي لصفات إنتاج الحليب العالي واستخدم ممارسات الحلب الحديثة مع معدات جيدة الصيانة.'
    }
  ];

  // Form state (simplified for this example)
  const [questionCategory, setQuestionCategory] = React.useState('');
  const [question, setQuestion] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Question submitted:', { questionCategory, question });
    // In a real implementation, this would send the question to a backend
    alert(language === 'en' ? 'Question submitted successfully!' : 'تم إرسال السؤال بنجاح!');
    setQuestionCategory('');
    setQuestion('');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'en' ? 'Ask Our Agricultural Experts' : 'اسأل خبراءنا الزراعيين'}
            </h1>
            <p className="text-xl mb-4">
              {language === 'en'
                ? 'Get professional answers to your farming questions'
                : 'احصل على إجابات احترافية لأسئلتك الزراعية'}
            </p>
          </div>
        </div>
      </section>

      {/* Ask Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-teal-800">
              {language === 'en' ? 'Submit Your Question' : 'أرسل سؤالك'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  {language === 'en' ? 'Question Category' : 'فئة السؤال'}
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  value={questionCategory}
                  onChange={(e) => setQuestionCategory(e.target.value)}
                  required
                >
                  <option value="">{language === 'en' ? '-- Select Category --' : '-- اختر الفئة --'}</option>
                  <option value="crops">{language === 'en' ? 'Crop Management' : 'إدارة المحاصيل'}</option>
                  <option value="livestock">{language === 'en' ? 'Livestock Care' : 'رعاية الماشية'}</option>
                  <option value="soil">{language === 'en' ? 'Soil Health' : 'صحة التربة'}</option>
                  <option value="water">{language === 'en' ? 'Water Management' : 'إدارة المياه'}</option>
                  <option value="organic">{language === 'en' ? 'Organic Farming' : 'الزراعة العضوية'}</option>
                  <option value="tech">{language === 'en' ? 'Farm Technology' : 'تكنولوجيا المزرعة'}</option>
                  <option value="business">{language === 'en' ? 'Farm Business' : 'أعمال المزرعة'}</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  {language === 'en' ? 'Your Question' : 'سؤالك'}
                </label>
                <textarea
                  className="w-full px-4 py-2 border rounded-md h-32"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Please provide as much detail as possible about your question...'
                      : 'يرجى تقديم أكبر قدر ممكن من التفاصيل حول سؤالك...'
                  }
                  required
                />
              </div>
              
              <div className="text-center">
                <Button type="submit" className="bg-teal-700 hover:bg-teal-800">
                  {language === 'en' ? 'Submit Question' : 'إرسال السؤال'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            {language === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-l-4 rtl:border-l-0 rtl:border-r-4 border-teal-500">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-teal-800">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Consultation CTA */}
      <section className="bg-teal-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' 
              ? 'Need Personalized Advice?' 
              : 'هل تحتاج إلى نصيحة مخصصة؟'}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {language === 'en'
              ? 'Our agricultural experts can provide tailored solutions for your specific farming challenges.'
              : 'يمكن لخبرائنا الزراعيين تقديم حلول مخصصة لتحديات الزراعة الخاصة بك.'}
          </p>
          <Link to="/book">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-800">
              {language === 'en' ? 'Schedule a Consultation' : 'جدولة استشارة'}
            </Button>
          </Link>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            {language === 'en' ? 'Explore Our Knowledge Resources' : 'استكشف موارد المعرفة لدينا'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-teal-800">
                  {language === 'en' ? 'Articles' : 'المقالات'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'en' 
                    ? 'In-depth articles on various agricultural topics' 
                    : 'مقالات متعمقة حول مواضيع زراعية متنوعة'}
                </p>
                <Link to="/content/articles">
                  <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                    {language === 'en' ? 'Browse Articles' : 'تصفح المقالات'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-teal-800">
                  {language === 'en' ? 'Videos' : 'الفيديوهات'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'en' 
                    ? 'Educational videos demonstrating farming techniques' 
                    : 'فيديوهات تعليمية توضح تقنيات الزراعة'}
                </p>
                <Link to="/content/videos">
                  <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                    {language === 'en' ? 'Watch Videos' : 'مشاهدة الفيديوهات'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-teal-800">
                  {language === 'en' ? 'Case Studies' : 'دراسات الحالة'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'en' 
                    ? 'Real-world examples of successful farming practices' 
                    : 'أمثلة واقعية لممارسات زراعية ناجحة'}
                </p>
                <Link to="/content/case-studies">
                  <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                    {language === 'en' ? 'View Case Studies' : 'عرض دراسات الحالة'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AskUs;

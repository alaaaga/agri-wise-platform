
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import ArticlesSection from '@/components/home/ArticlesSection';
import AnimalArticlesSection from '@/components/AnimalArticlesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterSubscription from '@/components/NewsletterSubscription';

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <ArticlesSection />
      <AnimalArticlesSection />
      <TestimonialsSection />
      <NewsletterSubscription />
    </Layout>
  );
};

export default Home;

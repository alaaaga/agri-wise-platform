
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import ArticlesSection from '@/components/home/ArticlesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <ArticlesSection />
      <TestimonialsSection />
    </Layout>
  );
};

export default Home;

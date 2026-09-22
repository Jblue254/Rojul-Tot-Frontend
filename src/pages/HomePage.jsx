import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import ServicesSection from "../components/home/ServicesSection";
import FeaturedMachines from "../components/home/FeaturedMachines";
import FeaturedDrawings from "../components/home/FeaturedDrawings";
import ProjectsSection from "../components/home/ProjectsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";
import MainLayout from "../layouts/MainLayout";


function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <FeaturedMachines />
      <FeaturedDrawings />
      <ProjectsSection />
      <TestimonialsSection />
      <CTASection />
    </MainLayout>
  );
}

export default HomePage;
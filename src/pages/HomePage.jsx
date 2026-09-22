import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import ServicesSection from "../components/home/ServicesSection";
import FeaturedMachines from "../components/home/FeaturedMachines";
import FeaturedDrawings from "../components/home/FeaturedDrawings";
import ProjectsSection from "../components/home/ProjectsSection";


function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <FeaturedMachines />
      <FeaturedDrawings />
      <ProjectsSection />
    </>
  );
}

export default HomePage;
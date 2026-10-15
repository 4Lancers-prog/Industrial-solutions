import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta.js';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import EquipmentGallery from '../components/EquipmentGallery.jsx';
import ProcessTimeline from '../components/ProcessTimeline.jsx';
import CTABand from '../components/CTABand.jsx';
import { PAGE_PROCESS } from '../data/services.js';

export default function ProductsPage() {
  useMeta({
    title: 'Products & Works | Industrial Solutions',
    description: 'Full catalogue of hydraulic and pneumatic trainers, electrical machines, motor-generator sets, control panels and laboratory equipment, with photographs of completed installations.',
  });

  return (
    <>
      <PageHero crumb="Products" title="Products & Works"
        text="Our full range of training and laboratory equipment, with photographs of completed installations. Specifications are available on request."
        image="/images/hydraulic-pneumatic-trainer-lab.webp"
        alt="Hydraulic and pneumatic trainer stations with cut-section component panels">
        <Link to="/#enquiry" className="btn btn--primary">Request a Quote</Link>
        <Link to="/about" className="btn btn--outline-light">About Us</Link>
      </PageHero>

      {/* full catalogue with filter + search */}
      <section id="catalogue" className="section">
        <div className="container">
          <SectionHeading title="Product Catalogue" intro="Filter by category or search by component name. Click a photo to enlarge it. Specifications are available on request." />
          <ProductGrid />
        </div>
      </section>

      <section id="works" className="section section--grey">
        <div className="container">
          <SectionHeading title="Our Works" intro="Photographs of completed installations and equipment. Click any image to enlarge." />
          <EquipmentGallery />
        </div>
      </section>

      <ProcessTimeline title="A structured, flexible process"
        intro="A proposed workflow from first conversation to handover. Timelines depend on your requirements and are discussed with you."
        steps={PAGE_PROCESS} />

      <CTABand title="Planning an Industrial Laboratory or Equipment Setup?"
        text="Tell us about your equipment requirements and our team will help with suitable products, supply and installation needs."
        primary={{ label: 'Request a Quote', to: '/#enquiry' }}
        secondary={{ label: 'WhatsApp Us' }} />
    </>
  );
}

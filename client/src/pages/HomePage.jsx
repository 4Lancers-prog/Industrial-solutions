import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta.js';
import HeroSection from '../components/HeroSection.jsx';
import Marquee from '../components/Marquee.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import NumberCard from '../components/NumberCard.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import VideoShowcase from '../components/VideoShowcase.jsx';
import EquipmentGallery from '../components/EquipmentGallery.jsx';
import ProcessTimeline from '../components/ProcessTimeline.jsx';
import EnquiryForm from '../components/EnquiryForm.jsx';
import RevealGrid from '../components/RevealGrid.jsx';
import Icon from '../components/Icon.jsx';
import { FEATURED } from '../data/products.js';
import { PAGE_PROCESS } from '../data/services.js';
import { SITE, whatsappLink, enquiryLink } from '../config/site.js';

export default function HomePage() {
  useMeta({
    title: 'Industrial Solutions | Engineering Equipment & Laboratory Systems',
    description: 'Explore industrial training equipment, hydraulic and pneumatic systems, electrical machines, laboratory equipment, installation, and commissioning services.',
  });

  return (
    <>
      <HeroSection />
      <Marquee />

      {/* 01-06 equipment cards */}
      <section id="equipment" className="section section--ink">
        <div className="container">
          <SectionHeading light title="Our Equipment" intro="Six equipment categories, shown with photographs of the real equipment. Specifications are available on request." />
          <RevealGrid className="grid grid--3 grid--rail">
            {FEATURED.map((f, i) => (
              <NumberCard key={f.id} num={i + 1} title={f.name} text={f.desc} image={f.image} alt={f.alt}
                footer={(
                  <>
                    <Link to={`/#cat-${f.anchor || f.id}`} className="btn btn--ghost-light">View Details</Link>
                    <Link to={enquiryLink(f.product)} className="btn btn--primary">Enquire Now</Link>
                  </>
                )} />
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* full catalogue with filter + search */}
      <section id="catalogue" className="section">
        <div className="container">
          <SectionHeading title="Product Catalogue" intro="Filter by category or search by component name. Click a photo to enlarge it. Specifications are available on request." />
          <ProductGrid />
        </div>
      </section>

      <VideoShowcase />

      <section id="works" className="section section--grey">
        <div className="container">
          <SectionHeading title="Our Works" intro="Photographs of the equipment. Click any image to enlarge." />
          <EquipmentGallery />
        </div>
      </section>

      <ProcessTimeline title="A structured, flexible process"
        intro="A proposed workflow from first conversation to handover. Timelines depend on your requirements and are discussed with you."
        steps={PAGE_PROCESS} />

      <section id="enquiry" className="section section--grey">
        <div className="container enquiry-layout">
          <div className="enquiry-layout__intro">
            <SectionHeading title="Send Us Your Requirements" intro="Tell us what equipment or laboratory you need and we will get back to you. For a faster reply use WhatsApp or call." />
            <ul className="quick-contact">
              <li><Icon name="phone" size={20} /><a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a></li>
              <li><Icon name="mail" size={20} /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><Icon name="chat" size={20} /><a href={whatsappLink()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></li>
              <li><Icon name="pin" size={20} /><a href={SITE.mapUrl} target="_blank" rel="noopener noreferrer">{SITE.address}</a></li>
            </ul>
          </div>
          <div className="enquiry-layout__form"><EnquiryForm /></div>
        </div>
      </section>
    </>
  );
}

import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta.js';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import NumberCard from '../components/NumberCard.jsx';
import RevealGrid from '../components/RevealGrid.jsx';
import WhyChoose from '../components/WhyChoose.jsx';
import FAQAccordion from '../components/FAQAccordion.jsx';
import CTABand from '../components/CTABand.jsx';
import Icon from '../components/Icon.jsx';
import useReveal from '../hooks/useReveal.js';
import { SITE, whatsappLink } from '../config/site.js';
import { SERVICES, WHY, INDUSTRIES } from '../data/services.js';
import { CATEGORIES } from '../data/products.js';

export default function AboutPage() {
  useMeta({
    title: 'About Us | Industrial Solutions',
    description: 'Industrial Solutions, Hubli: supply, installation, testing and commissioning of industrial training equipment, electrical machines and laboratory systems.',
  });
  const who = useReveal();

  return (
    <>
      <PageHero crumb="About Us" title="About Industrial Solutions"
        text="Delivering end-to-end supply, installation, and commissioning of industrial training and engineering equipment from Hubli, Karnataka."
        image="/images/hydraulic-pneumatic-trainer-lab.webp"
        alt="Hydraulic and pneumatic trainer stations with cut-section component panels">
        <Link to="/#enquiry" className="btn btn--primary">Request a Quote</Link>
        <Link to="/#equipment" className="btn btn--outline-light">View Our Equipment</Link>
      </PageHero>

      <section id="who" className="section">
        <div className="container about">
          <div ref={who} className="about__text reveal">
            <h2 className="about__title">Who We Are</h2>
            <p>Industrial Solutions supplies industrial training equipment and engineering laboratory systems from Hubli, Karnataka. Our focus is hydraulic and pneumatic trainers, electrical machines and motor-generator sets, control panels, and related laboratory equipment.</p>
            <p>Our work covers the whole journey: equipment supply, laboratory setup, installation, testing and commissioning, followed by technical support and maintenance.</p>
            <p className="about__quote">One partner. Complete solutions. Lasting value.</p>
            <h3>What we supply</h3>
            <ul className="about__list">
              {CATEGORIES.map((c) => (<li key={c.id}><Icon name="check" size={18} /><Link to={`/#cat-${c.id}`}>{c.name}</Link></li>))}
            </ul>
          </div>
          <div className="about__side">
            <img src="/images/motor-generator-set-dc-to-ac-lab.webp" alt="Motor-generator set with control panel in a laboratory" loading="lazy" />
            <dl className="about__facts">
              <div><dt>Representative</dt><dd>{SITE.representative}</dd></div>
              <div><dt>Address</dt><dd>{SITE.address}</dd></div>
              <div><dt>Phone</dt><dd><a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a></dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section id="services" className="section section--ink">
        <div className="container">
          <SectionHeading light title="Our Services" intro="From choosing equipment to handing over a working laboratory." />
          <RevealGrid className="grid grid--3 grid--rail">
            {SERVICES.map((s, i) => (
              <NumberCard key={s.id} num={i + 1} title={s.title} text={s.short}
                footer={<Link to="/#enquiry" className="btn btn--ghost-light">Enquire About This</Link>}>
                <p className="ncard__meta"><strong>Includes:</strong> {s.includes}</p>
                <p className="ncard__meta"><strong>Suits:</strong> {s.who}</p>
              </NumberCard>
            ))}
          </RevealGrid>
        </div>
      </section>

      <WhyChoose items={WHY} />

      <section id="industries" className="section">
        <div className="container">
          <SectionHeading title="Industries We Serve" />
          <RevealGrid className="grid grid--4 industries">
            {INDUSTRIES.map((i) => (
              <article key={i.title} className="industry">
                <Icon name={i.icon} size={24} />
                <h3>{i.title}</h3>
                <p>{i.text}</p>
              </article>
            ))}
          </RevealGrid>
        </div>
      </section>

      <section id="faq" className="section section--grey">
        <div className="container container--narrow">
          <SectionHeading title="Frequently Asked Questions" />
          <FAQAccordion />
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container">
          <SectionHeading title="Contact Information" intro={`Speak to ${SITE.representative} and the team at ${SITE.name}.`} />
          <RevealGrid className="grid grid--4 contact">
            <a className="contact__card" href={`tel:${SITE.phoneTel}`}><Icon name="phone" /><h3>Phone</h3><p>{SITE.phoneDisplay}</p></a>
            <a className="contact__card" href={`mailto:${SITE.email}`}><Icon name="mail" /><h3>Email</h3><p>{SITE.email}</p></a>
            <a className="contact__card" href={whatsappLink()} target="_blank" rel="noopener noreferrer"><Icon name="chat" /><h3>WhatsApp</h3><p>Start a chat</p></a>
            <a className="contact__card" href={SITE.mapUrl} target="_blank" rel="noopener noreferrer"><Icon name="pin" /><h3>Address</h3><p>{SITE.address}</p><span className="contact__link">Open in Maps</span></a>
          </RevealGrid>
        </div>
      </section>

      <CTABand title="Planning an Industrial Laboratory or Equipment Setup?"
        text="Tell us about your equipment requirements. Our team can help you discuss suitable products, supply, and installation needs."
        primary={{ label: 'Request a Quote', to: '/#enquiry' }}
        secondary={{ label: 'WhatsApp Us' }} />
    </>
  );
}

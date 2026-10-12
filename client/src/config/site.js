// ---- Edit business details here; the whole site updates ----
export const SITE = {
  name: 'Industrial Solutions',
  representative: 'Vijaykumar Malagavi',
  address: '52/1, Shiddan Peth, Hubli, Karnataka, 580020',
  phoneDisplay: '8951272366',
  phoneTel: '+918951272366',
  whatsappNumber: '918951272366',
  email: 'industrialsolutions2015@gmail.com',
  // Configurable map link (opens a Google Maps search for the address)
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('52/1, Shiddan Peth, Hubli, Karnataka 580020'),
  apiBase: import.meta.env.VITE_API_URL || '',
};

export const DEFAULT_WA_MESSAGE =
  'Hello Industrial Solutions, I would like to enquire about your industrial equipment and engineering services.';

export function whatsappLink(message = DEFAULT_WA_MESSAGE) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function whatsappProductLink(name) {
  return whatsappLink(`Hello Industrial Solutions, I would like to enquire about: ${name}. Please share details and availability.`);
}

export function enquiryLink(name) {
  return `/?product=${encodeURIComponent(name)}#enquiry`;
}

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/about#services' },
  { label: 'Works', to: '/#works' },
];

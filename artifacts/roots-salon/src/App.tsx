import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Maximize2, Menu, MessageCircle, X } from 'lucide-react';
import hairImage from '@assets/hair_1788431795125.png';
import bridalImage from '@assets/bridal_1788431795126.png';
import beautyImage from '@assets/beauty_1788431795126.png';
import groomingImage from '@assets/grooming_1788431795126.png';
import interiorImage from '@assets/interior_1788431795125.png';
import exteriorImage from '@assets/salon-exterior_-_Copy_1788431795124.png';
import galleryImage from '@assets/salon-gallery_1788431795125.png';
import academyImage from '@assets/academy_1788431795125.png';
// @ts-expect-error The business configuration intentionally stays as an editable JavaScript file.
import salonConfigData from './data/salonConfig.js';

type SalonService = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  items: [string, string][];
};
type SalonConfig = {
  salonName: string;
  tagline: string;
  address: string;
  phone: string;
  WHATSAPP_NUMBER: string;
  email: string;
  instagram: string;
  googleMaps: string;
  openingHours: string;
  services: SalonService[];
  testimonials: { quote: string; name: string; service: string }[];
};
const salonConfig = salonConfigData as SalonConfig;

const serviceImages = { hair: hairImage, bridal: bridalImage, beauty: beautyImage, grooming: groomingImage };
const galleryItems = [
  { image: hairImage, title: 'The Hair Atelier', alt: 'Hair styling at Roots Salon' },
  { image: beautyImage, title: 'Quiet precision', alt: 'Makeup artistry at Roots Salon' },
  { image: bridalImage, title: 'The Bridal Story', alt: 'Bridal styling at Roots Salon' },
  { image: groomingImage, title: 'The Grooming House', alt: 'Men’s grooming at Roots Salon' },
  { image: interiorImage, title: 'Inside the house', alt: 'Interior of Roots Salon' },
];

type HotspotKey = 'mirrors' | 'reception' | 'light';
type BookingData = { service: string; date: string; time: string; name: string; email: string; phone: string; note: string };

function App() {
  const [introVisible, setIntroVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('hair');
  const [compare, setCompare] = useState(52);
  const [hotspot, setHotspot] = useState<HotspotKey>('mirrors');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingSent, setBookingSent] = useState(false);
  const [whatsappNotice, setWhatsappNotice] = useState(false);
  const [booking, setBooking] = useState<BookingData>({
    service: 'hair', date: '', time: '', name: '', email: '', phone: '', note: '',
  });
  const [cursor, setCursor] = useState({ x: -20, y: -20, active: false });
  const activeService = salonConfig.services.find((service) => service.id === selectedService) ?? salonConfig.services[0];
  const imageForService = serviceImages[activeService.image as keyof typeof serviceImages];
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('roots-intro-seen') === 'true') setIntroVisible(false);
    } catch {
      // Session storage can be unavailable in privacy mode.
    }
  }, []);

  useEffect(() => {
    const move = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY, active: true });
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const dismissIntro = () => {
    setIntroVisible(false);
    try { sessionStorage.setItem('roots-intro-seen', 'true'); } catch { /* no-op */ }
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openBooking = (service = booking.service) => {
    setBooking((current) => ({ ...current, service }));
    setBookingSent(false);
    setBookingStep(1);
    setBookingOpen(true);
  };

  const openWhatsApp = () => {
    if (salonConfig.WHATSAPP_NUMBER) {
      const message = encodeURIComponent('Hello Roots Salon, I would like to enquire about a booking.');
      window.open(`https://wa.me/${salonConfig.WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
    } else {
      setWhatsappNotice(true);
      scrollTo('booking');
      window.setTimeout(() => setWhatsappNotice(false), 5000);
    }
  };

  return (
    <main className="roots-page" onMouseLeave={() => setCursor((current) => ({ ...current, active: false }))}>
      <div ref={introRef} className={`intro-screen ${introVisible ? '' : 'is-hidden'}`} data-testid="intro-screen" aria-hidden={!introVisible}>
        <div className="intro-content">
          <div className="intro-mark" aria-hidden="true">R</div>
          <p className="eyebrow">A beauty & grooming house</p>
          <h1>Enter the Roots</h1>
          <p>Black lacquer · golden light · precision craft</p>
          <button className="intro-enter" type="button" onClick={dismissIntro} data-testid="button-enter-roots">Enter the Roots <ArrowRight size={14} /></button>
        </div>
        <button className="ghost-button intro-skip" type="button" onClick={dismissIntro} data-testid="button-skip-intro">Skip intro</button>
      </div>
      <div className="cursor-dot" style={{ left: cursor.x, top: cursor.y, width: cursor.active ? 11 : 7, height: cursor.active ? 11 : 7 }} aria-hidden="true" />
      <header className="site-nav" data-testid="site-navigation">
        <button className="brand" onClick={() => scrollTo('top')} data-testid="button-brand" aria-label="Return to top">
          <strong>ROOTS</strong><small>Beauty & grooming house</small>
        </button>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#services" data-testid="link-services">Services</a>
          <a href="#transformation" data-testid="link-transformation">Craft</a>
          <a href="#space" data-testid="link-space">The space</a>
          <a href="#gallery" data-testid="link-gallery">Gallery</a>
          <a href="#booking" data-testid="link-booking">Contact</a>
        </nav>
        <button className="nav-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
        {['services', 'transformation', 'space', 'gallery', 'booking'].map((id) => (
          <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} data-testid={`mobile-link-${id}`}>{id === 'space' ? 'The space' : id}</a>
        ))}
        <button className="gold-button solid" type="button" onClick={() => { setMenuOpen(false); openBooking(); }} data-testid="mobile-book-now">Book now</button>
      </nav>
      <section className="hero" id="top" aria-labelledby="hero-heading">
        <div className="hero-bg"><img src={exteriorImage} alt="Warmly lit Roots Salon exterior" /></div>
        <div className="hero-embers" aria-hidden="true">
          {[['11%', '3px', '4.5s', '0s'], ['23%', '2px', '5.7s', '1.2s'], ['37%', '4px', '6.3s', '2.4s'], ['51%', '2px', '4.8s', '.8s'], ['67%', '3px', '5.3s', '1.9s'], ['79%', '2px', '6.1s', '3.2s'], ['91%', '3px', '5s', '1s']].map(([x, s, d, delay], index) => (
            <i key={index} style={{ '--x': x, '--s': s, '--d': d, '--delay': delay } as CSSProperties} />
          ))}
        </div>
        <div className="hero-copy">
          <div className="hero-kicker eyebrow reveal">Welcome to Roots</div>
          <h1 id="hero-heading" className="display reveal delay-1 font-extrabold text-justify">Come for the<br /><em>ritual.</em></h1>
          <p className="hero-sub reveal delay-2 text-foreground">An immersive beauty and grooming house where every detail is held in golden light.</p>
          <div className="text-right font-normal bg-[#f0ebe000] opacity-[1]">
            <button className="gold-button solid font-extrabold justify-center items-center flex-row text-[15px]" type="button" onClick={() => openBooking()} data-testid="button-hero-book">Book your ritual <ArrowUpRight size={14} /></button>
            <button className="underline-link text-[12px]" type="button" onClick={() => scrollTo('services')} data-testid="button-hero-explore">Explore the house</button>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true">Scroll to enter</div>
      </section>
      <section className="manifesto section-pad" aria-labelledby="manifesto-heading">
        <div className="section-shell manifesto-grid">
          <div>
            <p className="eyebrow">01 / Roots</p>
            <h2 id="manifesto-heading" className="display">Beauty that feels <em>alive.</em></h2>
          </div>
          <div className="manifesto-copy">
            <p>Roots is a place to slow down. Black lacquer, warm timber and a team of artists who notice the small things. We make space for the version of you that is already there.</p>
            <div className="manifesto-stat">
              <div><strong>01</strong><span>Unhurried<br />consultation</span></div>
              <div><strong>04</strong><span>Worlds of<br />expertise</span></div>
              <div><strong>∞</strong><span>Ways to<br />feel yourself</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="services section-pad" id="services" aria-labelledby="services-heading">
        <div className="section-shell">
          <div className="services-head">
            <div><p className="eyebrow">02 / The craft</p><h2 id="services-heading" className="display">Choose your<br /><em>element.</em></h2></div>
            <p>Four disciplines. One point of view: precise, personal, and never rushed.</p>
          </div>
          <div className="service-tabs" role="tablist" aria-label="Service categories">
            {salonConfig.services.map((service) => (
              <button key={service.id} className={selectedService === service.id ? 'active' : ''} role="tab" aria-selected={selectedService === service.id} onClick={() => setSelectedService(service.id)} data-testid={`tab-service-${service.id}`}>{service.label}</button>
            ))}
          </div>
          <div className="service-stage" data-testid="service-explorer">
            <div className="service-image image-frame"><img src={imageForService} alt={`${activeService.label} service at Roots Salon`} /></div>
            <div className="service-info">
              <p className="eyebrow">{activeService.label} / 0{salonConfig.services.findIndex((item) => item.id === activeService.id) + 1}</p>
              <h3 className="display" data-testid="text-active-service">{activeService.title}</h3>
              <p>{activeService.description}</p>
              <ul className="service-list">
                {activeService.items.map(([item, price], index) => <li key={item} data-testid={`service-item-${activeService.id}-${index}`}><span>{item}</span><span>{price}</span></li>)}
              </ul>
              <button className="gold-button" type="button" onClick={() => openBooking(activeService.id)} data-testid="button-book-service">Book this service <ArrowUpRight size={14} /></button>
            </div>
          </div>
        </div>
      </section>
      <section className="transformation section-pad" id="transformation" aria-labelledby="transformation-heading">
        <div className="section-shell">
          <div className="transformation-head">
            <div><p className="eyebrow">03 / The reveal</p><h2 id="transformation-heading" className="display">The<br /><em>transformation.</em></h2></div>
            <p>Before → after. The craft is in the in-between — a conversation, a considered hand, a little fire.</p>
          </div>
          <div className="compare" style={{ '--compare': `${compare}%` } as CSSProperties} data-testid="before-after-slider">
            <div className="compare-before"><img src={beautyImage} alt="Before beauty transformation" /></div>
            <div className="compare-after"><img src={bridalImage} alt="After beauty transformation" /></div>
            <span className="compare-label before">Before</span><span className="compare-label after">After</span>
            <div className="compare-handle"><span><ArrowLeft size={13} /><ArrowRight size={13} /></span></div>
            <input className="compare-input" type="range" min="0" max="100" value={compare} onChange={(event) => setCompare(Number(event.target.value))} aria-label="Drag to compare before and after" data-testid="input-transformation-slider" />
          </div>
        </div>
      </section>
      <section className="tour section-pad" id="space" aria-labelledby="space-heading">
        <div className="section-shell tour-layout">
          <div className="tour-intro">
            <p className="eyebrow">04 / The house</p>
            <h2 id="space-heading" className="display">Explore<br />the <em>space.</em></h2>
            <p>Step inside a living world of mirrored arches, soft firelight and tools that know exactly what they are doing.</p>
            <span className="underline-link">Tap a point of view</span>
          </div>
          <div className="tour-photo image-frame" data-testid="salon-tour">
            <img src={interiorImage} alt="The Roots Salon interior with styling stations" />
            {(['mirrors', 'reception', 'light'] as HotspotKey[]).map((key, index) => <button key={key} className={`tour-hotspot ${hotspot === key ? 'active' : ''}`} data-hotspot={key} onClick={() => setHotspot(key)} aria-label={`Explore ${key}`} data-testid={`hotspot-${key}`}>{index + 1}</button>)}
            <div className="tour-note" data-testid="tour-hotspot-detail">
              <strong>{hotspot === 'mirrors' ? 'The styling floor' : hotspot === 'reception' ? 'The welcome' : 'Golden hour'}</strong>
              <span>{hotspot === 'mirrors' ? 'Mirrored arches, velvet chairs, and room to see the whole picture.' : hotspot === 'reception' ? 'A quiet marble welcome, ready to take your coat and your time.' : 'Light designed to flatter every face, from first consultation to final reveal.'}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="gallery section-pad" id="gallery" aria-labelledby="gallery-heading">
        <div className="section-shell">
          <div className="gallery-head"><div><p className="eyebrow">05 / In the light</p><h2 id="gallery-heading" className="display">A living<br /><em>gallery.</em></h2></div><p className="eyebrow">Drag / discover</p></div>
          <div className="gallery-rail" data-testid="gallery-rail">
            {galleryItems.map((item, index) => <div className="gallery-item" key={item.title}><button type="button" onClick={() => setLightbox(index)} data-testid={`button-gallery-${index}`}><div className="image-frame"><img src={item.image} alt={item.alt} /><span className="gallery-caption">{item.title} <Maximize2 size={12} /></span></div></button></div>)}
          </div>
          <div className="gallery-foot"><span>05 frames from Roots</span><button type="button" className="underline-link" onClick={() => setLightbox(0)} data-testid="button-view-full-gallery">View full gallery</button></div>
        </div>
      </section>
      <section className="reviews section-pad" aria-labelledby="reviews-heading">
        <div className="section-shell reviews-layout">
          <div><p className="eyebrow">06 / In their words</p><h2 id="reviews-heading" className="display">Leave<br />lighter.</h2><p className="review-note">Reviews are intentionally editable placeholders until real, verified client words are added.</p></div>
          <div className="review-card" data-testid="review-card">
            <div className="quote-mark" aria-hidden="true">“</div>
            <blockquote>{salonConfig.testimonials[0].quote}</blockquote>
            <cite>{salonConfig.testimonials[0].name} · {salonConfig.testimonials[0].service}</cite>
          </div>
        </div>
      </section>
      <section className="social section-pad" aria-labelledby="social-heading">
        <div className="section-shell">
          <div className="social-head"><div><p className="eyebrow">07 / After hours</p><h2 id="social-heading" className="display">Follow<br /><em>the roots.</em></h2></div><a className="gold-button" href={salonConfig.instagram || undefined} target="_blank" rel="noreferrer" onClick={(event) => { if (!salonConfig.instagram) event.preventDefault(); }} aria-disabled={!salonConfig.instagram} data-testid="link-instagram">Follow us on Instagram <ArrowUpRight size={14} /></a></div>
          <div className="social-grid" data-testid="instagram-grid">
            {[galleryImage, bridalImage, groomingImage, academyImage, interiorImage].map((image, index) => <div className="image-frame" key={index}><img src={image} alt={`Roots Salon social frame ${index + 1}`} /></div>)}
          </div>
        </div>
      </section>
      <section className="booking section-pad" id="booking" aria-labelledby="booking-heading">
        <div className="section-shell booking-layout">
          <div className="booking-lead"><p className="eyebrow">08 / Your ritual</p><h2 id="booking-heading" className="display">Make<br />an <em>entrance.</em></h2><p>Tell us what you are dreaming of. We will be in touch to find the right artist and time for you.</p>{whatsappNotice && <p className="eyebrow" role="status" data-testid="status-whatsapp-placeholder">WhatsApp number to be added — please use the request form.</p>}</div>
          <BookingPanel bookingOpen={bookingOpen} booking={booking} setBooking={setBooking} step={bookingStep} setStep={setBookingStep} sent={bookingSent} setSent={setBookingSent} close={() => setBookingOpen(false)} onOpen={() => setBookingOpen(true)} />
        </div>
      </section>
      <footer className="site-footer">
        <div className="section-shell footer-grid">
          <div className="footer-brand"><strong>ROOTS</strong><p>{salonConfig.tagline}</p></div>
          <div className="footer-col"><h4>Find us</h4><p>{salonConfig.address}</p><p>{salonConfig.openingHours}</p><a href={salonConfig.googleMaps || undefined} target="_blank" rel="noreferrer" data-testid="link-google-maps">Open directions <ArrowUpRight size={12} /></a></div>
          <div className="footer-col"><h4>Say hello</h4><p>{salonConfig.phone}</p><p>{salonConfig.email}</p><button type="button" onClick={openWhatsApp} data-testid="button-footer-whatsapp">WhatsApp enquiry <MessageCircle size={13} /></button></div>
        </div>
      </footer>
      <div className="floating-actions" aria-label="Quick actions">
        <button className="float-action" type="button" onClick={openWhatsApp} aria-label="Open WhatsApp enquiry" data-testid="button-whatsapp"><MessageCircle size={19} /></button>
        <button className="float-action book" type="button" onClick={() => openBooking()} data-testid="button-floating-book">Book now <ArrowUpRight size={14} /></button>
      </div>
      {lightbox !== null && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Roots gallery" onClick={() => setLightbox(null)} data-testid="gallery-lightbox"><div className="lightbox" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setLightbox(null)} aria-label="Close gallery" data-testid="button-close-gallery"><X size={18} /></button><img src={galleryItems[lightbox].image} alt={galleryItems[lightbox].alt} /><div className="lightbox-caption">{galleryItems[lightbox].title}</div></div></div>}
    </main>
  );
}

type BookingPanelProps = {
  bookingOpen: boolean;
  booking: BookingData;
  setBooking: (value: BookingData | ((current: BookingData) => BookingData)) => void;
  step: number;
  setStep: (step: number) => void;
  sent: boolean;
  setSent: (sent: boolean) => void;
  close: () => void;
  onOpen: () => void;
};

function BookingPanel({ bookingOpen, booking, setBooking, step, setStep, sent, setSent, close, onOpen }: BookingPanelProps) {
  const update = (key: keyof BookingData, value: string) => setBooking((current) => ({ ...current, [key]: value }));
  const canAdvance = (step === 1 && booking.service) || (step === 2 && booking.date) || (step === 3 && booking.time) || (step === 4 && booking.name && booking.email && booking.phone);
  const serviceTitle = salonConfig.services.find((service) => service.id === booking.service)?.title ?? 'Your selected service';
  return (
    <div className={`booking-panel ${bookingOpen ? 'booking-panel-open' : ''}`} data-testid="booking-panel">
      {!bookingOpen && <div className="booking-confirm"><div className="seal" aria-hidden="true">R</div><h3 className="display">A considered start.</h3><p>Begin with a service and we will guide the rest of the way.</p><button className="gold-button solid" type="button" onClick={onOpen} data-testid="button-open-booking">Start a request <ArrowRight size={14} /></button></div>}
      {bookingOpen && !sent && <>
        <div className="progress" aria-label={`Booking step ${step} of 5`}>{[1, 2, 3, 4, 5].map((number) => <span key={number} className={number <= step ? 'active' : ''} />)}</div>
        <div className="step-label"><span>0{step} / {['Service', 'Date', 'Time', 'Details', 'Review'][step - 1]}</span><span>Roots request</span></div>
        {step === 1 && <><h3 className="display">What brings you in?</h3><div className="booking-options">{salonConfig.services.map((service) => <button type="button" key={service.id} className={booking.service === service.id ? 'selected' : ''} onClick={() => update('service', service.id)} data-testid={`booking-service-${service.id}`}>{service.label}<br /><small>{service.title}</small></button>)}</div></>}
        {step === 2 && <><h3 className="display">Choose a day.</h3><div className="booking-form"><label className="eyebrow" htmlFor="booking-date">Preferred date</label><input id="booking-date" type="date" value={booking.date} onChange={(event) => update('date', event.target.value)} data-testid="input-booking-date" /></div></>}
        {step === 3 && <><h3 className="display">Find your time.</h3><div className="booking-options">{['10:00', '12:30', '15:00', '17:30'].map((time) => <button type="button" key={time} className={booking.time === time ? 'selected' : ''} onClick={() => update('time', time)} data-testid={`booking-time-${time}`}>{time}<br /><small>Request window</small></button>)}</div></>}
        {step === 4 && <><h3 className="display">A little about you.</h3><div className="booking-form"><input placeholder="Your name" value={booking.name} onChange={(event) => update('name', event.target.value)} aria-label="Your name" data-testid="input-booking-name" /><input type="email" placeholder="Email address" value={booking.email} onChange={(event) => update('email', event.target.value)} aria-label="Email address" data-testid="input-booking-email" /><input type="tel" placeholder="Phone number" value={booking.phone} onChange={(event) => update('phone', event.target.value)} aria-label="Phone number" data-testid="input-booking-phone" /><textarea rows={3} placeholder="Anything we should know? (optional)" value={booking.note} onChange={(event) => update('note', event.target.value)} aria-label="Additional note" data-testid="input-booking-note" /></div></>}
        {step === 5 && <><h3 className="display">Read it back.</h3><div className="review-card"><p className="eyebrow">Your request</p><blockquote>{serviceTitle}<br />{booking.date} · {booking.time}</blockquote><cite>{booking.name} · {booking.email}</cite></div></>}
        <div className="booking-nav">{step > 1 ? <button className="ghost-button" type="button" onClick={() => setStep(step - 1)} data-testid="button-booking-back"><ArrowLeft size={14} /> Back</button> : <button className="ghost-button" type="button" onClick={close} data-testid="button-booking-close">Close</button>}{step < 5 ? <button className="gold-button solid" type="button" disabled={!canAdvance} onClick={() => setStep(step + 1)} data-testid="button-booking-next">Continue <ArrowRight size={14} /></button> : <button className="gold-button solid" type="button" onClick={() => setSent(true)} data-testid="button-submit-request">Submit request <ArrowUpRight size={14} /></button>}</div>
      </>}
      {bookingOpen && sent && <div className="booking-confirm" role="status" data-testid="booking-success"><div className="seal"><Check size={25} /></div><p className="eyebrow">Request received</p><h3 className="display">We have your note.</h3><p>This is a request, not a confirmed appointment. The Roots team will be in touch to refine the time and artist with you.</p><button className="gold-button" type="button" onClick={close} data-testid="button-close-success">Return to Roots <ArrowRight size={14} /></button></div>}
    </div>
  );
}

export default App;
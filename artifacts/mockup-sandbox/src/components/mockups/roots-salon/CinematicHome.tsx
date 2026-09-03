import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Flame,
  Menu,
  MoveHorizontal,
  Play,
  Sparkles,
  X,
} from "lucide-react";

const image = (name: string) => `/__mockup/images/${name}`;
const WHATSAPP_NUMBER = "";
const INSTAGRAM_URL = "";

type ServiceCategory = "HAIR" | "BEAUTY" | "GROOMING" | "BRIDAL";
type HotspotId = "stations" | "reception" | "grooming";

const services: Record<
  ServiceCategory,
  { eyebrow: string; title: string; body: string; image: string; detail: string }
> = {
  HAIR: {
    eyebrow: "THE CRAFT OF MOVEMENT",
    title: "Hair, shaped around you.",
    body: "Cut, colour and finish with the ease of a look that has always belonged to you.",
    image: image("roots-hair.png"),
    detail: "Cut · Colour · Styling",
  },
  BEAUTY: {
    eyebrow: "LIGHT, HELD CLOSE",
    title: "Beauty with a softer edge.",
    body: "A considered ritual for skin, eyes and the details that make the whole picture land.",
    image: image("roots-beauty.png"),
    detail: "Makeup · Skin · Finishing",
  },
  GROOMING: {
    eyebrow: "PRECISION, NOT PERFORMANCE",
    title: "Grooming in its element.",
    body: "Sharp lines, warm towels and a slower pace for the details that frame your face.",
    image: image("roots-grooming.png"),
    detail: "Cut · Beard · Ritual",
  },
  BRIDAL: {
    eyebrow: "THE DAY, IN YOUR HANDS",
    title: "A bridal story, composed.",
    body: "An unhurried beauty direction for the ceremony, the photographs and every in-between moment.",
    image: image("roots-bridal.png"),
    detail: "Makeup · Hair · Bridal",
  },
};

const galleryItems = [
  { src: image("roots-hair.png"), title: "The finishing chair", note: "Hair / movement" },
  { src: image("roots-bridal.png"), title: "A study in red", note: "Bridal / ritual" },
  { src: image("roots-beauty.png"), title: "Light on skin", note: "Beauty / detail" },
  { src: image("roots-grooming.png"), title: "The sharp hour", note: "Grooming / form" },
  { src: image("roots-academy.png"), title: "Practice makes roots", note: "Academy / craft" },
  { src: image("roots-exterior.png"), title: "After dark", note: "The house / entrance" },
];

const hotspotDetails: Record<
  HotspotId,
  { label: string; title: string; body: string; position: string }
> = {
  stations: {
    label: "01 / MIRROR STATIONS",
    title: "Where the work takes shape.",
    body: "Black lacquer, warm light and a chair that gives the craft room to unfold.",
    position: "left-[28%] top-[43%]",
  },
  reception: {
    label: "02 / RECEPTION",
    title: "Arrive into the glow.",
    body: "The first pause: marble, amber light and the quiet anticipation of what comes next.",
    position: "left-[50%] top-[52%]",
  },
  grooming: {
    label: "03 / GROOMING AREA",
    title: "A room for precision.",
    body: "A more intimate corner for clean lines, warm towels and a measured finish.",
    position: "left-[76%] top-[42%]",
  },
};

function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`roots-logo ${compact ? "roots-logo--compact" : ""}`} aria-label="Roots Salon">
      <span className="roots-logo__icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="roots-logo__word">ROOTS</span>
      {!compact && <span className="roots-logo__sub">SALON</span>}
    </span>
  );
}

function GoldRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[#c69a56]">
      <span className="h-px w-8 bg-[#b38346]" />
      <span>{label}</span>
    </div>
  );
}

function ArrowLink({
  children,
  onClick,
  light = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-3 border-b pb-2 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors ${
        light
          ? "border-[#e7c98b]/60 text-[#f1dec0] hover:border-[#f1dec0]"
          : "border-[#b38346] text-[#d6ae6d] hover:border-[#f1dec0] hover:text-[#f1dec0]"
      }`}
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

function BookingPanel({
  open,
  onClose,
  initialService,
}: {
  open: boolean;
  onClose: () => void;
  initialService: ServiceCategory;
}) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceCategory>(initialService);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSubmitted(false);
      setSelectedService(initialService);
    }
  }, [open, initialService]);

  if (!open) return null;

  const canContinue =
    (step === 1 && Boolean(selectedService)) ||
    (step === 2 && Boolean(date)) ||
    (step === 3 && Boolean(time)) ||
    (step === 4 && Boolean(name && email));

  const next = () => {
    if (!canContinue) return;
    if (step < 4) setStep((current) => current + 1);
    else setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-[#090705]/75 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Request a Roots Salon booking">
      <button type="button" aria-label="Close booking" className="absolute inset-0 cursor-default" onClick={onClose} />
      <aside className="roots-booking relative z-10 flex h-full w-full max-w-[540px] flex-col border-l border-[#b38346]/30 bg-[#15100d] px-6 py-7 shadow-2xl sm:px-10">
        <div className="flex items-start justify-between">
          <div>
            <GoldRule label="PRIVATE APPOINTMENTS" />
            <h2 className="mt-5 font-serif text-4xl leading-none text-[#f0dfc3]">Enter your details.</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#a99786]">Share a little about the visit. A member of the Roots team will follow up to discuss availability.</p>
          </div>
          <button type="button" aria-label="Close booking" onClick={onClose} className="rounded-full border border-[#b38346]/35 p-2 text-[#d6ae6d] transition-colors hover:bg-[#b38346]/10">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-2 border-y border-[#b38346]/20 py-4">
          {["SERVICE", "DATE", "TIME", "DETAILS"].map((item, index) => (
            <button type="button" key={item} onClick={() => index + 1 <= step && setStep(index + 1)} className="text-left">
              <span className={`block font-mono text-[10px] ${index + 1 <= step ? "text-[#d6ae6d]" : "text-[#695f56]"}`}>0{index + 1}</span>
              <span className={`mt-1 block text-[9px] tracking-[0.16em] ${index + 1 === step ? "text-[#f0dfc3]" : "text-[#85766b]"}`}>{item}</span>
              <span className={`mt-2 block h-px ${index + 1 <= step ? "bg-[#b38346]" : "bg-[#4c3d31]"}`} />
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto py-8">
          {!submitted && step === 1 && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#85766b]">01 / Select a direction</p>
              <div className="mt-5 space-y-2">
                {(Object.keys(services) as ServiceCategory[]).map((service) => (
                  <button type="button" key={service} onClick={() => setSelectedService(service)} className={`flex w-full items-center justify-between border px-4 py-4 text-left transition-colors ${selectedService === service ? "border-[#b38346] bg-[#b38346]/10 text-[#f0dfc3]" : "border-[#b38346]/20 text-[#9d8d7d] hover:border-[#b38346]/60"}`}>
                    <span className="text-xs tracking-[0.18em]">{service}</span>
                    <span className={`h-2 w-2 rounded-full border ${selectedService === service ? "border-[#d6ae6d] bg-[#d6ae6d]" : "border-[#715e4b]"}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
          {!submitted && step === 2 && (
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-[#85766b]">02 / Preferred date</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="roots-input mt-5" />
              <span className="mt-3 block text-xs leading-5 text-[#796a5c]">We will check availability around your request.</span>
            </label>
          )}
          {!submitted && step === 3 && (
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-[#85766b]">03 / Preferred time</span>
              <select value={time} onChange={(event) => setTime(event.target.value)} className="roots-input mt-5">
                <option value="">Select a window</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
              <span className="mt-3 block text-xs leading-5 text-[#796a5c]">Your preferred window helps us make the right space for you.</span>
            </label>
          )}
          {!submitted && step === 4 && (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#85766b]">04 / Customer details</p>
              <input aria-label="Your name" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} className="roots-input" />
              <input aria-label="Email address" type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} className="roots-input" />
              <p className="text-xs leading-5 text-[#796a5c]">No appointment is confirmed here. This preview captures your request for the team to review.</p>
            </div>
          )}
          {submitted && (
            <div className="roots-confirm flex h-full min-h-[280px] flex-col items-center justify-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#b38346] text-[#d6ae6d]"><Sparkles className="h-6 w-6" /></span>
              <h3 className="mt-6 font-serif text-4xl text-[#f0dfc3]">Request received.</h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-[#a99786]">Your request is staged for the Roots team. This preview does not confirm an appointment.</p>
              <button type="button" onClick={onClose} className="mt-8 border border-[#b38346]/60 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-[#d6ae6d] hover:bg-[#b38346]/10">Return to the house</button>
            </div>
          )}
        </div>

        {!submitted && (
          <div className="border-t border-[#b38346]/20 pt-5">
            <button type="button" onClick={next} disabled={!canContinue} className="flex w-full items-center justify-between bg-[#b38346] px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-[#16100c] transition-colors hover:bg-[#e1be76] disabled:cursor-not-allowed disabled:opacity-40">
              <span>{step === 4 ? "Send request" : "Continue"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.15em] text-[#66594d]">A considered beginning, never a promise of availability</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export function CinematicHome() {
  const [entryOpen, setEntryOpen] = useState(() => !new URLSearchParams(window.location.search).has("skip"));
  const [navOpen, setNavOpen] = useState(false);
  const [service, setService] = useState<ServiceCategory>("HAIR");
  const [comparePosition, setComparePosition] = useState(52);
  const [hotspot, setHotspot] = useState<HotspotId>("stations");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [contactHint, setContactHint] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100, mode: "point" });
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "ROOTS SALON — Premium Beauty & Grooming Experience";
    const description = document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    description.setAttribute("name", "description");
    description.setAttribute("content", "Premium salon experience by Roots Salon — hair, beauty, grooming and bridal services.");
    if (!description.parentElement) document.head.appendChild(description);
  }, []);

  useEffect(() => {
    if (!entryOpen) return;
    const dismiss = () => setEntryOpen(false);
    const timer = window.setTimeout(dismiss, 1200);
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("touchstart", dismiss, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
    };
  }, [entryOpen]);

  useEffect(() => {
    const handleMouse = (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement;
      const mode = target.closest("button, a") ? "ring" : target.closest("img") ? "image" : "point";
      setCursor({ x: event.clientX, y: event.clientY, mode });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const activeService = services[service];
  const activeHotspot = hotspotDetails[hotspot];
  const galleryWindow = useMemo(() => {
    const items = [];
    for (let index = 0; index < 3; index += 1) items.push(galleryItems[(galleryIndex + index) % galleryItems.length]);
    return items;
  }, [galleryIndex]);

  const scrollTo = (id: string) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openBooking = () => setBookingOpen(true);

  const handleHeroMove = (event: MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    setHeroTilt({ x: x * 5, y: y * 4 });
  };

  const moveGallery = (direction: number) => {
    setGalleryIndex((current) => (current + direction + galleryItems.length) % galleryItems.length);
  };

  const floatingStyle = { "--hero-x": `${heroTilt.x}px`, "--hero-y": `${heroTilt.y}px` } as CSSProperties;

  return (
    <main className="roots-page min-h-[100dvh] bg-[#0f0c09] text-[#eadbc5] selection:bg-[#b38346] selection:text-[#160f0b]">
      <div className="roots-cursor roots-cursor--desktop" style={{ left: cursor.x, top: cursor.y }} data-mode={cursor.mode} aria-hidden="true" />
      {entryOpen && (
        <div className="roots-entry fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#0b0806] px-6 text-center" onClick={() => setEntryOpen(false)}>
          <div className="roots-entry__glow" />
          <div className="roots-entry__roots" aria-hidden="true"><span /><span /><span /><span /><span /></div>
          <div className="relative z-10">
            <LogoMark />
            <p className="mt-9 text-[10px] uppercase tracking-[0.48em] text-[#9a7950]">A beauty house in motion</p>
            <button type="button" onClick={() => setEntryOpen(false)} className="roots-enter-button mt-16 inline-flex items-center gap-5 border border-[#b38346]/60 px-6 py-4 text-[10px] uppercase tracking-[0.28em] text-[#e5c487] transition-colors hover:bg-[#b38346]/10">
              Enter the Roots <ArrowDown className="h-4 w-4" />
            </button>
            <p className="mt-5 text-[9px] uppercase tracking-[0.2em] text-[#6f5c49]">Click or scroll to continue</p>
          </div>
          <button type="button" onClick={() => setEntryOpen(false)} className="absolute bottom-8 right-8 text-[9px] uppercase tracking-[0.2em] text-[#806b55] hover:text-[#e5c487]">Skip entry</button>
        </div>
      )}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#e0bc76]/10 bg-[#0f0c09]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 sm:px-10 lg:px-14">
          <button type="button" aria-label="Back to top" onClick={() => scrollTo("top")}><LogoMark compact /></button>
          <nav className="hidden items-center gap-9 md:flex">
            {["THE HOUSE", "SERVICES", "THE SPACE", "GALLERY"].map((item) => (
              <button type="button" key={item} onClick={() => scrollTo(item === "THE HOUSE" ? "house" : item === "THE SPACE" ? "space" : item.toLowerCase())} className="roots-nav-link text-[10px] uppercase tracking-[0.23em] text-[#a99786] transition-colors hover:text-[#e5c487]">{item}</button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" onClick={openBooking} className="hidden border border-[#b38346]/70 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-[#d7b36f] transition-colors hover:bg-[#b38346] hover:text-[#140e0b] sm:block">Book a visit</button>
            <button type="button" aria-label="Open navigation" onClick={() => setNavOpen(!navOpen)} className="rounded-full border border-[#b38346]/30 p-2.5 text-[#d7b36f] md:hidden">{navOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
          </div>
        </div>
        {navOpen && (
          <nav className="border-t border-[#b38346]/15 bg-[#15100d] px-5 py-4 md:hidden">
            {["THE HOUSE", "SERVICES", "THE SPACE", "GALLERY"].map((item) => (
              <button type="button" key={item} onClick={() => scrollTo(item === "THE HOUSE" ? "house" : item === "THE SPACE" ? "space" : item.toLowerCase())} className="block w-full border-b border-[#b38346]/10 py-4 text-left text-[10px] uppercase tracking-[0.24em] text-[#d6ae6d]">{item}</button>
            ))}
            <button type="button" onClick={openBooking} className="mt-4 w-full bg-[#b38346] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[#140e0b]">Book a visit</button>
          </nav>
        )}
      </header>

      <section id="top" ref={heroRef} onMouseMove={handleHeroMove} className="roots-hero relative flex min-h-[100dvh] items-end overflow-hidden border-b border-[#b38346]/20 pt-[74px]" style={floatingStyle}>
        <div className="roots-hero__image absolute inset-0" style={{ backgroundImage: `url(${image("roots-exterior.png")})` }} />
        <div className="roots-hero__veil absolute inset-0" />
        <div className="roots-hero__rays absolute inset-0" />
        <div className="roots-embers absolute inset-0" aria-hidden="true">{Array.from({ length: 11 }).map((_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}</div>
        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] gap-14 px-5 pb-14 sm:px-10 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-14 lg:pb-24">
          <div className="max-w-3xl">
            <GoldRule label="THE ROOTS SALON EXPERIENCE" />
            <h1 className="mt-7 max-w-4xl font-serif text-[clamp(4rem,10vw,9.8rem)] font-light leading-[0.82] tracking-[-0.055em] text-[#f2e4cf]">Beauty,<br /><em className="text-[#d5a85e]">with depth.</em></h1>
            <p className="mt-8 max-w-md text-sm leading-7 text-[#d2c0ab] sm:text-base">A cinematic beauty house for hair, beauty, grooming and bridal — shaped by craft, light and the way you want to feel leaving.</p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <button type="button" onClick={openBooking} className="group inline-flex items-center gap-4 bg-[#b38346] px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-[#160f0b] transition-colors hover:bg-[#e1be76]">Begin your visit <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button>
              <button type="button" onClick={() => scrollTo("house")} className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#d6ae6d] hover:text-[#f1dec0]">Follow the light <ArrowDown className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="hidden justify-self-end lg:block">
            <div className="roots-hero-note border-l border-[#d6ae6d]/60 pl-5">
              <p className="font-serif text-2xl leading-tight text-[#e8d7be]">Not a service menu.<br />A point of view.</p>
              <p className="mt-4 max-w-[220px] text-[10px] uppercase leading-5 tracking-[0.18em] text-[#a99786]">Scroll to move through the house</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-7 right-7 z-10 hidden items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-[#b38346] md:flex"><span className="h-px w-10 bg-[#b38346]/70" /> 01 / 07</div>
      </section>

      <section id="house" className="roots-section roots-house relative overflow-hidden border-b border-[#b38346]/15">
        <div className="roots-root-lines" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-24 sm:px-10 sm:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-14">
          <div className="relative">
            <GoldRule label="THE HOUSE" />
            <h2 className="mt-8 max-w-lg font-serif text-5xl font-light leading-[0.92] tracking-[-0.04em] text-[#edddc3] sm:text-7xl">A room that<br /><em className="text-[#c99a55]">holds a mood.</em></h2>
            <p className="mt-8 max-w-md text-sm leading-7 text-[#a99786]">Roots is built around the ritual of getting ready. Black lacquer, burnished metal, generous mirrors and the warmth of a room that knows when to let the quiet in.</p>
            <div className="mt-12 grid max-w-sm grid-cols-2 gap-x-8 gap-y-5 border-t border-[#b38346]/25 pt-5">
              {["Craft over noise", "Light as material", "Time well spent", "Beauty in layers"].map((item, index) => <div key={item} className="flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-[#b9a38b]"><span className="font-mono text-[#b38346]">0{index + 1}</span>{item}</div>)}
            </div>
          </div>
          <div className="relative min-h-[380px] overflow-hidden sm:min-h-[520px]">
            <img src={image("roots-interior.png")} alt="Roots Salon interior with black lacquer and warm golden light" className="roots-image h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100c09]/75 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#efdbb5]"><Compass className="h-4 w-4 text-[#d6ae6d]" /> The interior / Roots Salon</div>
            <div className="absolute right-5 top-5 font-mono text-[10px] text-[#d6ae6d]">02 / 07</div>
          </div>
        </div>
      </section>

      <section id="services" className="roots-section roots-services relative overflow-hidden border-b border-[#b38346]/15">
        <div className="roots-services__wash" style={{ backgroundImage: `url(${activeService.image})` }} />
        <div className="absolute inset-0 bg-[#110d0a]/70" />
        <div className="relative mx-auto max-w-[1440px] px-5 py-24 sm:px-10 sm:py-32 lg:px-14">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div><GoldRule label="THE CRAFT" /><h2 className="mt-7 max-w-2xl font-serif text-5xl font-light leading-[0.9] tracking-[-0.04em] text-[#edddc3] sm:text-7xl">Choose your<br /><em className="text-[#d0a15b]">element.</em></h2></div>
            <p className="max-w-xs text-sm leading-6 text-[#ad9a85] lg:mb-2">Turn the dial. Each room has its own temperature, rhythm and way of bringing the detail forward.</p>
          </div>
          <div className="mt-14 grid gap-8 lg:grid-cols-[0.62fr_1.38fr]">
            <div className="roots-service-tabs self-start border-l border-[#b38346]/25">
              {(Object.keys(services) as ServiceCategory[]).map((item, index) => <button type="button" key={item} onClick={() => setService(item)} className={`group flex w-full items-center justify-between border-b border-[#b38346]/15 px-5 py-5 text-left transition-all ${service === item ? "bg-[#b38346]/14 text-[#eed8ad]" : "text-[#877666] hover:bg-[#b38346]/6 hover:text-[#d7b575]"}`}><span className="flex items-center gap-5"><span className="font-mono text-[10px] text-[#8e704b]">0{index + 1}</span><span className="text-xs tracking-[0.25em]">{item}</span></span><ArrowUpRight className={`h-4 w-4 transition-transform ${service === item ? "text-[#d6ae6d] group-hover:-translate-y-0.5" : "text-transparent group-hover:text-[#d6ae6d]"}`} /></button>)}
              <div className="mt-9 border-t border-[#b38346]/20 pt-5 text-[10px] uppercase tracking-[0.18em] text-[#79695a]">Details on consultation</div>
            </div>
            <div className="grid gap-7 md:grid-cols-[1.08fr_0.92fr]">
              <div className="roots-service-card relative min-h-[360px] overflow-hidden border border-[#d6ae6d]/35">
                <img key={activeService.image} src={activeService.image} alt={`${service} service at Roots Salon`} className="roots-image h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b08] via-transparent to-[#0e0b08]/10" />
                <div className="absolute left-5 top-5 rounded-full border border-[#e6c98d]/50 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-[#e6c98d]">Selected / {service}</div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between"><span className="font-serif text-3xl text-[#f1dfc4]">{activeService.detail}</span><span className="font-mono text-[10px] text-[#e0bb77]">03 / 07</span></div>
              </div>
              <div className="flex flex-col justify-end border-t border-[#b38346]/40 pt-7 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#c99a55]">{activeService.eyebrow}</p>
                <h3 className="mt-5 font-serif text-4xl font-light leading-[0.95] text-[#ebdac0]">{activeService.title}</h3>
                <p className="mt-5 text-sm leading-7 text-[#a99786]">{activeService.body}</p>
                <button type="button" onClick={openBooking} className="group mt-8 flex w-fit items-center gap-4 border-b border-[#b38346] pb-2 text-[10px] uppercase tracking-[0.22em] text-[#dbb574]">Book this service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="transformation" className="roots-section border-b border-[#b38346]/15 bg-[#17110d]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 sm:py-32 lg:px-14">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><GoldRule label="THE TRANSFORMATION" /><h2 className="mt-7 font-serif text-5xl font-light leading-[0.9] text-[#edddc3] sm:text-7xl">Before <em className="text-[#c99a55]">→</em> after.</h2></div><p className="max-w-xs text-sm leading-6 text-[#a99786]">The difference is never just visible. Drag through the moment the look becomes yours.</p></div>
          <div className="roots-comparison relative mt-14 aspect-[1.45/1] min-h-[330px] overflow-hidden border border-[#b38346]/35 sm:min-h-0">
            <img src={image("roots-gallery.png")} alt="Roots Salon beauty detail before transformation" className="absolute inset-0 h-full w-full object-cover grayscale-[0.35]" />
            <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${comparePosition}%` }}><img src={image("roots-hair.png")} alt="Roots Salon hair styling after transformation" className="h-full w-[calc(100vw-2.5rem)] max-w-none object-cover sm:w-[calc(100vw-5rem)] lg:w-[calc(1440px-7rem)]" /></div>
            <div className="absolute inset-y-0 flex w-px items-center justify-center bg-[#f0c97f] shadow-[0_0_20px_rgba(223,174,91,0.45)]" style={{ left: `${comparePosition}%` }}><span className="flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-[#f0c97f] bg-[#19110b] text-[#f0c97f]"><MoveHorizontal className="h-4 w-4" /></span></div>
            <div className="absolute left-5 top-5 bg-[#0d0a08]/70 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-[#e6c58a]">Before</div>
            <div className="absolute right-5 top-5 bg-[#0d0a08]/70 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-[#e6c58a]">After</div>
            <input aria-label="Drag to compare before and after" type="range" min="5" max="95" value={comparePosition} onChange={(event) => setComparePosition(Number(event.target.value))} className="roots-range absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0" />
          </div>
          <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#806c58]"><span>Move through the work</span><span className="font-mono text-[#b38346]">{String(comparePosition).padStart(2, "0")}%</span></div>
        </div>
      </section>

      <section id="space" className="roots-section border-b border-[#b38346]/15 bg-[#0f0c09]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 sm:py-32 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-end"><div><GoldRule label="EXPLORE THE SPACE" /><h2 className="mt-7 font-serif text-5xl font-light leading-[0.9] text-[#edddc3] sm:text-7xl">Follow the<br /><em className="text-[#d0a15b]">golden line.</em></h2></div><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><p className="max-w-sm text-sm leading-7 text-[#a99786]">The house is designed as a sequence of moods. Tap a point of light to open the door.</p><div className="flex items-center gap-2">{(["stations", "reception", "grooming"] as HotspotId[]).map((item) => <button type="button" key={item} onClick={() => setHotspot(item)} className={`h-2.5 w-2.5 rounded-full border transition-all ${hotspot === item ? "scale-125 border-[#e5c487] bg-[#e5c487]" : "border-[#806648] hover:bg-[#806648]"}`} aria-label={`Explore ${hotspotDetails[item].label}`} />)}</div></div></div>
          <div className="relative mt-14 aspect-[1.7/1] min-h-[350px] overflow-hidden border border-[#b38346]/30 sm:min-h-0">
            <img src={image("roots-interior.png")} alt="Explore the Roots Salon interior" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[#120d09]/20" />
            {(["stations", "reception", "grooming"] as HotspotId[]).map((item) => <button type="button" key={item} onClick={() => setHotspot(item)} className={`roots-hotspot absolute ${hotspotDetails[item].position} group`} aria-label={`Open ${hotspotDetails[item].label}`}><span className={`relative flex h-8 w-8 items-center justify-center rounded-full border ${hotspot === item ? "border-[#f0ce8b] bg-[#b38346] text-[#160e09]" : "border-[#f0ce8b]/75 bg-[#160f0b]/70 text-[#e6c27e]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" /></span><span className="absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap bg-[#120d09]/90 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-[#e6c27e] group-hover:block">{hotspotDetails[item].label}</span></button>)}
            <div className="absolute bottom-5 left-5 right-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div className="roots-hotspot-panel max-w-md border-l border-[#e6c27e] bg-[#120d09]/80 px-5 py-4 backdrop-blur-sm"><p className="text-[9px] uppercase tracking-[0.2em] text-[#d6ae6d]">{activeHotspot.label}</p><h3 className="mt-2 font-serif text-2xl text-[#f0dfc3]">{activeHotspot.title}</h3><p className="mt-2 text-xs leading-5 text-[#bba58d]">{activeHotspot.body}</p></div><span className="font-mono text-[10px] text-[#e5c487]">04 / 07</span></div>
          </div>
        </div>
      </section>

      <section id="gallery" className="roots-section roots-gallery-section overflow-hidden border-b border-[#b38346]/15 bg-[#17110d]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 sm:py-32 lg:px-14">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><GoldRule label="THE GALLERY" /><h2 className="mt-7 font-serif text-5xl font-light leading-[0.88] tracking-[-0.04em] text-[#edddc3] sm:text-7xl">Light finds<br /><em className="text-[#c99a55]">a face.</em></h2></div><div className="flex items-center gap-5"><button type="button" onClick={() => moveGallery(-1)} aria-label="Previous gallery image" className="rounded-full border border-[#b38346]/40 p-3 text-[#d6ae6d] hover:bg-[#b38346]/10"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => moveGallery(1)} aria-label="Next gallery image" className="rounded-full border border-[#b38346]/40 p-3 text-[#d6ae6d] hover:bg-[#b38346]/10"><ChevronRight className="h-4 w-4" /></button><span className="font-mono text-[10px] text-[#806c58]">{String(galleryIndex + 1).padStart(2, "0")} / 06</span></div></div>
          <div ref={galleryRef} className="mt-14 flex gap-4 overflow-hidden sm:gap-6">{galleryWindow.map((item, index) => <button type="button" key={`${item.src}-${index}`} onClick={() => { setGalleryIndex((galleryIndex + index) % galleryItems.length); setGalleryOpen(true); }} className={`roots-gallery-card group relative shrink-0 overflow-hidden text-left ${index === 0 ? "w-[74vw] sm:w-[49vw]" : "w-[52vw] sm:w-[31vw]"}`}><img src={item.src} alt={item.title} className="h-[58vw] max-h-[600px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[38vw]" /><span className="absolute inset-0 bg-gradient-to-t from-[#0f0c09]/90 via-transparent to-transparent opacity-80" /><span className="absolute bottom-5 left-5 right-5 flex items-end justify-between"><span><span className="block font-serif text-2xl text-[#f0dfc3]">{item.title}</span><span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-[#c59b5c]">{item.note}</span></span><ArrowUpRight className="h-5 w-5 text-[#d6ae6d] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></span></button>)}</div>
          <div className="mt-10 flex items-center justify-between border-t border-[#b38346]/20 pt-5"><span className="text-[10px] uppercase tracking-[0.2em] text-[#806c58]">An archive of the Roots point of view</span><button type="button" onClick={() => setGalleryOpen(true)} className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#d6ae6d] hover:text-[#f0dfc3]">View full gallery <ArrowRight className="h-4 w-4" /></button></div>
        </div>
      </section>

      <section className="roots-section roots-academy relative overflow-hidden border-b border-[#b38346]/15">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${image("roots-academy.png")})`, backgroundPosition: "center", backgroundSize: "cover" }} />
        <div className="absolute inset-0 bg-[#100c09]/80" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-24 sm:px-10 sm:py-32 lg:grid-cols-[1fr_1fr] lg:px-14">
          <div><GoldRule label="THE ROOTS METHOD" /><h2 className="mt-7 max-w-xl font-serif text-5xl font-light leading-[0.88] tracking-[-0.04em] text-[#edddc3] sm:text-7xl">Stay close<br /><em className="text-[#d0a15b]">to the craft.</em></h2></div>
          <div className="flex flex-col justify-end"><p className="max-w-md text-lg leading-8 text-[#dbc8b0]">Every look begins with listening. Every finish is a conversation between the hand, the light and the person in the chair.</p><div className="mt-8 flex flex-wrap items-center gap-8"><div><span className="block font-mono text-2xl text-[#d6ae6d]">01</span><span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-[#8d7862]">Listen first</span></div><div><span className="block font-mono text-2xl text-[#d6ae6d]">02</span><span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-[#8d7862]">Shape slowly</span></div><div><span className="block font-mono text-2xl text-[#d6ae6d]">03</span><span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-[#8d7862]">Leave lighter</span></div></div></div>
        </div>
      </section>

      <section id="booking" className="roots-section roots-booking-cta relative overflow-hidden">
        <div className="roots-booking-cta__fire absolute inset-0" />
        <div className="relative mx-auto max-w-[1440px] px-5 py-28 text-center sm:px-10 sm:py-40 lg:px-14">
          <Flame className="mx-auto h-7 w-7 text-[#d6ae6d]" />
          <p className="mt-6 text-[10px] uppercase tracking-[0.32em] text-[#c99a55]">The next chapter is yours</p>
          <h2 className="mx-auto mt-7 max-w-4xl font-serif text-6xl font-light leading-[0.84] tracking-[-0.055em] text-[#f0dfc3] sm:text-8xl">Ready to enter<br /><em className="text-[#d0a15b]">the Roots?</em></h2>
          <p className="mx-auto mt-8 max-w-md text-sm leading-7 text-[#b7a38d]">Tell us what you are looking for. We will make space for the rest.</p>
          <button type="button" onClick={openBooking} className="group mt-9 inline-flex items-center gap-5 border border-[#d6ae6d] px-7 py-4 text-[10px] uppercase tracking-[0.24em] text-[#e7cb94] transition-colors hover:bg-[#d6ae6d] hover:text-[#17100b]">Book a private visit <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button>
        </div>
      </section>

      <footer className="border-t border-[#b38346]/20 bg-[#0d0a08]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-9 px-5 py-10 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-14">
          <div><LogoMark /><p className="mt-5 max-w-xs text-xs leading-5 text-[#786b5c]">A beauty house for hair, beauty, grooming and bridal. Details, held in golden light.</p></div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 text-[10px] uppercase tracking-[0.18em] text-[#9c856a]"><button type="button" onClick={() => scrollTo("top")} className="hover:text-[#e2bd77]">Back to top</button><button type="button" onClick={() => setContactHint(true)} className="hover:text-[#e2bd77]">Contact the house</button><button type="button" onClick={() => INSTAGRAM_URL ? window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer") : setContactHint(true)} className="hover:text-[#e2bd77]">Follow the roots</button></div>
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#5e5145]">07 / 07 · Made for the moment</p>
        </div>
        {contactHint && <div className="mx-auto max-w-[1440px] px-5 pb-8 text-center text-xs text-[#b38346] sm:px-10 lg:px-14">Contact details and social links are ready to be added by the Roots team.</div>}
      </footer>

      <div className="fixed bottom-5 right-5 z-40 hidden flex-col items-end gap-3 sm:flex">
        {contactHint && <div className="border border-[#b38346]/30 bg-[#17100c]/95 px-4 py-3 text-[10px] uppercase tracking-[0.13em] text-[#d4ae6b]">WhatsApp number pending configuration</div>}
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Contact Roots Salon on WhatsApp" onClick={() => WHATSAPP_NUMBER ? window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Roots%20Salon%2C%20I%20would%20like%20to%20make%20an%20enquiry.`, "_blank", "noopener,noreferrer") : setContactHint(true)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b38346]/70 bg-[#120d09] text-[#d6ae6d] transition-colors hover:bg-[#b38346] hover:text-[#160f0b]"><Play className="h-3 w-3 fill-current" /></button>
          <button type="button" onClick={openBooking} className="flex items-center gap-3 rounded-full border border-[#d6ae6d] bg-[#120d09] px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-[#e0bc77] shadow-[0_8px_30px_rgba(179,131,70,0.12)] transition-colors hover:bg-[#d6ae6d] hover:text-[#160f0b]"><Sparkles className="h-3.5 w-3.5" /> Book now</button>
        </div>
      </div>
      <button type="button" onClick={openBooking} className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between bg-[#b38346] px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-[#160f0b] sm:hidden">Book a visit <ArrowUpRight className="h-4 w-4" /></button>

      {galleryOpen && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-[#090705]/98 p-5 sm:p-10" role="dialog" aria-modal="true" aria-label="Roots Salon full gallery">
          <div className="flex items-center justify-between"><LogoMark compact /><button type="button" aria-label="Close gallery" onClick={() => setGalleryOpen(false)} className="rounded-full border border-[#b38346]/40 p-3 text-[#d6ae6d] hover:bg-[#b38346]/10"><X className="h-4 w-4" /></button></div>
          <div className="flex min-h-0 flex-1 items-center justify-center py-6"><div className="relative h-full max-h-[76vh] w-full max-w-5xl"><img src={galleryItems[galleryIndex].src} alt={galleryItems[galleryIndex].title} className="h-full w-full object-contain" /><div className="absolute bottom-5 left-5 bg-[#100c09]/80 px-4 py-3 backdrop-blur-sm"><p className="font-serif text-2xl text-[#f0dfc3]">{galleryItems[galleryIndex].title}</p><p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#c99a55]">{galleryItems[galleryIndex].note}</p></div></div></div>
          <div className="flex items-center justify-between border-t border-[#b38346]/20 pt-5"><button type="button" onClick={() => moveGallery(-1)} className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#d6ae6d]"><ChevronLeft className="h-4 w-4" /> Previous</button><span className="font-mono text-[10px] text-[#806c58]">{String(galleryIndex + 1).padStart(2, "0")} / 06</span><button type="button" onClick={() => moveGallery(1)} className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#d6ae6d]">Next <ChevronRight className="h-4 w-4" /></button></div>
        </div>
      )}

      <BookingPanel open={bookingOpen} onClose={() => setBookingOpen(false)} initialService={service} />
      <style>{`
        .roots-page { font-family: "DM Sans", sans-serif; }
        .roots-page button, .roots-page a { cursor: none; }
        .roots-page .font-serif, .roots-page h1, .roots-page h2, .roots-page h3 { font-family: "Libre Baskerville", Georgia, serif; }
        .roots-logo { position: relative; display: inline-flex; align-items: center; gap: 9px; color: #eed9b6; }
        .roots-logo__word { font-family: "DM Sans", sans-serif; font-size: 18px; font-weight: 500; letter-spacing: .35em; line-height: 1; }
        .roots-logo__sub { position: absolute; bottom: -13px; left: 31px; font-size: 7px; letter-spacing: .42em; color: #b38346; }
        .roots-logo--compact .roots-logo__word { font-size: 14px; letter-spacing: .31em; }
        .roots-logo__icon { position: relative; display: inline-flex; width: 18px; height: 20px; align-items: flex-end; justify-content: center; gap: 2px; }
        .roots-logo__icon span { display: block; width: 2px; background: #c99a55; border-radius: 2px; transform-origin: bottom; }
        .roots-logo__icon span:nth-child(1) { height: 11px; transform: rotate(-27deg); }
        .roots-logo__icon span:nth-child(2) { height: 18px; }
        .roots-logo__icon span:nth-child(3) { height: 13px; transform: rotate(28deg); }
        .roots-cursor { position: fixed; z-index: 120; pointer-events: none; height: 6px; width: 6px; margin-left: -3px; margin-top: -3px; border-radius: 50%; background: #e6c27e; box-shadow: 0 0 16px 4px rgba(215,164,78,.4); transition: width .2s ease, height .2s ease, margin .2s ease, border .2s ease, background .2s ease; }
        .roots-cursor[data-mode="ring"] { height: 28px; width: 28px; margin-left: -14px; margin-top: -14px; background: transparent; border: 1px solid #e6c27e; box-shadow: 0 0 18px rgba(215,164,78,.25); }
        .roots-cursor[data-mode="image"] { height: 42px; width: 42px; margin-left: -21px; margin-top: -21px; background: rgba(229,190,112,.08); border: 1px solid rgba(229,190,112,.7); }
        .roots-hero__image { background-position: center; background-size: cover; transform: scale(1.08) translate3d(var(--hero-x), var(--hero-y), 0); filter: saturate(.78) contrast(1.04); transition: transform .7s cubic-bezier(.2,.7,.2,1); }
        .roots-hero__veil { background: linear-gradient(90deg, rgba(11,8,6,.88) 0%, rgba(11,8,6,.42) 48%, rgba(11,8,6,.26) 100%), linear-gradient(0deg, rgba(10,7,5,.92) 0%, transparent 53%); }
        .roots-hero__rays { opacity: .3; background: linear-gradient(107deg, transparent 26%, rgba(237,199,126,.12) 43%, transparent 46%), linear-gradient(76deg, transparent 48%, rgba(237,199,126,.07) 53%, transparent 56%); mix-blend-mode: screen; }
        .roots-embers i { position: absolute; left: calc((var(--i) * 9%) + 3%); bottom: -20px; width: 2px; height: 2px; border-radius: 50%; background: #e4ad5d; opacity: 0; animation: roots-ember 6s calc(var(--i) * -0.45s) infinite ease-out; box-shadow: 0 0 8px 2px rgba(225,160,67,.45); }
        .roots-embers i:nth-child(3n) { width: 3px; height: 3px; }
        .roots-entry__glow { position: absolute; width: 45vw; height: 45vw; border-radius: 50%; background: radial-gradient(circle, rgba(175,116,42,.18), transparent 68%); filter: blur(6px); animation: roots-breathe 4s ease-in-out infinite; }
        .roots-entry__roots { position: absolute; bottom: -8vh; left: 50%; height: 72vh; width: 70vw; transform: translateX(-50%); opacity: .72; }
        .roots-entry__roots span { position: absolute; bottom: 0; left: 50%; width: 1px; height: 100%; transform-origin: bottom; background: linear-gradient(to top, rgba(202,151,77,.9), transparent); animation: roots-grow 2.8s cubic-bezier(.2,.7,.2,1) both; }
        .roots-entry__roots span:nth-child(1) { transform: rotate(-38deg); height: 73%; animation-delay: .2s; }
        .roots-entry__roots span:nth-child(2) { transform: rotate(-19deg); height: 92%; animation-delay: .38s; }
        .roots-entry__roots span:nth-child(3) { height: 100%; animation-delay: .52s; }
        .roots-entry__roots span:nth-child(4) { transform: rotate(22deg); height: 88%; animation-delay: .64s; }
        .roots-entry__roots span:nth-child(5) { transform: rotate(42deg); height: 65%; animation-delay: .8s; }
        .roots-root-lines { position: absolute; inset: auto 0 -25px 0; height: 190px; opacity: .28; background: repeating-linear-gradient(98deg, transparent 0 13%, rgba(191,139,65,.45) 13.1% 13.25%, transparent 13.35% 25%); transform: skewY(-5deg); }
        .roots-image { filter: saturate(.72) contrast(1.05); transition: transform .8s cubic-bezier(.2,.7,.2,1), filter .8s ease; }
        .roots-image:hover { transform: scale(1.035); filter: saturate(.95) contrast(1.05); }
        .roots-services { isolation: isolate; }
        .roots-services__wash { position: absolute; inset: 0; background-position: center; background-size: cover; opacity: .12; filter: blur(18px) saturate(.7); transform: scale(1.08); transition: background-image .5s ease; }
        .roots-service-card { transform: perspective(1000px) rotateY(-2deg); transition: transform .6s ease; }
        .roots-service-card:hover { transform: perspective(1000px) rotateY(0deg) translateY(-4px); }
        .roots-comparison { isolation: isolate; }
        .roots-comparison > img { filter: saturate(.55) sepia(.22); }
        .roots-range::-webkit-slider-thumb { appearance: none; }
        .roots-hotspot { transform: translate(-50%, -50%); }
        .roots-gallery-card:nth-child(2) { transform: rotate(1.5deg) translateY(24px); }
        .roots-gallery-card:nth-child(3) { transform: rotate(-1.2deg) translateY(-10px); }
        .roots-booking-cta { background: #0e0a08; }
        .roots-booking-cta__fire { opacity: .7; background: radial-gradient(ellipse at 50% 115%, rgba(159,77,34,.42), transparent 48%), radial-gradient(ellipse at 50% 112%, rgba(221,151,57,.18), transparent 31%); animation: roots-fire 5s ease-in-out infinite; }
        .roots-input { width: 100%; border: 1px solid rgba(179,131,70,.32); background: rgba(36,25,18,.55); padding: 14px 15px; color: #eadbc5; outline: none; font-size: 13px; }
        .roots-input::placeholder { color: #796a5c; }
        .roots-input:focus { border-color: #c99a55; box-shadow: 0 0 0 1px rgba(201,154,85,.2); }
        .roots-input option { background: #1d1510; color: #eadbc5; }
        @keyframes roots-ember { 0% { transform: translate3d(0,0,0) scale(.7); opacity: 0; } 15% { opacity: .8; } 100% { transform: translate3d(calc((var(--i) - 5) * 13px), -65vh, 0) scale(0); opacity: 0; } }
        @keyframes roots-breathe { 0%,100% { transform: scale(.9); opacity: .65; } 50% { transform: scale(1.08); opacity: 1; } }
        @keyframes roots-grow { from { transform: rotate(0deg) scaleY(0); opacity: 0; } to { opacity: 1; } }
        @keyframes roots-fire { 0%,100% { transform: scale(1); opacity: .55; } 50% { transform: scale(1.12); opacity: .9; } }
        @media (max-width: 767px) { .roots-cursor--desktop { display: none; } .roots-page button, .roots-page a { cursor: pointer; } .roots-hero__image { background-position: 62% center; } .roots-entry__roots { width: 140vw; } .roots-gallery-card:nth-child(2), .roots-gallery-card:nth-child(3) { transform: none; } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; } }
      `}</style>
    </main>
  );
}

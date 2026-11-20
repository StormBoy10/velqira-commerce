import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from 'react';
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImagePlus,
  LayoutDashboard,
  LockKeyhole,
  PackagePlus,
  Palette,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Truck,
  Upload,
  Wallet,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type BannerLayout = 'split' | 'minimal' | 'curated';
type BannerStatus = 'Active in preview' | 'Scheduled demo' | 'Draft';
type ViewportMode = 'desktop' | 'tablet' | 'mobile';
type CtaRoute = '/collections' | '/shop' | '/product';
type BannerField = 'eyebrow' | 'headline' | 'subtitle' | 'announcement';
type CtaField = 'primaryText' | 'secondaryText';

interface HeroBanner {
  id: string;
  name: string;
  status: BannerStatus;
  image: string;
  layout: BannerLayout;
  scrim: number;
  eyebrow: string;
  headline: string;
  subtitle: string;
  announcement: string;
  primaryText: string;
  primaryRoute: CtaRoute;
  secondaryText: string;
  secondaryRoute: CtaRoute;
  audiences: string[];
}

const audienceOptions = [
  'Korean Goodies',
  'Jewellery & Baroque Pearls',
  'Dresses & Fashion',
  'Home Decor',
  'Art & Crafts',
];

const initialBanners: HeroBanner[] = [
  {
    id: 'hero-korean',
    name: 'Korean Goodies & Kawaii Monographs',
    status: 'Active in preview',
    image: '/images/korean-sticker-1.jpg',
    layout: 'split',
    scrim: 24,
    eyebrow: 'Curated atelier · Est. 2021 · Kochi',
    headline: 'Poetry in Everyday Living: Handcrafted Decor, Kawaii Curios & Fine Jewellery',
    subtitle:
      'A curated selection of independent atelier-made objects and small-batch Korean studio finds.',
    announcement: 'Limited small-batch drops · Explore the edit',
    primaryText: 'Explore Collections',
    primaryRoute: '/collections',
    secondaryText: 'Spotlight: Korean Goodies',
    secondaryRoute: '/shop',
    audiences: ['Korean Goodies', 'Jewellery & Baroque Pearls', 'Dresses & Fashion', 'Home Decor'],
  },
  {
    id: 'hero-jewellery',
    name: 'Jewellery Atelier & Baroque Pearls',
    status: 'Scheduled demo',
    image: '/images/jewellery-necklace-1.jpg',
    layout: 'minimal',
    scrim: 30,
    eyebrow: 'Hand-finished in small batches · Kochi',
    headline: 'Objects of adornment, made to be kept',
    subtitle: 'Discover sculptural forms, delicate baroque pearls, and independent atelier work.',
    announcement: 'A new jewellery edit is arriving soon',
    primaryText: 'Discover Jewellery',
    primaryRoute: '/collections',
    secondaryText: 'View the Atelier',
    secondaryRoute: '/shop',
    audiences: ['Jewellery & Baroque Pearls', 'Art & Crafts'],
  },
  {
    id: 'hero-silk',
    name: 'Handloom Silk & Artisan Ceramics',
    status: 'Draft',
    image: '/images/hero-slide-3-showcase.jpg',
    layout: 'curated',
    scrim: 20,
    eyebrow: 'Slow-made textures · Kerala',
    headline: 'A quieter kind of statement',
    subtitle: 'Handwoven textiles and tactile ceramic forms, selected for everyday rituals.',
    announcement: 'Explore a considered edit from the atelier',
    primaryText: 'Explore the Edit',
    primaryRoute: '/collections',
    secondaryText: 'Shop Home Decor',
    secondaryRoute: '/shop',
    audiences: ['Dresses & Fashion', 'Home Decor', 'Art & Crafts'],
  },
];

const initialActiveId = initialBanners[0].id;

const viewportOptions: { id: ViewportMode; label: string; dimensions: string }[] = [
  { id: 'desktop', label: 'Desktop', dimensions: '1440px' },
  { id: 'tablet', label: 'Tablet', dimensions: '768px' },
  { id: 'mobile', label: 'Mobile', dimensions: '390px' },
];

const layoutOptions: { id: BannerLayout; name: string; description: string }[] = [
  { id: 'split', name: 'Full-width split', description: 'Editorial image with left-aligned copy' },
  { id: 'minimal', name: 'Minimal typography', description: 'Centered copy with a calm overlay' },
  { id: 'curated', name: 'Curated card', description: 'Inset copy panel over imagery' },
];

const inputClass =
  'w-full rounded-md border border-[#e5e2dc] bg-white px-3 py-2.5 text-xs text-[#1c1c18] outline-none focus:border-[#735c00] focus:ring-1 focus:ring-[#735c00]';

export function AdminHeroPage() {
  const [banners, setBanners] = useState(initialBanners);
  const [savedBanners, setSavedBanners] = useState(initialBanners);
  const [activeId, setActiveId] = useState(initialActiveId);
  const [viewport, setViewport] = useState<ViewportMode>('mobile');
  const [bannerSearch, setBannerSearch] = useState('');
  const [notice, setNotice] = useState('');

  const activeBanner = banners.find((banner) => banner.id === activeId) ?? banners[0];
  const hasUnsavedChanges = JSON.stringify(banners) !== JSON.stringify(savedBanners);
  const visibleBanners = useMemo(() => {
    const query = bannerSearch.trim().toLowerCase();
    return banners.filter((banner) => !query || banner.name.toLowerCase().includes(query));
  }, [bannerSearch, banners]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Hero Screen & Banner Manager | VELQIRA';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const updateBanner = <K extends keyof HeroBanner>(field: K, value: HeroBanner[K]) => {
    setBanners((current) =>
      current.map((banner) => (banner.id === activeId ? { ...banner, [field]: value } : banner)),
    );
    setNotice('Preview updated locally. The live storefront has not changed.');
  };

  const updateCopy = (field: BannerField, value: string) => updateBanner(field, value);

  const updateCta = (field: CtaField, value: string) => updateBanner(field, value);

  const selectBanner = (id: string) => {
    setActiveId(id);
    setNotice('');
  };

  const addBanner = () => {
    const nextBanner: HeroBanner = {
      ...initialBanners[0],
      id: `hero-demo-${Date.now()}`,
      name: 'New editorial banner',
      status: 'Draft',
      headline: 'New atelier story',
      subtitle: 'Add a short introduction to this curated collection.',
      announcement: 'A new atelier story',
      audiences: [],
    };
    setBanners((current) => [...current, nextBanner]);
    setActiveId(nextBanner.id);
    setBannerSearch('');
    setNotice('Draft banner added to this page preview.');
  };

  const discardChanges = () => {
    setBanners(savedBanners);
    setActiveId(savedBanners.some((banner) => banner.id === activeId) ? activeId : savedBanners[0].id);
    setBannerSearch('');
    setNotice('Unsaved banner changes were discarded in this preview.');
  };

  const applyToPreview = () => {
    const nextBanners = banners.map((banner) =>
      banner.id === activeId
        ? { ...banner, status: 'Active in preview' as const }
        : banner.status === 'Active in preview'
          ? { ...banner, status: 'Scheduled demo' as const }
          : banner,
    );
    setBanners(nextBanners);
    setSavedBanners(nextBanners);
    setNotice('Hero update applied to the local preview only. Nothing was published to the live storefront.');
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setNotice('Choose an image file to preview it.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setNotice('Choose an image smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result;
      if (typeof image === 'string') {
        updateBanner('image', image);
        setNotice('Banner image preview loaded locally. It has not been uploaded.');
      }
    };
    reader.onerror = () => setNotice('Could not read the selected image.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const toggleAudience = (audience: string) => {
    const nextAudiences = activeBanner.audiences.includes(audience)
      ? activeBanner.audiences.filter((item) => item !== audience)
      : [...activeBanner.audiences, audience];
    updateBanner('audiences', nextAudiences);
  };

  const stepBanner = (direction: -1 | 1) => {
    const currentIndex = banners.findIndex((banner) => banner.id === activeId);
    const nextIndex = (currentIndex + direction + banners.length) % banners.length;
    selectBanner(banners[nextIndex].id);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f3] text-[#1c1c18]">
      <AdminHeroSidebar />

      <div className="min-h-screen md:pl-52 xl:pl-64">
        <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#e5e2dc] bg-[#fcf9f3]/95 px-4 py-3 backdrop-blur md:px-5">
          <label className="relative min-w-[220px] flex-1 md:max-w-sm">
            <span className="sr-only">Search banners</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8178]" size={15} />
            <input
              className="w-full rounded-md border border-[#e5e2dc] bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-[#735c00]"
              onChange={(event) => setBannerSearch(event.target.value)}
              placeholder="Search banner names..."
              type="search"
              value={bannerSearch}
            />
          </label>
          <div className="flex items-center gap-2">
            <Link
              className="hidden items-center gap-1.5 rounded-md bg-[#f0eee8] px-3 py-2 text-[11px] font-medium hover:bg-[#e5e2dc] sm:inline-flex"
              to="/"
            >
              <Eye aria-hidden="true" size={14} />
              View current storefront
            </Link>
            <Link
              className="hidden items-center gap-1.5 rounded-md bg-[#201b17] px-3 py-2 text-[11px] font-medium text-white hover:bg-[#39312b] sm:inline-flex"
              to="/admin/products/new"
            >
              <PackagePlus aria-hidden="true" size={14} />
              Add New Product
            </Link>
            <button
              aria-label="Notifications unavailable in preview"
              className="rounded-md p-2 text-[#6b625d]"
              disabled
              type="button"
            >
              <Bell aria-hidden="true" size={16} />
            </button>
            <span
              aria-label="Demo administrator profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#201b17] text-white"
            >
              <LockKeyhole aria-hidden="true" size={15} />
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] space-y-4 p-4 md:p-6 xl:p-8">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div className="max-w-3xl">
              <p className="mb-2 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
                <span>Atelier suite</span>
                <span className="text-[#c7bfb6]">/</span>
                <Link className="hover:underline" to="/admin/customizer">Storefront customizer</Link>
                <span className="text-[#c7bfb6]">/</span>
                <span>Hero screen &amp; banner editor</span>
              </p>
              <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">Hero Screen &amp; Banner Manager</h1>
              <p className="mt-2 text-sm leading-5 text-[#6b625d]">
                Edit banner content and preview responsive customer screens. The live storefront is not connected.
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[8px] text-[#8b8178]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                Edits update this page preview · Local changes reset after leaving or reloading
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-1.5 rounded-md bg-[#f0eee8] px-3 py-2.5 text-[10px] font-medium hover:bg-[#e5e2dc] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!hasUnsavedChanges}
                onClick={discardChanges}
                type="button"
              >
                <X aria-hidden="true" size={13} />
                Discard Changes
              </button>
              <Link
                className="inline-flex items-center gap-1.5 rounded-md bg-[#f0eee8] px-3 py-2.5 text-[10px] font-medium hover:bg-[#e5e2dc]"
                to="/"
              >
                <Eye aria-hidden="true" size={13} />
                View current storefront
              </Link>
              <button
                className="inline-flex items-center gap-1.5 rounded-md bg-[#201b17] px-3 py-2.5 text-[10px] font-semibold text-white hover:bg-[#39312b]"
                onClick={applyToPreview}
                type="button"
              >
                <Sparkles aria-hidden="true" size={13} />
                Apply Hero to Preview
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#eadfbf] bg-[#fff9e8] px-3 py-2 text-[9px] leading-4 text-[#6b625d]">
            <span>
              <strong className="text-[#4d4540]">Preview only.</strong> Banner text, images, CTA routes, and layout choices
              update this simulator; they are not published to customers.
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f0e5] px-2.5 py-1 font-semibold uppercase tracking-wider text-[#735c00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
              {activeBanner.status}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {visibleBanners.map((banner, index) => (
              <button
                aria-pressed={banner.id === activeId}
                className={`flex min-w-[190px] max-w-[260px] items-center gap-2 rounded-md border px-3 py-2 text-left transition ${
                  banner.id === activeId
                    ? 'border-[#c9b571] bg-white shadow-sm'
                    : 'border-transparent bg-[#f0eee8] hover:bg-white'
                }`}
                key={banner.id}
                onClick={() => selectBanner(banner.id)}
                type="button"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#a98218]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[9px] font-medium">{`Banner ${index + 1}: ${banner.name}`}</span>
                  <span className="mt-1 block text-[7px] font-semibold uppercase tracking-wider text-[#8b8178]">
                    {banner.status}
                  </span>
                </span>
                {banner.id === activeId && <SlidersHorizontal aria-hidden="true" size={11} />}
              </button>
            ))}
            {visibleBanners.length === 0 && (
              <p className="rounded-md bg-white px-3 py-2 text-[9px] text-[#8b8178]">No banners match the search.</p>
            )}
            <button
              aria-label="Add banner"
              className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white px-3 py-2 text-[9px] font-medium text-[#735c00] hover:bg-[#f0eee8]"
              onClick={addBanner}
              type="button"
            >
              <Plus aria-hidden="true" size={12} />
              Create banner
            </button>
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
            <section aria-label="Banner settings" className="space-y-4">
              <Panel
                description="Choose a clean editorial arrangement. The carousel transition remains a simple fade."
                number="Step 01"
                title="Layout Architecture"
              >
                <div className="grid grid-cols-3 gap-2">
                  {layoutOptions.map((option) => (
                    <button
                      aria-pressed={activeBanner.layout === option.id}
                      className={`rounded-md border p-2 text-left transition ${
                        activeBanner.layout === option.id
                          ? 'border-[#201b17] bg-[#fcf9f3] ring-1 ring-[#201b17]'
                          : 'border-[#e5e2dc] bg-white hover:bg-[#f6f3ed]'
                      }`}
                      key={option.id}
                      onClick={() => updateBanner('layout', option.id)}
                      type="button"
                    >
                      <LayoutPreview layout={option.id} />
                      <span className="mt-2 block text-[8px] font-semibold leading-3">{option.name}</span>
                      <span className="mt-1 block min-h-6 text-[7px] leading-3 text-[#8b8178]">{option.description}</span>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel
                description="Add one image and a light tonal scrim to keep copy legible at each viewport size."
                number="Step 02"
                title="Curated Imagery & Tonal Scrim"
              >
                <div className="grid grid-cols-[90px_1fr] gap-3">
                  <img
                    alt="Selected banner artwork preview"
                    className="aspect-[4/3] w-full rounded-md border border-[#e5e2dc] bg-[#f0eee8] object-cover"
                    src={activeBanner.image}
                  />
                  <div className="space-y-2">
                    <p className="text-[8px] text-[#6b625d]">Hero visual · Landscape / editorial composition</p>
                    <p className="rounded bg-[#f4f0e5] px-2 py-1.5 text-[7px] font-semibold uppercase tracking-wider text-[#735c00]">
                      Recommended: 2400 × 1600 px
                    </p>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#f0eee8] px-2.5 py-2 text-[8px] font-semibold hover:bg-[#e5e2dc]">
                      <Upload aria-hidden="true" size={11} />
                      Replace image
                      <input accept="image/*" className="sr-only" onChange={handleImageChange} type="file" />
                    </label>
                    <p className="text-[7px] text-[#8b8178]">Image is previewed locally; max 5 MB.</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-[8px]">
                    <label className="font-semibold uppercase tracking-wider text-[#6b625d]" htmlFor="hero-scrim">
                      Warm sand editorial vignette
                    </label>
                    <span className="font-semibold text-[#735c00]">{activeBanner.scrim}% opacity</span>
                  </div>
                  <input
                    className="w-full accent-[#735c00]"
                    id="hero-scrim"
                    max={60}
                    min={0}
                    onChange={(event) => updateBanner('scrim', Number(event.target.value))}
                    type="range"
                    value={activeBanner.scrim}
                  />
                  <p className="mt-1 text-[7px] leading-3 text-[#8b8178]">
                    Keep enough contrast for text without obscuring the artwork.
                  </p>
                </div>
                <div className="mt-3 rounded-md bg-[#f6f3ed] p-2.5">
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-[#6b625d]">
                    Banner sequence · Simple fade transition
                  </p>
                  <p className="mt-1 text-[7px] leading-3 text-[#8b8178]">
                    Slides can be selected in the preview; transition settings are intentionally kept simple.
                  </p>
                </div>
              </Panel>

              <Panel
                description="Keep the headline and supporting copy concise for the mobile viewport."
                number="Step 03"
                title="Typographic Copywriting"
              >
                <div className="space-y-3">
                  <TextField
                    count={activeBanner.eyebrow.length}
                    label="Provenance overline / eyebrow"
                    maxLength={44}
                    onChange={(value) => updateCopy('eyebrow', value)}
                    value={activeBanner.eyebrow}
                  />
                  <TextField
                    count={activeBanner.headline.length}
                    label="Editorial display headline"
                    maxLength={120}
                    multiline
                    onChange={(value) => updateCopy('headline', value)}
                    value={activeBanner.headline}
                  />
                  <TextField
                    count={activeBanner.subtitle.length}
                    label="Curatorial editorial subtitle"
                    maxLength={180}
                    multiline
                    onChange={(value) => updateCopy('subtitle', value)}
                    value={activeBanner.subtitle}
                  />
                  <TextField
                    count={activeBanner.announcement.length}
                    label="Seasonal announcement ribbon"
                    maxLength={65}
                    onChange={(value) => updateCopy('announcement', value)}
                    value={activeBanner.announcement}
                  />
                </div>
              </Panel>

              <Panel
                description="Set a primary action and an optional secondary route for this banner."
                number="Step 04"
                title="Atelier CTA Controls"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CtaEditor
                    label="Primary action"
                    route={activeBanner.primaryRoute}
                    routeLabel="Target route"
                    text={activeBanner.primaryText}
                    onRouteChange={(route) => updateBanner('primaryRoute', route)}
                    onTextChange={(value) => updateCta('primaryText', value)}
                    variant="dark"
                  />
                  <CtaEditor
                    label="Secondary action"
                    route={activeBanner.secondaryRoute}
                    routeLabel="Target route"
                    text={activeBanner.secondaryText}
                    onRouteChange={(route) => updateBanner('secondaryRoute', route)}
                    onTextChange={(value) => updateCta('secondaryText', value)}
                    variant="light"
                  />
                </div>
              </Panel>

              <Panel
                description="Choose which quick-jump pills to show beneath the banner preview."
                number="Step 05"
                title="Target Audience & Quick Links"
              >
                <div className="flex flex-wrap gap-2">
                  {audienceOptions.map((audience) => {
                    const selected = activeBanner.audiences.includes(audience);
                    return (
                      <button
                        aria-pressed={selected}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[8px] font-medium ${
                          selected ? 'bg-[#201b17] text-white' : 'bg-[#f0eee8] text-[#6b625d] hover:bg-[#e5e2dc]'
                        }`}
                        key={audience}
                        onClick={() => toggleAudience(audience)}
                        type="button"
                      >
                        {selected && <Check aria-hidden="true" size={9} />}
                        {audience}
                      </button>
                    );
                  })}
                </div>
              </Panel>
            </section>

            <aside className="space-y-4 xl:sticky xl:top-20">
              <section className="rounded-xl border border-[#e5e2dc] bg-white p-3 shadow-sm sm:p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 rounded-md bg-[#f6f3ed] p-0.5">
                    {viewportOptions.map((option) => (
                      <button
                        aria-pressed={viewport === option.id}
                        className={`rounded px-2.5 py-1.5 text-[8px] font-semibold ${
                          viewport === option.id ? 'bg-[#201b17] text-white' : 'text-[#6b625d]'
                        }`}
                        key={option.id}
                        onClick={() => setViewport(option.id)}
                        type="button"
                      >
                        {option.label} ({option.dimensions})
                      </button>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-wider text-[#735c00]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                    Preview updates instantly
                  </span>
                </div>
                <div className="flex min-h-[410px] items-center justify-center rounded-lg bg-[#f6f3ed] p-3 sm:min-h-[540px] sm:p-5">
                  <HeroPreview banner={activeBanner} onStep={stepBanner} viewport={viewport} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[7px] text-[#8b8178]">
                  <span>Viewport preview · scale adapted to panel</span>
                  <span>Asset bandwidth: local image · Browser preview</span>
                </div>
              </section>

              <section className="rounded-xl border border-[#e5e2dc] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-[10px] font-semibold">
                    <LockKeyhole aria-hidden="true" size={13} />
                    Storefront integrity · preview
                  </h2>
                  <span className="rounded-full bg-[#f4f0e5] px-2 py-1 text-[7px] font-semibold uppercase tracking-wider text-[#735c00]">
                    Review required
                  </span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <IntegrityItem label="Checkout policy" value="Sample prepaid copy" />
                  <IntegrityItem label="Tax & origin" value="Not verified" />
                  <IntegrityItem label="Provenance" value="Editable demo copy" />
                </div>
              </section>

              {notice && (
                <p aria-live="polite" className="flex items-start gap-2 rounded-lg bg-[#f0eee8] p-3 text-[9px] leading-4 text-[#4d4540]" role="status">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#735c00]" />
                  <span>{notice}</span>
                  <button aria-label="Dismiss message" className="ml-auto" onClick={() => setNotice('')} type="button">
                    <X aria-hidden="true" size={12} />
                  </button>
                </p>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminHeroSidebar() {
  const navClass = 'flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-[#6b625d] hover:bg-[#ebe8e2]';
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-52 flex-col justify-between border-r border-[#e5e2dc] bg-[#f6f3ed] p-4 md:flex xl:w-64 xl:p-5">
      <div className="min-h-0">
        <div className="mb-6 px-2">
          <p className="mb-1 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
            Kochi Atelier Sanctuary
          </p>
          <p className="font-serif text-xl uppercase tracking-tight">Velqira Atelier</p>
          <p className="mt-1 flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-[#6b625d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
            Storefront preview
          </p>
        </div>
        <nav aria-label="Admin preview navigation" className="space-y-5 overflow-y-auto">
          <NavGroup label="Overview">
            <Link className={navClass} to="/admin/dashboard">
              <LayoutDashboard aria-hidden="true" size={14} />
              Dashboard &amp; Quick Stats
            </Link>
          </NavGroup>
          <NavGroup label="Catalog & Products">
            <Link className={navClass} to="/admin/products">
              <PackagePlus aria-hidden="true" size={14} />
              Product Listing
            </Link>
            <Link className={navClass} to="/admin/categories">
              <ImagePlus aria-hidden="true" size={14} />
              Category Image Manager
            </Link>
            <Link className={navClass} to="/admin/products/new">
              <PackagePlus aria-hidden="true" size={14} />
              Assign New Product
            </Link>
          </NavGroup>
          <NavGroup label="Storefront Customizer">
            <Link className={navClass} to="/admin/customizer">
              <Palette aria-hidden="true" size={14} />
              Customer Screen Controls
            </Link>
            <span aria-current="page" className="flex items-center gap-2 rounded-md bg-[#201b17] px-2.5 py-2 text-[11px] font-semibold text-white">
              <Sparkles aria-hidden="true" size={14} />
              Hero Screen &amp; Banner
            </span>
          </NavGroup>
          <NavGroup label="Orders & Reconciliation">
            <Link className={navClass} to="/admin/settlements">
              <Wallet aria-hidden="true" size={14} />
              UPI Settlements (Demo)
            </Link>
            <span aria-disabled="true" className="flex items-center gap-2 px-2.5 py-2 text-[11px] text-[#8b8178]">
              <Truck aria-hidden="true" size={14} />
              Dispatches
            </span>
          </NavGroup>
        </nav>
      </div>
      <div className="rounded-lg bg-[#ebe8e2] p-3">
        <p className="text-xs font-semibold">Admin preview</p>
        <p className="mt-1 text-[10px] leading-4 text-[#6b625d]">
          Banner edits stay in this page preview.
        </p>
        <Link className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#735c00]" to="/admin">
          <LockKeyhole aria-hidden="true" size={12} />
          Admin access
        </Link>
      </div>
    </aside>
  );
}

function NavGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="px-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8b8178]">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Panel({
  children,
  description,
  number,
  title,
}: {
  children: ReactNode;
  description: string;
  number: string;
  title: string;
}) {
  return (
    <section className="space-y-3 rounded-lg border border-[#e5e2dc] bg-white p-4 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-base leading-5">{title}</h2>
          <p className="mt-1 text-[8px] leading-4 text-[#6b625d]">{description}</p>
        </div>
        <span className="shrink-0 text-[7px] font-semibold uppercase tracking-wider text-[#a98218]">{number}</span>
      </header>
      {children}
    </section>
  );
}

function LayoutPreview({ layout }: { layout: BannerLayout }) {
  return (
    <div className="relative h-12 overflow-hidden rounded-sm bg-[#e7e2d9]">
      {layout === 'split' && (
        <div className="flex h-full">
          <span className="flex w-1/2 flex-col justify-center gap-1 p-1.5">
            <span className="h-1 w-8 rounded bg-[#81796f]" />
            <span className="h-1 w-12 rounded bg-[#aba49b]" />
            <span className="h-1 w-6 rounded bg-[#c4bcb0]" />
          </span>
          <span className="m-1 flex-1 rounded-sm bg-[#c4bcb0]" />
        </div>
      )}
      {layout === 'minimal' && (
        <div className="flex h-full flex-col items-center justify-center gap-1">
          <span className="h-1 w-7 rounded bg-[#81796f]" />
          <span className="h-1 w-14 rounded bg-[#aba49b]" />
          <span className="h-1 w-9 rounded bg-[#c4bcb0]" />
        </div>
      )}
      {layout === 'curated' && (
        <div className="absolute inset-2 flex items-end justify-start">
          <span className="flex h-7 w-12 flex-col justify-center gap-1 rounded-sm bg-[#f7f4ed] px-1.5 shadow-sm">
            <span className="h-1 w-8 rounded bg-[#81796f]" />
            <span className="h-1 w-5 rounded bg-[#aba49b]" />
          </span>
          <span className="absolute inset-0 -z-10 rounded-sm bg-[#c4bcb0]" />
        </div>
      )}
    </div>
  );
}

function TextField({
  count,
  label,
  maxLength,
  multiline = false,
  onChange,
  value,
}: {
  count: number;
  label: string;
  maxLength: number;
  multiline?: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  const controlClass = `${inputClass} ${multiline ? 'min-h-16 resize-y' : ''}`;
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between gap-2 text-[8px] font-semibold uppercase tracking-wider text-[#6b625d]">
        {label}
        <span className="font-normal text-[#8b8178]">{count} / {maxLength}</span>
      </span>
      {multiline ? (
        <textarea className={controlClass} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} value={value} />
      ) : (
        <input className={controlClass} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} value={value} />
      )}
    </label>
  );
}

function CtaEditor({
  label,
  onRouteChange,
  onTextChange,
  route,
  routeLabel,
  text,
  variant,
}: {
  label: string;
  onRouteChange: (route: CtaRoute) => void;
  onTextChange: (value: string) => void;
  route: CtaRoute;
  routeLabel: string;
  text: string;
  variant: 'dark' | 'light';
}) {
  return (
    <div className="space-y-2 rounded-md bg-[#f6f3ed] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-[#6b625d]">{label}</p>
        <span className={`rounded px-1.5 py-1 text-[7px] font-semibold uppercase ${variant === 'dark' ? 'bg-[#201b17] text-white' : 'bg-white text-[#6b625d]'}`}>
          {variant === 'dark' ? 'Espresso solid' : 'Warm stone ghost'}
        </span>
      </div>
      <label className="block">
        <span className="mb-1 block text-[7px] font-medium text-[#6b625d]">Button text</span>
        <input className={inputClass} maxLength={32} onChange={(event) => onTextChange(event.target.value)} value={text} />
      </label>
      <label className="block">
        <span className="mb-1 block text-[7px] font-medium text-[#6b625d]">{routeLabel}</span>
        <select
          className={inputClass}
          onChange={(event) => onRouteChange(event.target.value as CtaRoute)}
          value={route}
        >
          <option value="/collections">Collections</option>
          <option value="/shop">Shop</option>
          <option value="/product">Featured product</option>
        </select>
      </label>
    </div>
  );
}

function HeroPreview({
  banner,
  onStep,
  viewport,
}: {
  banner: HeroBanner;
  onStep: (direction: -1 | 1) => void;
  viewport: ViewportMode;
}) {
  const isMobile = viewport === 'mobile';
  const frameClass =
    viewport === 'mobile'
      ? 'aspect-[9/16] w-full max-w-[300px] rounded-[28px] border-[7px] border-[#201b17] p-1.5'
      : viewport === 'tablet'
        ? 'aspect-[4/3] w-full max-w-[650px] rounded-xl border-[5px] border-[#d6d1c8] p-1'
        : 'aspect-[16/9] w-full max-w-[900px] rounded-lg border-[5px] border-[#d6d1c8] p-1';
  const contentClass =
    banner.layout === 'minimal'
      ? 'mx-auto max-w-[90%] text-center'
      : banner.layout === 'curated'
        ? 'max-w-[80%] rounded-md bg-[#fcf9f3]/85 p-3 text-[#1c1c18] shadow-lg sm:p-5'
        : 'max-w-[84%] text-left';

  return (
    <div className={`${frameClass} relative flex shrink-0 flex-col bg-[#201b17] shadow-2xl`}>
      {isMobile && (
        <div className="flex h-7 items-center justify-between rounded-t-[20px] bg-[#fffefa] px-3 text-[7px] text-[#4d4540]">
          <span>9:41</span>
          <span className="h-1.5 w-12 rounded-full bg-[#201b17]" />
          <span>◦ ◦ ▰</span>
        </div>
      )}
      <div className={`relative min-h-0 ${isMobile ? 'flex-1' : 'h-full'} overflow-hidden ${isMobile ? 'rounded-b-[19px]' : 'rounded-md'}`}>
        <img alt="" className="absolute inset-0 h-full w-full object-cover" src={banner.image} />
        <div className="absolute inset-0 bg-[#201b17]" style={{ opacity: banner.scrim / 100 }} />
        <div className="absolute inset-x-0 top-0 flex h-10 items-center justify-between bg-[#fcf9f3]/95 px-3 text-[#1c1c18] sm:h-12 sm:px-5">
          <span className="text-[8px]">☰</span>
          <span className="font-serif text-[10px] tracking-[0.12em] sm:text-xs">VELQIRA</span>
          <span className="flex items-center gap-2 text-[8px]">
            <Search aria-hidden="true" size={10} />
            <span>♡</span>
            <span>▣</span>
          </span>
        </div>
        {banner.announcement.trim() && (
          <div className="absolute inset-x-0 top-10 z-10 truncate bg-[#f2e7c7]/95 px-3 py-1 text-center text-[6px] font-medium text-[#514218] sm:top-12 sm:text-[8px]">
            {banner.announcement}
          </div>
        )}
        <div
          className={`absolute inset-x-0 bottom-0 flex flex-col justify-end px-3 pb-5 text-white sm:px-8 sm:pb-8 ${
            banner.layout === 'minimal' ? 'items-center' : 'items-start'
          }`}
        >
          <div className={contentClass}>
            <p className="inline-flex rounded-full bg-[#f2e7c7] px-2 py-1 text-[6px] font-semibold uppercase tracking-wider text-[#514218] sm:text-[8px]">
              {banner.eyebrow}
            </p>
            <h2 className={`mt-2 font-serif text-base leading-tight sm:text-3xl ${
              banner.layout === 'curated' ? 'text-[#1c1c18]' : 'text-white'
            }`}>
              {banner.headline}
            </h2>
            <p className={`mt-2 max-w-xl text-[7px] leading-4 sm:text-xs sm:leading-5 ${
              banner.layout === 'curated' ? 'text-[#4d4540]' : 'text-white/90'
            }`}>
              {banner.subtitle}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button className="rounded-sm bg-[#fcf9f3] px-2 py-1.5 text-[6px] font-semibold text-[#1c1c18] sm:px-3 sm:text-[8px]" type="button">
                {banner.primaryText}
              </button>
              <button className={`rounded-sm border px-2 py-1.5 text-[6px] font-semibold sm:px-3 sm:text-[8px] ${
                banner.layout === 'curated'
                  ? 'border-[#6b625d] bg-transparent text-[#1c1c18]'
                  : 'border-white/75 bg-black/10 text-white'
              }`} type="button">
                {banner.secondaryText}
              </button>
            </div>
          </div>
          {banner.audiences.length > 0 && (
            <div className="mt-3 flex max-w-full gap-1 overflow-hidden">
              {banner.audiences.slice(0, 3).map((audience) => (
                <span className="shrink-0 rounded-full bg-[#fcf9f3]/90 px-2 py-1 text-[6px] font-medium text-[#4d4540] sm:text-[7px]" key={audience}>
                  {audience}
                </span>
              ))}
            </div>
          )}
        </div>
        {!isMobile && (
          <>
            <button
              aria-label="Previous banner preview"
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#fcf9f3]/80 text-[#1c1c18]"
              onClick={() => onStep(-1)}
              type="button"
            >
              <ChevronLeft aria-hidden="true" size={13} />
            </button>
            <button
              aria-label="Next banner preview"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#fcf9f3]/80 text-[#1c1c18]"
              onClick={() => onStep(1)}
              type="button"
            >
              <ChevronRight aria-hidden="true" size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function IntegrityItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#f6f3ed] p-2">
      <p className="text-[7px] font-semibold uppercase tracking-wider text-[#8b8178]">{label}</p>
      <p className="mt-1 text-[8px] font-medium text-[#4d4540]">{value}</p>
    </div>
  );
}

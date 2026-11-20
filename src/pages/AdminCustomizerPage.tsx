import { useState, type ReactNode } from 'react';
import {
  Bell,
  Check,
  CircleAlert,
  CreditCard,
  Eye,
  ImagePlus,
  LayoutDashboard,
  LockKeyhole,
  MapPin,
  MessageCircle,
  PackagePlus,
  Palette,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Truck,
  Wallet,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type SettingsSection = 'all' | 'header' | 'checkout' | 'transit' | 'disclaimer';
type PreviewMode = 'product' | 'checkout';

interface CustomerSettings {
  announcementEnabled: boolean;
  announcementText: string;
  brandTagline: string;
  paymentMethods: string[];
  gstEnabled: boolean;
  freeDeliveryThreshold: string;
  deliveryZones: string[];
  policyEnabled: boolean;
  policyText: string;
  whatsapp: string;
  replacementWindow: string;
}

const initialSettings: CustomerSettings = {
  announcementEnabled: false,
  announcementText: 'Atelier Holiday Pause: Dispatches resume Monday',
  brandTagline: 'EST. 2021 • KOCHI, KERALA',
  paymentMethods: ['Google Pay', 'PhonePe', 'Paytm', 'Credit Pay'],
  gstEnabled: true,
  freeDeliveryThreshold: '2,499',
  deliveryZones: [
    'Bandra West & South Mumbai Corridor',
    'Kochi Urban Studio Radius (Panampilly / Fort Kochi)',
    'Mumbai Metro Suburban Grid',
  ],
  policyEnabled: true,
  policyText: 'Final Sale — No Returns or Exchanges (Strictly transit damage replacement only).',
  whatsapp: '+91 98201 44829',
  replacementWindow: '24 Hours from Delivery Timestamp',
};

const sections: { id: SettingsSection; label: string }[] = [
  { id: 'all', label: 'All screen policies' },
  { id: 'header', label: 'Header & marquee' },
  { id: 'checkout', label: 'Prepaid settlement' },
  { id: 'transit', label: 'Transit & radius' },
  { id: 'disclaimer', label: 'Atelier disclaimers' },
];

const paymentOptions = ['Google Pay', 'PhonePe', 'Paytm', 'Credit Pay'];

export function AdminCustomizerPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeSection, setActiveSection] = useState<SettingsSection>('all');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('product');
  const [newZone, setNewZone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState('');

  const matchesSection = (section: Exclude<SettingsSection, 'all'>, keywords: string) => {
    const query = searchQuery.trim().toLowerCase();
    return query
      ? keywords.includes(query)
      : activeSection === 'all' || activeSection === section;
  };

  const showHeader = matchesSection('header', 'header announcement marquee notice banner provenance tagline');
  const showCheckout = matchesSection('checkout', 'checkout prepaid settlement cash delivery cod upi payment tax gst');
  const showTransit = matchesSection('transit', 'transit radius shipping courier delivery zone pin threshold');
  const showDisclaimer = matchesSection(
    'disclaimer',
    'atelier disclaimer guarantee return final sale whatsapp concierge damage replacement policy',
  );

  const updateSetting = <K extends keyof CustomerSettings>(key: K, value: CustomerSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setNotice('Preview updated locally. Customer-facing settings have not been changed.');
  };

  const addZone = () => {
    const zone = newZone.trim();
    if (!zone) return;
    if (settings.deliveryZones.some((existing) => existing.toLowerCase() === zone.toLowerCase())) {
      setNotice('That delivery zone is already in the preview.');
      return;
    }
    updateSetting('deliveryZones', [...settings.deliveryZones, zone]);
    setNewZone('');
  };

  const togglePayment = (payment: string) => {
    const nextPayments = settings.paymentMethods.includes(payment)
      ? settings.paymentMethods.filter((method) => method !== payment)
      : [...settings.paymentMethods, payment];
    updateSetting('paymentMethods', nextPayments);
  };

  const resetSettings = () => {
    setSettings(initialSettings);
    setNewZone('');
    setSearchQuery('');
    setActiveSection('all');
    setPreviewMode('product');
    setNotice('Preview controls reset. No live storefront settings were changed.');
  };

  return (
    <div className="min-h-screen bg-[#fcf9f3] text-[#1c1c18]">
      <AdminCustomizerSidebar />

      <div className="min-h-screen md:pl-52 xl:pl-64">
        <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#e5e2dc] bg-[#fcf9f3]/95 px-4 py-3 backdrop-blur md:px-5">
          <label className="relative min-w-[220px] flex-1 md:max-w-sm">
            <span className="sr-only">Search customer screen controls</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8178]" size={15} />
            <input
              aria-label="Search customer screen controls"
              className="w-full rounded-md border border-[#e5e2dc] bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-[#735c00]"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search customer screen controls..."
              type="search"
              value={searchQuery}
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
            <button
              className="inline-flex items-center gap-1.5 rounded-md bg-[#201b17] px-3 py-2 text-[11px] font-medium text-white hover:bg-[#39312b]"
              onClick={resetSettings}
              type="button"
            >
              <RotateCcw aria-hidden="true" size={13} />
              Reset demo controls
            </button>
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

        <main className="mx-auto max-w-[1500px] space-y-5 p-4 md:p-6 xl:p-8">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div className="max-w-3xl">
              <p className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                Atelier digital governance <span className="text-[#c7bfb6]">/</span> Kochi studio control hub
              </p>
              <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">
                Customer Screen Controls &amp; Live Storefront Customizer
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b625d]">
                Adjust how customer notices, checkout methods, delivery zones, and atelier policies appear in the preview.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0eee8] px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-[#6b625d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                Preview only · not live
              </span>
              <a
                className="inline-flex items-center gap-2 rounded-md bg-[#201b17] px-3 py-2.5 text-xs font-medium text-white hover:bg-[#39312b]"
                href="#customer-preview"
              >
                <Eye aria-hidden="true" size={14} />
                Preview customer screen
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-[#eadfbf] bg-[#fff9e8] px-4 py-3 text-xs leading-5 text-[#6b625d]">
            <strong className="text-[#4d4540]">Demo controls only.</strong> Changes update the simulator on this page.
            No customer-facing storefront, checkout, tax, shipping, or payment settings are saved or changed.
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,390px)]">
            <section aria-label="Customer screen controls" className="min-w-0 space-y-4">
              <nav aria-label="Customizer sections" className="flex gap-2 overflow-x-auto pb-1">
                {sections.map((section) => (
                  <button
                    aria-pressed={activeSection === section.id}
                    className={`shrink-0 rounded-md px-3 py-2 text-[9px] font-semibold uppercase tracking-wider transition ${
                      activeSection === section.id
                        ? 'bg-[#201b17] text-white'
                        : 'bg-white text-[#4d4540] hover:bg-[#f0eee8]'
                    }`}
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    type="button"
                  >
                    {section.label}
                  </button>
                ))}
              </nav>

              {showHeader && (
                <SettingsCard
                  description="Regulate the topmost notice banner and the studio provenance masthead."
                  icon={<Bell aria-hidden="true" size={14} />}
                  section="Section 01"
                  title="Header & Announcement Bar"
                >
                  <div className="rounded-md bg-[#f6f3ed] p-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium">Top Announcement Ribbon</p>
                        <p className="mt-1 text-[10px] leading-4 text-[#6b625d]">
                          Displays above the main atelier masthead across storefront paths.
                        </p>
                      </div>
                      <Toggle
                        checked={settings.announcementEnabled}
                        label="Top announcement ribbon"
                        onChange={(checked) => updateSetting('announcementEnabled', checked)}
                      />
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <Field label="Custom announcement copy">
                        <input
                          className={inputClass}
                          maxLength={65}
                          onChange={(event) => updateSetting('announcementText', event.target.value)}
                          value={settings.announcementText}
                        />
                        <span className="mt-1 block text-[9px] text-[#8b8178]">
                          {settings.announcementText.length}/65 characters
                        </span>
                      </Field>
                      <Field label="Provenance tagline (under brand logo)">
                        <input
                          className={inputClass}
                          maxLength={45}
                          onChange={(event) => updateSetting('brandTagline', event.target.value)}
                          value={settings.brandTagline}
                        />
                      </Field>
                    </div>
                  </div>
                </SettingsCard>
              )}

              {showCheckout && (
                <SettingsCard
                  description="Strict governance preventing cash-on-delivery and maintaining prepaid UPI protocols."
                  icon={<Wallet aria-hidden="true" size={14} />}
                  section="Section 02"
                  title="Checkout & Prepaid Mandate"
                >
                  <div className="rounded-md bg-[#f6f3ed] p-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium">Cash on Delivery (COD)</p>
                        <p className="mt-1 text-[10px] leading-4 text-[#6b625d]">
                          To safeguard limited handcrafted dispatches from transit abandonment, COD remains disabled.
                        </p>
                      </div>
                      <span className="flex items-center gap-2 text-[8px] font-semibold uppercase tracking-wider text-[#8b8178]">
                        <LockKeyhole aria-hidden="true" size={12} />
                        Locked off
                        <Toggle checked={false} disabled label="Cash on delivery is locked off" onChange={() => {}} />
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-[#6b625d]">
                      Instant UPI routing (1-tap seamless checkout)
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {paymentOptions.map((payment) => {
                        const selected = settings.paymentMethods.includes(payment);
                        return (
                          <button
                            aria-pressed={selected}
                            className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2.5 text-left text-[10px] font-medium transition ${
                              selected
                                ? 'border-[#e5e2dc] bg-[#f6f3ed] text-[#1c1c18]'
                                : 'border-transparent bg-[#f0eee8] text-[#8b8178]'
                            }`}
                            key={payment}
                            onClick={() => togglePayment(payment)}
                            type="button"
                          >
                            <span className="flex items-center gap-2">
                              <CreditCard aria-hidden="true" className="text-[#735c00]" size={13} />
                              {payment}
                            </span>
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                selected ? 'border-[#201b17] bg-[#201b17] text-white' : 'border-[#b8afa6]'
                              }`}
                            >
                              {selected && <Check aria-hidden="true" size={11} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-[10px] leading-4 text-[#6b625d]">
                      Payment options shown here are sample controls. No payment provider is connected.
                    </p>
                  </div>
                  <div className="flex flex-col justify-between gap-3 rounded-md bg-[#f6f3ed] p-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-medium">Tax &amp; GST configuration</p>
                      <p className="mt-1 text-[10px] leading-4 text-[#6b625d]">
                        GST treatment has not been configured or verified for a live shop.
                      </p>
                    </div>
                    <Toggle
                      checked={settings.gstEnabled}
                      label="GST configuration preview"
                      onChange={(checked) => updateSetting('gstEnabled', checked)}
                    />
                  </div>
                </SettingsCard>
              )}

              {showTransit && (
                <SettingsCard
                  description="Configure the sample courier handoff logic, threshold, and authorized sanctuary pins."
                  icon={<Truck aria-hidden="true" size={14} />}
                  section="Section 03"
                  title="Shipping & Local Courier Rules"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Default delivery method">
                      <div className="flex items-center justify-between rounded-md border border-[#e5e2dc] bg-[#f6f3ed] px-3 py-2.5 text-[10px]">
                        <span className="flex items-center gap-2">
                          <Truck aria-hidden="true" className="text-[#735c00]" size={13} />
                          Local Courier (Direct Handoff)
                        </span>
                        <LockKeyhole aria-label="Fixed in demo" className="text-[#8b8178]" size={12} />
                      </div>
                    </Field>
                    <Field label="Free delivery threshold">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#6b625d]">₹</span>
                        <input
                          className={`${inputClass} pl-7 pr-12`}
                          inputMode="numeric"
                          onChange={(event) =>
                            updateSetting('freeDeliveryThreshold', event.target.value.replace(/[^\d,]/g, ''))
                          }
                          value={settings.freeDeliveryThreshold}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#8b8178]">INR</span>
                      </div>
                    </Field>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-[#6b625d]">
                      <MapPin aria-hidden="true" size={13} />
                      Active dispatched sanctuary zones
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {settings.deliveryZones.map((zone) => (
                        <span
                          className="inline-flex items-center gap-2 rounded-md bg-[#f6f3ed] px-2.5 py-2 text-[9px] text-[#4d4540]"
                          key={zone}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                          {zone}
                          <button
                            aria-label={`Remove ${zone}`}
                            className="text-[#8b8178] hover:text-[#201b17]"
                            onClick={() =>
                              updateSetting(
                                'deliveryZones',
                                settings.deliveryZones.filter((existing) => existing !== zone),
                              )
                            }
                            type="button"
                          >
                            <X aria-hidden="true" size={11} />
                          </button>
                        </span>
                      ))}
                      {settings.deliveryZones.length === 0 && (
                        <p className="text-[10px] text-[#8b8178]">No sample delivery zones added.</p>
                      )}
                    </div>
                    <div className="mt-3 flex max-w-lg gap-2">
                      <input
                        aria-label="New delivery zone"
                        className={inputClass}
                        onChange={(event) => setNewZone(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            addZone();
                          }
                        }}
                        placeholder="Add a sample pin-code cluster"
                        value={newZone}
                      />
                      <button
                        aria-label="Add delivery zone"
                        className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#ebe8e2] px-3 text-[10px] font-semibold hover:bg-[#e5e2dc]"
                        onClick={addZone}
                        type="button"
                      >
                        <Plus aria-hidden="true" size={13} />
                        Add zone
                      </button>
                    </div>
                  </div>
                </SettingsCard>
              )}

              {showDisclaimer && (
                <SettingsCard
                  description="Specify customer-facing return policy badges and concierge assistance channels."
                  icon={<ShieldCheck aria-hidden="true" size={14} />}
                  section="Section 04"
                  title="Customer Guarantee & Return Disclaimer"
                >
                  <div className="rounded-md bg-[#f6f3ed] p-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-medium">Store Policy: Final Sale Notice</p>
                      <Toggle
                        checked={settings.policyEnabled}
                        label="Show final sale policy in preview"
                        onChange={(checked) => updateSetting('policyEnabled', checked)}
                      />
                    </div>
                    <textarea
                      aria-label="Final sale policy text"
                      className={`${inputClass} mt-3 min-h-16 resize-y`}
                      maxLength={180}
                      onChange={(event) => updateSetting('policyText', event.target.value)}
                      value={settings.policyText}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Direct WhatsApp concierge line">
                      <div className="relative">
                        <MessageCircle
                          aria-hidden="true"
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#735c00]"
                          size={13}
                        />
                        <input
                          className={`${inputClass} pl-9`}
                          onChange={(event) => updateSetting('whatsapp', event.target.value)}
                          value={settings.whatsapp}
                        />
                      </div>
                      <span className="mt-1 block text-[9px] text-[#8b8178]">Preview contact only; no message is sent.</span>
                    </Field>
                    <Field label="Damage replacement window">
                      <input
                        className={inputClass}
                        maxLength={48}
                        onChange={(event) => updateSetting('replacementWindow', event.target.value)}
                        value={settings.replacementWindow}
                      />
                      <span className="mt-1 block text-[9px] text-[#8b8178]">
                        Final policies require review before use.
                      </span>
                    </Field>
                  </div>
                </SettingsCard>
              )}
              {searchQuery.trim() && !showHeader && !showCheckout && !showTransit && !showDisclaimer && (
                <p className="rounded-lg border border-[#e5e2dc] bg-white p-5 text-sm text-[#6b625d]">
                  No customer screen controls match “{searchQuery.trim()}”.
                </p>
              )}
            </section>

            <aside className="space-y-4 xl:sticky xl:top-20" id="customer-preview">
              <section className="rounded-xl border border-[#e5e2dc] bg-white p-3 shadow-sm sm:p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-[#4d4540]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                    Client viewport simulator
                  </p>
                  <div aria-label="Preview screen" className="flex rounded-md bg-[#f6f3ed] p-0.5">
                    <PreviewTab
                      active={previewMode === 'product'}
                      label="Product screen"
                      onClick={() => setPreviewMode('product')}
                    />
                    <PreviewTab
                      active={previewMode === 'checkout'}
                      label="Bag & checkout"
                      onClick={() => setPreviewMode('checkout')}
                    />
                  </div>
                </div>

                <div className="mx-auto max-w-[330px] rounded-[26px] border-[7px] border-[#ebe8e2] bg-[#fcf9f3] p-2 shadow-inner">
                  <div className="overflow-hidden rounded-[18px] border border-[#e5e2dc] bg-[#fffefa]">
                    {settings.announcementEnabled && (
                      <div className="truncate bg-[#f2e7c7] px-3 py-1.5 text-center text-[8px] font-medium text-[#514218]">
                        {settings.announcementText || 'Atelier notice'}
                      </div>
                    )}
                    <div className="flex items-center justify-between border-b border-[#eee9df] px-3 py-3">
                      <span className="text-[10px] font-semibold text-[#6b625d]">☰</span>
                      <span className="text-center font-serif text-[12px] tracking-wide">
                        VELQIRA
                        <small className="mt-0.5 block text-[6px] tracking-[0.14em] text-[#8b8178]">
                          {settings.brandTagline || 'VELQIRA ATELIER'}
                        </small>
                      </span>
                      <span className="flex items-center gap-2 text-[10px] text-[#6b625d]">
                        <Search aria-hidden="true" size={12} />
                        <Wallet aria-hidden="true" size={12} />
                      </span>
                    </div>

                    {previewMode === 'product' ? (
                      <div className="p-3">
                        <div className="relative mb-3 overflow-hidden rounded-md bg-[#e8e2d7]">
                          <img
                            alt="Sample stoneware product"
                            className="aspect-[1.4] w-full object-cover"
                            src="/images/hero-slide-3-showcase.jpg"
                          />
                          <span className="absolute left-2 top-2 rounded-full bg-[#fcf9f3]/90 px-2 py-1 text-[7px] font-semibold uppercase tracking-wider text-[#6b625d]">
                            Artisanal drop 04
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h2 className="font-serif text-sm leading-5">Kochi Ochre Stoneware Amphora</h2>
                            <p className="mt-1 text-[8px] leading-4 text-[#6b625d]">
                              Hand-thrown local clay • Matte terracotta glaze
                            </p>
                          </div>
                          <span className="whitespace-nowrap pt-1 text-[9px] font-semibold">₹3,400</span>
                        </div>
                        <div className="mt-3 space-y-2">
                          <PreviewNotice>
                            Eligible for Complimentary Direct Handoff (Orders over ₹
                            {settings.freeDeliveryThreshold || '0'})
                          </PreviewNotice>
                          {settings.policyEnabled && <PreviewNotice>{settings.policyText}</PreviewNotice>}
                        </div>
                        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm bg-black px-3 py-2.5 text-[8px] font-semibold uppercase tracking-wider text-white" type="button">
                          Acquire for atelier · ₹3,400
                        </button>
                        <a
                          className="mt-3 block text-center text-[7px] text-[#6b625d] underline"
                          href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                          onClick={(event) => event.preventDefault()}
                        >
                          Questions? WhatsApp Concierge · {settings.whatsapp || 'Contact unavailable'}
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-3 p-3">
                        <div className="flex items-center justify-between">
                          <h2 className="font-serif text-sm">Your atelier bag</h2>
                          <span className="text-[8px] text-[#6b625d]">1 sample item</span>
                        </div>
                        <div className="flex gap-2 rounded-md bg-[#f6f3ed] p-2">
                          <img
                            alt=""
                            className="h-12 w-12 rounded object-cover"
                            src="/images/hero-slide-3-showcase.jpg"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-medium">Kochi Ochre Stoneware Amphora</p>
                            <p className="mt-1 text-[8px] text-[#6b625d]">Quantity 1 · Sample item</p>
                          </div>
                          <span className="text-[9px] font-semibold">₹3,400</span>
                        </div>
                        <PreviewNotice>
                          {settings.freeDeliveryThreshold
                            ? `Complimentary delivery over ₹${settings.freeDeliveryThreshold}`
                            : 'Delivery threshold not set'}
                        </PreviewNotice>
                        <div>
                          <p className="mb-2 text-[8px] font-semibold uppercase tracking-wider text-[#6b625d]">
                            Available prepaid methods
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {settings.paymentMethods.length > 0 ? (
                              settings.paymentMethods.map((method) => (
                                <span className="rounded border border-[#e5e2dc] px-2 py-1 text-[7px]" key={method}>
                                  {method}
                                </span>
                              ))
                            ) : (
                              <span className="text-[8px] text-[#8b8178]">No sample methods selected</span>
                            )}
                          </div>
                        </div>
                        <p className="rounded bg-[#f6f3ed] p-2 text-[8px] leading-4 text-[#6b625d]">
                          COD is disabled in this sample configuration.
                        </p>
                        {settings.policyEnabled && <PreviewNotice>{settings.policyText}</PreviewNotice>}
                        <button className="w-full rounded-sm bg-black px-3 py-2.5 text-[8px] font-semibold uppercase tracking-wider text-white" type="button">
                          Continue with prepaid checkout
                        </button>
                      </div>
                    )}
                    <div className="border-t border-[#eee9df] px-3 py-2 text-center text-[7px] text-[#8b8178]">
                      {settings.gstEnabled ? 'Tax treatment requires review' : 'Tax details not shown in preview'}
                    </div>
                  </div>
                </div>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-[#6b625d]">
                  <RotateCcw aria-hidden="true" size={11} />
                  Auto-updates from controls · This preview only
                </p>
              </section>

              <section className="rounded-xl border border-[#e5e2dc] bg-white p-4">
                <h2 className="flex items-center gap-2 text-xs font-semibold">
                  <ShieldCheck aria-hidden="true" size={14} />
                  Charter compliance
                </h2>
                <p className="mt-2 text-[10px] leading-5 text-[#6b625d]">
                  VELQIRA policies apply to the demo preview only. No live checkout, payment routing, tax treatment,
                  courier coverage, or customer notice is changed from this page.
                </p>
                <div className="mt-3 flex justify-between border-t border-[#eee9df] pt-3 text-[8px] uppercase tracking-wider text-[#8b8178]">
                  <span>Policy review</span>
                  <span className="font-semibold text-[#735c00]">Required before launch</span>
                </div>
              </section>

              {notice && (
                <p aria-live="polite" className="flex items-start gap-2 rounded-lg bg-[#f0eee8] p-3 text-[10px] leading-4 text-[#4d4540]" role="status">
                  <CircleAlert aria-hidden="true" className="mt-0.5 shrink-0 text-[#735c00]" size={13} />
                  <span>{notice}</span>
                  <button aria-label="Dismiss message" className="ml-auto" onClick={() => setNotice('')} type="button">
                    <X aria-hidden="true" size={13} />
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

function AdminCustomizerSidebar() {
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
            <NavPlaceholder icon={<SlidersHorizontal size={14} />} label="Inventory & Pricing" />
          </NavGroup>
          <NavGroup label="Storefront Customizer">
            <span aria-current="page" className="flex items-center gap-2 rounded-md bg-[#201b17] px-2.5 py-2 text-[11px] font-semibold text-white">
              <Palette aria-hidden="true" size={14} />
              Customer Screen Controls
            </span>
            <Link className={navClass} to="/admin/hero">
              <ImagePlus aria-hidden="true" size={14} />
              Hero Screen &amp; Banner
            </Link>
          </NavGroup>
          <NavGroup label="Orders & Reconciliation">
            <Link className={navClass} to="/admin/settlements">
              <Wallet aria-hidden="true" size={14} />
              UPI Settlements (Demo)
            </Link>
            <NavPlaceholder icon={<Truck size={14} />} label="Dispatches" />
          </NavGroup>
        </nav>
      </div>
      <div className="rounded-lg bg-[#ebe8e2] p-3">
        <p className="text-xs font-semibold">Admin preview</p>
        <p className="mt-1 text-[10px] leading-4 text-[#6b625d]">Customizer changes remain local to this page.</p>
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

function NavPlaceholder({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span aria-disabled="true" className="flex cursor-not-allowed items-center gap-2 px-2.5 py-2 text-[11px] text-[#8b8178]">
      {icon}
      {label}
    </span>
  );
}

function SettingsCard({
  children,
  description,
  icon,
  section,
  title,
}: {
  children: ReactNode;
  description: string;
  icon: ReactNode;
  section: string;
  title: string;
}) {
  return (
    <section className="space-y-4 rounded-lg border border-[#e5e2dc] bg-white p-4 shadow-sm md:p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-lg leading-6">
            <span className="text-[#735c00]">{icon}</span>
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-[10px] leading-4 text-[#6b625d]">{description}</p>
        </div>
        <span className="shrink-0 rounded-md bg-[#f0eee8] px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-[#6b625d]">
          {section}
        </span>
      </header>
      {children}
    </section>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-[#6b625d]">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  checked,
  disabled = false,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={`relative h-5 w-10 shrink-0 rounded-full transition ${
        checked ? 'bg-[#201b17]' : 'bg-[#d5d0c8]'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
          checked ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  );
}

function PreviewTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      aria-pressed={active}
      className={`rounded px-2.5 py-1.5 text-[7px] font-semibold uppercase tracking-wide ${
        active ? 'bg-white text-[#201b17] shadow-sm' : 'text-[#6b625d]'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function PreviewNotice({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-1.5 rounded bg-[#f4f0e5] px-2 py-2 text-[7px] leading-3 text-[#5b5348]">
      <Star aria-hidden="true" className="mt-0.5 shrink-0 text-[#9a7a26]" size={9} />
      {children}
    </p>
  );
}

const inputClass =
  'w-full rounded-md border border-[#e5e2dc] bg-white px-3 py-2.5 text-xs text-[#1c1c18] outline-none focus:border-[#735c00] focus:ring-1 focus:ring-[#735c00]';

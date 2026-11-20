import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  ArrowRight,
  Bell,
  Boxes,
  Check,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Eye,
  ImagePlus,
  LayoutDashboard,
  LockKeyhole,
  MapPin,
  PackagePlus,
  Palette,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Truck,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type DispatchState = 'Ready for handoff' | 'Courier dispatched' | 'Delivered by local courier';

interface DemoOrder {
  id: string;
  patron: string;
  area: string;
  item: string;
  amount: number;
  payment: string;
  reference: string;
  dispatch: DispatchState;
}

interface DemoInventoryItem {
  title: string;
  sku: string;
  quantity: string;
  price: string;
  image: string;
  status: 'Low stock' | 'In stock' | 'Made to order';
}

const demoOrders: DemoOrder[] = [
  {
    id: 'VQ-DEMO-92401',
    patron: 'Sample patron A',
    area: 'Kochi Studio',
    item: 'Kochi Torus Collar · 1',
    amount: 4800,
    payment: 'Google Pay',
    reference: 'DEMO-REF-09218',
    dispatch: 'Ready for handoff',
  },
  {
    id: 'VQ-DEMO-92398',
    patron: 'Sample patron B',
    area: 'Panampilly Nagar',
    item: 'Ash-Glaze Anagama Flagon · 1',
    amount: 2900,
    payment: 'PhonePe UPI',
    reference: 'DEMO-REF-08104',
    dispatch: 'Courier dispatched',
  },
  {
    id: 'VQ-DEMO-92385',
    patron: 'Sample patron C',
    area: 'Fort Kochi Heritage Zone',
    item: 'Tidal Crest Ring · 1',
    amount: 3450,
    payment: 'Paytm UPI',
    reference: 'DEMO-REF-77209',
    dispatch: 'Delivered by local courier',
  },
];

const inventoryItems: DemoInventoryItem[] = [
  {
    title: 'Kochi Torus Collar',
    sku: 'DEMO-SKU-089',
    quantity: '12 in sample stock',
    price: '₹3,450',
    image: '/images/jewellery-necklace-1.jpg',
    status: 'In stock',
  },
  {
    title: 'Ash-Glaze Anagama Flagon',
    sku: 'DEMO-SKU-104',
    quantity: '3 remaining',
    price: '₹2,800',
    image: '/images/hero-slide-3-showcase.jpg',
    status: 'Low stock',
  },
  {
    title: 'Monolith Incense Well',
    sku: 'DEMO-SKU-142',
    quantity: 'Made to order',
    price: '₹4,200',
    image: '/images/jewellery-necklace-2.jpg',
    status: 'Made to order',
  },
];

const dailyVolumes = [
  { day: 'Mon', amount: 78000, label: '₹78k' },
  { day: 'Tue', amount: 82000, label: '₹82k' },
  { day: 'Wed', amount: 112000, label: '₹112k' },
  { day: 'Thu', amount: 96000, label: '₹96k' },
  { day: 'Fri', amount: 134000, label: '₹134k' },
  { day: 'Sat', amount: 122000, label: '₹122k' },
  { day: 'Today', amount: 142850, label: '₹142.8k' },
];

const weeklyTotal = dailyVolumes.reduce((total, volume) => total + volume.amount, 0);
const dailyAverage = Math.round(weeklyTotal / dailyVolumes.length);

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export function AdminDashboardPage() {
  const [query, setQuery] = useState('');
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [courierThresholdEnabled, setCourierThresholdEnabled] = useState(true);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return demoOrders.filter((order) =>
      [order.id, order.patron, order.area, order.item, order.payment, order.reference].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#fcf9f3] text-[#1c1c18]">
      <AdminDashboardSidebar />

      <div className="min-h-screen md:pl-52 xl:pl-64">
        <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#e5e2dc] bg-[#fcf9f3]/95 px-4 py-3 backdrop-blur md:px-5">
          <label className="relative min-w-[220px] flex-1 md:max-w-sm">
            <span className="sr-only">Search demo orders and references</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8178]" size={15} />
            <input
              className="w-full rounded-md border border-[#e5e2dc] bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-[#735c00]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search demo orders, items, or UPI refs..."
              type="search"
              value={query}
            />
          </label>
          <div className="flex items-center gap-2">
            <Link
              className="hidden items-center gap-1.5 rounded-md bg-[#f0eee8] px-3 py-2 text-[11px] font-medium hover:bg-[#e5e2dc] sm:inline-flex"
              to="/"
            >
              <Eye aria-hidden="true" size={14} />
              View Storefront
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

        <main className="mx-auto max-w-[1500px] space-y-5 p-4 md:p-6 xl:p-8">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div className="max-w-3xl">
              <p className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                Fort Kochi studio operational desk <span className="text-[#c7bfb6]">/</span> Demo store overview
              </p>
              <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                Atelier Pulse &amp; Daily Repertoire
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b625d]">
                Sample overview of prepaid orders, settlement references, dispatch activity, and curated inventory.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-[#f0eee8] px-3 py-2.5 text-xs font-medium hover:bg-[#e5e2dc]"
                to="/admin/customizer"
              >
                <Palette aria-hidden="true" size={14} />
                Storefront Decor
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-[#201b17] px-3 py-2.5 text-xs font-medium text-white hover:bg-[#39312b]"
                to="/admin/products/new"
              >
                <PackagePlus aria-hidden="true" size={14} />
                Assign New Piece
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-md border border-[#eadfbf] bg-[#fff9e8] px-3 py-2.5 text-[10px] leading-4 text-[#6b625d]">
            <CircleAlert aria-hidden="true" className="shrink-0 text-[#9a7a26]" size={13} />
            <span>
              <strong className="text-[#4d4540]">Sample dashboard.</strong> Revenue, orders, references, dispatches,
              and stock shown here are synthetic preview data; no bank, payment, courier, or inventory service is connected.
            </span>
          </div>
          {bannerEnabled && (
            <p className="rounded-md bg-[#f2e7c7] px-3 py-2 text-center text-[9px] font-medium text-[#514218]">
              Banner preview · Fort Kochi Studio: Handcrafted, Slow Living.
            </p>
          )}

          <section aria-label="Demo daily metrics" className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            <MetricCard
              detail="47 sample settlement records"
              icon={<Wallet aria-hidden="true" size={14} />}
              label="Settled revenue · demo"
              value="₹1,42,850"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f0e5] px-2 py-1 text-[8px] font-semibold text-[#735c00]">
                <Check aria-hidden="true" size={10} />
                Prepaid samples
              </span>
            </MetricCard>
            <MetricCard
              detail="Awaiting local courier handoff"
              icon={<Truck aria-hidden="true" size={14} />}
              label="Active dispatches"
              value="04"
            >
              <span className="text-[8px] text-[#6b625d]">DEMO fulfillment queue</span>
            </MetricCard>
            <MetricCard
              detail="4 products in the sample catalog"
              icon={<Boxes aria-hidden="true" size={14} />}
              label="Live catalog preview"
              value="04"
            >
              <span className="text-[8px] font-medium text-[#735c00]">1 sample item at low stock</span>
            </MetricCard>
            <MetricCard
              detail="Tax setup requires review"
              icon={<ShieldCheck aria-hidden="true" size={14} />}
              label="Policy status"
              value="COD off · Tax review"
            >
              <span className="text-[8px] text-[#6b625d]">Demo controls only</span>
            </MetricCard>
          </section>

          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.8fr)]">
            <section className="min-w-0 overflow-hidden rounded-xl border border-[#e5e2dc] bg-white shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eee9df] px-4 py-4">
                <div>
                  <p className="mb-1 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                    Demo activity ledger
                  </p>
                  <h2 className="font-serif text-xl">Recent Orders &amp; UPI Settlements</h2>
                </div>
                <Link
                  className="inline-flex items-center gap-1 rounded-full bg-[#f0eee8] px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-wider text-[#6b625d]"
                  to="/admin/settlements"
                >
                  Zero COD in demo
                  <ArrowRight aria-hidden="true" size={11} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#fcfaf6] text-[8px] font-semibold uppercase tracking-wider text-[#8b8178]">
                      <th className="px-3 py-2.5">Order ref</th>
                      <th className="px-3 py-2.5">Sample patron</th>
                      <th className="px-3 py-2.5">Curated item</th>
                      <th className="px-3 py-2.5">Prepaid settlement</th>
                      <th className="px-3 py-2.5">Dispatch status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0eee8]">
                    {filteredOrders.map((order) => (
                      <tr className="text-[9px] text-[#4d4540]" key={order.id}>
                        <td className="px-3 py-4 align-middle">
                          <span className="font-semibold text-[#1c1c18]">#{order.id}</span>
                          <span className="mt-1 block text-[8px] text-[#8b8178]">Sample order · today</span>
                        </td>
                        <td className="px-3 py-4 align-middle">
                          <span className="font-medium">{order.patron}</span>
                          <span className="mt-1 flex items-center gap-1 text-[8px] text-[#8b8178]">
                            <MapPin aria-hidden="true" size={9} />
                            {order.area}
                          </span>
                        </td>
                        <td className="max-w-44 px-3 py-4 align-middle">
                          <span className="line-clamp-2">{order.item}</span>
                          <span className="mt-1 block text-[8px] text-[#8b8178]">Sample product option</span>
                        </td>
                        <td className="px-3 py-4 align-middle">
                          <span className="flex items-center gap-1 font-semibold text-[#1c1c18]">
                            <CreditCard aria-hidden="true" className="text-[#735c00]" size={11} />
                            {formatCurrency(order.amount)}
                          </span>
                          <span className="mt-1 block text-[8px] text-[#6b625d]">
                            {order.payment} · {order.reference}
                          </span>
                        </td>
                        <td className="px-3 py-4 align-middle">
                          <DispatchBadge status={order.dispatch} />
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td className="px-4 py-8 text-center text-xs text-[#8b8178]" colSpan={5}>
                          No demo orders or references match “{query}”.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#fcfaf6] px-4 py-3 text-[8px] text-[#6b625d]">
                <span>Showing {filteredOrders.length} of 3 sample orders · 47 demo settlement records</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                  UPI records are not verified against a provider
                </span>
              </div>
            </section>

            <div className="space-y-4">
              <section className="rounded-xl border border-[#e5e2dc] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="mb-1 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                      Preview-only switches
                    </p>
                    <h2 className="font-serif text-xl">Storefront Controls</h2>
                  </div>
                  <SlidersHorizontal aria-hidden="true" className="text-[#8b8178]" size={15} />
                </div>
                <DashboardSwitch
                  checked={bannerEnabled}
                  detail="Fort Kochi Studio: Handcrafted, Slow Living."
                  label="Storefront top banner"
                  onChange={setBannerEnabled}
                  stateLabel={bannerEnabled ? 'On in preview' : 'Off'}
                />
                <DashboardSwitch
                  checked={courierThresholdEnabled}
                  detail={
                    courierThresholdEnabled
                      ? 'Waive sample delivery on orders over ₹2,499.'
                      : 'Free-delivery threshold disabled in preview.'
                  }
                  label="Courier free threshold"
                  onChange={setCourierThresholdEnabled}
                  stateLabel={courierThresholdEnabled ? 'On in preview' : 'Off'}
                />
                <div className="mt-3 rounded-md bg-[#f6f3ed] p-3 text-[8px] leading-4 text-[#6b625d]">
                  <p className="font-semibold text-[#4d4540]">Policy preview</p>
                  <p className="mt-1">COD disabled · Tax configuration pending review · Final sale notice</p>
                </div>
                <Link
                  className="mt-3 flex items-center justify-center gap-2 rounded-md bg-[#f0eee8] px-3 py-2.5 text-[9px] font-semibold hover:bg-[#e5e2dc]"
                  to="/admin/customizer"
                >
                  Manage customer screen controls
                  <ChevronRight aria-hidden="true" size={12} />
                </Link>
              </section>

              <section className="rounded-xl border border-[#e5e2dc] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="mb-1 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
                      <Boxes aria-hidden="true" size={12} />
                      Atelier reserves
                    </p>
                    <h2 className="font-serif text-xl">Curated Inventory Watch</h2>
                  </div>
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f3e5e0] px-1.5 text-[8px] font-semibold text-[#8d4a3c]">
                    1
                  </span>
                </div>
                <div className="space-y-3">
                  {inventoryItems.map((item) => (
                    <div className="flex items-center gap-2.5" key={item.sku}>
                      <img alt="" className="h-11 w-11 shrink-0 rounded-md bg-[#f0eee8] object-cover" src={item.image} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[9px] font-medium text-[#1c1c18]">{item.title}</p>
                        <p className="mt-0.5 truncate text-[8px] text-[#8b8178]">{item.sku}</p>
                        <p
                          className={`mt-0.5 text-[8px] ${
                            item.status === 'Low stock' ? 'font-semibold text-[#9a5945]' : 'text-[#6b625d]'
                          }`}
                        >
                          {item.quantity} · {item.price}
                        </p>
                      </div>
                      <Link
                        aria-label={`View ${item.title} in demo catalog`}
                        className="rounded p-1.5 text-[#8b8178] hover:bg-[#f0eee8] hover:text-[#201b17]"
                        to="/admin/products"
                      >
                        <ArrowRight aria-hidden="true" size={13} />
                      </Link>
                    </div>
                  ))}
                </div>
                <Link
                  className="mt-4 flex items-center justify-end gap-1 text-[9px] font-medium text-[#735c00] hover:underline"
                  to="/admin/products"
                >
                  View sample catalog <ChevronRight aria-hidden="true" size={12} />
                </Link>
              </section>
            </div>
          </div>

          <section className="rounded-xl border border-[#e5e2dc] bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="mb-1 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
                  <Activity aria-hidden="true" size={12} />
                  Synthetic settlement trend
                </p>
                <h2 className="font-serif text-xl">7-Day Prepaid Volume (INR)</h2>
              </div>
              <div className="text-right">
                <p className="font-serif text-xl font-semibold">{formatCurrency(weeklyTotal)}</p>
                <p className="mt-1 text-[8px] text-[#8b8178]">
                  Sample average {formatCurrency(dailyAverage)} / day
                </p>
              </div>
            </div>
            <DemoVolumeChart />
          </section>

          <footer className="flex flex-wrap justify-between gap-2 border-t border-[#e5e2dc] py-3 text-[8px] uppercase tracking-wider text-[#8b8178]">
            <span>VELQIRA Atelier Kochi Desk · Admin preview</span>
            <span>Sample settlement data · No live provider connection</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function AdminDashboardSidebar() {
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
            <span aria-current="page" className="flex items-center gap-2 rounded-md bg-[#201b17] px-2.5 py-2 text-[11px] font-semibold text-white">
              <LayoutDashboard aria-hidden="true" size={14} />
              Dashboard &amp; Quick Stats
            </span>
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
            <span aria-disabled="true" className="flex items-center gap-2 px-2.5 py-2 text-[11px] text-[#8b8178]">
              <SlidersHorizontal aria-hidden="true" size={14} />
              Inventory &amp; Pricing
            </span>
          </NavGroup>
          <NavGroup label="Storefront Customizer">
            <Link className={navClass} to="/admin/customizer">
              <Palette aria-hidden="true" size={14} />
              Customer Screen Controls
            </Link>
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
          Dashboard metrics use sample orders and inventory.
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

function MetricCard({
  children,
  detail,
  icon,
  label,
  value,
}: {
  children: ReactNode;
  detail: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="flex min-h-32 flex-col justify-between rounded-xl border border-[#e5e2dc] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-wider text-[#8b8178]">{label}</p>
          <p className="mt-2 font-serif text-2xl leading-none tracking-tight">{value}</p>
        </div>
        <span className="rounded-full bg-[#f6f3ed] p-2 text-[#735c00]">{icon}</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="text-[8px] leading-4 text-[#6b625d]">{detail}</p>
        {children}
      </div>
    </article>
  );
}

function DispatchBadge({ status }: { status: DispatchState }) {
  const styles: Record<DispatchState, string> = {
    'Ready for handoff': 'bg-[#f4f0e5] text-[#735c00]',
    'Courier dispatched': 'bg-[#f0eee8] text-[#6b625d]',
    'Delivered by local courier': 'bg-[#eaf0e8] text-[#486344]',
  };
  return (
    <span className={`inline-flex max-w-36 items-center gap-1 rounded-full px-2 py-1 text-[8px] leading-3 ${styles[status]}`}>
      <span className="h-1 w-1 shrink-0 rounded-full bg-current" />
      {status}
    </span>
  );
}

function DashboardSwitch({
  checked,
  detail,
  label,
  onChange,
  stateLabel,
}: {
  checked: boolean;
  detail: string;
  label: string;
  onChange: (checked: boolean) => void;
  stateLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#eee9df] py-3">
      <div className="min-w-0">
        <p className="text-[10px] font-medium">{label}</p>
        <p className="mt-1 truncate text-[8px] text-[#8b8178]">{detail}</p>
        <p className="mt-1 text-[7px] font-semibold uppercase tracking-wider text-[#8b8178]">{stateLabel}</p>
      </div>
      <button
        aria-checked={checked}
        aria-label={label}
        className={`relative h-5 w-10 shrink-0 rounded-full transition ${checked ? 'bg-[#201b17]' : 'bg-[#d5d0c8]'}`}
        onClick={() => onChange(!checked)}
        role="switch"
        type="button"
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function DemoVolumeChart() {
  const points = '20,115 150,108 280,75 410,95 540,48 670,62 790,20';
  return (
    <div className="mt-4 overflow-x-auto">
      <svg
        aria-label="Sample seven-day prepaid volume line chart"
        className="h-44 min-w-[640px] w-full"
        preserveAspectRatio="none"
        role="img"
        viewBox="0 0 810 160"
      >
        <defs>
          <linearGradient id="demo-volume-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a98218" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#a98218" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[35, 75, 115].map((y) => (
          <line key={y} stroke="#eee9df" strokeDasharray="3 5" x1="0" x2="810" y1={y} y2={y} />
        ))}
        <path d={`M ${points.replaceAll(' ', ' L ')} L 790 145 L 20 145 Z`} fill="url(#demo-volume-fill)" />
        <polyline fill="none" points={points} stroke="#8f7100" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        {points.split(' ').map((point) => {
          const [cx, cy] = point.split(',');
          return <circle cx={cx} cy={cy} fill="#fcf9f3" key={point} r="3.5" stroke="#8f7100" strokeWidth="2" />;
        })}
      </svg>
      <div className="flex min-w-[640px] justify-between text-[8px] text-[#8b8178]">
        {dailyVolumes.map(({ day, label }) => (
          <span className="flex flex-col gap-1 text-center" key={day}>
            <span>{day}</span>
            <span className="font-medium text-[#6b625d]">{label}</span>
          </span>
        ))}
      </div>
      <p className="mt-2 flex items-center gap-1 text-[8px] text-[#8b8178]">
        <CircleAlert aria-hidden="true" size={10} />
        Synthetic trend data for layout preview only; not a financial report.
      </p>
    </div>
  );
}

import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Eye,
  ImagePlus,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  PackagePlus,
  Palette,
  Search,
  Settings,
  ShieldAlert,
  Smartphone,
  Truck,
  Wallet,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type SettlementStatus = 'matched' | 'processing';
type StatusFilter = 'all' | SettlementStatus | 'flagged';

interface Settlement {
  orderId: string;
  time: string;
  customer: string;
  item: string;
  details: string;
  method: string;
  utr: string;
  rrn: string;
  amount: number;
  status: SettlementStatus;
}

const demoSettlements: Settlement[] = [
  {
    orderId: 'DEMO-1048',
    time: '14:32 IST',
    customer: 'Sample buyer 01',
    item: 'Example jewellery piece',
    details: 'Demo product option',
    method: 'Google Pay',
    utr: 'DEMO-UTR-001',
    rrn: 'DEMO-RRN-001',
    amount: 4800,
    status: 'matched',
  },
  {
    orderId: 'DEMO-1047',
    time: '14:06 IST',
    customer: 'Sample buyer 02',
    item: 'Example homeware',
    details: 'Demo product option',
    method: 'PhonePe',
    utr: 'DEMO-UTR-002',
    rrn: 'DEMO-RRN-002',
    amount: 12400,
    status: 'matched',
  },
  {
    orderId: 'DEMO-1046',
    time: '13:41 IST',
    customer: 'Sample buyer 03',
    item: 'Example tabletop item',
    details: 'Demo product option',
    method: 'Paytm UPI',
    utr: 'DEMO-UTR-003',
    rrn: 'DEMO-RRN-003',
    amount: 3200,
    status: 'matched',
  },
  {
    orderId: 'DEMO-1045',
    time: '12:49 IST',
    customer: 'Sample buyer 04',
    item: 'Example apparel',
    details: 'Demo product option',
    method: 'UPI',
    utr: 'DEMO-UTR-004',
    rrn: 'DEMO-RRN-004',
    amount: 18500,
    status: 'matched',
  },
  {
    orderId: 'DEMO-1044',
    time: '11:22 IST',
    customer: 'Sample buyer 05',
    item: 'Example home decor',
    details: 'Demo product option',
    method: 'Google Pay',
    utr: 'DEMO-UTR-005',
    rrn: 'DEMO-RRN-005',
    amount: 2650,
    status: 'matched',
  },
  {
    orderId: 'DEMO-1043',
    time: '10:15 IST',
    customer: 'Sample buyer 06',
    item: 'Example accessory',
    details: 'Demo product option',
    method: 'PhonePe',
    utr: 'DEMO-UTR-006',
    rrn: 'DEMO-RRN-006',
    amount: 9800,
    status: 'matched',
  },
  {
    orderId: 'DEMO-1049',
    time: 'Just now',
    customer: 'Sample buyer 07',
    item: 'Example textile',
    details: 'Demo product option',
    method: 'Google Pay',
    utr: 'DEMO-UTR-007',
    rrn: 'Pending in demo',
    amount: 5400,
    status: 'processing',
  },
];

const channelData = [
  { name: 'Google Pay', shortName: 'GPay', amount: 60000, transactions: 20, share: 42, icon: Wallet },
  { name: 'PhonePe', shortName: 'PhonePe', amount: 48570, transactions: 16, share: 34, icon: Smartphone },
  { name: 'Paytm', shortName: 'Paytm', amount: 22850, transactions: 8, share: 16, icon: CreditCard },
  { name: 'Other UPI', shortName: 'Other', amount: 11430, transactions: 3, share: 8, icon: CreditCard },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const statusNames: Record<SettlementStatus, string> = {
  matched: 'Matched · sample',
  processing: 'Processing · sample',
};

function exportDemoLedger(rows: Settlement[]) {
  const csvRows = [
    ['Order', 'Sample buyer', 'Item', 'UPI method', 'Demo UTR', 'Amount INR', 'Status'],
    ...rows.map((row) => [
      row.orderId,
      row.customer,
      row.item,
      row.method,
      row.utr,
      String(row.amount),
      statusNames[row.status],
    ]),
  ];
  const csv = csvRows.map((row) => row.map((field) => `"${field.replaceAll('"', '""')}"`).join(',')).join('\n');
  const downloadUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = 'velqira-demo-settlements.csv';
  downloadLink.click();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

export function AdminSettlementsPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

  const filteredSettlements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return demoSettlements.filter((settlement) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'flagged' ? false : settlement.status === statusFilter);
      const searchableFields = [
        settlement.orderId,
        settlement.customer,
        settlement.item,
        settlement.method,
        settlement.utr,
        settlement.rrn,
      ];
      return (
        matchesStatus &&
        (!normalizedQuery || searchableFields.some((field) => field.toLowerCase().includes(normalizedQuery)))
      );
    });
  }, [query, statusFilter]);

  const statusFilters: { id: StatusFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: demoSettlements.length },
    { id: 'matched', label: 'Matched', count: demoSettlements.filter((row) => row.status === 'matched').length },
    {
      id: 'processing',
      label: 'Processing',
      count: demoSettlements.filter((row) => row.status === 'processing').length,
    },
    { id: 'flagged', label: 'Flagged', count: 0 },
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f3] text-[#1c1c18]">
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
              <Link
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-[#6b625d] hover:bg-[#ebe8e2]"
                to="/admin/dashboard"
              >
                <LayoutDashboard aria-hidden="true" size={15} />
                Dashboard &amp; Quick Stats
              </Link>
            </NavGroup>
            <NavGroup label="Catalog & Products">
              <Link
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-[#6b625d] hover:bg-[#ebe8e2]"
                to="/admin/products"
              >
                <PackagePlus aria-hidden="true" size={15} />
                Product Listing
              </Link>
              <Link
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-[#6b625d] hover:bg-[#ebe8e2]"
                to="/admin/categories"
              >
                <ImagePlus aria-hidden="true" size={15} />
                Category Image Manager
              </Link>
              <Link
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-[#6b625d] hover:bg-[#ebe8e2]"
                to="/admin/products/new"
              >
                <PackagePlus aria-hidden="true" size={15} />
                Assign New Product
              </Link>
              <NavItem icon={<CreditCard size={15} />} label="Inventory & Pricing" />
            </NavGroup>
            <NavGroup label="Storefront Customizer">
              <Link
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-[#6b625d] hover:bg-[#ebe8e2]"
                to="/admin/customizer"
              >
                <Palette aria-hidden="true" size={15} />
                Customer Screen Controls
              </Link>
              <Link
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-[#6b625d] hover:bg-[#ebe8e2]"
                to="/admin/hero"
              >
                <ImagePlus aria-hidden="true" size={15} />
                Hero Screen &amp; Banner
              </Link>
            </NavGroup>
            <NavGroup label="Orders & Reconciliation">
              <div
                aria-current="page"
                className="flex items-center gap-2 rounded-md bg-[#201b17] px-2.5 py-2 text-xs font-semibold text-white"
              >
                <Wallet aria-hidden="true" size={15} />
                UPI Settlements (Demo)
              </div>
              <NavItem icon={<Truck size={15} />} label="Dispatches" />
              <NavItem icon={<CreditCard size={15} />} label="Receipts" />
            </NavGroup>
            <NavGroup label="Customer Sanctuary">
              <NavItem icon={<CircleAlert size={15} />} label="Patron Accounts & Inquiries" />
            </NavGroup>
          </nav>
        </div>

        <div className="rounded-lg bg-[#ebe8e2] p-3">
          <p className="text-xs font-semibold">Admin preview</p>
          <p className="mt-1 text-[10px] leading-4 text-[#6b625d]">
            Demo screen only. Sign-in and financial integrations are not configured.
          </p>
          <Link className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#735c00]" to="/admin">
            <LockKeyhole aria-hidden="true" size={12} />
            Admin access
          </Link>
        </div>
      </aside>

      <div className="min-h-screen md:pl-52 xl:pl-64">
        <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#e5e2dc] bg-[#fcf9f3]/95 px-4 py-3 backdrop-blur md:px-5">
          <label className="relative min-w-[220px] flex-1 md:max-w-sm">
            <span className="sr-only">Search demo settlements</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8178]" size={15} />
            <input
              className="w-full rounded-md border border-[#e5e2dc] bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-[#735c00]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search demo settlements, order ID, UTR..."
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
              Add Product
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

        <main className="mx-auto max-w-[1380px] space-y-5 p-4 md:p-6 xl:p-8">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div className="max-w-3xl">
              <p className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#6b625d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                Fort Kochi Studio Operational Desk <span className="text-[#c7bfb6]">/</span> Demo reconciliation
              </p>
              <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">
                UPI Settlements &amp; Instant Ledger Reconciliation
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b625d]">
                Sample settlement dashboard for reviewing payment channels, payout batches, and ledger status.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-md bg-[#f0eee8] px-3 py-2.5 text-xs font-medium hover:bg-[#e5e2dc]"
                onClick={() => exportDemoLedger(filteredSettlements)}
                type="button"
              >
                <ArrowDownToLine aria-hidden="true" size={15} />
                Export Demo CSV
              </button>
              <UnavailableAction label="Sync gateway" />
              <UnavailableAction label="Mark matched" primary />
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            <ShieldAlert aria-hidden="true" className="mt-0.5 shrink-0" size={16} />
            <p>
              <strong>DEMO PREVIEW — no live UPI, bank, or customer data.</strong> The sign-in, provider sync, and
              settlement actions are not connected. Do not use this page for real financial operations.
            </p>
          </div>

          <section aria-label="Demo settlement summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Settled volume (sample)" value="₹1,42,850" detail="47 example transactions" icon="↗" />
            <MetricCard label="Settlement velocity" value="—" detail="Provider not connected" icon="↯" />
            <MetricCard label="Direct bank route" value="Not connected" detail="No account or balance loaded" icon="▤" />
            <MetricCard label="Store policy preview" value="Prepaid only" detail="No COD payment data loaded" icon="✓" />
          </section>

          <section className="grid items-stretch gap-4 xl:grid-cols-12">
            <div className="space-y-4 rounded-lg border border-[#e5e2dc] bg-white p-4 shadow-sm xl:col-span-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl">UPI Channel Split &amp; Terminal Routing</h2>
                  <p className="mt-1 text-xs text-[#6b625d]">Illustrative provider distribution — not live gateway data</p>
                </div>
                <span className="rounded-sm bg-[#f0eee8] px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#6b625d]">
                  Demo split
                </span>
              </div>
              <div aria-label="Example channel shares" className="flex h-3 overflow-hidden rounded-full bg-[#ebe8e2]">
                <span className="w-[42%] bg-[#201b17]" />
                <span className="w-[34%] bg-[#6b625d]" />
                <span className="w-[16%] bg-[#a98218]" />
                <span className="w-[8%] bg-[#c7bfb6]" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#6b625d] sm:grid-cols-4">
                {channelData.map((channel) => (
                  <span key={channel.name}>
                    {channel.share}% {channel.name}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {channelData.map((channel) => (
                  <div className="space-y-1 rounded-md bg-[#f6f3ed] p-3" key={channel.name}>
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <channel.icon aria-hidden="true" size={13} />
                      {channel.shortName}
                    </div>
                    <p className="font-serif text-lg">{formatCurrency(channel.amount)}</p>
                    <p className="text-[9px] text-[#6b625d]">
                      {channel.transactions} demo txns · {channel.share}%
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-[#f0eee8] px-3 py-2 text-[10px] text-[#4d4540]">
                <span className="flex items-center gap-1.5">
                  <CircleAlert aria-hidden="true" className="text-[#735c00]" size={14} />
                  Provider webhook status is unavailable in this demo.
                </span>
                <span className="font-mono text-[#6b625d]">No gateway node connected</span>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-lg bg-[#f6f3ed] p-5 xl:col-span-4">
              <div className="space-y-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
                  Atelier settlement desk
                </span>
                <h2 className="font-serif text-2xl leading-tight">Direct merchant settlement overview</h2>
                <p className="text-xs leading-5 text-[#6b625d]">
                  Connect a payment provider and bank statement feed to review real transaction references and payouts.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-md bg-white p-3">
                <img
                  alt="Sample jewellery product"
                  className="h-12 w-12 rounded object-cover"
                  src="/images/jewellery-necklace-1.jpg"
                />
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-[#6b625d]">Example item</p>
                  <p className="text-xs font-medium">Sample atelier product</p>
                  <p className="text-[10px] text-[#735c00]">No transaction linked</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-[#e5e2dc] bg-white p-4 shadow-sm">
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
              <div>
                <h2 className="font-serif text-xl">Daily Bank Payout Batches</h2>
                <p className="mt-1 text-xs text-[#6b625d]">Example batches only — no bank account connected</p>
              </div>
              <span className="w-fit rounded-sm bg-[#f0eee8] px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#6b625d]">
                Demo batch data
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <PayoutBatch
                name="DEMO-BATCH-A"
                schedule="Example midday"
                description="28 synthetic entries · no bank transfer"
                amount="₹84,200"
              />
              <PayoutBatch
                name="DEMO-BATCH-B"
                schedule="Example evening"
                description="19 synthetic entries · no bank transfer"
                amount="₹58,650"
              />
            </div>
            <div className="flex items-start gap-2 rounded-md bg-[#f0eee8] px-3 py-2.5 text-xs leading-5 text-[#4d4540]">
              <CircleAlert aria-hidden="true" className="mt-0.5 shrink-0 text-[#735c00]" size={15} />
              <span>
                No reconciliation status is verified. Live payout exceptions require connected provider and bank data.
              </span>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-[#e5e2dc] bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 p-4 xl:flex-row xl:items-center">
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <button
                    aria-pressed={statusFilter === filter.id}
                    className={`rounded px-3 py-2 text-[10px] font-semibold transition ${
                      statusFilter === filter.id
                        ? 'bg-[#201b17] text-white'
                        : 'bg-[#f0eee8] text-[#4d4540] hover:bg-[#e5e2dc]'
                    }`}
                    key={filter.id}
                    onClick={() => setStatusFilter(filter.id)}
                    type="button"
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded bg-[#f6f3ed] px-3 py-2 text-xs text-[#4d4540]">
                <Search aria-hidden="true" size={14} />
                <span>Demo date · 24 Oct</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left text-xs">
                <thead className="bg-[#f6f3ed] text-[9px] uppercase tracking-wider text-[#6b625d]">
                  <tr>
                    <th className="px-3 py-3 font-semibold">Order &amp; timestamp</th>
                    <th className="px-3 py-3 font-semibold">Sample buyer</th>
                    <th className="px-3 py-3 font-semibold">Example item</th>
                    <th className="px-3 py-3 font-semibold">UPI app</th>
                    <th className="px-3 py-3 font-semibold">Demo UTR / reference</th>
                    <th className="px-3 py-3 text-right font-semibold">Amount</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 text-right font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eee8]">
                  {filteredSettlements.map((settlement) => (
                    <tr className="hover:bg-[#fcf9f3]" key={settlement.orderId}>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span className="block font-semibold">{settlement.orderId}</span>
                        <span className="text-[9px] text-[#6b625d]">Demo · {settlement.time}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="block">{settlement.customer}</span>
                        <span className="font-mono text-[9px] text-[#8b8178]">••••@demo</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="block">{settlement.item}</span>
                        <span className="text-[9px] text-[#8b8178]">{settlement.details}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">{settlement.method}</td>
                      <td className="px-3 py-3 font-mono text-[9px]">
                        <span className="block">{settlement.utr}</span>
                        <span className="text-[#8b8178]">{settlement.rrn}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right font-serif text-base">
                        {formatCurrency(settlement.amount)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`whitespace-nowrap rounded-sm px-2 py-1 text-[9px] font-semibold ${
                            settlement.status === 'matched'
                              ? 'bg-[#f0eee8] text-[#735c00]'
                              : 'bg-amber-50 text-amber-900'
                          }`}
                        >
                          {statusNames[settlement.status]}
                        </span>
                        <span className="mt-1 block text-[9px] text-[#8b8178]">No bank data</span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          className="font-semibold text-[#735c00] hover:underline"
                          onClick={() => setSelectedSettlement(settlement)}
                          type="button"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredSettlements.length === 0 && (
                    <tr>
                      <td className="px-3 py-10 text-center text-[#6b625d]" colSpan={8}>
                        No sample records match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f6f3ed] px-4 py-3 text-[10px] text-[#6b625d]">
              <span>
                Showing {filteredSettlements.length} of {demoSettlements.length} displayed sample records
              </span>
              <div className="flex items-center gap-1">
                <button
                  aria-label="Previous page"
                  className="rounded bg-white px-2 py-1 disabled:opacity-40"
                  disabled
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" size={13} />
                </button>
                <span className="rounded bg-[#201b17] px-2.5 py-1 text-white">1</span>
                <button
                  aria-label="Next page"
                  className="rounded bg-white px-2 py-1 disabled:opacity-40"
                  disabled
                  type="button"
                >
                  <ChevronRight aria-hidden="true" size={13} />
                </button>
              </div>
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-3 rounded-lg bg-[#f6f3ed] p-4 text-[10px] leading-5 text-[#6b625d] md:flex-row md:items-center">
            <div>
              <p className="font-semibold uppercase tracking-wider text-[#1c1c18]">Velqira Atelier • Admin preview</p>
              <p>Demo data only. No NPCI, bank, or payment provider integration is active.</p>
            </div>
            <Link className="inline-flex items-center gap-1 font-semibold text-[#735c00]" to="/">
              <ArrowLeft aria-hidden="true" size={13} />
              Back to storefront
            </Link>
          </footer>
        </main>
      </div>

      {selectedSettlement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#201b17]/40 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedSettlement(null);
          }}
        >
          <section
            aria-labelledby="settlement-dialog-title"
            aria-modal="true"
            className="w-full max-w-md space-y-4 rounded-lg bg-white p-5 shadow-2xl"
            role="dialog"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[#735c00]">Sample record</p>
                <h2 className="mt-1 font-serif text-xl" id="settlement-dialog-title">
                  Settlement details
                </h2>
              </div>
              <button
                aria-label="Close settlement details"
                className="rounded p-1.5 text-[#6b625d] hover:bg-[#f0eee8]"
                onClick={() => setSelectedSettlement(null)}
                type="button"
              >
                <X aria-hidden="true" size={17} />
              </button>
            </div>
            <dl className="space-y-3 rounded bg-[#f6f3ed] p-4 text-xs">
              <Detail label="Order reference" value={selectedSettlement.orderId} />
              <Detail label="Buyer" value={selectedSettlement.customer} />
              <Detail label="Item" value={selectedSettlement.item} />
              <Detail label="UPI method" value={selectedSettlement.method} />
              <Detail label="Demo UTR" value={selectedSettlement.utr} />
              <Detail label="Demo reference" value={selectedSettlement.rrn} />
              <Detail label="Amount" value={formatCurrency(selectedSettlement.amount)} />
              <Detail label="Status" value={statusNames[selectedSettlement.status]} />
            </dl>
            <p className="text-[10px] leading-4 text-[#6b625d]">
              This is not a payment receipt or bank confirmation. Live transaction details are unavailable.
            </p>
            <button
              className="w-full rounded bg-[#201b17] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#39312b]"
              onClick={() => setSelectedSettlement(null)}
              type="button"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </div>
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

function NavItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span
      aria-disabled="true"
      className="flex cursor-not-allowed items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-[#6b625d] opacity-80"
      title="This admin feature is not connected."
    >
      {icon}
      {label}
    </span>
  );
}

function MetricCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: string }) {
  return (
    <article className="flex min-h-32 flex-col justify-between rounded-lg border border-[#e5e2dc] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-[#6b625d]">{label}</span>
        <span aria-hidden="true" className="rounded bg-[#f0eee8] px-2 py-1 text-xs font-bold text-[#735c00]">
          {icon}
        </span>
      </div>
      <div>
        <p className="font-serif text-2xl leading-tight md:text-3xl">{value}</p>
        <p className="mt-2 text-[10px] text-[#6b625d]">{detail}</p>
      </div>
    </article>
  );
}

function PayoutBatch({
  name,
  schedule,
  description,
  amount,
}: {
  name: string;
  schedule: string;
  description: string;
  amount: string;
}) {
  return (
    <article className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-[#f6f3ed] p-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold">{name}</p>
          <span className="rounded-sm bg-[#ebe8e2] px-2 py-1 text-[9px] text-[#6b625d]">{schedule}</span>
        </div>
        <p className="text-[10px] text-[#6b625d]">{description}</p>
      </div>
      <div className="text-right">
        <p className="font-serif text-xl">{amount}</p>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-[#6b625d]">Example only</span>
      </div>
    </article>
  );
}

function UnavailableAction({ label, primary = false }: { label: string; primary?: boolean }) {
  return (
    <button
      className={`inline-flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-2.5 text-xs font-medium opacity-50 ${
        primary ? 'bg-[#201b17] text-white' : 'bg-[#f0eee8] text-[#1c1c18]'
      }`}
      disabled
      title="This action requires a secure backend integration."
      type="button"
    >
      <LockKeyhole aria-hidden="true" size={14} />
      {label}
    </button>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#6b625d]">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

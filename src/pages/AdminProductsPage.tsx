import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  ImagePlus,
  LayoutDashboard,
  LockKeyhole,
  PackagePlus,
  Palette,
  Pencil,
  Search,
  SlidersHorizontal,
  Star,
  Truck,
  Wallet,
  X,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const categories = [
  'Adornments & Jewelry',
  'Ceramics & Vessels',
  'Olfactory & Scents',
  "Objets d'Art",
] as const;

type ProductCategory = (typeof categories)[number];
type InventoryFilter = 'all' | 'in-stock' | 'low-stock' | 'made-to-order';

interface Product {
  id: string;
  sku: string;
  title: string;
  category: ProductCategory;
  provenance: string;
  material: string;
  price: number;
  stock: number | null;
  reserve: number;
  published: boolean;
  featured: boolean;
  image: string;
}

interface ProductDraft {
  title: string;
  category: ProductCategory;
  provenance: string;
  material: string;
  price: string;
  stock: string;
  reserve: string;
  madeToOrder: boolean;
  published: boolean;
  featured: boolean;
  image: string;
}

const initialProducts: Product[] = [
  {
    id: 'product-1',
    sku: 'DEMO-SKU-089',
    title: 'Kochi Torus Collar',
    category: 'Adornments & Jewelry',
    provenance: 'Fort Kochi Forge',
    material: 'Recycled molten brass',
    price: 3450,
    stock: 12,
    reserve: 3,
    published: true,
    featured: true,
    image: '/images/jewellery-necklace-1.jpg',
  },
  {
    id: 'product-2',
    sku: 'DEMO-SKU-104',
    title: 'Ash-Glaze Anagama Flagon',
    category: 'Ceramics & Vessels',
    provenance: 'Mattancherry Kiln',
    material: 'Kerala red earth & ash',
    price: 2800,
    stock: 3,
    reserve: 5,
    published: true,
    featured: false,
    image: '/images/hero-slide-3-showcase.jpg',
  },
  {
    id: 'product-3',
    sku: 'DEMO-SKU-142',
    title: 'Monolith Incense Well',
    category: 'Olfactory & Scents',
    provenance: 'Jaipur Bronze Foundry',
    material: 'Lost-wax sand cast bronze',
    price: 4200,
    stock: null,
    reserve: 0,
    published: false,
    featured: false,
    image: '/images/jewellery-necklace-2.jpg',
  },
  {
    id: 'product-4',
    sku: 'DEMO-SKU-051',
    title: 'Tidal Crest Ring',
    category: 'Adornments & Jewelry',
    provenance: 'Fort Kochi Forge',
    material: '925 sterling silver',
    price: 1950,
    stock: 8,
    reserve: 3,
    published: true,
    featured: true,
    image: '/images/jewellery-necklace-3.jpg',
  },
];

const createEmptyDraft = (): ProductDraft => ({
  title: '',
  category: categories[0],
  provenance: '',
  material: '',
  price: '',
  stock: '0',
  reserve: '0',
  madeToOrder: false,
  published: false,
  featured: false,
  image: '',
});

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

function isLowStock(product: Product) {
  return product.stock !== null && product.stock <= product.reserve;
}

function exportProductAudit(products: Product[]) {
  const rows = [
    ['SKU', 'Title', 'Category', 'Provenance', 'Price INR', 'Stock', 'Visibility', 'Home feature'],
    ...products.map((product) => [
      product.sku,
      product.title,
      product.category,
      product.provenance,
      String(product.price),
      product.stock === null ? 'Made to order' : String(product.stock),
      product.published ? 'Preview published' : 'Vault only',
      product.featured ? 'Featured' : 'Not featured',
    ]),
  ];
  const csv = rows.map((row) => row.map((field) => `"${field.replaceAll('"', '""')}"`).join(',')).join('\n');
  const downloadUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = 'velqira-demo-product-catalog.csv';
  downloadLink.click();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

export function AdminProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const previousPath = useRef(location.pathname);
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [inventoryFilter, setInventoryFilter] = useState<InventoryFilter>('all');
  const [drawerOpen, setDrawerOpen] = useState(() => location.pathname.endsWith('/new'));
  const [draft, setDraft] = useState<ProductDraft>(createEmptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [stockValue, setStockValue] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (
      location.pathname.endsWith('/new') &&
      !previousPath.current.endsWith('/new')
    ) {
      setEditingId(null);
      setDraft(createEmptyDraft());
      setDrawerOpen(true);
    }
    previousPath.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen && !stockProduct) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
        setStockProduct(null);
        if (location.pathname.endsWith('/new')) navigate('/admin/products', { replace: true });
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [drawerOpen, location.pathname, navigate, stockProduct]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesInventory =
        inventoryFilter === 'all' ||
        (inventoryFilter === 'in-stock' && product.stock !== null && !isLowStock(product)) ||
        (inventoryFilter === 'low-stock' && isLowStock(product)) ||
        (inventoryFilter === 'made-to-order' && product.stock === null);
      const searchableFields = [product.title, product.sku, product.provenance, product.category, product.material];
      return (
        matchesCategory &&
        matchesInventory &&
        (!normalizedQuery || searchableFields.some((field) => field.toLowerCase().includes(normalizedQuery)))
      );
    });
  }, [categoryFilter, inventoryFilter, products, query]);

  const openNewProduct = () => {
    setEditingId(null);
    setDraft(createEmptyDraft());
    setDrawerOpen(true);
    navigate('/admin/products/new');
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    if (location.pathname.endsWith('/new')) navigate('/admin/products', { replace: true });
  };

  const openEditProduct = (product: Product) => {
    setEditingId(product.id);
    setDraft({
      title: product.title,
      category: product.category,
      provenance: product.provenance,
      material: product.material,
      price: String(product.price),
      stock: String(product.stock ?? 0),
      reserve: String(product.reserve),
      madeToOrder: product.stock === null,
      published: product.published,
      featured: product.featured,
      image: product.image,
    });
    setDrawerOpen(true);
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
        setDraft((current) => ({ ...current, image }));
        setNotice('Image preview added locally. It has not been uploaded.');
      }
    };
    reader.onerror = () => setNotice('Could not read the selected image.');
    reader.readAsDataURL(file);
  };

  const saveProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(draft.price);
    const stock = Number(draft.stock);
    const reserve = Number(draft.reserve);
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0 || !Number.isInteger(reserve) || reserve < 0) {
      setNotice('Enter a valid price and non-negative whole-number stock values.');
      return;
    }

    if (editingId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? {
                ...product,
                title: draft.title,
                category: draft.category,
                provenance: draft.provenance,
                material: draft.material,
                image: draft.image,
                published: draft.published,
                featured: draft.featured,
                price,
                stock: draft.madeToOrder ? null : stock,
                reserve: draft.madeToOrder ? 0 : reserve,
              }
            : product,
        ),
      );
    } else {
      const id = `demo-${Date.now()}`;
      setProducts((current) => [
        {
          id,
          sku: `DEMO-SKU-${String(current.length + 1).padStart(3, '0')}`,
          title: draft.title,
          category: draft.category,
          provenance: draft.provenance,
          material: draft.material,
          image: draft.image,
          published: draft.published,
          featured: draft.featured,
          price,
          stock: draft.madeToOrder ? null : stock,
          reserve: draft.madeToOrder ? 0 : reserve,
        },
        ...current,
      ]);
    }

    setNotice('Saved in this preview only. The live storefront and inventory were not changed.');
    setDrawerOpen(false);
    if (location.pathname.endsWith('/new')) navigate('/admin/products', { replace: true });
  };

  const saveStock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const stock = Number(stockValue);
    if (!Number.isInteger(stock) || stock < 0 || !stockProduct) {
      setNotice('Enter a non-negative whole-number stock quantity.');
      return;
    }
    setProducts((current) =>
      current.map((product) => (product.id === stockProduct.id ? { ...product, stock } : product)),
    );
    setStockProduct(null);
    setNotice('Sample inventory updated locally. No live stock was changed.');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((current) =>
      current.map((product) => (product.id === id ? { ...product, ...updates } : product)),
    );
    setNotice('Preview updated locally. The live storefront was not changed.');
  };

  const publishedCount = products.filter((product) => product.published).length;
  const lowStockCount = products.filter(isLowStock).length;
  const vaultedCount = products.filter((product) => !product.published || product.stock === null).length;

  return (
    <div className="min-h-screen bg-[#fcf9f3] text-[#1c1c18]">
      <AdminProductSidebar />

      <div className="min-h-screen md:pl-52 xl:pl-64">
        <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#e5e2dc] bg-[#fcf9f3]/95 px-4 py-3 backdrop-blur md:px-5">
          <label className="relative min-w-[220px] flex-1 md:max-w-sm">
            <span className="sr-only">Search demo products</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8178]" size={15} />
            <input
              className="w-full rounded-md border border-[#e5e2dc] bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-[#735c00]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product title, SKU, or provenance..."
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
            <button
              className="hidden items-center gap-1.5 rounded-md bg-[#201b17] px-3 py-2 text-[11px] font-medium text-white hover:bg-[#39312b] sm:inline-flex"
              onClick={openNewProduct}
              type="button"
            >
              <PackagePlus aria-hidden="true" size={14} />
              Add New Product
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

        <main className="mx-auto max-w-[1380px] space-y-5 p-4 md:p-6 xl:p-8">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div className="max-w-3xl">
              <p className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#6b625d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                Storefront registry <span className="text-[#c7bfb6]">/</span> Demo catalog
              </p>
              <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">
                Product Catalog &amp; Item Assignment
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b625d]">
                Review sample inventory, assign products, and preview storefront visibility. Changes are local to this
                demo.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-md bg-[#f0eee8] px-3 py-2.5 text-xs font-medium hover:bg-[#e5e2dc]"
                onClick={() => exportProductAudit(filteredProducts)}
                type="button"
              >
                <ArrowDownToLine aria-hidden="true" size={15} />
                Stock Audit Sheet
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-md bg-[#201b17] px-3 py-2.5 text-xs font-medium text-white hover:bg-[#39312b]"
                onClick={openNewProduct}
                type="button"
              >
                <PackagePlus aria-hidden="true" size={15} />
                Assign New Product
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            <CircleAlert aria-hidden="true" className="mt-0.5 shrink-0" size={16} />
            <p>
              <strong>DEMO CATALOG — no live product or inventory connection.</strong> Assignments, images, stock,
              publishing, and featured state remain in this browser session only.
            </p>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div aria-label="Filter products by category" className="flex gap-2 overflow-x-auto pb-1">
              <CategoryTab
                active={categoryFilter === 'all'}
                count={products.length}
                label="All"
                onClick={() => setCategoryFilter('all')}
              />
              {categories.map((category) => (
                <CategoryTab
                  active={categoryFilter === category}
                  count={products.filter((product) => product.category === category).length}
                  key={category}
                  label={category}
                  onClick={() => setCategoryFilter(category)}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-[9px] font-semibold uppercase tracking-wider text-[#6b625d]">
              <MetricPill label="Published in preview" value={publishedCount} />
              <MetricPill label="Low reserve" value={lowStockCount} warning />
              <MetricPill label="Vaulted / custom" value={vaultedCount} />
            </div>
          </div>

          <section className="overflow-hidden rounded-lg border border-[#e5e2dc] bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-[#e5e2dc] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block w-full sm:max-w-sm">
                <span className="sr-only">Filter products</span>
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8178]"
                  size={15}
                />
                <input
                  className="w-full rounded-md bg-[#fcf9f3] py-2 pl-9 pr-3 text-xs outline-none focus:ring-1 focus:ring-[#735c00]"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Filter by title, SKU, or provenance..."
                  type="search"
                  value={query}
                />
              </label>
              <label className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-[#6b625d]">
                Displaying
                <select
                  className="rounded bg-[#f0eee8] px-2 py-2 text-xs font-normal normal-case tracking-normal text-[#1c1c18] outline-none focus:ring-1 focus:ring-[#735c00]"
                  onChange={(event) => setInventoryFilter(event.target.value as InventoryFilter)}
                  value={inventoryFilter}
                >
                  <option value="all">All inventory statuses</option>
                  <option value="in-stock">In stock</option>
                  <option value="low-stock">Low stock</option>
                  <option value="made-to-order">Made to order</option>
                </select>
                <SlidersHorizontal aria-hidden="true" size={14} />
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-xs">
                <thead className="bg-[#f6f3ed] text-[9px] uppercase tracking-wider text-[#6b625d]">
                  <tr>
                    <th className="px-3 py-3 font-semibold">Item monograph</th>
                    <th className="px-3 py-3 font-semibold">Classification</th>
                    <th className="px-3 py-3 font-semibold">Stock status</th>
                    <th className="px-3 py-3 font-semibold">Retail value</th>
                    <th className="px-3 py-3 font-semibold">Storefront status</th>
                    <th className="px-3 py-3 text-center font-semibold">Home feature</th>
                    <th className="px-3 py-3 text-right font-semibold">Quick actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eee8]">
                  {filteredProducts.map((product) => (
                    <tr className="group hover:bg-[#fcf9f3]" key={product.id}>
                      <td className="min-w-[220px] px-3 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            alt=""
                            className="h-14 w-12 shrink-0 rounded bg-[#f0eee8] object-cover"
                            src={product.image || '/images/velqira-editorial-silk.jpeg'}
                          />
                          <div>
                            <p className="font-serif text-sm">{product.title}</p>
                            <p className="mt-1 text-[9px] text-[#6b625d]">
                              <span className="font-mono">{product.sku}</span>
                              <span className="mx-1">·</span>
                              <span className="uppercase text-[#735c00]">{product.provenance}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-sm bg-[#f0eee8] px-2 py-1 text-[9px] uppercase tracking-wider text-[#4d4540]">
                          {product.category}
                        </span>
                        <p className="mt-2 text-[9px] text-[#6b625d]">{product.material}</p>
                      </td>
                      <td className="px-3 py-3">
                        <StockBadge product={product} />
                        {product.stock !== null && (
                          <p className="mt-1 text-[9px] text-[#6b625d]">Reserve at {product.reserve} units</p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <p className="font-serif text-base">{formatCurrency(product.price)}</p>
                        <p className="mt-1 text-[9px] uppercase tracking-wider text-[#8b8178]">Tax setup required</p>
                      </td>
                      <td className="px-3 py-3">
                        <Toggle
                          checked={product.published}
                          label={product.published ? 'Preview published' : 'Vault only'}
                          onChange={(published) => updateProduct(product.id, { published })}
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          aria-label={`${product.featured ? 'Remove' : 'Add'} ${product.title} ${product.featured ? 'from' : 'to'} home feature preview`}
                          aria-pressed={product.featured}
                          className={`rounded-full p-2 ${
                            product.featured
                              ? 'bg-[#ffe088]/40 text-[#735c00]'
                              : 'bg-[#f0eee8] text-[#8b8178] hover:text-[#735c00]'
                          }`}
                          onClick={() => updateProduct(product.id, { featured: !product.featured })}
                          title={product.featured ? 'Featured in demo preview' : 'Feature in demo preview'}
                          type="button"
                        >
                          <Star aria-hidden="true" fill={product.featured ? 'currentColor' : 'none'} size={14} />
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            aria-label={`Edit ${product.title}`}
                            className="rounded p-1.5 text-[#6b625d] hover:bg-[#f0eee8] hover:text-[#1c1c18]"
                            onClick={() => openEditProduct(product)}
                            title="Edit product"
                            type="button"
                          >
                            <Pencil aria-hidden="true" size={14} />
                          </button>
                          <button
                            aria-label={`Adjust stock for ${product.title}`}
                            className="rounded p-1.5 text-[#6b625d] hover:bg-[#f0eee8] hover:text-[#1c1c18] disabled:cursor-not-allowed disabled:opacity-40"
                            disabled={product.stock === null}
                            onClick={() => {
                              setStockProduct(product);
                              setStockValue(String(product.stock ?? 0));
                            }}
                            title={product.stock === null ? 'Made-to-order item has no stock quantity' : 'Adjust demo stock'}
                            type="button"
                          >
                            <SlidersHorizontal aria-hidden="true" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td className="px-3 py-10 text-center text-[#6b625d]" colSpan={7}>
                        No sample products match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f6f3ed] px-4 py-3 text-[9px] uppercase tracking-wider text-[#6b625d]">
              <span>
                Showing {filteredProducts.length} of {products.length} sample products · Tax setup requires review
              </span>
              <div className="flex items-center gap-1">
                <button aria-label="Previous page" className="rounded bg-white p-1.5 opacity-40" disabled type="button">
                  <ChevronLeft aria-hidden="true" size={13} />
                </button>
                <span className="rounded bg-[#201b17] px-2.5 py-1.5 text-white">1</span>
                <button aria-label="Next page" className="rounded bg-white p-1.5 opacity-40" disabled type="button">
                  <ChevronRight aria-hidden="true" size={13} />
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <PolicyCard
              label="Provenance preview"
              title={`${products.filter((product) => product.provenance.includes('Kochi')).length} local workshop items`}
              detail="Sample origin values shown here are editable catalog fields, not supplier verification."
            />
            <PolicyCard
              label="Pre-settlement policy"
              title="Store policy not connected"
              detail="Payment and delivery rules are not changed when editing this sample catalog."
            />
            <PolicyCard
              label="Tax configuration"
              title="Review required"
              detail="No tax rate or exemption is assumed. Configure applicable tax rules before publishing real products."
            />
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#6b625d]">
            <span>VELQIRA · Admin product catalog preview</span>
            <Link className="inline-flex items-center gap-1 font-semibold text-[#735c00]" to="/">
              <ArrowLeft aria-hidden="true" size={13} />
              Back to storefront
            </Link>
          </footer>
        </main>
      </div>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-[#201b17]/40 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDrawer();
          }}
        >
          <section
            aria-labelledby="product-drawer-title"
            aria-modal="true"
            className="flex h-full w-full max-w-xl flex-col bg-[#fcf9f3] shadow-2xl"
            role="dialog"
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#e5e2dc] bg-[#f6f3ed] p-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
                  Curation &amp; provenance registry · demo
                </p>
                <h2 className="mt-1 font-serif text-2xl" id="product-drawer-title">
                  {editingId ? 'Edit catalog item' : 'Assign new product'}
                </h2>
                <p className="mt-1 text-xs text-[#6b625d]">
                  Saves to this preview only. No live storefront changes are made.
                </p>
              </div>
              <button
                aria-label="Close product form"
                className="rounded-md p-2 text-[#6b625d] hover:bg-[#e5e2dc]"
                onClick={closeDrawer}
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </header>

            <form className="flex min-h-0 flex-1 flex-col" onSubmit={saveProduct}>
              <div className="flex-1 space-y-6 overflow-y-auto p-5">
                <section className="space-y-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[#6b625d]">
                    1. Product identification &amp; provenance
                  </h3>
                  <FormField label="Product title">
                    <input
                      autoFocus
                      className={inputClass}
                      onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                      placeholder="Enter product title"
                      required
                      value={draft.title}
                    />
                  </FormField>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Category">
                      <select
                        className={inputClass}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, category: event.target.value as ProductCategory }))
                        }
                        value={draft.category}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Workshop / provenance">
                      <input
                        className={inputClass}
                        onChange={(event) => setDraft((current) => ({ ...current, provenance: event.target.value }))}
                        placeholder="Workshop or origin"
                        required
                        value={draft.provenance}
                      />
                    </FormField>
                  </div>
                  <FormField label="Primary material & craft">
                    <input
                      className={inputClass}
                      onChange={(event) => setDraft((current) => ({ ...current, material: event.target.value }))}
                      placeholder="Describe materials"
                      required
                      value={draft.material}
                    />
                  </FormField>
                  <FormField label="Product image (local preview only)">
                    <input
                      accept="image/*"
                      className="block w-full text-xs text-[#6b625d] file:mr-3 file:rounded-md file:border-0 file:bg-[#f0eee8] file:px-3 file:py-2 file:text-xs file:font-medium file:text-[#1c1c18]"
                      onChange={handleImageChange}
                      type="file"
                    />
                    <p className="mt-1 text-[10px] text-[#8b8178]">Images up to 5 MB are previewed locally; not uploaded.</p>
                    {draft.image && (
                      <img alt="Selected product preview" className="mt-2 h-24 w-20 rounded object-cover" src={draft.image} />
                    )}
                  </FormField>
                </section>

                <section className="space-y-4 rounded-lg border border-[#e5e2dc] bg-white p-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[#6b625d]">
                    2. Pricing &amp; tax setup
                  </h3>
                  <FormField label="Retail price (INR)">
                    <input
                      className={inputClass}
                      min="1"
                      onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))}
                      required
                      step="1"
                      type="number"
                      value={draft.price}
                    />
                  </FormField>
                  <div className="rounded-md bg-[#f6f3ed] p-3 text-xs leading-5 text-[#6b625d]">
                    Tax classification is not configured in this preview. Confirm the applicable tax treatment before
                    using a live catalog.
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[#6b625d]">
                    3. Inventory &amp; visibility
                  </h3>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      checked={draft.madeToOrder}
                      className="accent-[#201b17]"
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, madeToOrder: event.target.checked }))
                      }
                      type="checkbox"
                    />
                    Made to order (do not track stock quantity)
                  </label>
                  {!draft.madeToOrder && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField label="Stock allocation">
                        <input
                          className={inputClass}
                          min="0"
                          onChange={(event) => setDraft((current) => ({ ...current, stock: event.target.value }))}
                          required
                          step="1"
                          type="number"
                          value={draft.stock}
                        />
                      </FormField>
                      <FormField label="Low-stock reserve threshold">
                        <input
                          className={inputClass}
                          min="0"
                          onChange={(event) => setDraft((current) => ({ ...current, reserve: event.target.value }))}
                          required
                          step="1"
                          type="number"
                          value={draft.reserve}
                        />
                      </FormField>
                    </div>
                  )}
                  <Toggle
                    checked={draft.published}
                    label="Show as published in preview"
                    onChange={(published) => setDraft((current) => ({ ...current, published }))}
                  />
                  <Toggle
                    checked={draft.featured}
                    label="Feature on home showcase preview"
                    onChange={(featured) => setDraft((current) => ({ ...current, featured }))}
                  />
                </section>
                {notice && (
                  <p aria-live="polite" className="rounded-md bg-[#f0eee8] p-3 text-xs leading-5 text-[#4d4540]" role="status">
                    {notice}
                  </p>
                )}
              </div>

              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e2dc] bg-[#f6f3ed] p-4">
                <button
                  className="rounded-md px-3 py-2 text-xs font-medium text-[#6b625d] hover:bg-[#e5e2dc]"
                  onClick={closeDrawer}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-md bg-[#201b17] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#39312b]"
                  type="submit"
                >
                  <Check aria-hidden="true" size={14} />
                  Save to demo catalog
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {stockProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#201b17]/40 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setStockProduct(null);
          }}
        >
          <section
            aria-labelledby="stock-dialog-title"
            aria-modal="true"
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-2xl"
            role="dialog"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[#735c00]">Demo inventory</p>
                <h2 className="mt-1 font-serif text-xl" id="stock-dialog-title">
                  Adjust stock
                </h2>
                <p className="mt-1 text-xs text-[#6b625d]">{stockProduct.title}</p>
              </div>
              <button
                aria-label="Close stock adjustment"
                className="rounded p-1.5 text-[#6b625d] hover:bg-[#f0eee8]"
                onClick={() => setStockProduct(null)}
                type="button"
              >
                <X aria-hidden="true" size={17} />
              </button>
            </div>
            <form className="space-y-4" onSubmit={saveStock}>
              <FormField label="Available quantity">
                <input
                  autoFocus
                  className={inputClass}
                  min="0"
                  onChange={(event) => setStockValue(event.target.value)}
                  required
                  step="1"
                  type="number"
                  value={stockValue}
                />
              </FormField>
              <p className="text-[10px] leading-4 text-[#6b625d]">
                This only changes the sample row in your current browser session.
              </p>
              <button
                className="w-full rounded-md bg-[#201b17] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#39312b]"
                type="submit"
              >
                Save sample quantity
              </button>
            </form>
          </section>
        </div>
      )}

      {notice && !drawerOpen && !stockProduct && (
        <div
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-[#201b17] px-4 py-3 text-xs text-white shadow-xl"
          role="status"
        >
          <div className="flex items-start justify-between gap-4">
            <span>{notice}</span>
            <button aria-label="Dismiss message" onClick={() => setNotice('')} type="button">
              <X aria-hidden="true" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  'w-full rounded-md border border-[#e5e2dc] bg-white px-3 py-2.5 text-xs text-[#1c1c18] outline-none focus:border-[#735c00] focus:ring-1 focus:ring-[#735c00]';

function AdminProductSidebar() {
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
            <Link aria-current="page" className="flex items-center gap-2 rounded-md bg-[#201b17] px-2.5 py-2 text-[11px] font-semibold text-white" to="/admin/products">
              <PackagePlus aria-hidden="true" size={14} />
              Product Listing
            </Link>
            <Link className={navClass} to="/admin/categories">
              <ImagePlus aria-hidden="true" size={14} />
              Category Image Manager
            </Link>
            <Link className={navClass} to="/admin/products/new">
              <ImagePlus aria-hidden="true" size={14} />
              Assign New Product
            </Link>
            <NavPlaceholder icon={<SlidersHorizontal size={14} />} label="Inventory & Pricing" />
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
            <NavPlaceholder icon={<Truck size={14} />} label="Dispatches" />
          </NavGroup>
        </nav>
      </div>
      <div className="rounded-lg bg-[#ebe8e2] p-3">
        <p className="text-xs font-semibold">Admin preview</p>
        <p className="mt-1 text-[10px] leading-4 text-[#6b625d]">Catalog changes remain local to this demo.</p>
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

function CategoryTab({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`whitespace-nowrap rounded-full px-3 py-2 text-[9px] font-semibold uppercase tracking-wider transition ${
        active ? 'bg-[#201b17] text-white' : 'bg-[#ebe8e2] text-[#4d4540] hover:bg-[#e5e2dc]'
      }`}
      onClick={onClick}
      type="button"
    >
      {label} ({count})
    </button>
  );
}

function MetricPill({ label, value, warning = false }: { label: string; value: number; warning?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-[#f0eee8] px-2 py-1">
      <span className={`h-1.5 w-1.5 rounded-full ${warning && value > 0 ? 'bg-rose-600' : 'bg-[#a98218]'}`} />
      {label}: <strong className="text-[#1c1c18]">{value}</strong>
    </span>
  );
}

function StockBadge({ product }: { product: Product }) {
  if (product.stock === null) {
    return (
      <span className="inline-flex rounded-sm bg-[#ebe8e2] px-2 py-1 text-[9px] font-semibold uppercase text-[#6b625d]">
        Made to order
      </span>
    );
  }
  if (isLowStock(product)) {
    return (
      <span className="inline-flex rounded-sm bg-rose-50 px-2 py-1 text-[9px] font-semibold uppercase text-rose-800">
        Low stock · {product.stock}
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-sm bg-[#f0eee8] px-2 py-1 text-[9px] font-semibold uppercase text-[#735c00]">
      In stock · {product.stock}
    </span>
  );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input
        checked={checked}
        className="peer sr-only"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 rounded-full transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#735c00] ${
          checked ? 'bg-[#201b17]' : 'bg-[#d0c4be]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-wider text-[#4d4540]">{label}</span>
    </label>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4d4540]">{label}</span>
      {children}
    </label>
  );
}

function PolicyCard({ label, title, detail }: { label: string; title: string; detail: string }) {
  return (
    <article className="rounded-lg border border-[#e5e2dc] bg-white p-4">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-[#735c00]">{label}</p>
      <h2 className="mt-2 font-serif text-lg">{title}</h2>
      <p className="mt-2 text-[10px] leading-5 text-[#6b625d]">{detail}</p>
    </article>
  );
}

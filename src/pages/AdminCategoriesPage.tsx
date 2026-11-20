import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import {
  Bell,
  Check,
  Eye,
  ImagePlus,
  LayoutDashboard,
  LockKeyhole,
  PackagePlus,
  Palette,
  Pencil,
  Search,
  SlidersHorizontal,
  Truck,
  Upload,
  Wallet,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryAsset {
  id: string;
  title: string;
  description: string;
  primaryImage: string;
  detailImage: string;
  editorialImage: string;
  productCount: number;
  visible: boolean;
}

type CategoryAssetDraft = Omit<CategoryAsset, 'id' | 'productCount'>;
type AssetImageField = 'primaryImage' | 'detailImage' | 'editorialImage';
type VisibilityFilter = 'all' | 'visible' | 'draft';

const initialCategoryAssets: CategoryAsset[] = [
  {
    id: 'category-adornments',
    title: 'Adornments & Jewelry',
    description: 'Sculptural adornments shaped by independent atelier craft.',
    primaryImage: '/images/jewellery-necklace-1.jpg',
    detailImage: '/images/jewellery-necklace-2.jpg',
    editorialImage: '/images/jewellery-necklace-3.jpg',
    productCount: 2,
    visible: true,
  },
  {
    id: 'category-ceramics',
    title: 'Ceramics & Vessels',
    description: 'Hand-thrown forms, ash glazes, and tactile table objects.',
    primaryImage: '/images/hero-slide-3-showcase.jpg',
    detailImage: '/images/hero-slide-4-showcase.jpg',
    editorialImage: '/images/why-choose-velqira.jpg',
    productCount: 1,
    visible: true,
  },
  {
    id: 'category-olfactory',
    title: 'Olfactory & Scents',
    description: 'Atmospheric objects and small-batch sensory rituals.',
    primaryImage: '/images/hero-slide-4-showcase.jpg',
    detailImage: '/images/velqira-editorial-silk.jpeg',
    editorialImage: '/images/velqira-silk-banner.jpg',
    productCount: 1,
    visible: true,
  },
  {
    id: 'category-objets',
    title: "Objets d'Art",
    description: 'Rare decorative pieces and collected studio editions.',
    primaryImage: '/images/hero-slide-1-wide.jpg',
    detailImage: '/images/why-choose-velqira.jpg',
    editorialImage: '/images/velqira-editorial-silk.jpeg',
    productCount: 0,
    visible: false,
  },
];

const emptyDraft = (): CategoryAssetDraft => ({
  title: '',
  description: '',
  primaryImage: '',
  detailImage: '',
  editorialImage: '',
  visible: false,
});

export function AdminCategoriesPage() {
  const [assets, setAssets] = useState(initialCategoryAssets);
  const [query, setQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CategoryAssetDraft>(emptyDraft);
  const [selectedPreview, setSelectedPreview] = useState<CategoryAsset | null>(null);
  const [notice, setNotice] = useState('');

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && asset.visible) ||
        (visibilityFilter === 'draft' && !asset.visible);
      const searchableFields = [asset.title, asset.description];
      return (
        matchesVisibility &&
        (!normalizedQuery || searchableFields.some((value) => value.toLowerCase().includes(normalizedQuery)))
      );
    });
  }, [assets, query, visibilityFilter]);

  useEffect(() => {
    if (!drawerOpen && !selectedPreview) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
        setSelectedPreview(null);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [drawerOpen, selectedPreview]);

  const openNewAsset = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setNotice('');
    setDrawerOpen(true);
  };

  const openEditAsset = (asset: CategoryAsset) => {
    setEditingId(asset.id);
    setNotice('');
    setDraft({
      title: asset.title,
      description: asset.description,
      primaryImage: asset.primaryImage,
      detailImage: asset.detailImage,
      editorialImage: asset.editorialImage,
      visible: asset.visible,
    });
    setDrawerOpen(true);
  };

  const handleImageChange = (field: AssetImageField, event: ChangeEvent<HTMLInputElement>) => {
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
        setDraft((current) => ({ ...current, [field]: image }));
        setNotice('Image preview added locally. It has not been uploaded.');
      }
    };
    reader.onerror = () => setNotice('Could not read the selected image.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const saveAsset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      setNotice('Enter a category title before saving the visual asset.');
      return;
    }
    if (!draft.primaryImage) {
      setNotice('Add a primary card image before saving.');
      return;
    }

    const normalizedDraft = { ...draft, title: draft.title.trim(), description: draft.description.trim() };
    if (editingId) {
      setAssets((current) =>
        current.map((asset) => (asset.id === editingId ? { ...asset, ...normalizedDraft } : asset)),
      );
    } else {
      setAssets((current) => [
        {
          ...normalizedDraft,
          id: `demo-category-${Date.now()}`,
          productCount: 0,
        },
        ...current,
      ]);
    }

    setDrawerOpen(false);
    setNotice('Category artwork saved in this preview only. No live category or storefront was changed.');
  };

  const toggleVisibility = (asset: CategoryAsset) => {
    setAssets((current) =>
      current.map((item) => (item.id === asset.id ? { ...item, visible: !item.visible } : item)),
    );
    setNotice('Preview visibility updated locally. The live storefront was not changed.');
  };

  const clearDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f3] text-[#1c1c18]">
      <AdminCategoriesSidebar />

      <div className="min-h-screen md:pl-52 xl:pl-64">
        <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#e5e2dc] bg-[#fcf9f3]/95 px-4 py-3 backdrop-blur md:px-5">
          <label className="relative min-w-[220px] flex-1 md:max-w-sm">
            <span className="sr-only">Search category artwork</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8178]" size={15} />
            <input
              className="w-full rounded-md border border-[#e5e2dc] bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-[#735c00]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search category names or card copy..."
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
              className="inline-flex items-center gap-1.5 rounded-md bg-[#201b17] px-3 py-2 text-[11px] font-medium text-white hover:bg-[#39312b]"
              onClick={openNewAsset}
              type="button"
            >
              <ImagePlus aria-hidden="true" size={14} />
              Add Category Artwork
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

        <main className="mx-auto max-w-[1400px] space-y-5 p-4 md:p-6 xl:p-8">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div className="max-w-3xl">
              <p className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a98218]" />
                Kochi sanctuary curation <span className="text-[#c7bfb6]">/</span> Category visual assets
              </p>
              <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">
                Category Visual Assets &amp; Editorial Card Art
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b625d]">
                Add and edit the artwork, detail imagery, and editorial cards used in the category preview.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-[#f0eee8] px-3 py-2.5 text-xs font-medium hover:bg-[#e5e2dc]"
                to="/admin/products"
              >
                <PackagePlus aria-hidden="true" size={14} />
                Product catalog
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-[#201b17] px-3 py-2.5 text-xs font-medium text-white hover:bg-[#39312b]"
                to="/admin/products/new"
              >
                <ImagePlus aria-hidden="true" size={14} />
                Assign New Product
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-md border border-[#eadfbf] bg-[#fff9e8] px-3 py-2.5 text-[10px] leading-4 text-[#6b625d]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#a98218]" />
            <span>
              <strong className="text-[#4d4540]">Preview-only asset manager.</strong> Uploaded images and visibility
              changes stay on this page until you leave or reload; they are not published or connected to product categories.
            </span>
          </div>

          <section aria-label="Category image assets" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FilterButton
                  active={visibilityFilter === 'all'}
                  label="All assets"
                  onClick={() => setVisibilityFilter('all')}
                  total={assets.length}
                />
                <FilterButton
                  active={visibilityFilter === 'visible'}
                  label="Visible in preview"
                  onClick={() => setVisibilityFilter('visible')}
                  total={assets.filter((asset) => asset.visible).length}
                />
                <FilterButton
                  active={visibilityFilter === 'draft'}
                  label="Draft"
                  onClick={() => setVisibilityFilter('draft')}
                  total={assets.filter((asset) => !asset.visible).length}
                />
              </div>
              <span className="text-[9px] text-[#8b8178]">
                Showing {filteredAssets.length} of {assets.length} sample category sets
              </span>
            </div>

            {filteredAssets.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {filteredAssets.map((asset) => (
                  <CategoryAssetCard
                    asset={asset}
                    key={asset.id}
                    onEdit={() => openEditAsset(asset)}
                    onPreview={() => setSelectedPreview(asset)}
                    onToggleVisibility={() => toggleVisibility(asset)}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-[#e5e2dc] bg-white p-6 text-sm text-[#6b625d]">
                No category assets match the current search or visibility filter.
              </p>
            )}
          </section>

          {notice && !drawerOpen && !selectedPreview && (
            <p aria-live="polite" className="flex items-start gap-2 rounded-lg bg-[#f0eee8] p-3 text-[10px] leading-4 text-[#4d4540]" role="status">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#735c00]" />
              <span>{notice}</span>
              <button aria-label="Dismiss message" className="ml-auto" onClick={() => setNotice('')} type="button">
                <X aria-hidden="true" size={13} />
              </button>
            </p>
          )}

          <footer className="flex flex-wrap justify-between gap-2 border-t border-[#e5e2dc] py-3 text-[8px] uppercase tracking-wider text-[#8b8178]">
            <span>VELQIRA · Category artwork preview</span>
            <span>Images are local previews · No live category changes</span>
          </footer>
        </main>
      </div>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-[#201b17]/45 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) clearDrawer();
          }}
        >
          <section
            aria-labelledby="category-asset-title"
            aria-modal="true"
            className="flex h-full w-full max-w-[580px] flex-col overflow-y-auto bg-[#fcf9f3] shadow-2xl"
            role="dialog"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#e5e2dc] bg-[#fcf9f3]/95 p-5 backdrop-blur">
              <div>
                <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#735c00]">
                  Kochi sanctuary curation &amp; provenance registry
                </p>
                <h2 className="font-serif text-xl leading-6" id="category-asset-title">
                  {editingId ? 'Edit Category Visual Assets' : 'Add Category Visual Assets'}
                </h2>
                <p className="mt-1 text-[9px] leading-4 text-[#6b625d]">
                  Artwork previews remain local; no category or storefront is updated.
                </p>
              </div>
              <button
                aria-label="Close category asset form"
                className="rounded-md p-1 text-[#6b625d] hover:bg-[#f0eee8]"
                onClick={clearDrawer}
                type="button"
              >
                <X aria-hidden="true" size={17} />
              </button>
            </header>

            <form className="flex flex-1 flex-col" onSubmit={saveAsset}>
              <div className="flex-1 space-y-5 p-5">
                <section className="space-y-3">
                  <SectionHeading number="01" title="Category identity & card copy" />
                  <Field label="Category name">
                    <input
                      autoFocus
                      className={inputClass}
                      maxLength={54}
                      onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                      placeholder="e.g. Studio Ceramics"
                      required
                      value={draft.title}
                    />
                  </Field>
                  <Field label="Editorial card description">
                    <textarea
                      className={`${inputClass} min-h-20 resize-y`}
                      maxLength={150}
                      onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                      placeholder="A short introduction for the category card"
                      value={draft.description}
                    />
                    <span className="mt-1 block text-[8px] text-[#8b8178]">{draft.description.length}/150 characters</span>
                  </Field>
                </section>

                <section className="space-y-3">
                  <SectionHeading number="02" title="Category image set" />
                  <div className="grid grid-cols-3 gap-2">
                    <ImageSlot
                      description="Main category card"
                      field="primaryImage"
                      image={draft.primaryImage}
                      label="01 Primary"
                      onChange={handleImageChange}
                      required
                    />
                    <ImageSlot
                      description="Product/detail view"
                      field="detailImage"
                      image={draft.detailImage}
                      label="02 Detail"
                      onChange={handleImageChange}
                    />
                    <ImageSlot
                      description="Editorial card"
                      field="editorialImage"
                      image={draft.editorialImage}
                      label="03 Editorial"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="text-[8px] leading-4 text-[#8b8178]">
                    Image files up to 5 MB are previewed locally and are not uploaded.
                  </p>
                </section>

                <section className="flex items-center justify-between gap-4 rounded-md bg-[#f0eee8] p-3">
                  <div>
                    <p className="text-[10px] font-semibold">Show category card in preview</p>
                    <p className="mt-1 text-[8px] leading-4 text-[#6b625d]">
                      This toggle does not publish to the customer storefront.
                    </p>
                  </div>
                  <button
                    aria-checked={draft.visible}
                    aria-label="Show category card in preview"
                    className={`relative h-5 w-10 shrink-0 rounded-full transition ${
                      draft.visible ? 'bg-[#201b17]' : 'bg-[#d5d0c8]'
                    }`}
                    onClick={() => setDraft((current) => ({ ...current, visible: !current.visible }))}
                    role="switch"
                    type="button"
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                        draft.visible ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </section>
              </div>

              {notice && (
                <p aria-live="polite" className="mx-5 mb-4 rounded-md bg-[#f0eee8] p-3 text-[9px] leading-4 text-[#4d4540]" role="status">
                  {notice}
                </p>
              )}

              <footer className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-[#e5e2dc] bg-[#fcf9f3] p-4">
                <button
                  className="text-[10px] font-medium text-[#6b625d] hover:text-[#201b17]"
                  onClick={clearDrawer}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-md bg-[#201b17] px-4 py-2.5 text-[10px] font-semibold text-white hover:bg-[#39312b]"
                  type="submit"
                >
                  <Check aria-hidden="true" size={13} />
                  {editingId ? 'Save Category Artwork' : 'Add Category Artwork'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {selectedPreview && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#201b17]/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedPreview(null);
          }}
        >
          <section
            aria-labelledby="category-preview-title"
            aria-modal="true"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-[#e5e2dc] bg-[#fcf9f3] shadow-2xl"
            role="dialog"
          >
            <header className="flex items-start justify-between gap-4 p-4">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-wider text-[#735c00]">Category card preview</p>
                <h2 className="mt-1 font-serif text-xl" id="category-preview-title">{selectedPreview.title}</h2>
              </div>
              <button
                aria-label="Close category preview"
                className="rounded-md p-1 text-[#6b625d] hover:bg-[#f0eee8]"
                onClick={() => setSelectedPreview(null)}
                type="button"
              >
                <X aria-hidden="true" size={16} />
              </button>
            </header>
            <div className="grid gap-3 p-4 pt-0 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-[#eee8dc]">
                <img alt="" className="aspect-[4/5] h-full w-full object-cover" src={selectedPreview.primaryImage} />
              </div>
              <div className="flex flex-col justify-between gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-[#8b8178]">Shop the edit</p>
                  <h3 className="mt-2 font-serif text-2xl">{selectedPreview.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#6b625d]">{selectedPreview.description}</p>
                </div>
                {selectedPreview.editorialImage && (
                  <img
                    alt=""
                    className="aspect-[16/9] w-full rounded-md object-cover"
                    src={selectedPreview.editorialImage}
                  />
                )}
                <p className="rounded-md bg-[#f0eee8] p-2 text-[8px] leading-4 text-[#6b625d]">
                  Preview only · This artwork is not published to the live storefront.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function AdminCategoriesSidebar() {
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
            <Link className={navClass} to="/admin/products/new">
              <ImagePlus aria-hidden="true" size={14} />
              Assign New Product
            </Link>
            <span aria-current="page" className="flex items-center gap-2 rounded-md bg-[#201b17] px-2.5 py-2 text-[11px] font-semibold text-white">
              <Palette aria-hidden="true" size={14} />
              Category Image Manager
            </span>
          </NavGroup>
          <NavGroup label="Storefront Customizer">
            <Link className={navClass} to="/admin/customizer">
              <SlidersHorizontal aria-hidden="true" size={14} />
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
        <p className="mt-1 text-[10px] leading-4 text-[#6b625d]">Category images are local previews in this demo.</p>
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

function CategoryAssetCard({
  asset,
  onEdit,
  onPreview,
  onToggleVisibility,
}: {
  asset: CategoryAsset;
  onEdit: () => void;
  onPreview: () => void;
  onToggleVisibility: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#e5e2dc] bg-white shadow-sm">
      <div className="relative">
        <img alt="" className="aspect-[16/8] w-full bg-[#eee8dc] object-cover" src={asset.primaryImage} />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider ${
            asset.visible ? 'bg-[#fcf9f3]/95 text-[#4d6549]' : 'bg-[#fcf9f3]/95 text-[#8b8178]'
          }`}
        >
          {asset.visible ? 'Visible in preview' : 'Draft / hidden'}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg leading-6">{asset.title}</h2>
            <p className="mt-1 text-[9px] leading-4 text-[#6b625d]">{asset.description || 'No editorial copy yet.'}</p>
          </div>
          <span className="shrink-0 rounded-md bg-[#f0eee8] px-2 py-1 text-[8px] font-semibold text-[#6b625d]">
            {asset.productCount} sample {asset.productCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <ImageThumbnail image={asset.primaryImage} label="Primary" />
          <ImageThumbnail image={asset.detailImage} label="Detail" />
          <ImageThumbnail image={asset.editorialImage} label="Editorial" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#eee9df] pt-3">
          <button
            aria-pressed={asset.visible}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[9px] font-medium ${
              asset.visible ? 'bg-[#f0eee8] text-[#4d4540]' : 'bg-[#ebe8e2] text-[#6b625d]'
            }`}
            onClick={onToggleVisibility}
            type="button"
          >
            {asset.visible ? <Eye aria-hidden="true" size={12} /> : <Eye aria-hidden="true" size={12} />}
            {asset.visible ? 'Hide from preview' : 'Show in preview'}
          </button>
          <div className="flex items-center gap-1.5">
            <button
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[9px] font-medium text-[#6b625d] hover:bg-[#f0eee8]"
              onClick={onPreview}
              type="button"
            >
              <Eye aria-hidden="true" size={12} />
              Preview
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-md bg-[#201b17] px-2.5 py-2 text-[9px] font-medium text-white hover:bg-[#39312b]"
              onClick={onEdit}
              type="button"
            >
              <Pencil aria-hidden="true" size={11} />
              Edit
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ImageThumbnail({ image, label }: { image: string; label: string }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-[#e5e2dc] bg-[#f0eee8]">
      {image ? (
        <img alt="" className="aspect-[4/3] w-full object-cover" src={image} />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center text-[#8b8178]">
          <ImagePlus aria-hidden="true" size={17} />
        </div>
      )}
      <span className="absolute left-1.5 top-1.5 rounded bg-[#fcf9f3]/90 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function ImageSlot({
  description,
  field,
  image,
  label,
  onChange,
  required = false,
}: {
  description: string;
  field: AssetImageField;
  image: string;
  label: string;
  onChange: (field: AssetImageField, event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  const id = `category-image-${field}`;
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wider text-[#6b625d]">
        {label}{required ? ' · Required' : ''}
      </p>
      <div className="relative overflow-hidden rounded-md border border-dashed border-[#cfc9bd] bg-white">
        {image ? (
          <img alt="" className="aspect-[4/3] w-full object-cover" src={image} />
        ) : (
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1 text-[#8b8178]">
            <ImagePlus aria-hidden="true" size={18} />
            <span className="text-[7px] uppercase tracking-wide">Add image</span>
          </div>
        )}
        <label
          className="absolute inset-0 flex cursor-pointer items-end justify-center bg-gradient-to-t from-[#201b17]/55 to-transparent p-2 text-white opacity-0 transition hover:opacity-100 focus-within:opacity-100"
          htmlFor={id}
        >
          <span className="inline-flex items-center gap-1 rounded bg-[#201b17]/75 px-2 py-1 text-[7px] font-semibold uppercase">
            <Upload aria-hidden="true" size={9} />
            Choose file
          </span>
          <input
            accept="image/*"
            className="sr-only"
            id={id}
            onChange={(event) => onChange(field, event)}
            type="file"
          />
        </label>
      </div>
      <p className="mt-1 truncate text-[7px] text-[#8b8178]">{description}</p>
    </div>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[8px] font-semibold uppercase tracking-wider text-[#6b625d]">{label}</span>
      {children}
    </label>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <h3 className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-[#6b625d]">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f0eee8] text-[8px] text-[#735c00]">
        {number}
      </span>
      {title}
    </h3>
  );
}

function FilterButton({
  active,
  label,
  onClick,
  total,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  total: number;
}) {
  return (
    <button
      aria-pressed={active}
      className={`whitespace-nowrap rounded-full px-3 py-2 text-[8px] font-semibold uppercase tracking-wider transition ${
        active ? 'bg-[#201b17] text-white' : 'bg-white text-[#4d4540] hover:bg-[#f0eee8]'
      }`}
      onClick={onClick}
      type="button"
    >
      {label} ({total})
    </button>
  );
}

const inputClass =
  'w-full rounded-md border border-[#e5e2dc] bg-white px-3 py-2.5 text-xs text-[#1c1c18] outline-none focus:border-[#735c00] focus:ring-1 focus:ring-[#735c00]';

import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPassword('');
    setStatus('Admin sign-in is not configured yet. No credentials were sent or stored.');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fcf9f3] px-4 py-10 text-[#1c1c18]">
      <section className="w-full max-w-md">
        <header className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f0eee8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4d4540]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#735c00]" />
            VELQIRA • ADMIN ACCESS
          </div>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#201b17] text-[#ffe088]">
            <ShieldCheck aria-hidden="true" size={24} />
          </div>
          <h1 className="font-serif text-2xl">Studio Manager &amp; Owner Gateway</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[#4d4540]">
            Sign in to manage your storefront. Access is available only through a configured
            authentication service.
          </p>
        </header>

        <form
          className="space-y-5 rounded-2xl border border-[#e5e2dc] bg-white p-6 shadow-lg"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#4d4540]" htmlFor="admin-email">
              Admin email
            </label>
            <input
              autoComplete="username"
              className="w-full rounded-lg bg-[#f6f3ed] px-3 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#735c00]"
              id="admin-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
              type="email"
              value={email}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#4d4540]" htmlFor="admin-password">
              Password
            </label>
            <div className="relative">
              <input
                autoComplete="current-password"
                className="w-full rounded-lg bg-[#f6f3ed] px-3 py-3 pr-12 text-sm outline-none transition focus:ring-2 focus:ring-[#735c00]"
                id="admin-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#4d4540] hover:text-[#735c00]"
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
              </button>
            </div>
          </div>

          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#201b17] px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#39312b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#735c00]"
            type="submit"
          >
            <LockKeyhole aria-hidden="true" size={16} />
            Sign in
          </button>

          {status && (
            <p aria-live="polite" className="rounded-lg bg-[#f6f3ed] p-3 text-sm text-[#4d4540]" role="status">
              {status}
            </p>
          )}

          <p className="text-center text-xs leading-5 text-[#6b625d]">
            Need access or a password reset? Contact your site administrator.
          </p>
          <p className="text-center text-xs">
            <Link className="font-medium text-[#735c00] underline-offset-4 hover:underline" to="/admin/dashboard">
              Preview operations dashboard (sample data)
            </Link>
          </p>
          <p className="text-center text-xs">
            <Link className="font-medium text-[#735c00] underline-offset-4 hover:underline" to="/admin/settlements">
              Preview settlement dashboard (sample data)
            </Link>
          </p>
          <p className="text-center text-xs">
            <Link className="font-medium text-[#735c00] underline-offset-4 hover:underline" to="/admin/products">
              Preview product catalog (sample data)
            </Link>
          </p>
          <p className="text-center text-xs">
            <Link className="font-medium text-[#735c00] underline-offset-4 hover:underline" to="/admin/customizer">
              Preview customer screen customizer
            </Link>
          </p>
          <p className="text-center text-xs">
            <Link className="font-medium text-[#735c00] underline-offset-4 hover:underline" to="/admin/categories">
              Preview category image manager
            </Link>
          </p>
          <p className="text-center text-xs">
            <Link className="font-medium text-[#735c00] underline-offset-4 hover:underline" to="/admin/hero">
              Preview hero and banner manager
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link className="font-medium text-[#735c00] underline-offset-4 hover:underline" to="/">
            Return to the storefront
          </Link>
        </p>
      </section>
    </main>
  );
}

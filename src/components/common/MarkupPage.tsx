import { useLayoutEffect, useMemo } from 'react';

interface MarkupPageProps {
  markup: string;
}

export function MarkupPage({ markup }: MarkupPageProps) {
  const pageDocument = useMemo(
    () => {
      const parsedDocument = new DOMParser().parseFromString(markup, 'text/html');
      const hero = parsedDocument.querySelector<HTMLElement>('#hero-slider');
      const adminPortalButton = Array.from(parsedDocument.querySelectorAll('footer button')).find(
        (button) => button.textContent?.includes('Admin Portal Login'),
      );

      if (adminPortalButton) {
        const adminPortalLink = parsedDocument.createElement('a');
        adminPortalLink.href = '/admin';
        adminPortalLink.className = adminPortalButton.className;
        adminPortalLink.innerHTML = adminPortalButton.innerHTML;
        adminPortalButton.replaceWith(adminPortalLink);
      }

      if (hero) {
        hero.children.item(1)?.remove();
        hero
          .querySelector('#btn-toggle-transition')
          ?.parentElement?.parentElement?.parentElement?.remove();
        hero.querySelector('.slide-tab')?.parentElement?.remove();
        hero.querySelectorAll('[onclick]').forEach((element) => {
          element.removeAttribute('onclick');
        });
        hero.querySelectorAll<HTMLElement>('.hero-slide').forEach((slide) => {
          slide.classList.replace('duration-700', 'duration-500');
        });
      }

      return parsedDocument;
    },
    [markup],
  );

  useLayoutEffect(() => {
    const hero = document.querySelector<HTMLElement>('#hero-slider');
    if (!hero) return;

    const slides = Array.from(hero.querySelectorAll<HTMLElement>('.hero-slide'));
    const captions = Array.from(hero.querySelectorAll<HTMLElement>('.slide-caption'));
    const dots = Array.from(hero.querySelectorAll<HTMLButtonElement>('.slide-dot'));
    const previousButton = hero.querySelector<HTMLButtonElement>('[aria-label="Previous slide"]');
    const nextButton = hero.querySelector<HTMLButtonElement>('[aria-label="Next slide"]');
    if (slides.length === 0) return;

    let activeSlide = 0;
    const showSlide = (index: number) => {
      activeSlide = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeSlide;
        slide.classList.toggle('opacity-100', isActive);
        slide.classList.toggle('opacity-0', !isActive);
        slide.classList.toggle('pointer-events-none', !isActive);
        slide.classList.toggle('z-10', isActive);
        slide.classList.toggle('z-0', !isActive);
      });

      captions.forEach((caption, captionIndex) => {
        const isActive = captionIndex === activeSlide;
        caption.classList.toggle('hidden', !isActive);
        caption.classList.toggle('block', isActive);
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeSlide;
        dot.classList.toggle('w-8', isActive);
        dot.classList.toggle('w-2', !isActive);
        dot.classList.toggle('bg-secondary-fixed', isActive);
        dot.classList.toggle('bg-surface/40', !isActive);
        if (isActive) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    };

    const showPrevious = () => showSlide(activeSlide - 1);
    const showNext = () => showSlide(activeSlide + 1);
    previousButton?.addEventListener('click', showPrevious);
    nextButton?.addEventListener('click', showNext);

    const dotHandlers = dots.map((dot, index) => {
      const handler = () => showSlide(index);
      dot.addEventListener('click', handler);
      return handler;
    });

    showSlide(0);
    const interval = Number(hero.dataset.interval);
    const autoplay =
      Number.isFinite(interval) &&
      interval > 0 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? window.setInterval(showNext, interval)
        : undefined;

    return () => {
      previousButton?.removeEventListener('click', showPrevious);
      nextButton?.removeEventListener('click', showNext);
      dots.forEach((dot, index) => dot.removeEventListener('click', dotHandlers[index]));
      if (autoplay !== undefined) window.clearInterval(autoplay);
    };
  }, [pageDocument]);

  useLayoutEffect(() => {
    const previousTitle = document.title;
    const previousBodyClass = document.body.className;
    const injectedElements: HTMLElement[] = [];

    document.title = pageDocument.title || previousTitle;
    document.body.className = pageDocument.body.className;
    if (/\/collections(?:\.html)?$/.test(window.location.pathname)) {
      document.body.classList.add('collections-theme');
    }

    for (const element of pageDocument.head.querySelectorAll(
      'link[rel="preconnect"], link[rel="stylesheet"], style',
    )) {
      const clone = element.cloneNode(true) as HTMLElement;
      document.head.append(clone);
      injectedElements.push(clone);
    }

    let active = true;
    const initializePage = async () => {
      for (const source of pageDocument.body.querySelectorAll('script')) {
        const script = document.createElement('script');
        for (const attribute of source.attributes) {
          script.setAttribute(attribute.name, attribute.value);
        }
        script.textContent = source.textContent;
        document.body.append(script);
        injectedElements.push(script);
      }

      if (!active) return;
      document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
      window.dispatchEvent(new Event('load'));
    };

    void initializePage().catch((error: unknown) => {
      console.error('Failed to initialize the current storefront page.', error);
    });

    return () => {
      active = false;
      for (const element of injectedElements) element.remove();
      document.title = previousTitle;
      document.body.className = previousBodyClass;
    };
  }, [pageDocument]);

  return <div dangerouslySetInnerHTML={{ __html: pageDocument.body.innerHTML }} />;
}

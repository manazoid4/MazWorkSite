'use client';

import Image from 'next/image';
import { TOUCH_PRICING, type TouchBundleId } from './touch-config';
import { useTouchSelection } from './touch-selection';

function moveToPersonalisation() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('personalise')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  document.getElementById('personalise-title')?.focus({ preventScroll: true });
}

export function TouchCollection() {
  const { interactive, submitState, bundleId, selectBundle } = useTouchSelection();

  function personalise(id: TouchBundleId) {
    selectBundle(id);
    window.setTimeout(moveToPersonalisation, 0);
  }

  return (
    <section className="objects-section objects-collection" id="collection" aria-labelledby="collection-title">
      <header className="objects-section-heading">
        <p className="objects-kicker">Three simple choices</p>
        <h2 id="collection-title">Choose your Touch.</h2>
      </header>

      <div className="objects-bundle-list">
        {TOUCH_PRICING.bundles.map((bundle, index) => (
          <article className={`objects-bundle ${interactive && bundleId === bundle.id ? 'is-selected' : ''}`} key={bundle.id} aria-labelledby={`${bundle.id}-title`}>
            <div className="objects-bundle-number" aria-hidden="true">0{index + 1}</div>
            <figure className="objects-bundle-visual">
              <Image src={bundle.image} alt={bundle.imageAlt} width={bundle.imageWidth} height={bundle.imageHeight} sizes="(max-width: 760px) 100vw, 48vw" unoptimized />
              <figcaption>Illustrative sketch</figcaption>
            </figure>
            <div className="objects-bundle-copy">
              <div className="objects-bundle-title">
                <div><p>Touch / {index + 1}</p><h3 id={`${bundle.id}-title`}>{bundle.name}</h3></div>
                <div className="objects-bundle-price"><strong>£{bundle.basePrice}</strong><small>With your artwork £{bundle.basePrice + TOUCH_PRICING.artworkAddOnPrice}</small></div>
              </div>
              <p className="objects-bundle-short">{bundle.short}</p>
              <ul>{bundle.contents.map((item) => <li key={item}>{item}</li>)}</ul>
              <button className="objects-button objects-button-dark" type="button" hidden={!interactive} disabled={submitState === 'sending'} onClick={() => personalise(bundle.id)} aria-pressed={bundleId === bundle.id}>
                Choose {bundle.name}
              </button>
              <a className="objects-button objects-button-dark" href="#personalise" hidden={interactive}>Choose in the enquiry form</a>
            </div>
          </article>
        ))}
      </div>

      <p className="objects-name-note">Examples show my name. Yours goes in that spot.</p>

      <aside className="objects-artwork-note">
        <span>Optional +£10</span>
        <p><strong>Add your logo or supplied artwork.</strong> One design across the bundle, with one proof. Redrawing is quoted first.</p>
      </aside>
    </section>
  );
}

import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Read Markdown. <span className={styles.highlight}>Faster.</span></h1>
        <p className="hero__subtitle">A high-performance native desktop reader for your technical docs.</p>
        
        <div className={styles.downloadWrapper}>
          <div className={styles.osIcons}>
             <img width="48" height="48" src="https://icons8.com" alt="Windows 11"/>
             <img width="48" height="48" src="https://icons8.com" alt="mac os"/>
             <img width="48" height="48" src="https://icons8.com" alt="linux"/>
          </div>
          <button className={clsx('button button--secondary button--lg', styles.ctaBtn)}>
            Download Now
          </button>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Car } from '@/lib/api';
import styles from './CarCard.module.css';

export default function CarCard({ car }: { car: Car }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={car.img}
          alt={`${car.brand} ${car.model}`}
          fill
          className={styles.image}
          sizes="(max-width: 1280px) 25vw"
        />
        <button
          className={styles.heart}
          onClick={() => setLiked((prev) => !prev)}
          aria-label="Add to favorites"
        >
          {liked ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.99978 1.31405C12.4378 -3.24795 23.5338 4.73505 7.99978 15.0001C-7.53422 4.73605 3.56178 -3.24795 7.99978 1.31405Z" fill="#3470FF" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.9999 2.74805L7.2829 2.01105C5.5999 0.281049 2.5139 0.878049 1.39989 3.05305C0.876895 4.07605 0.758895 5.55305 1.71389 7.43805C2.63389 9.25305 4.5479 11.427 7.9999 13.795C11.4519 11.427 13.3649 9.25305 14.2859 7.43805C15.2409 5.55205 15.1239 4.07605 14.5999 3.05305C13.4859 0.878049 10.3999 0.280049 8.7169 2.01005L7.9999 2.74805ZM7.9999 15C-7.33311 4.86805 3.27889 -3.03995 7.82389 1.14305C7.88389 1.19838 7.94256 1.25538 7.9999 1.31405C8.05623 1.25501 8.11494 1.1983 8.17589 1.14405C12.7199 -3.04195 23.3329 4.86705 7.9999 15Z" fill="#F2F4F7" />
            </svg>
          )}
        </button>
      </div>
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <span className={styles.title}>
            {car.brand} <span className={styles.blue}>{car.model}</span>, {car.year}
          </span>
          <span className={styles.price}>${car.rentalPrice}</span>
        </div>
        <div className={styles.tags}>
          <span>{car.location.city}</span>
          <span>{car.location.country}</span>
          <span>{car.rentalCompany}</span>
          <span>{car.type}</span>
          <span>{car.mileage.toLocaleString()} km</span>
        </div>
      </div>
      <Link href={`/catalog/${car.id}`} target="_blank" className={styles.btn}>
        Read more
      </Link>
    </div>
  );
}
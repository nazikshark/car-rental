'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Filters.module.css';

const PRICES = [30, 40, 50, 60, 70, 80];

const ArrowIcon = ({ open }: { open: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M3.14689 6.14689C3.19334 6.10033 3.24852 6.06339 3.30926 6.03818C3.37001 6.01297 3.43513 6 3.50089 6C3.56666 6 3.63178 6.01297 3.69253 6.03818C3.75327 6.06339 3.80845 6.10033 3.85489 6.14689L9.50089 11.7939L15.1469 6.14689C15.1934 6.10041 15.2486 6.06353 15.3093 6.03837C15.37 6.01321 15.4352 6.00026 15.5009 6.00026C15.5666 6.00026 15.6317 6.01321 15.6925 6.03837C15.7532 6.06353 15.8084 6.10041 15.8549 6.14689C15.9014 6.19338 15.9383 6.24857 15.9634 6.30931C15.9886 6.37005 16.0015 6.43515 16.0015 6.50089C16.0015 6.56664 15.9886 6.63174 15.9634 6.69248C15.9383 6.75322 15.9014 6.80841 15.8549 6.85489L9.85489 12.8549C9.80845 12.9015 9.75327 12.9384 9.69253 12.9636C9.63178 12.9888 9.56666 13.0018 9.50089 13.0018C9.43513 13.0018 9.37001 12.9888 9.30926 12.9636C9.24852 12.9384 9.19334 12.9015 9.14689 12.8549L3.14689 6.85489C3.10033 6.80845 3.06339 6.75327 3.03818 6.69253C3.01297 6.63178 3 6.56666 3 6.50089C3 6.43513 3.01297 6.37001 3.03818 6.30926C3.06339 6.24851 3.10033 6.19334 3.14689 6.14689Z" fill="#101828" />
  </svg>
);

interface DropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  formatOption?: (val: string) => string;
}

function Dropdown({ label, placeholder, options, value, onChange, formatOption }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.dropdown} ref={ref}>
        <button
          type="button"
          className={styles.dropdownBtn}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className={value ? styles.selected : styles.placeholder}>
            {value || placeholder}
          </span>
          <ArrowIcon open={open} />
        </button>
        {open && (
          <ul className={styles.dropdownList}>
            {options.map((opt) => (
              <li
                key={opt}
                className={`${styles.dropdownItem} ${value === (formatOption ? formatOption(opt) : opt) ? styles.activeItem : ''}`}
                onClick={() => {
                  onChange(formatOption ? formatOption(opt) : opt);
                  setOpen(false);
                }}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

interface FiltersProps {
  brands: string[];
  onSearch: (filters: {
    brand: string;
    price: string;
    minMileage: string;
    maxMileage: string;
  }) => void;
}

export default function Filters({ brands, onSearch }: FiltersProps) {
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [minMileage, setMinMileage] = useState('');
  const [maxMileage, setMaxMileage] = useState('');

  return (
    <div className={styles.filters}>
      <Dropdown
        label="Car brand"
        placeholder="Choose a brand"
        options={brands}
        value={brand}
        onChange={setBrand}
      />

      <Dropdown
        label="Price / 1 hour"
        placeholder="Choose a price"
        options={PRICES.map((p) => `${p}`)}
        value={price ? `To $${price}` : ''}
        onChange={(val) => setPrice(val)}
        formatOption={(val) => `${val}`}
      />

      <div className={styles.field}>
        <label>Car mileage / km</label>
        <div className={styles.mileage}>
          <div className={styles.inputWrapperFrom}>
            <input
              type="number"
              value={minMileage}
              onChange={(e) => setMinMileage(e.target.value)}
            />
          </div>
          <div className={styles.inputWrapperTo}>
            <input
              type="number"
              value={maxMileage}
              onChange={(e) => setMaxMileage(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button
        className={styles.btn}
        onClick={() => onSearch({ brand, price: price.replace('To $', ''), minMileage, maxMileage })}
      >
        Search
      </button>
    </div>
  );
}
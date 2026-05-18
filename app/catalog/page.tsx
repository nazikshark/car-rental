'use client';

import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getCars, getFilters } from '@/lib/api';
import CarCard from '@/components/CarCard/CarCard';
import Filters from '@/components/Filters/Filters';
import styles from './catalog.module.css';

interface FiltersState {
  brand: string;
  price: string;
  minMileage: string;
  maxMileage: string;
}

export default function CatalogPage() {
  const [filters, setFilters] = useState<FiltersState>({
    brand: '',
    price: '',
    minMileage: '',
    maxMileage: '',
  });

  const { data: filtersData } = useQuery({
    queryKey: ['filters'],
    queryFn: getFilters,
  });

  const brands = filtersData?.brands || [];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['cars', filters],
    queryFn: ({ pageParam = 1 }) =>
      getCars({
        brand: filters.brand || undefined,
        price: filters.price ? Number(filters.price) : undefined,
        minMileage: filters.minMileage ? Number(filters.minMileage) : undefined,
        maxMileage: filters.maxMileage ? Number(filters.maxMileage) : undefined,
        page: pageParam as number,
        perPage: 12,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length < lastPage.totalPages) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const cars = data?.pages.flatMap((page) => page.cars) ?? [];

  return (
    <main>
      <div className={styles.filtersWrapper}>
        <Filters brands={brands} onSearch={setFilters} />
      </div>
      {isLoading ? (
        <div className={styles.loader}>Loading...</div>
      ) : (
        <>
          <div className={styles.grid}>
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          {hasNextPage && (
            <div className={styles.loadMore}>
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className={styles.loadMoreBtn}
              >
                {isFetchingNextPage ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
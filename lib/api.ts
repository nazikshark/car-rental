const BASE_URL = 'https://car-rental-api.goit.study';

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  img: string;
  rentalPrice: string;
  rentalCompany: string;
  mileage: number;
  description: string;
  fuelConsumption: string;
  engine: string;
  features: string[];
  location: {
    country: string;
    city: string;
    address: string;
  };
  rentalConditions: string[];
}

export interface CarsResponse {
  cars: Car[];
  totalCars: number;
  page: number;
  totalPages: number;
}

export interface FiltersParams {
  brand?: string;
  price?: number;
  minMileage?: number;
  maxMileage?: number;
  page?: number;
  perPage?: number;
}

export const getCars = async (params: FiltersParams): Promise<CarsResponse> => {
  const query = new URLSearchParams();

  if (params.brand) query.set('brand', params.brand);
  if (params.price) query.set('price', String(params.price));
  if (params.minMileage) query.set('minMileage', String(params.minMileage));
  if (params.maxMileage) query.set('maxMileage', String(params.maxMileage));
  query.set('page', String(params.page || 1));
  query.set('perPage', String(params.perPage || 12));

  const res = await fetch(`${BASE_URL}/cars?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch cars');
  return res.json();
};

export const getCarById = async (id: string): Promise<Car> => {
  const res = await fetch(`${BASE_URL}/cars/${id}`);
  if (!res.ok) throw new Error('Failed to fetch car');
  return res.json();
};

export const getFilters = async (): Promise<{ brands: string[]; price: { min: number; max: number } }> => {
  const res = await fetch(`${BASE_URL}/cars/filters`);
  if (!res.ok) throw new Error('Failed to fetch filters');
  return res.json();
};

export const rentCar = async (data: {
  name: string;
  email: string;
  comment?: string;
  carId: string;
}) => {
  const res = await fetch(`${BASE_URL}/cars/${data.carId}/booking-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      comment: data.comment,
    }),
  });
  if (!res.ok) throw new Error('Failed to rent car');
  return res.json();
};
import axiosInstance from './axiosInstance';

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

export interface ProductsResponse {
    products: Product[];
}

export const productApi = {
    getProducts: async (): Promise<Product[]> => {
        const response = await axiosInstance.get<ProductsResponse>('/api/products');
        return response.data.products;
    },
};

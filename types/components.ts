
export interface StockCardDTO {
    id: number;
    name: string;
    value: number;
    currency: string;
    description: string;
    user: {
        id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
    style: {
        color: string;
        bgColor: string;
    };
    description: string;
  };
  vendor: {
    id: number;
    name: string;
    style: {
        color: string;
        image: string;
        bgColor: string;
    } | null;
    description: string;
  };
}
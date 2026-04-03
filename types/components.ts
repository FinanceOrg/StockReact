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
      color?: string | null;
      bgColor?: string | null;
      accentColor?: string | null;
      secondaryButtonColor?: string | null;
    };
    description: string;
  };
  vendor: {
    id: number;
    name: string;
    style: {
      color?: string | null;
      image?: string | null;
      bgColor?: string | null;
      accentColor?: string | null;
      secondaryButtonColor?: string | null;
    } | null;
    description: string;
  };
}

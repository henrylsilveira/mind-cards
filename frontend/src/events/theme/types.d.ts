export interface ThemeProps {
  id?: string;
  theme_name: string;
  theme_description: string;
  card_quantity?: number;
  userId: string;
}

export interface ThemeRequestPagination {
  data: ThemeProps[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
  };
}

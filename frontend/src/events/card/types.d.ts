export interface CardProps {
  id?: string;
  themesId: string;
  userId: string;
  title: string;
  sub_title: string;
  description: string;
  level: number;
  created_at?: string;
  updated_at?: string;
  theme_name?: CardProps['theme']['theme_name'];
  theme?: {
    theme_name: ThemeProps["theme_name"];
  }
}

export interface CardRequestPagination {
  data: CardProps[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
  };
}

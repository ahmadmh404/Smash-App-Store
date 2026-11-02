import { IUser } from "@/next-auth";

export type BackendInfiniteData<T> = {
  data: T;
  next_cursor: string | null;
};

export enum APP_STATUS {
  PUBLISHED = "published",
  DRAFT = "draft",
  PENDING = "pending",
}

export enum APP_TYPE {
  APP = "app",
  GAME = "game",
  SOCIAL = "social",
  SCIENCE = "science",
  COMMUNICATION = "communication",
  LEARN = "learn",
}

export type AppType =
  | "app"
  | "game"
  | "social"
  | "science"
  | "communication"
  | "learn";

export type AppSTatus = "published" | "draft" | "pending";

export type IGallery = {
  id: number;
  path: string;
};

export type ICategory = {
  id: number;
  name: string;
  icon?: string;
  apps_count: number;
};

export type IBadge = {
  id: number;
  badge: "none" | "bronze" | "sliver" | "gold";
  offer: number;
};

// App
export interface IApp {
  id: number;
  user_id: number;
  status: AppSTatus;
  type: AppType;
  name: string;
  recommended: boolean;
  app_rate: number;
  description: string;
  galleries: IGallery[];
  developer: IUser;
  category: ICategory;
  reviews: IReview[];
  features: string[];
  requirements: string[];
  downloads: number;
  version: string;
  size: number;
  price: number;
  icon: string;
  published_at: string | null;
  updated_at: string;
}

//

export interface IReview {
  id: number;
  user: Partial<IUser>;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful_count: number;
  version_reviewed: string;
  verified_purchase: boolean;
}

export type MainCategories = "featured" | "top-rated" | "apps" | "games";

// dashboard states
export type IDashboardStates = {
  total_downloads: number;
  purchased_apps: number;
  total_spent: number;
  reviews_written: number;

  // Dev additional states
  published_apps: number;
  total_revenue: number;
  your_total_downloads: number;
  avg_rating: number;

  // Boss additional staes
  pending_requests: number;
  total_users: number;
  store_revenue: number;
  active_apps: number;
};

// Download type
export type PayMethod = "stripe" | "paypal";

export type Download = {
  id: number;
  user_id: number;
  app_id: number;
  app: IApp;
  developer: IUser;
  method: PayMethod;
  amount: number;
  downlaoded_at: string;
};

// Download page
export type DownloadPage = {
  data: Download[];
  nextCursor: string | null;
};

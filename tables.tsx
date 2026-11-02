"use client";

import Image from "next/image";

import { InfiniteTableProps } from "./components/_builders/types/table";
import { getUserDownloadHistory } from "./data/downloads";
import { Button } from "./components/ui/button";

import { useCurrentuser } from "./hooks/use-current-user";
import { useInfiniteQuery } from "./lib/react-query/query";
import { downloads } from "@/constants";

import { format } from "date-fns";
import { getUserPurchasedApps } from "./data/apps";
import { Badge } from "./components/ui/badge";
import { cn } from "./lib/utils";

// Dashboard Downloads Section
type DownloadsTableRow = {
  app: {
    id: number;
    icon: string;
    name: string;
  };

  developer: {
    id: number;
    name: string;
  };

  downloadDate: string;
  price: number;
  version: string;
};

export const dashboardDownloadTbaleOptions =
  (): InfiniteTableProps<DownloadsTableRow> => {
    const user = useCurrentuser();

    const query = useInfiniteQuery({
      queryFn: async ({ pageParam }) =>
        getUserDownloadHistory({ pageParam, userId: user?.id! }),
      queryKey: [`download-history-${user?.id}`],
      getNextPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    });

    // const downloads = query?.pages.flatMap((page) => page.data) || [];

    const data: DownloadsTableRow[] = downloads?.map((download, index) => ({
      app: {
        id: download.app.id,
        icon: download.app.icon,
        name: download.app.name,
      },
      developer: {
        id: download.developer.id,
        name: download.developer.name,
      },

      downloadDate: download.downlaoded_at,
      price: download.app.price,
      version: download.app.version,
    }));

    return {
      columns: [
        {
          accessorKey: "1",
          header: "App",
          cell(row) {
            return (
              <div className="flex items-center gap-x-3">
                <Image
                  width={40}
                  height={40}
                  src={row.app.icon}
                  className="object-cover rounded-sm"
                  alt="app_icon"
                />

                <span>{row.app.name}</span>
              </div>
            );
          },
        },

        {
          accessorKey: "2",
          header: "Developer",
          cell(row) {
            return <span>{row.developer.name}</span>;
          },
        },

        {
          accessorKey: "4",
          header: "Price",
          cell(row) {
            if (!row.price) {
              return <Badge className="primary-gradient shadow-sm">Free</Badge>;
            }

            return <span>${row.price}</span>;
          },
        },

        {
          accessorKey: "3",
          header: "Download Date",
          cell(row) {
            return <span>{format(row.downloadDate, "dd, MMM, yyyy")}</span>;
          },
        },

        {
          accessorKey: "5",
          header: "Version",
          cell(row) {
            return <span>v{row.version}</span>;
          },
        },

        {
          accessorKey: "6",
          header: "Actions",
          cell(row) {
            return (
              <Button variant={"link"} className="text-destructive">
                Delete
              </Button>
            );
          },
        },
      ],
      data,
      fetchMoreData: query?.fetchNextPage,
      isFetching: query?.isFetching,
      isFetchingNextPage: query?.isFetchingNextPage,
      errorMessage: query?.message?.text,
      hasNextPage: query?.hasNextPage,
    };
  };

// Dashboard Purchased Apps Section
type PurchasedAppsTableRow = {
  app: {
    id: number;
    name: string;
    icon: string;
    price: number;
  };

  purchased_at: string;
  method: "stripe" | "paypal";
};

export const DashboardPurchasedTableOptions =
  (): InfiniteTableProps<PurchasedAppsTableRow> => {
    const user = useCurrentuser();

    const query = useInfiniteQuery({
      queryFn: async ({ pageParam }) =>
        getUserPurchasedApps({ pageParam, userId: user?.id! }),
      queryKey: [`purchased-apps-${user?.id}`],
      getNextPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    });

    // const purchasedApps = query?.pages.flatMap((page) => page.data) || [];

    const purchasedApps = downloads.filter((download) => download.app.price);

    const data: PurchasedAppsTableRow[] = purchasedApps.map((pa) => ({
      app: {
        id: pa.app.id,
        name: pa.app.name,
        icon: pa.app.icon,
        price: pa.app.price,
      },
      method: pa.method,
      purchased_at: pa.downlaoded_at,
    }));

    return {
      columns: [
        // App Column
        {
          accessorKey: "app_metadata",
          header: "App",
          cell(row) {
            return (
              <div className="flex items-center gap-x-3">
                <Image
                  width={40}
                  height={40}
                  src={row.app.icon}
                  className="object-cover rounded-sm"
                  alt="app_icon"
                />

                <span>{row.app.name}</span>
              </div>
            );
          },
        },

        // method
        {
          accessorKey: "pay_method",
          header: "Payment Method",
          cell(row) {
            return (
              <Badge
                className={cn(
                  "capitalize shadow-sm",
                  row.method === "paypal" ? "bg-blue-500" : "bg-yellow-500"
                )}
              >
                {row.method}
              </Badge>
            );
          },
        },

        // price
        {
          accessorKey: "app_price",
          header: "Price",
          cell(row) {
            return <span>${row.app.price}</span>;
          },
        },

        // Purchase Date
        {
          accessorKey: "purchase_date",
          header: "Purchase Date",
          cell(row) {
            return <span>{format(row.purchased_at, "dd, MMM, yyyy")}</span>;
          },
        },
      ],
      data,
      fetchMoreData: query?.fetchNextPage,
      isFetching: query?.isFetching,
      isFetchingNextPage: query?.isFetchingNextPage,
      hasNextPage: query?.hasNextPage,
      errorMessage: query?.message?.text,
    };
  };

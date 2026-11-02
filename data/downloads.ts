import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TPage } from "@/lib/react-query/types";
import { BackendInfiniteData, Download, DownloadPage } from "@/types";

interface Props {
  userId: number;
  pageParam: string | null;
}

export const getUserDownloadHistory = async ({ pageParam, userId }: Props) => {
  const user = await currentUser();

  if (!user?.token) return { error: "Unauthenticated" };

  try {
    const res = await db.get(
      `/downloads/userDownloadHistory/${userId}?cursor=${pageParam}`
    );

    const {
      app_download_history,
    }: { app_download_history: BackendInfiniteData<Download[]> } = res.data;

    if (!app_download_history) return { error: "Something went wrong" };

    const page: TPage<Download> = {
      data: app_download_history.data,
      nextCursor: app_download_history.next_cursor,
    };

    return { page };
  } catch (error) {
    console.log("DOWNLOAD_HISTORY_ERROR: ", error);
    return null;
  }
};

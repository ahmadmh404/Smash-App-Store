import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { IDashboardStates } from "@/types";

export const getDashboardStates = async (userId: number) => {
  const user = await currentUser();

  if (!user?.token) return null;

  try {
    const res = await db.get(`/user/getUserStates/${userId}`);

    const { states }: { states: IDashboardStates } = res.data;

    if (!states) return null;

    return { data: states };
  } catch (error) {
    console.log("DASHBOARD_STATES: ", error);
    return null;
  }
};

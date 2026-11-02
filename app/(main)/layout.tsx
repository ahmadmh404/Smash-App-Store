import React from "react";
import { QueryClientProvider } from "@/lib/react-query/query-client-provider";

import "../globals.css";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <QueryClientProvider>{children}</QueryClientProvider>
    </div>
  );
};

export default MainLayout;

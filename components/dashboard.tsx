"use client";

import { useState } from "react";
import {
  BarChart3,
  Download,
  Upload,
  Settings,
  Users,
  ShoppingBag,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Star,
  Package,
  Activity,
  PieChart,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useInfiniteQuery, useQuery } from "@/lib/react-query/query";
import { getDashboardStates } from "@/data/states";
import { Loader } from "./ui/loader";
import { formatNumber } from "@/lib/utils";
import { IUser } from "@/next-auth";
import { useCurrentuser } from "@/hooks/use-current-user";
import { getUserDownloadHistory } from "@/data/downloads";
import { IDashboardStates } from "../types";
import { InfiniteTable } from "./_builders/table-builder";
import {
  dashboardDownloadTbaleOptions,
  DashboardPurchasedTableOptions,
} from "@/tables";

// Types and Interfaces
type UserRole = "user" | "developer" | "admin";

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  joinDate: string;
}

interface AppDownload {
  id: number;
  appId: number;
  appName: string;
  appIcon: string;
  downloadDate: string;
  price: number;
  developer: string;
  version: string;
}

interface AppUpload {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: "game" | "app";
  category: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  uploadDate: string;
  developer: string;
  developerId: number;
  downloads: number;
  revenue: number;
}

interface StoreSection {
  id: number;
  name: string;
  description: string;
  appCount: number;
  createdDate: string;
}

interface ProfitData {
  totalRevenue: number;
  monthlyRevenue: number;
  totalDownloads: number;
  monthlyDownloads: number;
  topApps: Array<{
    name: string;
    revenue: number;
    downloads: number;
  }>;
}

const mockUploads: AppUpload[] = [
  {
    id: 1,
    name: "My Awesome Game",
    description: "An exciting adventure game",
    icon: "/placeholder.svg?height=40&width=40",
    type: "game",
    category: "Adventure",
    price: 4.99,
    status: "approved",
    uploadDate: "2024-01-10",
    developer: "John Doe",
    developerId: 1,
    downloads: 1250,
    revenue: 6247.5,
  },
  {
    id: 2,
    name: "Productivity App",
    description: "Boost your productivity",
    icon: "/placeholder.svg?height=40&width=40",
    type: "app",
    category: "Productivity",
    price: 2.99,
    status: "pending",
    uploadDate: "2024-01-18",
    developer: "John Doe",
    developerId: 1,
    downloads: 0,
    revenue: 0,
  },
];

const mockSections: StoreSection[] = [
  {
    id: 1,
    name: "Games",
    description: "All types of games",
    appCount: 1250,
    createdDate: "2023-01-01",
  },
  {
    id: 2,
    name: "Productivity",
    description: "Apps to boost productivity",
    appCount: 340,
    createdDate: "2023-01-01",
  },
  {
    id: 3,
    name: "Entertainment",
    description: "Entertainment apps",
    appCount: 890,
    createdDate: "2023-01-01",
  },
];

const mockProfitData: ProfitData = {
  totalRevenue: 125000,
  monthlyRevenue: 15000,
  totalDownloads: 500000,
  monthlyDownloads: 45000,
  topApps: [
    { name: "Clash Royale", revenue: 25000, downloads: 100000 },
    { name: "Minecraft", revenue: 20000, downloads: 80000 },
    { name: "Instagram", revenue: 15000, downloads: 120000 },
  ],
};

const DashboardLoader = () => {
  return <Loader variant="spinner" size="sm" overlay />;
};

// Navigation items based on role
const getNavigationItems = (role: UserRole) => {
  const baseItems = [{ title: "Dashboard", icon: BarChart3, id: "dashboard" }];

  const userItems = [
    { title: "My Downloads", icon: Download, id: "downloads" },
    { title: "Purchased Apps", icon: ShoppingBag, id: "purchases" },
  ];

  const developerItems = [
    { title: "My Apps", icon: Package, id: "my-apps" },
    { title: "Upload App", icon: Upload, id: "upload" },
    { title: "Analytics", icon: TrendingUp, id: "analytics" },
    { title: "Revenue", icon: DollarSign, id: "revenue" },
  ];

  const adminItems = [
    { title: "All Apps", icon: Package, id: "all-apps" },
    { title: "Upload Requests", icon: FileText, id: "requests" },
    { title: "Store Sections", icon: Settings, id: "sections" },
    { title: "Users", icon: Users, id: "users" },
    { title: "Store Analytics", icon: PieChart, id: "store-analytics" },
  ];

  switch (role) {
    case "user":
      return [...baseItems, ...userItems];
    case "developer":
      return [...baseItems, ...userItems, ...developerItems];
    case "admin":
      return [...baseItems, ...userItems, ...developerItems, ...adminItems];
    default:
      return baseItems;
  }
};

// Done
function DashboardOverview({ user }: { user: IUser }) {
  const query = useQuery<IDashboardStates>({
    queryFn: () => getDashboardStates(user.id),
    queryKey: [`dashboard-states-${user.id}`],
  });

  if (query?.isFetching || !query.data) {
    return <DashboardLoader />;
  }

  const states = query?.data;

  const stats = [
    {
      title: "Total Downloads",
      value: formatNumber(states?.total_downloads),
      icon: Download,
    },
    {
      title: "Purchased Apps",
      value: formatNumber(states?.purchased_apps),
      icon: ShoppingBag,
    },
    {
      title: "Total Spent",
      value: `$${formatNumber(states?.total_spent)}`,
      icon: DollarSign,
    },
    {
      title: "Reviews Written",
      value: formatNumber(states?.reviews_written),
      icon: Star,
    },
  ];

  if (user.type === "developer") {
    stats.push(
      {
        title: "Published Apps",
        value: formatNumber(states?.published_apps),
        icon: Package,
      },
      {
        title: "Total Revenue",
        value: `$${formatNumber(states?.total_revenue)}`,
        icon: TrendingUp,
      },
      {
        title: "Your App Download",
        value: formatNumber(states?.your_total_downloads),
        icon: Activity,
      },
      { title: "Avg Rating", value: `${states.avg_rating}`, icon: Star }
    );
  }

  if (user.type === "admin") {
    stats.push(
      {
        title: "Pending Requests",
        value: `${states.pending_requests}`,
        icon: FileText,
      },
      { title: "Total Users", value: `${states.total_users}`, icon: Users },
      {
        title: "Store Revenue",
        value: `$${states.store_revenue}`,
        icon: DollarSign,
      },
      {
        title: "Active Apps",
        value: formatNumber(states.active_apps),
        icon: Package,
      }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your account.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Done...
function DownloadsHistory() {
  const user = useCurrentuser();

  if (!user) return;

  // refactor with tabel builder
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Download History</h2>
        <div className="flex gap-2">
          <Input placeholder="Search downloads..." className="w-64" />
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Downloads table */}
      <InfiniteTable {...dashboardDownloadTbaleOptions()} />
    </div>
  );
}

// Pending...
function PurchasedApps() {
  const user = useCurrentuser();

  if (!user) return;

  // refactor with tabel builder
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Purchased Apps</h2>
        <div className="flex gap-2">
          <Input placeholder="Search downloads..." className="w-64" />
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Downloads table */}
      <InfiniteTable {...DashboardPurchasedTableOptions()} />
    </div>
  );
}

function MyApps() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Apps</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Upload New App
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUploads.map((app) => (
          <Card key={app.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={app.icon || "/placeholder.svg"}
                  alt={app.name}
                  className="w-16 h-16 rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{app.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {app.category}
                  </p>
                  <Badge
                    variant={
                      app.status === "approved"
                        ? "default"
                        : app.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="mt-2"
                  >
                    {app.status}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Downloads:</span>
                  <span className="font-medium">
                    {app.downloads.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Revenue:</span>
                  <span className="font-medium">
                    ${app.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function UploadApp() {
  const [appData, setAppData] = useState({
    name: "",
    description: "",
    category: "",
    type: "",
    price: "",
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upload New App</h2>
      <Card>
        <CardHeader>
          <CardTitle>App Information</CardTitle>
          <CardDescription>
            Provide details about your app or game
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">App Name</Label>
              <Input
                id="name"
                value={appData.name}
                onChange={(e) =>
                  setAppData({ ...appData, name: e.target.value })
                }
                placeholder="Enter app name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={appData.type}
                onValueChange={(value) =>
                  setAppData({ ...appData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app">App</SelectItem>
                  <SelectItem value="game">Game</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={appData.category}
                onValueChange={(value) =>
                  setAppData({ ...appData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="games">Games</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={appData.price}
                onChange={(e) =>
                  setAppData({ ...appData, price: e.target.value })
                }
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={appData.description}
              onChange={(e) =>
                setAppData({ ...appData, description: e.target.value })
              }
              placeholder="Describe your app..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>App Icon</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 2MB
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Screenshots</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload app screenshots
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 5MB each
              </p>
            </div>
          </div>
          <Button className="w-full">Submit for Review</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function UploadRequests() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Upload Requests</h2>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>App</TableHead>
              <TableHead>Developer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUploads.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={app.icon || "/placeholder.svg"}
                      alt={app.name}
                      className="w-10 h-10 rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.category}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{app.developer}</TableCell>
                <TableCell className="capitalize">{app.type}</TableCell>
                <TableCell>
                  {new Date(app.uploadDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      app.status === "approved"
                        ? "default"
                        : app.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                    {app.status === "pending" && (
                      <>
                        <Button size="sm" variant="default">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function StoreSections() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Store Sections</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
              <DialogDescription>
                Create a new category section for the app store.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="section-name">Section Name</Label>
                <Input id="section-name" placeholder="Enter section name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-description">Description</Label>
                <Textarea
                  id="section-description"
                  placeholder="Describe this section..."
                />
              </div>
              <Button className="w-full">Create Section</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSections.map((section) => (
          <Card key={section.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{section.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Apps:</span>
                  <span className="font-medium">
                    {section.appCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Created:</span>
                  <span className="font-medium">
                    {new Date(section.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StoreAnalytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Store Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">
                  ${mockProfitData.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold">
                  ${mockProfitData.monthlyRevenue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Downloads
                </p>
                <p className="text-2xl font-bold">
                  {mockProfitData.totalDownloads.toLocaleString()}
                </p>
              </div>
              <Download className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Downloads
                </p>
                <p className="text-2xl font-bold">
                  {mockProfitData.monthlyDownloads.toLocaleString()}
                </p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Apps</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App Name</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProfitData.topApps.map((app, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>${app.revenue.toLocaleString()}</TableCell>
                  <TableCell>{app.downloads.toLocaleString()}</TableCell>
                  <TableCell>
                    <Progress value={75} className="w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Dashboard Component
function DashboardSidebar({
  user,
  activeTab,
  setActiveTab,
}: {
  user: IUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const navigationItems = getNavigationItems(user.type);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <Avatar>
            <AvatarImage
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-sm text-muted-foreground capitalize">
              {user.type}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <Button variant="outline" className="w-full">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function DashboardContent({
  user,
  activeTab,
}: {
  user: IUser;
  activeTab: string;
}) {
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview user={user} />;
      case "downloads":
        return <DownloadsHistory />;
      case "purchases":
        return <PurchasedApps />;
      case "my-apps":
        return <MyApps />;
      case "upload":
        return <UploadApp />;
      case "requests":
        return <UploadRequests />;
      case "sections":
        return <StoreSections />;
      case "store-analytics":
        return <StoreAnalytics />;
      default:
        return <DashboardOverview user={user} />;
    }
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex-1">
          <h1 className="font-semibold">Dashboard</h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6">{renderContent()}</div>
    </SidebarInset>
  );
}

export default function Dashboard({ user }: { user: IUser }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <DashboardSidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <DashboardContent user={user} activeTab={activeTab} />
      </div>
    </SidebarProvider>
  );
}

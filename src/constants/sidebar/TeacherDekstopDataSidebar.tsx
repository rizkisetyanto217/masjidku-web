// src/constants/sidebarTeacherDesktopData.ts
import { SidebarItem } from "@/components/common/navigation/Sidebar";
import {
  BeakerIcon,
  LayoutDashboardIcon,
  BellIcon,
  CalendarIcon,
  FileIcon,
  UsersIcon,
  PieChartIcon,
} from "lucide-react";

export const teacherDesktopDataSidebar: SidebarItem[] = [
  { text: "Beranda", icon: <BeakerIcon />, to: "/dkm" },
  { text: "Profil", icon: <LayoutDashboardIcon />, to: "/dkm/profil" },
  { text: "Kajian", icon: <CalendarIcon />, to: "/dkm/kajian" },
  { text: "Sertifikat", icon: <FileIcon />, to: "/dkm/sertifikat" },
];

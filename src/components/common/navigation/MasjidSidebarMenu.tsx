import { useLocation, Link, matchPath } from "react-router-dom";
import { colors } from "@/constants/colorsThema";
import useHtmlDarkMode from "@/hooks/userHTMLDarkMode";

export type MasjidSidebarMenuItem = {
  name: string;
  icon: React.ReactNode;
  to: string;
  badge?: number | string;
};

type MasjidSidebarMenuProps = {
  menus: MasjidSidebarMenuItem[];
  title?: string;
  currentPath?: string;
};




export default function MasjidSidebarMenu({
  menus,
  title = "Beranda",
}: MasjidSidebarMenuProps) {
  const location = useLocation();
  const { isDark } = useHtmlDarkMode();
  const theme = isDark ? colors.dark : colors.light;

  return (
    <div
      className="hidden md:block w-48 rounded-xl p-4 shadow-sm transition-colors"
      style={{
        backgroundColor: theme.white1,
        color: theme.black1,
      }}
    >
      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: theme.primary }}
      >
        {title}
      </h2>
      <ul className="space-y-2">
        {menus.map((menu) => {
          const active =
            !!matchPath({ path: menu.to + "/*" }, location.pathname) ||
            location.pathname === menu.to;

          const bg = active ? theme.primary2 : "transparent";
          const textColor = active ? theme.primary : theme.silver2;

          return (
            <Link
              to={menu.to}
              key={menu.to}
              className={`flex items-center justify-between px-4 py-2 rounded-lg text-md transition font-medium
                ${active ? "bg-teal-600 text-white" : "text-gray-500 hover:bg-teal-200 dark:hover:bg-teal-700 dark:text-gray-300"}`}
              style={{ backgroundColor: bg, color: textColor }}
            >
              <div className="flex items-center gap-3">
                <div className="text-lg">{menu.icon}</div>
                <span>{menu.name}</span>
              </div>
              {menu.badge !== undefined && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.white1,
                  }}
                >
                  {menu.badge}
                </span>
              )}
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

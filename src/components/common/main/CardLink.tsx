import { useNavigate } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/userHTMLDarkMode";
import { colors } from "@/constants/colorsThema";

type CartLink = {
  label: string;
  icon: React.ReactNode; // untuk mendukung icon komponen, bukan string biasa
  href?: string;
  internal?: boolean;
};

export default function CartLink({
  label,
  icon,
  href,
  internal = true,
}: CartLink) {
  const navigate = useNavigate();
  const { isDark } = useHtmlDarkMode();
  const themeColors = isDark ? colors.dark : colors.light;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!href) return;
    if (internal) {
      navigate(href);
    } else {
      window.open(href, "_blank", "noopener noreferrer");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex items-center justify-between p-3 rounded hover:opacity-90 transition-all"
      style={{
        backgroundColor: themeColors.white2,
        border: `1px solid ${themeColors.silver1}`,
      }}
    >
      <span className="flex items-center space-x-2">
        <span>{icon}</span>
        <span style={{ color: themeColors.black1 }}>{label}</span>
      </span>
      <span style={{ color: themeColors.silver4 }}>›</span>
    </div>
  );
}

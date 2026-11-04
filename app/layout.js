import { fontVariables } from "../lib/fonts";
import "./globals.css";

export const metadata = {
  title: "TiancrisENP — Portafolio",
  description:
    "Portafolio de TiancrisENP. Los repositorios pineados en GitHub, presentados como un manuscrito rústico.",
};

export const viewport = {
  themeColor: "#2a1b12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}

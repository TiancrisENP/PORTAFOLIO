import { Cinzel, IM_Fell_English, MedievalSharp } from "next/font/google";

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});

export const fell = IM_Fell_English({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const medieval = MedievalSharp({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const fontVariables = `${cinzel.variable} ${fell.variable} ${medieval.variable}`;

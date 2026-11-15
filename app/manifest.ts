import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Masjid Amanah",
    short_name: "Masjid Amanah",
    description: "Official mosque information, prayer timetable, community updates, and learning resources.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f7f1",
    theme_color: "#123d32",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}

import { practicePhrases } from "@/lib/landing/phrases";
import { landingPreviews } from "@/lib/landing/scenes";
import { LandingPage } from "../components/landing/landing-page";

const posters = { desktop: "/assets/hangul-poster.webp", mobile: "/assets/hangul-poster-mobile.webp" };

export default function Page() {
  return <LandingPage posters={posters} scenes={landingPreviews} phrases={practicePhrases} />;
}

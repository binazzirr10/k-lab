import { LandingPage } from "../components/landing/landing-page";

const posters = { desktop: "/assets/hangul-poster.webp", mobile: "/assets/hangul-poster-mobile.webp" };

export default function Page() {
  return <LandingPage posters={posters} />;
}

import { signInFor } from "@/lib/sign-in";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { AppNav } from "@/app/components/app-nav";
import { KTutor } from "@/app/components/k-tutor";
import { getScene } from "@/lib/k-scenes";
import { landingScenes } from "@/lib/landing/scenes";
import { activePlan, canOpenScene } from "@/lib/plans";
import "@/app/components/plan-cards.css";
import { ScenePlayer } from "./scene-player";

export default async function ScenePage({ params }: { params: Promise<{ slug: string }> }) {
  const { userId } = await auth();
  const { slug } = await params;
  if (!userId) redirect(signInFor(`/k-scene/${encodeURIComponent(slug)}`));
  const scene = getScene(slug);
  if (!scene) notFound();
  const user = await currentUser();
  const open = canOpenScene(activePlan(user?.publicMetadata).plan, scene.slug);
  const name = user?.firstName || user?.username || "Ученик";

  return (
    <>
      <AppNav active="scenes"><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></AppNav>
      <main className="scene-player">
        <header className="scene-hero">
          <div>
            <span>{scene.lesson.replace("Lesson", "Урок")} · {scene.location}</span>
            <h1>{scene.title}</h1>
            <p>Слушай реплики по порядку, читай перевод и повторяй каждую вслух.</p>
          </div>
          <aside><b>Озвучка реплик</b><p>Фразы озвучивает браузер. Если звука нет, попробуй другой браузер.</p></aside>
        </header>
        {open ? <ScenePlayer scene={scene} romanization={landingScenes.find((item) => item.slug === scene.slug)?.lines.map((line) => line.romanization) ?? []} /> : <section className="plan-locked">
          <h2>Эта сцена в Pro</h2>
          <p>Бесплатно открыта первая сцена. Pro открывает все сцены курса.</p>
          <Link className="plan-action" href="/pricing">Смотреть тарифы</Link>
        </section>}
      </main>
      <KTutor context={`scene:${scene.slug}`} />
    </>
  );
}

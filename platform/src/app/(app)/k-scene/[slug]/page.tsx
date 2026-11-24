import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { AppNav } from "@/app/components/app-nav";
import { KTutor } from "@/app/components/k-tutor";
import { getScene } from "@/lib/k-scenes";
import { ScenePlayer } from "./scene-player";

export default async function ScenePage({ params }: { params: Promise<{ slug: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const { slug } = await params;
  const scene = getScene(slug);
  if (!scene) notFound();
  const user = await currentUser();
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
        <ScenePlayer scene={scene} />
      </main>
      <KTutor context={`scene:${scene.slug}`} />
    </>
  );
}

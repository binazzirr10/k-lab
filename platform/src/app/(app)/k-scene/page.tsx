import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppNav } from "@/app/components/app-nav";
import { KTutor } from "@/app/components/k-tutor";
import { kScenes } from "@/lib/k-scenes";

export default async function KSceneHub() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Ученик";

  return (
    <>
      <AppNav active="scenes"><b>{name}</b><UserButton appearance={{ elements: { avatarBox: "learn-avatar" } }} /></AppNav>
      <main className="scene-hub">
        <header className="scene-hero">
          <div>
            <span>K‑Scene</span>
            <h1>Диалоги к урокам</h1>
            <p>Послушай реплику, прочитай перевод и повтори вслух. Записать голос можно в Speaking Lab.</p>
          </div>
          <aside><b>Четыре сцены</b><p>В первых трёх говорят Минджи и Алина, в четвёртой Алина и Джун.</p></aside>
        </header>
        <section className="scene-grid" aria-label="Сцены">
          {kScenes.map((scene) => (
            <Link className="scene-card" href={`/k-scene/${scene.slug}`} key={scene.id}>
              <ViewTransition name={`scene-${scene.slug}`} share="klab-morph" default="none"><figure>
                <Image src={scene.cover} alt={scene.location} fill unoptimized />
                <Image src={scene.cast} alt="" width={720} height={scene.slug === "joons-day" ? 1080 : 658} unoptimized />
              </figure></ViewTransition>
              <div>
                <small>{scene.lesson.replace("Lesson", "Урок")} · {scene.location}</small>
                <h2>{scene.title}</h2>
                <p>{scene.lines.length} реплик <span aria-hidden="true">↗</span></p>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <KTutor context="k-scene-hub" />
    </>
  );
}

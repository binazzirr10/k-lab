import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonStyleFix } from "@/app/components/lesson-style-fix";
import { KSceneStyleFix } from "@/app/components/k-scene-style-fix";
import { getScene } from "@/lib/k-scenes";
import { ScenePlayer } from "./scene-player";

export default async function ScenePage({params}:{params:Promise<{slug:string}>}){const{userId}=await auth();if(!userId)redirect("/sign-in");const{slug}=await params;const scene=getScene(slug);if(!scene)notFound();const user=await currentUser();const name=user?.firstName||user?.username||"Ученик";return <><LessonStyleFix/><KSceneStyleFix/><nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a href="/learn/lesson-01-introduction">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="/vocabulary">WORD DECK</a><a className="active" href="/k-scene">K‑SCENE</a></div><section><b>{name}</b><UserButton appearance={{elements:{avatarBox:"learn-avatar"}}}/></section></nav><main className="scene-player"><header className="scene-hero"><div><span>{scene.lesson.toUpperCase()} · {scene.location.toUpperCase()}</span><h1>{scene.title}.</h1><p>Сначала послушай сцену, затем выбери реплику и повтори её в своём темпе.</p></div><aside><b>SHADOWING MODE</b><p>Реплики идут по очереди. Озвучка использует корейский голос Safari; для Джуна браузер пытается выбрать мужской голос, если он установлен.</p></aside></header><ScenePlayer scene={scene}/></main><KTutor lessonContext={`K-Scene: ${scene.title}. Объясняй реплики из этой сцены и предлагай короткую подсказку для shadowing.`}/></>}

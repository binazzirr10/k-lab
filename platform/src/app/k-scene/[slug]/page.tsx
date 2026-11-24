import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonStyleFix } from "@/app/components/lesson-style-fix";
import { KSceneStyleFix } from "@/app/components/k-scene-style-fix";
import { getScene } from "@/lib/k-scenes";
import { ScenePlayer } from "./scene-player";

export default async function ScenePage({params}:{params:Promise<{slug:string}>}){const{userId}=await auth();if(!userId)redirect("/sign-in");const{slug}=await params;const scene=getScene(slug);if(!scene)notFound();const user=await currentUser();const name=user?.firstName||user?.username||"Ученик";return <><LessonStyleFix/><KSceneStyleFix/><nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a href="/learn/lesson-01-introduction">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="/vocabulary">WORD DECK</a><Link className="active" href="/k-scene">K‑SCENE</Link></div><section><b>{name}</b><UserButton appearance={{elements:{avatarBox:"learn-avatar"}}}/></section></nav><main className="scene-player"><header className="scene-hero"><div><span>{scene.lesson.toUpperCase()} · {scene.location.toUpperCase()}</span><h1>{scene.title}</h1><p>Слушай реплики по порядку, читай перевод и повторяй каждую вслух.</p></div><aside><b>КАК ПРОЙТИ СЦЕНУ</b><p>Переходи к следующей реплике кнопкой «Дальше», на последней заверши сцену. Фразы озвучивает браузер. Если звука нет, попробуй другой браузер.</p></aside></header><ScenePlayer scene={scene}/></main><KTutor context={`scene:${scene.slug}`}/></>}

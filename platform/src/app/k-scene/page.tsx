import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { LessonStyleFix } from "@/app/components/lesson-style-fix";
import { KSceneStyleFix } from "@/app/components/k-scene-style-fix";
import { kScenes } from "@/lib/k-scenes";

export default async function KSceneHub(){const{userId}=await auth();if(!userId)redirect("/sign-in");const user=await currentUser();const name=user?.firstName||user?.username||"Ученик";return <><LessonStyleFix/><KSceneStyleFix/><nav className="learn-nav"><a className="learn-logo" href="/studio"><span>ㅋ</span>K‑Lab</a><div><a href="/studio">МОЙ РИТМ</a><a href="/learn/lesson-01-introduction">УРОКИ</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="/vocabulary">WORD DECK</a><Link className="active" href="/k-scene">K‑SCENE</Link></div><section><b>{name}</b><UserButton appearance={{elements:{avatarBox:"learn-avatar"}}}/></section></nav><main className="scene-hub"><header className="scene-hero"><div><span>K‑SCENE · ДИАЛОГИ К УРОКАМ</span><h1>Слушай<br/>и повторяй.</h1><p>Фразы из уроков звучат здесь в диалогах. Послушай реплику, прочитай перевод и повтори вслух. Записать голос можно в Speaking Lab.</p></div><aside><b>4 СЦЕНЫ К УРОКАМ</b><p>По одной сцене к каждому уроку. В первых трёх говорят Минджи и Алина, в четвёртой Алина и Джун.</p></aside></header><section className="scene-grid">{kScenes.map(scene=><Link className="scene-card" href={`/k-scene/${scene.slug}`} key={scene.id}><figure><img src={scene.cover} alt={scene.location}/><img src={scene.cast} alt={`Персонажи: ${scene.title}`}/></figure><div><small>{scene.lesson.toUpperCase()} · {scene.location.toUpperCase()}</small><h2>{scene.title}</h2><p>{scene.lines.length} реплик · послушай и повтори вслух →</p></div></Link>)}</section></main><KTutor context="k-scene-hub" /></>}

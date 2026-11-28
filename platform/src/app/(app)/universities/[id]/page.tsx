import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppNav } from "@/app/components/app-nav";
import { AuthActions } from "@/app/components/auth-actions";
import { universityCatalog } from "@/lib/universities";
import { articleSections, universityArticles } from "@/lib/university-articles";
import { loadUniversityLab } from "@/lib/university-lab";
import { SaveUniversity } from "./save-university";
import { ArticleIntro } from "./article-intro";
import { ArticleMotion, ArticleReveal, SectionHeading } from "./article-motion";
import { RollNumber } from "../university-motion";
import { CatalogBackLink } from "../university-navigation";
import s from "./university-article.module.css";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return universityCatalog.map(({ id }) => ({ id }));
}

async function getUniversity(params: Props["params"]) {
  const { id } = await params;
  const index = universityCatalog.findIndex((university) => university.id === id);
  const university = universityCatalog[index];
  const article = universityArticles[id];

  if (!university || !article) notFound();

  return { university, article, index };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { university, article } = await getUniversity(params);
  return { title: `${university.name} | University Lab | K‑Lab`, description: article.lead };
}

export default async function UniversityArticlePage({ params }: Props) {
  const { university, article, index } = await getUniversity(params);
  const { photo } = article;
  const user = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? await currentUser() : null;
  const lab = user ? await loadUniversityLab(user.id) : null;
  const previous = universityCatalog[index - 1];
  const next = universityCatalog[index + 1];

  return <>
    <AppNav active="universities"><AuthActions /></AppNav>
    <main className={s.main} data-university-page>
      <CatalogBackLink id={university.id} className={s.back} />
      <ArticleMotion
        intro={<ArticleIntro id={university.id} title={university.name} korean={university.korean} lead={article.lead}
          photo={photo && <Image src={photo.src} alt={photo.alt} fill loading="eager" fetchPriority="high"
            sizes="(min-width: 1152px) 1120px, calc(100vw - 32px)" />}
          credit={photo && <>Фото: {photo.author}, <a href={photo.licenseUrl}>{photo.license}</a>
            {" — "}<a href={photo.filePage}>Wikimedia Commons</a></>} />}
        facts={<dl className={s.facts}>
          {article.facts.map(({ label, value }, factIndex) => <ArticleReveal as="div" key={label} delay={factIndex * .075}>
            <dt>{label}</dt><dd>{value.split(/(\b[0-9]{4}\b)/).map((piece, index) => /^[0-9]{4}$/.test(piece)
              ? <RollNumber key={index} value={piece} onReveal /> : piece)}</dd>
          </ArticleReveal>)}
        </dl>}
        sections={articleSections.map(([key, heading]) => <section key={key} aria-labelledby={key}>
          <SectionHeading id={key}>{heading}</SectionHeading>
          {article.sections[key].map((paragraph, index) => <ArticleReveal as="p" key={paragraph}
            delay={.085 + index * .075}>{paragraph}</ArticleReveal>)}
        </section>)}
        actions={<div className={s.actions}>
          <a className={s.official} href={university.url} target="_blank" rel="noreferrer">Официальный сайт ↗</a>
          {lab?.connected && <SaveUniversity id={university.id} initialSaved={lab.saved} initialRevision={lab.revision} />}
          {lab && !lab.connected && <p role="alert">Не удалось загрузить твой список. Обнови страницу, чтобы сохранить университет.</p>}
        </div>}
        sources={<section aria-labelledby="sources" className={s.sources}>
          <h2 id="sources">Источники</h2>
          <ArticleReveal as="ul" delay={.14}>
            {article.sources.map(({ url, title }) => <li key={url}><a href={url}>{title}</a></li>)}
          </ArticleReveal>
        </section>}
        pagination={<ArticleReveal as="nav" className={s.pagination} label="Соседние университеты" delay={.2}>
          {previous && <Link href={`/universities/${previous.id}`} rel="prev" prefetch={false}>
            <span><i aria-hidden="true">←</i> Предыдущий</span><strong>{previous.name}</strong>
          </Link>}
          {next && <Link href={`/universities/${next.id}`} rel="next" prefetch={false}>
            <span>Следующий <i aria-hidden="true">→</i></span><strong>{next.name}</strong>
          </Link>}
        </ArticleReveal>}
      />
    </main>
  </>;
}

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { projects, type Project } from '@/lib/portfolio-data'
import { GithubIcon } from './brand-icon'
import { Reveal, SectionHeading, TiltCard } from './primitives'

function ProjectLink({
  href,
  label,
  icon,
  primary,
}: {
  href: string | null
  label: string
  icon: React.ReactNode
  primary?: boolean
}) {
  const base =
    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all'
  if (!href) {
    return (
      <span
        className={`${base} cursor-not-allowed border border-dashed border-white/15 text-muted-foreground`}
        title="Link coming soon"
      >
        {icon}
        {label}
        <span className="sr-only">(coming soon)</span>
      </span>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        primary
          ? `${base} bg-foreground text-background hover:bg-neon`
          : `${base} border border-white/15 hover:border-neon/50 hover:text-neon`
      }
    >
      {icon}
      {label}
    </a>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const pending = !project.liveUrl && !project.sourceUrl
  return (
    <TiltCard
      intensity={6}
      className="glass glow-border flex flex-col overflow-hidden rounded-3xl transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_rgb(34_211_238/0.3)]"
    >
      <div className="relative m-2 aspect-[16/10] overflow-hidden rounded-2xl">
        <Image
          src={project.image}
          alt={`Preview of ${project.title}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" aria-hidden="true" />
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />
        <span className="glass absolute top-3 left-3 rounded-full px-3 py-1 font-mono text-xs">{project.index}</span>
        {pending ? (
          <span className="absolute top-3 right-3 rounded-full bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
            In progress
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-6 pt-4 pb-6">
        <h3 className="flex items-start justify-between gap-3 text-xl font-semibold tracking-tight md:text-2xl">
          {project.title}
          <ArrowUpRight
            className="mt-1 size-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neon"
            aria-hidden="true"
          />
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{project.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-neon/20 bg-neon/[0.06] px-3 py-1 font-mono text-[11px] text-neon"
            >
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.06] pt-5">
          <ProjectLink
            href={project.liveUrl}
            label="View Project"
            primary
            icon={<ArrowUpRight className="size-4" aria-hidden="true" />}
          />
          <ProjectLink
            href={project.sourceUrl}
            label="Source Code"
            icon={<GithubIcon className="size-4" />}
          />
        </div>
      </div>
    </TiltCard>
  )
}

export function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="03"
          eyebrow="Projects"
          title={<>Selected <span className="text-gradient">work.</span></>}
          description="A few projects that shaped how I think about building for the web. Live links will be added as each project is published."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={0.1 * i} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

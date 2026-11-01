import Image from 'next/image'
import { GraduationCap, Sparkles, Target } from 'lucide-react'
import { Reveal, SectionHeading } from './primitives'

const facts = [
  {
    icon: GraduationCap,
    label: 'Education',
    value: 'Informatics Engineering student building a strong foundation in software and data.',
  },
  {
    icon: Sparkles,
    label: 'Interests',
    value: 'Web development, database systems, UI/UX design and interactive 3D on the web.',
  },
  {
    icon: Target,
    label: 'Career Goal',
    value: 'Grow into a full-stack engineer who ships products that feel as good as they work.',
  },
]

export function About() {
  return (
    <section id="about" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="01" eyebrow="About Me" title={<>Code meets <span className="text-gradient">craft.</span></>} />

        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/40 via-neon/20 to-violet/40 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-[1.75rem] bg-gradient-to-br from-neon/70 via-primary/30 to-violet/70 p-px">
              <div className="relative overflow-hidden rounded-[1.7rem] bg-background">
                <Image
                  src="/images/profile.png"
                  alt="Portrait of Gilang"
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover"
                  sizes="(min-width: 1024px) 384px, 90vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
                  <span className="text-foreground">Gilang</span>
                  <span className="text-neon">ID / Dev</span>
                </div>
              </div>
            </div>
            <span className="absolute -top-3 -left-3 size-6 border-t-2 border-l-2 border-neon" aria-hidden="true" />
            <span className="absolute -right-3 -bottom-3 size-6 border-r-2 border-b-2 border-violet" aria-hidden="true" />
          </Reveal>

          <div>
            <Reveal>
              <p className="text-pretty text-xl leading-relaxed text-foreground/90 md:text-2xl">
                {"Hi, I'm Gilang — a student developer who loves the space where engineering and design overlap. I enjoy building interfaces that are fast, accessible and a little bit delightful."}
              </p>
              <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
                {"Beyond the frontend, I care about how data is structured and served. From modeling relational databases to wiring up authentication, I like understanding the whole system behind the screen."}
              </p>
            </Reveal>

            <ul className="mt-10 grid gap-4">
              {facts.map((fact, i) => (
                <Reveal key={fact.label} delay={0.1 * i}>
                  <li className="glass flex gap-4 rounded-2xl p-5 transition-colors hover:border-neon/30">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-neon/10 text-neon">
                      <fact.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{fact.label}</p>
                      <p className="mt-1 leading-relaxed">{fact.value}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

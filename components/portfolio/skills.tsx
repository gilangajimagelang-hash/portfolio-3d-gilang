import { skillGroups } from '@/lib/portfolio-data'
import { BrandIcon } from './brand-icon'
import { Reveal, SectionHeading, TiltCard } from './primitives'

export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="pointer-events-none absolute top-1/3 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          index="02"
          eyebrow="Skills"
          title={<>The <span className="text-gradient">toolkit</span> I build with.</>}
          description="Technologies I use in coursework and personal projects — grouped by where they sit in the stack."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={0.08 * i} className="h-full">
              <TiltCard className="glass rounded-3xl p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{group.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.description}</p>
                  </div>
                  <span className="font-mono text-xs text-neon">0{i + 1}</span>
                </div>
                <ul className="mt-8 flex flex-wrap gap-3 [transform:translateZ(30px)]">
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm transition-colors hover:border-neon/40 hover:text-neon"
                    >
                      <BrandIcon name={skill.icon} className="size-4" />
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

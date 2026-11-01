'use client'

import { ArrowUpRight, Briefcase, Mail, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { profile } from '@/lib/portfolio-data'
import { GithubIcon } from './brand-icon'
import { Reveal, SectionHeading } from './primitives'

const links = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: <Mail className="size-5" aria-hidden="true" /> },
  { label: 'GitHub', value: 'github.com/your-username', href: profile.github, icon: <GithubIcon className="size-5" /> },
  { label: 'LinkedIn', value: 'linkedin.com/in/your-username', href: profile.linkedin, icon: <Briefcase className="size-5" aria-hidden="true" /> },
]

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-neon/60 focus:ring-2 focus:ring-neon/20'

export function Contact() {
  const [opened, setOpened] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setOpened(true)
  }

  return (
    <section id="contact" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="pointer-events-none absolute bottom-0 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-violet/10 blur-[160px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          index="05"
          eyebrow="Contact"
          title={<>{"Let's build something "}<span className="text-gradient">together.</span></>}
          description="Have an opportunity, a project idea, or just want to say hi? My inbox is open."
        />

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="glass group flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-neon/40"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-white/5 text-neon">{link.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">{link.label}</span>
                      <span className="block truncate">{link.value}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neon" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-muted-foreground">Name</label>
                  <input id="name" name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-muted-foreground">Email</label>
                  <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@example.com" className={fieldClass} />
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="message" className="mb-2 block text-sm text-muted-foreground">Message</label>
                <textarea id="message" name="message" required rows={5} maxLength={2000} placeholder="Tell me about your idea..." className={`${fieldClass} resize-none`} />
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-muted-foreground" aria-live="polite">
                  {opened
                    ? 'Your email app should now be open with the message ready to send.'
                    : 'Sending opens your email app with this message pre-filled.'}
                </p>
                <button
                  type="submit"
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-neon px-6 py-3 text-sm font-semibold text-background shadow-[0_0_30px_rgb(34_211_238/0.3)] transition-shadow hover:shadow-[0_0_50px_rgb(34_211_238/0.5)]"
                >
                  Send Message
                  <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

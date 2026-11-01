export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 font-mono text-xs text-muted-foreground sm:flex-row">
        <p>{`© ${new Date().getFullYear()} Gilang. All rights reserved.`}</p>
        <a href="#home" className="transition-colors hover:text-neon">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}

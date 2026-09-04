"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { SocialGlyph } from "@/components/ui/social-glyph";
import { Button } from "@/components/ui/button";
import { contact, primaryNav, socials } from "@/content/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-signal focus:px-5 focus:py-2.5 focus:text-meta focus:font-medium focus:text-void"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled ? "py-2.5" : "py-4",
        )}
      >
        <div className="container-page">
          <div
            className={cn(
              "grid grid-cols-[auto_1fr] items-center gap-3 rounded-full px-4 py-2.5 backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:px-5 lg:grid-cols-[1fr_auto_1fr]",
              scrolled
                ? "bg-raised/95 shadow-[inset_0_0_0_1px_rgba(17,23,34,0.16),0_14px_32px_-14px_rgba(11,37,64,0.32)]"
                : "bg-raised/85 shadow-[inset_0_0_0_1px_rgba(17,23,34,0.13),0_8px_24px_-14px_rgba(11,37,64,0.24)]",
            )}
          >
            <Logo />

            <nav
              aria-label="Primary"
              className="hidden shrink-0 items-center justify-center gap-1 whitespace-nowrap lg:flex"
            >
              {primaryNav.map((item) => {
                // The prefix test has to skip the root: `"/services".startsWith("/")`
                // is true, so a plain `/` entry would light up on every page.
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-meta font-medium transition-colors duration-300",
                      active ? "text-ink" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-signal transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        active && "scale-x-100",
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center justify-end gap-2 whitespace-nowrap">
              <div className="hidden items-center gap-1.5 md:flex">
                {socials.filter((s) => s.href).map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="hairline grid size-9 place-items-center rounded-full bg-obsidian text-ink-muted transition-colors hover:bg-signal-soft hover:text-signal"
                  >
                    <SocialGlyph label={s.label} />
                  </a>
                ))}
              </div>
              <span aria-hidden="true" className="hidden h-6 w-px bg-ink/[0.12] md:block" />
              <a
                href={contact.phoneHref}
                className="hidden shrink-0 items-center gap-2 rounded-full px-3 py-2 font-mono text-meta tracking-wide text-ink-muted transition-colors hover:text-signal xl:inline-flex"
              >
                <Phone className="size-3.5" strokeWidth={1.8} />
                {contact.phone}
              </a>
              <Button href="/contact" size="sm" className="hidden shrink-0 sm:inline-flex" arrow>
                Request a quote
              </Button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="grid size-10 place-items-center rounded-full bg-ink/[0.06] text-ink transition-colors hover:bg-ink/[0.12] lg:hidden"
              >
                <Menu className="size-5" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-void/95 backdrop-blur-xl" />
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />

            <div className="relative flex h-full flex-col">
              <div className="container-page flex items-center justify-between py-6">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid size-10 place-items-center rounded-full bg-ink/[0.06] text-ink transition-colors hover:bg-ink/[0.12]"
                >
                  <X className="size-5" strokeWidth={1.8} />
                </button>
              </div>

              <nav aria-label="Mobile" className="container-page flex flex-1 flex-col justify-center gap-1 pb-24">
                {primaryNav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-baseline justify-between border-b border-ink/[0.1] py-4"
                    >
                      <span className="font-display text-3xl tracking-tight text-ink transition-colors group-hover:text-signal">
                        {item.label}
                      </span>
                      <span className="max-w-[45%] text-right font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
                        {item.description}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 flex flex-col gap-3"
                >
                  <Button href="/contact" size="lg" arrow>
                    Request a quote
                  </Button>
                  <a
                    href={contact.phoneHref}
                    className="inline-flex items-center justify-center gap-2 font-mono text-meta tracking-wide text-ink-muted"
                  >
                    <Phone className="size-4" strokeWidth={1.8} />
                    {contact.phone}
                  </a>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

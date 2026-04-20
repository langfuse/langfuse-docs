"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { productLinks, resourcesLinks } from "@/lib/nav-links";
import type { SectionNavData } from "@/lib/nav-tree";

export function MobileMenu({
  sectionNavData,
}: {
  sectionNavData: SectionNavData[];
}) {
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const close = () => setOpen(false);

  return (
    <>
      {/* Hamburger / close toggle — animated Menu ↔ X */}
      <button
        className="relative p-1 lg:hidden text-text-primary"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="block"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="block"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Overlay panel — portalled to body to escape backdrop-filter stacking context */}
      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-y-auto fixed inset-x-0 bottom-0 lg:hidden z-200 bg-surface-bg"
              style={{ top: "calc(4rem + var(--fd-banner-height, 0px))" }}
            >
              <nav className="flex flex-col">
                {/* Product */}
                <CollapsibleRow
                  label="Product"
                  open={productOpen}
                  onToggle={() => setProductOpen((v) => !v)}
                >
                  {productLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={close}
                      className="block px-0 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </CollapsibleRow>

                {/* Resources */}
                <CollapsibleRow
                  label="Resources"
                  open={resourcesOpen}
                  onToggle={() => setResourcesOpen((v) => !v)}
                >
                  {resourcesLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={close}
                      className="block px-0 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </CollapsibleRow>

                {/* Sections from nav tree */}
                {sectionNavData.map((section) =>
                (
                  <Link
                    key={section.href}
                    href={section.href}
                    onClick={close}
                    className="flex items-center justify-between px-4 py-3.5 text-sm text-text-primary hover:text-text-secondary transition-colors"
                  >
                    <span>{section.name}</span>
                    <ChevronRight className="w-4 h-4 text-text-tertiary" />
                  </Link>
                )
                )}

                {/* Social links */}
                <div className="flex gap-4 px-4 py-5 mt-auto">
                  <a
                    href="https://github.com/langfuse/langfuse"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="transition-colors text-text-tertiary hover:text-text-primary"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                  <a
                    href="https://x.com/langfuse"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    className="transition-colors text-text-tertiary hover:text-text-primary"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                    </svg>
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function CollapsibleRow({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3.5 text-sm text-text-primary hover:text-text-secondary transition-colors"
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-tertiary transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="flex flex-col pb-2 pl-4 ml-4 border-l border-line-structure">
          {children}
        </div>
      )}
    </div>
  );
}

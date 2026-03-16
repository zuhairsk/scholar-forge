import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function formatCents(cents: number): string {
  const n = Number.isFinite(cents) ? cents : 0
  return `$${(n / 100).toFixed(2)}`
}

export function formatNumber(n: number): string {
  const x = Number.isFinite(n) ? n : 0
  return new Intl.NumberFormat("en-US").format(x)
}

export function calculateReadTime(wordCount: number): number {
  const wc = Number.isFinite(wordCount) ? wordCount : 0
  return Math.max(1, Math.ceil(wc / 200))
}

export function paginateQuery(page: number, limit: number): { skip: number; take: number } {
  const p = Math.max(1, Math.floor(page || 1))
  const l = Math.max(1, Math.min(100, Math.floor(limit || 20)))
  return { skip: (p - 1) * l, take: l }
}

export function sanitizeHtml(html: string): string {
  return (html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

export function generateCitation(paper: any, format: "bibtex" | "apa" | "mla"): string {
  const title = paper?.title ?? "Untitled"
  const author = paper?.author?.name ?? paper?.authorName ?? "Unknown"
  const year = paper?.publishedAt ? new Date(paper.publishedAt).getFullYear() : new Date().getFullYear()
  const slug = generateSlug(`${author}-${title}-${year}`)

  if (format === "bibtex") {
    return `@article{${slug},\n  title={${title}},\n  author={${author}},\n  year={${year}},\n  journal={ScholarForge}\n}`
  }
  if (format === "apa") {
    return `${author}. (${year}). ${title}. ScholarForge.`
  }
  return `${author}. "${title}." ScholarForge, ${year}.`
}

export function truncate(text: string, maxLength: number): string {
  const t = text ?? ""
  if (t.length <= maxLength) return t
  return `${t.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`
}

export function timeAgo(date: Date | string | number): string {
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? "" : "s"} ago`
  const mo = Math.floor(day / 30)
  if (mo < 12) return `${mo} month${mo === 1 ? "" : "s"} ago`
  const yr = Math.floor(mo / 12)
  return `${yr} year${yr === 1 ? "" : "s"} ago`
}

export function getDomainColor(domain: string): string {
  const map: Record<string, string> = {
    "Computer Science": "#d4a843",
    Biology: "#22c55e",
    Physics: "#60a5fa",
    Chemistry: "#f97316",
    Mathematics: "#a78bfa",
    Medicine: "#ef4444",
    Economics: "#f59e0b",
    Psychology: "#14b8a6",
    Engineering: "#38bdf8",
    "Environmental Science": "#84cc16",
  }
  return map[domain] ?? "#d4a843"
}

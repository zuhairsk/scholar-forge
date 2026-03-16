import Anthropic from '@anthropic-ai/sdk'

function getClient() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  return new Anthropic({ apiKey: key })
}

function safeFirst(text: string, n: number) {
  return (text || '').slice(0, n)
}

export async function extractPaperMetadata(pdfText: string): Promise<{
  title: string
  abstract: string
  suggestedTags: string[]
  estimatedReadTime: number
  suggestedDomain: string
}> {
  const client = getClient()
  if (!client) {
    return { title: '', abstract: '', suggestedTags: [], estimatedReadTime: 10, suggestedDomain: 'Computer Science' }
  }

  try {
    const text = safeFirst(pdfText, 3000)
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: 'Extract academic paper metadata. Return ONLY valid JSON, no markdown, no explanation.',
      messages: [
        {
          role: 'user',
          content:
            `From this text extract: title, abstract (max 200 words), suggestedTags (3-5 keywords array), estimatedReadTime (integer minutes), suggestedDomain (one of: Computer Science|Biology|Physics|Chemistry|Mathematics|Medicine|Economics|Psychology|Engineering|Environmental Science).\n\nText: ${text}`,
        },
      ],
    })

    const content = resp.content?.[0]
    const raw = content && 'text' in content ? content.text : ''
    const parsed = JSON.parse(raw)

    return {
      title: typeof parsed.title === 'string' ? parsed.title : '',
      abstract: typeof parsed.abstract === 'string' ? parsed.abstract : '',
      suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags.map(String).slice(0, 5) : [],
      estimatedReadTime: Number.isFinite(parsed.estimatedReadTime) ? Math.max(1, Math.floor(parsed.estimatedReadTime)) : 10,
      suggestedDomain: typeof parsed.suggestedDomain === 'string' ? parsed.suggestedDomain : 'Computer Science',
    }
  } catch {
    return { title: '', abstract: '', suggestedTags: [], estimatedReadTime: 10, suggestedDomain: 'Computer Science' }
  }
}

export async function generateReviewHint(reviewText: string, paperAbstract: string): Promise<string> {
  if (!reviewText || reviewText.length < 100) return ''
  const client = getClient()
  if (!client) return ''

  try {
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 60,
      system: 'You are a peer review assistant. Give ONE specific improvement suggestion in under 20 words. No preamble.',
      messages: [
        {
          role: 'user',
          content: `Paper abstract:\n${safeFirst(paperAbstract, 800)}\n\nReview text:\n${safeFirst(reviewText, 1200)}`,
        },
      ],
    })
    const content = resp.content?.[0]
    const raw = content && 'text' in content ? content.text : ''
    return raw.trim()
  } catch {
    return ''
  }
}

const STATIC_SUGGESTIONS: Record<string, string[]> = {
  'Computer Science': ['Machine learning evaluation', 'Security & privacy', 'Systems & scalability'],
  Biology: ['Experimental design', 'Bioinformatics', 'Statistical analysis'],
  Physics: ['Simulation methodology', 'Instrumentation', 'Theoretical modeling'],
  Chemistry: ['Reaction mechanisms', 'Analytical methods', 'Materials characterization'],
  Mathematics: ['Proof techniques', 'Optimization', 'Applied modeling'],
  Medicine: ['Clinical study design', 'Outcomes & statistics', 'Safety & ethics'],
  Economics: ['Causal inference', 'Empirical methods', 'Policy evaluation'],
  Psychology: ['Experimental design', 'Measurement validity', 'Statistical rigor'],
  Engineering: ['System design', 'Reliability testing', 'Performance benchmarking'],
  'Environmental Science': ['Field methods', 'Model validation', 'Impact assessment'],
}

export async function suggestReviewers(paperAbstract: string, domain: string): Promise<string[]> {
  const client = getClient()
  if (!client) return STATIC_SUGGESTIONS[domain] ?? ['Methodology', 'Evaluation', 'Domain expertise']

  try {
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 120,
      system: 'Return ONLY valid JSON. Return an array of 3 short expertise areas (strings).',
      messages: [
        {
          role: 'user',
          content: `Domain: ${domain}\nAbstract: ${safeFirst(paperAbstract, 1200)}\nReturn an array of 3 expertise areas relevant to reviewing this paper.`,
        },
      ],
    })
    const content = resp.content?.[0]
    const raw = content && 'text' in content ? content.text : ''
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.map(String).slice(0, 3)
    return STATIC_SUGGESTIONS[domain] ?? ['Methodology', 'Evaluation', 'Domain expertise']
  } catch {
    return STATIC_SUGGESTIONS[domain] ?? ['Methodology', 'Evaluation', 'Domain expertise']
  }
}


export type SearchCategory = 
  | "Project"
  | "Article"
  | "Experience"
  | "Skill"
  | "Certification"
  | "Page"
  | "Action"

export interface SearchDocument {
  id: string
  type: SearchCategory
  title: string
  description?: string
  url: string
  category?: string
  tags?: string[]
  technologies?: string[]
  content?: string
  metadata?: Record<string, unknown>
  published?: boolean
}

export interface SearchResult extends SearchDocument {
  score: number
}

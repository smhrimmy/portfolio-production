import { motion } from "framer-motion"

interface FilterBarProps {
  categories: string[]
  activeCategory: string
  onSelect: (category: string) => void
}

export function FilterBar({ categories, activeCategory, onSelect }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-12">
      {["All", ...categories].map((category) => {
        const isActive = activeCategory === category
        
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            aria-pressed={isActive}
            className={`
              relative px-4 py-2 text-sm font-medium rounded-full transition-colors
              ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-primary rounded-full -z-10"
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        )
      })}
    </div>
  )
}

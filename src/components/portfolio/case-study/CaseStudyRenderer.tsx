import { CaseStudyHero } from "./CaseStudyHero"
import { CaseStudyOverview } from "./CaseStudyOverview"
import { CaseStudyTechStack } from "./CaseStudyTechStack"
import { CaseStudyArchitecture } from "./CaseStudyArchitecture"
import type { Project } from "../../../types/project"

export function CaseStudyRenderer({ project }: { project: Project }) {
  return (
    <article className="w-full">
      <CaseStudyHero project={project} />
      
      {/* Overview, Role, Problem, Goals, Constraints */}
      <CaseStudyOverview project={project} />
      
      {/* Tech Stack categorization */}
      {project.techStack && project.techStack.length > 0 && (
        <CaseStudyTechStack techStack={project.techStack} />
      )}

      {/* Architecture */}
      {project.architecture && (
        <CaseStudyArchitecture 
          architecture={project.architecture} 
          architectureDiagram={project.architectureDiagram} 
        />
      )}
      
      {/* Fallback for other sections (Architecture, Results) will be implemented here */}
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl py-24 prose prose-lg dark:prose-invert">
        
        {project.challenges && project.challenges.length > 0 && (
          <section id="challenges">
            <h2>Engineering Challenges</h2>
            {project.challenges.map((c, i) => (
              <div key={i} className="mb-8">
                <h3>{c.challenge}</h3>
                <p><strong>Solution:</strong> {c.solution}</p>
                {c.result && <p><strong>Result:</strong> {c.result}</p>}
              </div>
            ))}
          </section>
        )}

        {project.results && project.results.length > 0 && (
          <section id="results">
            <h2>Outcomes & Evidence</h2>
            <ul>
              {project.results.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </section>
        )}
        
        {project.lessons && project.lessons.length > 0 && (
          <section id="lessons">
            <h2>Lessons Learned</h2>
            <ul>
              {project.lessons.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}

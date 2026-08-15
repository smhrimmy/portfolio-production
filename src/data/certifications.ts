import type { Certification } from "../types/certification"

export const certificationsData: Certification[] = [
  {
    id: "cert_1",
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    issueDate: "2024-01-15",
    expiryDate: "2027-01-15",
    credentialId: "AWS-12345678",
    credentialUrl: "https://aws.amazon.com/certification",
    category: "Cloud",
    skills: ["Cloud Architecture", "AWS", "Infrastructure"],
    featured: true,
    order: 1,
    status: "active"
  },
  {
    id: "cert_2",
    name: "Google Professional Cloud Developer",
    issuer: "Google Cloud",
    issueDate: "2023-06-10",
    credentialId: "GCP-87654321",
    credentialUrl: "https://cloud.google.com/certification",
    category: "Cloud",
    skills: ["GCP", "Cloud Native", "Kubernetes"],
    featured: false,
    order: 2,
    status: "active"
  }
]

export async function getCertifications(): Promise<Certification[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return [...certificationsData].sort((a, b) => a.order - b.order)
}

export async function getFeaturedCertifications(): Promise<Certification[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return certificationsData.filter(c => c.featured).sort((a, b) => a.order - b.order)
}

export async function getCertificationCategories(): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  const categories = new Set(certificationsData.map(c => c.category).filter(Boolean) as string[])
  return Array.from(categories)
}

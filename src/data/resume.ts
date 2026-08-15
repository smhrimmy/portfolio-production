import type { Resume } from "../types/resume"

export const resumeData: Resume = {
  id: "res_1",
  title: "Prajwal DL - Software Engineer Resume",
  fileUrl: "/Prajwal-DL-Resume.pdf", // This will map to public/Prajwal-DL-Resume.pdf
  version: "1.0.0",
  updatedAt: new Date().toISOString(),
  featured: true
}

export async function getResume(): Promise<Resume> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return resumeData
}

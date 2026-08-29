import { createBrowserRouter } from "react-router-dom"
import { PublicLayout } from "../layouts/PublicLayout"
import { AdminLayout } from "../layouts/AdminLayout"
import { Home } from "../pages/Home"
import Projects from "../pages/Projects"
import ProjectDetail from "../pages/ProjectDetail"
import Experience from "../pages/Experience"
import Writing from "../pages/Writing"
import ArticleDetail from "../pages/ArticleDetail"
import About from "../pages/About"
import Skills from "../pages/Skills"
import Certifications from "../pages/Certifications"
import { Lab } from "../pages/Lab"
import { LabExperiment } from "../pages/LabExperiment"
import ResumePage from "../pages/Resume"
import Contact from "../pages/Contact"
import Search from "../pages/Search"
import Dashboard from "../pages/admin/Dashboard"
import Login from "../pages/admin/Login"
import ProjectsAdmin from "../pages/admin/content/ProjectsAdmin"
import ExperienceAdmin from "../pages/admin/content/ExperienceAdmin"
import ArticlesAdmin from "../pages/admin/content/ArticlesAdmin"
import SkillsAdmin from "../pages/admin/content/SkillsAdmin"
import CertificationsAdmin from "../pages/admin/content/CertificationsAdmin"
import SitesAdmin from "../pages/admin/content/SitesAdmin"
import TestimonialsAdmin from "../pages/admin/content/TestimonialsAdmin"
import SubscribersAdmin from "../pages/admin/audience/SubscribersAdmin"
import PublishingDashboard from "../pages/admin/content/PublishingDashboard"
import ThemeStudio from "../pages/admin/design/ThemeStudio"
import AiStudio from "../pages/admin/ai/AiStudio"
import MediaLibrary from "../pages/admin/media/MediaLibrary"
import { ProfileEditor } from "../pages/admin/ProfileEditor"
import NavigationAdmin from "../pages/admin/content/NavigationAdmin"
import SettingsAdmin from "../pages/admin/content/SettingsAdmin"
import SeoStudio from "../pages/admin/seo/SeoStudio"
import GithubAdmin from "../pages/admin/content/GithubAdmin"
import ExperimentsAdmin from "../pages/admin/content/ExperimentsAdmin"
import ExperimentEditor from "../pages/admin/content/ExperimentEditor"
import AnalyticsDashboard from "../pages/admin/analytics/AnalyticsDashboard"
import { NotFound } from "../pages/NotFound"

export const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "content/profile",
        element: <ProfileEditor />
      },
      {
        path: "content/navigation",
        element: <NavigationAdmin />
      },
      {
        path: "settings",
        element: <SettingsAdmin />
      },
      {
        path: "seo",
        element: <SeoStudio />
      },
      {
        path: "github",
        element: <GithubAdmin />
      },
      {
        path: "content/lab",
        element: <ExperimentsAdmin />
      },
      {
        path: "content/lab/:id",
        element: <ExperimentEditor />
      },
      {
        path: "content/publishing",
        element: <PublishingDashboard />
      },
      {
        path: "content/projects",
        element: <ProjectsAdmin />
      },
      {
        path: "content/experience",
        element: <ExperienceAdmin />
      },
      {
        path: "content/articles",
        element: <ArticlesAdmin />
      },
      {
        path: "content/skills",
        element: <SkillsAdmin />
      },
      {
        path: "sites",
        element: <SitesAdmin />
      },
      {
        path: "analytics",
        element: <AnalyticsDashboard />,
      },
      {
        path: "content/certifications",
        element: <CertificationsAdmin />
      },
      {
        path: "content/testimonials",
        element: <TestimonialsAdmin />
      },
      {
        path: "audience/subscribers",
        element: <SubscribersAdmin />
      },
      {
        path: "design/theme",
        element: <ThemeStudio />
      },
      {
        path: "ai",
        element: <AiStudio />
      },
      {
        path: "media",
        element: <MediaLibrary />
      }
    ],
  },
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "skills",
        element: <Skills />,
      },
      {
        path: "certifications",
        element: <Certifications />
      },
      {
        path: "lab",
        element: <Lab />
      },
      {
        path: "lab/:slug",
        element: <LabExperiment />
      },
      {
        path: "resume",
        element: <ResumePage />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/:slug",
        element: <ProjectDetail />,
      },
      {
        path: "experience",
        element: <Experience />,
      },
      {
        path: "writing",
        element: <Writing />,
      },
      {
        path: "writing/:slug",
        element: <ArticleDetail />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])

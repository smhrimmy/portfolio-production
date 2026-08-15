import { createBrowserRouter } from "react-router-dom"
import { PublicLayout } from "../layouts/PublicLayout"
import { Home } from "../pages/Home"
import Projects from "../pages/Projects"
import ProjectDetail from "../pages/ProjectDetail"
import Experience from "../pages/Experience"
import Writing from "../pages/Writing"
import ArticleDetail from "../pages/ArticleDetail"
import About from "../pages/About"
import Skills from "../pages/Skills"
import Certifications from "../pages/Certifications"
import ResumePage from "../pages/Resume"
import Contact from "../pages/Contact"
import Search from "../pages/Search"
import { NotFound } from "../pages/NotFound"

export const router = createBrowserRouter([
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
        element: <Certifications />,
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

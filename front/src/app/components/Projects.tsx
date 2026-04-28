import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

interface Project {
  id: number;
  title: string;
  description: string;
  tags?: string;
  category?: string;
  demo_url?: string;
  github_url?: string;
  image?: string;
  sort_order: number;
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => {
        if (!res.ok) throw new Error("Nepavyko gauti projektų");
        return res.json();
      })
      .then(data => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading projects:", err);
        setProjects([]);
        setLoading(false);
      });
  }, []);

  return (
    <section id="projects" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal animation="bounce-in">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/35 bg-blue-500/10 text-blue-300 text-sm tracking-wide uppercase mb-5">
              Darbai
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-100">
              Projektai
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Realūs projektai — nuo idėjos iki veikiančio produkto.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Kraunami projektai...</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.12 } }
            }}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const projectTags = project.tags ? project.tags.split(",").map(t => t.trim()) : [];

  const getCategoryColor = () => {
    if (project.category === "Frontend") return "text-cyan-300 bg-cyan-500/10 border-cyan-500/30";
    if (project.category === "Full Stack") return "text-purple-300 bg-purple-500/10 border-purple-500/30";
    return "text-blue-300 bg-blue-500/10 border-blue-500/30";
  };

  const getDemoUrl = (url: string) => {
    if (!url) return url;
    let fullUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = url.startsWith("/") ? `${window.location.origin}${url}` : `${window.location.origin}/${url}`;
    }
    const separator = fullUrl.includes("?") ? "&" : "?";
    return `${fullUrl}${separator}v=${Date.now()}`;
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
        }
      }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div className="relative h-full rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-zinc-900/80 overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-blue-500/10">

        {/* Image area */}
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-800/60 to-zinc-800/60">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-serif font-bold text-slate-700 select-none">
                {project.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

          {/* Category badge */}
          {project.category && (
            <div className="absolute top-3 left-3">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getCategoryColor()}`}>
                {project.category}
              </span>
            </div>
          )}

          {/* Hover overlay with demo link */}
          {project.demo_url && (
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(getDemoUrl(project.demo_url!), "_blank", "noopener,noreferrer")}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Žiūrėti demo
              </motion.button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-serif font-semibold text-gray-100 group-hover:text-white transition-colors leading-tight">
              {project.title}
            </h3>
            {project.demo_url && (
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-0.5" />
            )}
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-4 group-hover:text-slate-300 transition-colors line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          {projectTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {projectTags.slice(0, 4).map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 text-xs rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50"
                >
                  {tag}
                </span>
              ))}
              {projectTags.length > 4 && (
                <span className="px-2.5 py-0.5 text-xs rounded-full bg-slate-800/80 text-slate-500 border border-slate-700/50">
                  +{projectTags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1 border-t border-slate-800">
            {project.demo_url && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open(getDemoUrl(project.demo_url!), "_blank", "noopener,noreferrer")}
                className="flex items-center gap-1.5 text-sm text-slate-200 bg-slate-900 border border-blue-500/60 px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:border-blue-400 transition-all mt-3"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Demo
              </motion.button>
            )}
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 text-sm text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-800/50 hover:text-slate-300 transition-all mt-3"
              >
                <Github className="w-3.5 h-3.5" />
                Kodas
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

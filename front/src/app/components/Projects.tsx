import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useEffect, useState } from "react";

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
        if (!res.ok) throw new Error('Failed to fetch projects');
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-3 font-serif font-semibold text-gray-100">
            Projektai
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Mano sukurti projektai ir atsiskaityomieji darbai.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-400">Kraunami projektai...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const projectTags = project.tags ? project.tags.split(',').map(t => t.trim()) : [];
  const getEmoji = () => {
    if (project.category === 'Frontend') return '⚡';
    if (project.category === 'Full Stack') return '🚀';
    return '✨';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <div className="relative h-full">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-slate-800 to-zinc-900 rounded-2xl opacity-0 group-hover:opacity-25 blur-xl transition-opacity duration-300"
        />
        
        <div className="relative h-full bg-gradient-to-br from-slate-900/70 to-zinc-900/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 shadow-lg hover:shadow-slate-800/50">
          <div className="relative h-40 bg-gradient-to-br from-slate-800/40 to-zinc-800/40 flex items-center justify-center">
            {project.image ? (
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-4xl opacity-30">{getEmoji()}</div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-serif font-medium text-slate-200 group-hover:text-slate-100 transition-colors">
                {project.title}
              </h3>
              {project.category && (
                <span className="px-2 py-0.5 text-xs rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {project.category}
                </span>
              )}
            </div>
            <p className="text-slate-400 mb-4 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {projectTags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-slate-800/60 to-zinc-800/60 text-slate-300 border border-slate-700/50 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {project.demo_url && (
                <motion.a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 text-sm text-slate-200 bg-slate-900 border-2 border-blue-500 px-3 py-1 rounded-md hover:bg-slate-800 hover:border-blue-400 transition-all shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Demo</span>
                </motion.a>
              )}
              {project.github_url && (
                <motion.a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 text-sm text-slate-300 border border-slate-700 px-3 py-1 rounded-md hover:bg-slate-800/50 hover:border-slate-600 transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>Code</span>
                </motion.a>
              )}
            </div>
          </div>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
            className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
}

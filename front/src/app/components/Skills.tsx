import { motion } from "framer-motion";
import { Code2, Database, Layers, Smartphone, Globe, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

const defaultSkillCategories = [
  {
    icon: Code2,
    title: "Frontend",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Motion"]
  },
  {
    icon: Database,
    title: "Backend",
    skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "GraphQL"]
  },
  {
    icon: Smartphone,
    title: "Mobile",
    skills: ["React Native", "Flutter", "iOS", "Android", "Progressive Web Apps"]
  },
  {
    icon: Layers,
    title: "Design",
    skills: ["Figma", "Adobe XD", "UI/UX", "Prototyping", "Design Systems"]
  },
  {
    icon: Globe,
    title: "Cloud & DevOps",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Vercel"]
  },
  {
    icon: Cpu,
    title: "Other",
    skills: ["Git", "Agile", "Testing", "Performance", "Accessibility"]
  }
];

const iconMap: { [key: string]: any } = {
  "Frontend": Code2,
  "Frontend Development": Code2,
  "Backend": Database,
  "Backend Development": Database,
  "Mobile": Smartphone,
  "Mobile Development": Smartphone,
  "Design": Layers,
  "Cloud & DevOps": Globe,
  "Other": Cpu,
  "Other Skills": Cpu
};

export function Skills() {
  const [skillCategories, setSkillCategories] = useState(defaultSkillCategories);

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          const skillSections = data.filter((item: any) => 
            item.section?.startsWith("skills_") && item.data?.skills
          );
          
          if (skillSections.length > 0) {
            const categories = skillSections.map((section: any) => ({
              icon: iconMap[section.title] || Cpu,
              title: section.title,
              skills: section.data.skills || []
            }));
            setSkillCategories(categories);
          }
        }
      })
      .catch(err => console.error("Failed to load skills:", err));
  }, []);

  return (
    <section id="skills" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-3 font-serif font-semibold text-gray-100">Skills & Expertise</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">Technologies and tools used to craft reliable products</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative h-full">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-slate-800 to-zinc-900 rounded-2xl opacity-0 group-hover:opacity-25 blur-xl transition-opacity duration-300"
                />
                
                <div className="relative h-full bg-gradient-to-br from-slate-900/70 to-zinc-900/70 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 shadow-lg hover:shadow-slate-800/50">
                  <div className="mb-4 inline-block">
                    <div className="bg-gradient-to-br from-slate-800 to-zinc-800 border border-blue-500/40 p-3 rounded-lg inline-flex items-center justify-center shadow-md shadow-blue-500/10">
                      <category.icon className="w-6 h-6 text-slate-400" />
                    </div>
                  </div>

                  <h3 className="text-lg mb-4 font-serif font-medium text-slate-200">
                    {category.title}
                  </h3>

                  <div className="space-y-3">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skillIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.06 + skillIndex * 0.04 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-slate-600 shadow-sm shadow-slate-600/50" />
                        <span className="text-slate-400">{skill}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mt-6"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24"
        >
          <h3 className="text-3xl mb-12 text-center bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Experience
          </h3>
          
          <div className="max-w-3xl mx-auto space-y-8">
            {[
              { year: "2024 - 2026", role: "Learning JavaScript", company: "KTMC" }
            ].map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 group"
              >
                <div className="relative">
                  <motion.div
                    className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 border-4 border-black"
                    whileHover={{ scale: 1.5 }}
                  />
                  {index < 2 && (
                    <div className="absolute top-4 left-1/2 w-px h-16 bg-gradient-to-b from-gray-700 to-transparent -translate-x-1/2" />
                  )}
                </div>
                
                <div className="flex-1 pb-8">
                  <div className="text-sm text-gray-500 mb-1">{exp.year}</div>
                  <div className="text-xl text-white mb-1">{exp.role}</div>
                  <div className="text-gray-400">{exp.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

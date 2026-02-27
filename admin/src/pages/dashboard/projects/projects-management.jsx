import { useEffect, useState, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Chip,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AuthContext, AlertContext } from "@/context";
import { LoadingScreen } from "@/components/Spinner";

const TABLE_HEAD = ["Nuotrauka", "Pavadinimas", "Aprašymas", "Kategorija", "Data", "Veiksmai"];

export function ProjectsManagement() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    demo_url: "",
    github_url: "",
    tags: "",
    category: "",
    sort_order: 0,
    publish_date: new Date().toISOString().split('T')[0],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const { token } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/projects", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Nepavyko užkrauti projektų`);
      }
      
      const data = await res.json();
      setProjects(data);
    } catch (e) {
      const errorMsg = e.message || "Nepavyko užkrauti projektų";
      setError(errorMsg);
      addAlert(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle create/edit
  const handleSubmit = async () => {
    try {
      // Validacija
      if (!formData.title || !formData.description) {
        addAlert("Užpildykite visus privalomus laukus", "error");
        return;
      }

      const url = selectedProject ? `/api/projects/${selectedProject.id}` : "/api/projects";
      const method = selectedProject ? "PUT" : "POST";

      // Create FormData for file upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('demo_url', formData.demo_url || '');
      data.append('github_url', formData.github_url || '');
      data.append('tags', formData.tags || '');
      data.append('category', formData.category || '');
      data.append('sort_order', formData.sort_order || 0);
      data.append('publish_date', formData.publish_date || new Date().toISOString().split('T')[0]);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Nepavyko išsaugoti projekto`);
      }

      addAlert(
        selectedProject ? "Projektas atnaujintas" : "Projektas sukurtas",
        "success"
      );
      
      setEditDialog(false);
      setSelectedProject(null);
      setImagePreview(null);
      setFormData({
        title: "",
        description: "",
        demo_url: "",
        github_url: "",
        tags: "",
        category: "",
        sort_order: 0,
        publish_date: new Date().toISOString().split('T')[0],
        image: null,
      });
      fetchProjects();
    } catch (e) {
      addAlert(e.message || "Nepavyko išsaugoti projekto", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      const res = await fetch(`/api/projects/${projectToDelete}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Nepavyko ištrinti projekto`);
      }

      addAlert("Projektas ištrintas", "success");
      setDeleteDialog(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (e) {
      addAlert(e.message || "Nepavyko ištrinti projekto", "error");
    }
  };

  // Open edit dialog
  const openEditDialog = (project = null) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        title: project.title || "",
        description: project.description || "",
        demo_url: project.demo_url || "",
        github_url: project.github_url || "",
        tags: project.tags || "",
        category: project.category || "",
        sort_order: project.sort_order || 0,
        publish_date: project.publish_date ? new Date(project.publish_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        image: null,
      });
      setImagePreview(project.image || null);
    } else {
      setSelectedProject(null);
      setFormData({
        title: "",
        description: "",
        demo_url: "",
        github_url: "",
        tags: "",
        category: "",
        sort_order: 0,
        publish_date: new Date().toISOString().split('T')[0],
        image: null,
      });
      setImagePreview(null);
    }
    setEditDialog(true);
  };

  return (
    <div className="mt-12">
      <Card className="h-full w-full bg-slate-900 border-0 shadow-2xl">
        <CardHeader floated={false} shadow={false} className="rounded-none bg-slate-900 border-b-2 border-blue-500 mb-8 p-6 shadow-lg">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="white" className="font-bold">
                Projektų valdymas
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-80">
                Valdykite savo portfelio projektus
              </Typography>
            </div>
            <Button
              size="sm"
              className="flex items-center gap-2 bg-slate-900 border-2 border-blue-500 text-slate-200 hover:bg-slate-800 hover:border-blue-400 transition-colors shadow-lg"
              onClick={() => openEditDialog()}
            >
              <PlusIcon className="h-4 w-4" />
              Pridėti projektą
            </Button>
          </div>
        </CardHeader>

        <CardBody className="overflow-scroll px-0">
          {loading && <LoadingScreen message="Užkraunami projektai..." />}

          {!loading && projects.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-400">
              Nėra projektų. Pradėkite kurdami naują.
            </div>
          )}

          {!loading && projects.length > 0 && (
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-slate-700 bg-slate-800/50 p-4"
                    >
                      <Typography
                        variant="small"
                        className="font-normal leading-none text-slate-300"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => {
                  const isLast = index === projects.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-slate-700/50";

                  return (
                    <tr 
                      key={project.id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className={classes}>
                        {project.image ? (
                          <img 
                            src={`http://localhost:3000${project.image}`} 
                            alt={project.title}
                            className="w-16 h-16 object-cover rounded border border-slate-700"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-slate-600 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-200">
                          {project.title}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-400 max-w-md truncate">
                          {project.description}
                        </Typography>
                      </td>
                      <td className={classes}>
                        {project.category ? (
                          <Chip
                            size="sm"
                            value={project.category}
                            className="bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          />
                        ) : (
                          <span className="text-slate-600 text-sm">-</span>
                        )}
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-400 text-sm">
                          {project.publish_date ? new Date(project.publish_date).toLocaleDateString('lt-LT') : '-'}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex gap-2">
                          <IconButton
                            variant="text"
                            size="sm"
                            onClick={() => openEditDialog(project)}
                            className="hover:bg-blue-500/20 text-blue-400"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            variant="text"
                            size="sm"
                            onClick={() => {
                              setProjectToDelete(project.id);
                              setDeleteDialog(true);
                            }}
                            className="hover:bg-red-500/20 text-red-400"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={editDialog} 
        handler={() => setEditDialog(false)}
        className="bg-slate-900 border border-slate-700"
        size="lg"
      >
        <DialogHeader className="text-slate-200 border-b border-slate-700">
          {selectedProject ? "Redaguoti projektą" : "Naujas projektas"}
        </DialogHeader>
        <DialogBody className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <Input
              label="Pavadinimas"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-slate-200"
            />
          </div>
          <div>
            <Textarea
              label="Aprašymas"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-slate-200"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Demo URL"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                className="text-slate-200"
                placeholder="/projektas/skaiciuotuvas"
              />
            </div>
            <div>
              <Input
                label="GitHub URL"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="text-slate-200"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Tags (kableliais)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="text-slate-200"
                placeholder="React,Node.js,MySQL"
              />
            </div>
            <div>
              <Input
                label="Kategorija"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="text-slate-200"
                placeholder="Frontend, Backend, Full Stack"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Nuotrauka</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData({ ...formData, image: file });
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700"
            />
            {imagePreview && (
              <div className="mt-4">
                <img 
                  src={imagePreview.startsWith('blob:') ? imagePreview : `http://localhost:3000${imagePreview}`} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded border-2 border-slate-700"
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="number"
                label="Rikiavimo numeris"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="text-slate-200"
              />
            </div>
            <div>
              <Input
                type="date"
                label="Publikavimo data"
                value={formData.publish_date}
                onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                className="text-slate-200"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="border-t border-slate-700">
          <Button variant="text" onClick={() => setEditDialog(false)} className="mr-2">
            Atšaukti
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-slate-900 border-2 border-blue-500 hover:bg-slate-800 hover:border-blue-400"
            disabled={!formData.title || !formData.description}
          >
            {selectedProject ? "Atnaujinti" : "Sukurti"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog} 
        handler={() => setDeleteDialog(false)}
        className="bg-slate-900 border border-slate-700"
      >
        <DialogHeader className="text-slate-200 border-b border-slate-700">
          Patvirtinti ištrynimą
        </DialogHeader>
        <DialogBody>
          <Typography className="text-slate-300">
            Ar tikrai norite ištrinti šį projektą? Šio veiksmo negalima atšaukti.
          </Typography>
        </DialogBody>
        <DialogFooter className="border-t border-slate-700">
          <Button variant="text" onClick={() => setDeleteDialog(false)} className="mr-2">
            Atšaukti
          </Button>
          <Button 
            onClick={handleDelete}
            className="bg-red-900/30 border-2 border-red-500 hover:bg-red-900/50 hover:border-red-400 text-red-300"
          >
            Ištrinti
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ProjectsManagement;

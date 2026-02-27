import { useEffect, useState, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react";
import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/solid";
import { AuthContext, AlertContext } from "@/context";

export function FeatureBoxManagement() {
  const [featureBoxes, setFeatureBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [currentBox, setCurrentBox] = useState(null);
  const [formData, setFormData] = useState({
    section: "about_features",
    label: "",
    icon: "Code2",
    description: "",
    display_order: 0,
    is_active: 1
  });

  const { token } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);

  // Available Lucide icons
  const availableIcons = [
    "Code2", "Palette", "Zap", "Rocket", "Layers", "Shield", 
    "Gauge", "Smartphone", "Code", "Sparkles", "Star", "Heart",
    "CheckCircle", "Users", "Globe", "Lock", "Key", "Target"
  ];

  // Section options
  const sectionOptions = [
    { value: "about_features", label: "About - Feature Boxes" },
    { value: "home_features", label: "Home - Features" },
    { value: "services_features", label: "Services" },
    { value: "skills_features", label: "Skills Highlights" }
  ];

  // Fetch all feature boxes
  const fetchFeatureBoxes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/feature-boxes", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Nepavyko užkrauti feature boxes");

      const data = await res.json();
      setFeatureBoxes(data);
    } catch (e) {
      addAlert(e.message || "Klaida kraunant feature boxes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatureBoxes();
  }, []);

  // Open create dialog
  const handleCreate = () => {
    setCurrentBox(null);
    setFormData({
      section: "about_features",
      label: "",
      icon: "Code2",
      description: "",
      display_order: 0,
      is_active: 1
    });
    setEditDialog(true);
  };

  // Open edit dialog
  const handleEdit = (box) => {
    setCurrentBox(box);
    setFormData({
      section: box.section,
      label: box.label,
      icon: box.icon,
      description: box.description || "",
      display_order: box.display_order,
      is_active: box.is_active
    });
    setEditDialog(true);
  };

  // Close dialog
  const handleClose = () => {
    setEditDialog(false);
    setCurrentBox(null);
    setFormData({
      section: "about_features",
      label: "",
      icon: "Code2",
      description: "",
      display_order: 0,
      is_active: 1
    });
  };

  // Save changes
  const handleSave = async () => {
    try {
      if (!formData.label || !formData.section) {
        addAlert("Pavadinimas ir sekcija privalomi", "error");
        return;
      }

      const url = currentBox 
        ? `/api/feature-boxes/${currentBox.id}` 
        : "/api/feature-boxes";
      
      const method = currentBox ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Klaida išsaugant");
      }

      addAlert(
        currentBox ? "Feature box atnaujintas" : "Feature box sukurtas", 
        "success"
      );
      handleClose();
      fetchFeatureBoxes();
    } catch (e) {
      addAlert(e.message || "Klaida išsaugant pakeitimus", "error");
    }
  };

  // Delete feature box
  const handleDelete = async () => {
    try {
      if (!currentBox) return;

      const res = await fetch(`/api/feature-boxes/${currentBox.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Klaida trinant");
      }

      addAlert("Feature box ištrintas", "success");
      setDeleteDialog(false);
      setCurrentBox(null);
      fetchFeatureBoxes();
    } catch (e) {
      addAlert(e.message || "Klaida trinant", "error");
    }
  };

  // Move box up/down
  const handleMove = async (box, direction) => {
    try {
      const sectionBoxes = featureBoxes
        .filter(b => b.section === box.section)
        .sort((a, b) => a.display_order - b.display_order);
      
      const currentIndex = sectionBoxes.findIndex(b => b.id === box.id);
      
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === sectionBoxes.length - 1)
      ) {
        return; // Can't move
      }

      const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const updates = [
        { id: sectionBoxes[currentIndex].id, display_order: sectionBoxes[swapIndex].display_order },
        { id: sectionBoxes[swapIndex].id, display_order: sectionBoxes[currentIndex].display_order }
      ];

      const res = await fetch("/api/feature-boxes/order/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) throw new Error("Klaida keičiant tvarką");

      fetchFeatureBoxes();
    } catch (e) {
      addAlert(e.message || "Klaida keičiant tvarką", "error");
    }
  };

  // Group by section
  const groupedBoxes = featureBoxes.reduce((acc, box) => {
    if (!acc[box.section]) acc[box.section] = [];
    acc[box.section].push(box);
    return acc;
  }, {});

  // Sort each section by display_order
  Object.keys(groupedBoxes).forEach(section => {
    groupedBoxes[section].sort((a, b) => a.display_order - b.display_order);
  });

  if (loading) {
    return (
      <div className="mt-12">
        <Typography>Kraunama...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <Card className="bg-slate-900 border-0 shadow-2xl">
        <CardHeader className="mb-8 p-6 bg-slate-900 border-b-2 border-blue-500 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="h5" color="white" className="font-bold">
                Feature Boxes valdymas
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-80">
                Tvarkykite funkcijų korteles ir jų išdėstymą
              </Typography>
            </div>
            <Button
              size="sm"
              className="flex items-center gap-2 bg-slate-900 border-2 border-blue-500 text-slate-200 hover:bg-slate-800 hover:border-blue-400 transition-colors shadow-lg"
              onClick={handleCreate}
            >
              <PlusIcon className="h-4 w-4" />
              Pridėti naują
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          {Object.keys(groupedBoxes).length === 0 ? (
            <div className="p-6 text-center">
              <Typography color="gray">
                Nėra sukurtų feature boxes. Pradėkite kurdami naują.
              </Typography>
            </div>
          ) : (
            Object.entries(groupedBoxes).map(([section, boxes]) => (
              <div key={section} className="p-6 border-b border-gray-700/50 last:border-0">
                <Typography variant="h6" className="mb-4 text-white font-bold flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-slate-700 to-blue-500 rounded-full"></span>
                  {sectionOptions.find(s => s.value === section)?.label || section}
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {boxes.map((box, index) => (
                    <Card 
                      key={box.id} 
                      className={`transition-all duration-300 ${
                        box.is_active 
                          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 card-hover' 
                          : 'bg-gradient-to-br from-red-900/20 to-gray-900 border border-red-900/50 opacity-60'
                      }`}
                    >
                      <CardBody className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <Typography variant="h6" className="text-sm text-white font-semibold">
                              {box.label}
                            </Typography>
                            <Chip 
                              size="sm" 
                              value={box.icon} 
                              className={`mt-1 w-fit text-xs ${
                                box.is_active 
                                  ? 'bg-gradient-to-r from-slate-700 to-blue-500' 
                                  : 'bg-red-500'
                              }`}
                            />
                          </div>
                          <div className="flex gap-1">
                            <IconButton
                              size="sm"
                              variant="text"
                              className="hover:bg-blue-500/20 text-gray-400 hover:text-blue-400"
                              onClick={() => handleMove(box, "up")}
                              disabled={index === 0}
                            >
                              <ArrowUpIcon className="h-3 w-3" />
                            </IconButton>
                            <IconButton
                              size="sm"
                              variant="text"
                              className="hover:bg-blue-500/20 text-gray-400 hover:text-blue-400"
                              onClick={() => handleMove(box, "down")}
                              disabled={index === boxes.length - 1}
                            >
                              <ArrowDownIcon className="h-3 w-3" />
                            </IconButton>
                          </div>
                        </div>
                        
                        {box.description && (
                          <Typography variant="small" className="mb-3 text-xs line-clamp-2 text-gray-300">
                            {box.description}
                          </Typography>
                        )}
                        
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="text"
                            className="p-2 hover:bg-blue-500/20 text-blue-400"
                            onClick={() => handleEdit(box)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="text"
                            className="p-2 hover:bg-red-500/20 text-red-400"
                            onClick={() => {
                              setCurrentBox(box);
                              setDeleteDialog(true);
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialog} handler={handleClose} size="md">
        <DialogHeader>
          {currentBox ? "Redaguoti Feature Box" : "Sukurti naują Feature Box"}
        </DialogHeader>
        <DialogBody divider className="h-[32rem] overflow-y-scroll">
          <div className="space-y-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Sekcija *
              </Typography>
              <Select
                value={formData.section}
                onChange={(value) => setFormData({ ...formData, section: value })}
                label="Pasirinkite sekciją"
              >
                {sectionOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Pavadinimas *
              </Typography>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                label="Pavyzdžiui: Clean Code"
              />
            </div>
            
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Ikona
              </Typography>
              <Select
                value={formData.icon}
                onChange={(value) => setFormData({ ...formData, icon: value })}
                label="Pasirinkite ikoną"
              >
                {availableIcons.map(icon => (
                  <Option key={icon} value={icon}>
                    {icon}
                  </Option>
                ))}
              </Select>
            </div>
            
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Aprašymas (tooltip)
              </Typography>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                label="Papildomas aprašymas"
                rows={3}
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Rodymo tvarka
              </Typography>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                label="Tvarka (skaičius)"
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Aktyvus
              </Typography>
              <Select
                value={formData.is_active?.toString()}
                onChange={(value) => setFormData({ ...formData, is_active: parseInt(value) })}
                label="Ar rodomas puslapyje?"
              >
                <Option value="1">Taip</Option>
                <Option value="0">Ne</Option>
              </Select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleClose} className="mr-2">
            Atšaukti
          </Button>
          <Button variant="gradient" color="green" onClick={handleSave}>
            Išsaugoti
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)} size="sm">
        <DialogHeader>Patvirtinti trinimą</DialogHeader>
        <DialogBody>
          <Typography>
            Ar tikrai norite ištrinti feature box "{currentBox?.label}"?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setDeleteDialog(false)} className="mr-2">
            Atšaukti
          </Button>
          <Button variant="gradient" color="red" onClick={handleDelete}>
            Ištrinti
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default FeatureBoxManagement;

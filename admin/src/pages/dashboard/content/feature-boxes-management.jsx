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
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";
import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon
} from "@heroicons/react/24/solid";
import { AuthContext, AlertContext } from "@/context";
import { LoadingScreen } from "@/components/Spinner";

const FEATURE_TABS = [
  { label: "About Me", value: "about", icon: UserIcon, section: "about_features" },
  { label: "Projects", value: "projects", icon: BriefcaseIcon, section: "projects_features" },
  { label: "Skills", value: "skills", icon: AcademicCapIcon, section: "skills_features" },
  { label: "Experience", value: "experience", icon: ClockIcon, section: "experience_features" },
];

export function FeatureBoxesManagement() {
  const [featureBoxes, setFeatureBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [currentBox, setCurrentBox] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [formData, setFormData] = useState({
    section: "about_features",
    label: "",
    icon: "Code2",
    description: "",
    sort_order: 0
  });

  const { token } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);

  // Available Lucide icons
  const availableIcons = [
    "Code2", "Palette", "Zap", "Rocket", "Layers", "Shield", 
    "Gauge", "Smartphone", "Code", "Sparkles", "Star", "Heart",
    "CheckCircle", "Users", "Globe", "Lock", "Key", "Target",
    "TrendingUp", "Award", "Coffee", "Lightbulb", "Clock",
    "Calendar", "Briefcase", "Database", "Server", "Cloud"
  ];

  // Fetch all feature boxes
  const fetchFeatureBoxes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/feature-boxes", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Nepavyko užkrauti feature boxes`);
      }

      const data = await res.json();
      setFeatureBoxes(data);
    } catch (e) {
      const errorMsg = e.message || "Klaida kraunant feature boxes";
      setError(errorMsg);
      addAlert(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatureBoxes();
  }, []);

  // Get current tab section
  const getCurrentSection = () => {
    return FEATURE_TABS.find(t => t.value === activeTab)?.section || "about_features";
  };

  // Open create dialog
  const handleCreate = () => {
    setCurrentBox(null);
    const section = getCurrentSection();
    setFormData({
      section,
      label: "",
      icon: "Code2",
      description: "",
      sort_order: getNextSortOrder(section)
    });
    setEditDialog(true);
  };

  // Get next sort order for section
  const getNextSortOrder = (section) => {
    const sectionBoxes = featureBoxes.filter(b => b.section === section);
    return sectionBoxes.length > 0 
      ? Math.max(...sectionBoxes.map(b => b.sort_order || 0)) + 1 
      : 0;
  };

  // Open edit dialog
  const handleEdit = (box) => {
    setCurrentBox(box);
    setFormData({
      section: box.section,
      label: box.label,
      icon: box.icon,
      description: box.description || "",
      sort_order: box.sort_order || 0
    });
    setEditDialog(true);
  };

  // Close dialog
  const handleClose = () => {
    setEditDialog(false);
    setCurrentBox(null);
    setFormData({
      section: getCurrentSection(),
      label: "",
      icon: "Code2",
      description: "",
      sort_order: 0
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
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${res.status}: Klaida išsaugant`);
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

  // Open delete dialog
  const handleDeleteClick = (box) => {
    setCurrentBox(box);
    setDeleteDialog(true);
  };

  // Delete feature box
  const handleDelete = async () => {
    try {
      if (!currentBox) {
        addAlert("Nėra pasirinkto elemento", "error");
        return;
      }

      const res = await fetch(`/api/feature-boxes/${currentBox.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${res.status}: Klaida trinant`);
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
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      
      const currentIndex = sectionBoxes.findIndex(b => b.id === box.id);
      
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === sectionBoxes.length - 1)
      ) {
        return;
      }

      const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      
      // Update both boxes
      const results = await Promise.all([
        fetch(`/api/feature-boxes/${sectionBoxes[currentIndex].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            ...sectionBoxes[currentIndex],
            sort_order: sectionBoxes[swapIndex].sort_order 
          }),
        }),
        fetch(`/api/feature-boxes/${sectionBoxes[swapIndex].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            ...sectionBoxes[swapIndex],
            sort_order: sectionBoxes[currentIndex].sort_order 
          }),
        })
      ]);

      // Check if any request failed
      const failedRequest = results.find(res => !res.ok);
      if (failedRequest) {
        const errorData = await failedRequest.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${failedRequest.status}: Klaida keičiant tvarką`);
      }

      fetchFeatureBoxes();
    } catch (e) {
      addAlert(e.message || "Klaida keičiant tvarką", "error");
    }
  };

  // Get boxes for current tab
  const getBoxesForTab = (tabValue) => {
    const section = FEATURE_TABS.find(t => t.value === tabValue)?.section;
    return featureBoxes
      .filter(b => b.section === section)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  };

  if (loading) {
    return <LoadingScreen message="Užkraunamos funkcijos..." />;
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
                Tvarkykite funkcijų korteles pagal sekcijas
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
          <Tabs value={activeTab} className="px-6">
            <TabsHeader className="bg-slate-800 border border-slate-700">
              {FEATURE_TABS.map(({ value, label, icon: Icon }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => setActiveTab(value)}
                  className={activeTab === value ? "text-blue-500" : "text-slate-300"}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              {FEATURE_TABS.map(({ value }) => (
                <TabPanel key={value} value={value} className="py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {getBoxesForTab(value).map((box, index) => {
                      const boxes = getBoxesForTab(value);
                      return (
                        <Card 
                          key={box.id} 
                          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 card-hover"
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
                                  className="mt-1 w-fit text-xs bg-gradient-to-r from-slate-700 to-blue-500"
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
                                onClick={() => handleDeleteClick(box)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      );
                    })}
                    {getBoxesForTab(value).length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <Typography className="text-slate-400">
                          Šioje sekcijoje nėra feature boxes
                        </Typography>
                      </div>
                    )}
                  </div>
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog} handler={handleClose} size="md">
        <DialogHeader>
          {currentBox ? "Redaguoti Feature Box" : "Naujas Feature Box"}
        </DialogHeader>
        <DialogBody divider className="max-h-[32rem] overflow-y-scroll">
          <div className="space-y-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Sekcija
              </Typography>
              <Input
                value={FEATURE_TABS.find(t => t.section === formData.section)?.label || formData.section}
                disabled
                label="Sekcija"
              />
            </div>
            
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Pavadinimas *
              </Typography>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                label="Pavadinimas"
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Ikona
              </Typography>
              <Select
                value={formData.icon}
                onChange={(val) => setFormData({ ...formData, icon: val })}
                label="Pasirinkite ikoną"
              >
                {availableIcons.map((icon) => (
                  <Option key={icon} value={icon}>
                    {icon}
                  </Option>
                ))}
              </Select>
            </div>
            
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Aprašymas
              </Typography>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                label="Aprašymas"
                rows={4}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleClose} className="mr-2">
            Atšaukti
          </Button>
          <Button 
            className="bg-slate-900 border-2 border-blue-500 text-slate-200 hover:bg-slate-800"
            onClick={handleSave}
          >
            Išsaugoti
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)} size="xs">
        <DialogHeader>Patvirtinti trynimą</DialogHeader>
        <DialogBody>
          Ar tikrai norite ištrinti šį feature box? Šis veiksmas negrįžtamas.
        </DialogBody>
        <DialogFooter>
          <Button 
            variant="text" 
            color="blue-gray" 
            onClick={() => setDeleteDialog(false)} 
            className="mr-2"
          >
            Atšaukti
          </Button>
          <Button 
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
          >
            Ištrinti
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default FeatureBoxesManagement;

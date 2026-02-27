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
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";
import { PencilIcon, PlusIcon, HomeIcon, UserIcon, BriefcaseIcon, AcademicCapIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { AuthContext, AlertContext } from "@/context";
import { LoadingScreen } from "@/components/Spinner";

const SECTION_TABS = [
  { label: "Home", value: "home", icon: HomeIcon },
  { label: "About Me", value: "about", icon: UserIcon },
  { label: "Projects", value: "projects", icon: BriefcaseIcon },
  { label: "Skills & Experience", value: "skills", icon: AcademicCapIcon },
  { label: "Contact", value: "contact", icon: EnvelopeIcon },
];

export function ContentManagement() {
  const [contentSections, setContentSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    section: "",
    title: "",
    content: "",
    data: {}
  });

  const { token } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);

  // Fetch all content sections
  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/content", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Nepavyko užkrauti turinio`);
      }

      const data = await res.json();
      setContentSections(data);
    } catch (e) {
      const errorMsg = e.message || "Klaida kraunant turinį";
      setError(errorMsg);
      addAlert(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Open edit dialog
  const handleEdit = (section) => {
    setCurrentSection(section);
    setFormData({
      section: section.section,
      title: section.title || "",
      content: section.content || "",
      data: section.data || {}
    });
    setImageFile(null);
    setImagePreview(section.image ? `http://localhost:3000${section.image}` : null);
    setEditDialog(true);
  };

  // Close dialog
  const handleClose = () => {
    setEditDialog(false);
    setCurrentSection(null);
    setFormData({ section: "", title: "", content: "", data: {} });
    setImageFile(null);
    setImagePreview(null);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes
  const handleSave = async () => {
    try {
      if (!currentSection) {
        addAlert("Nėra pasirinktos sekcijos", "error");
        return;
      }

      if (!formData.title && !formData.content && !imageFile) {
        addAlert("Užpildykite bent vieną lauką", "error");
        return;
      }

      // Create FormData for multipart upload
      const submitData = new FormData();
      submitData.append('section', formData.section);
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('data', JSON.stringify(formData.data));
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const res = await fetch(`/api/content/${currentSection.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: submitData,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${res.status}: Klaida atnaujinant turinį`);
      }

      addAlert("Turinys sėkmingai atnaujintas", "success");
      handleClose();
      fetchContent();
    } catch (e) {
      addAlert(e.message || "Klaida išsaugant pakeitimus", "error");
    }
  };

  // Update skills in data object
  const handleSkillsChange = (skillsText) => {
    const skillsArray = skillsText.split(",").map(s => s.trim()).filter(s => s);
    setFormData({
      ...formData,
      data: { ...formData.data, skills: skillsArray }
    });
  };

  // Get section display name
  const getSectionName = (section) => {
    const names = {
      about_me: "Apie mane",
      hero_main: "Hero sekcija",
      feature_cards: "Feature Cards",
      selected_work: "Projektai (Selected Work)",
      skills_section: "Įgūdžiai",
      experience: "Patirtis",
      contact_section: "Kontaktai",
      skills_frontend: "Frontend įgūdžiai",
      skills_backend: "Backend įgūdžiai",
      skills_mobile: "Mobilių aplikacijų įgūdžiai",
      skills_design: "Dizaino įgūdžiai",
      skills_devops: "DevOps įgūdžiai",
      skills_other: "Kiti įgūdžiai",
      contact_info: "Kontaktinė informacija (sena)"
    };
    return names[section] || section;
  };

  // Filter sections by tab
  const getSectionsForTab = (tabName) => {
    const sectionMap = {
      home: ["hero_main"],
      about: ["about_me"],
      projects: ["selected_work", "feature_cards"],
      skills: ["skills_section", "experience", "skills_frontend", "skills_backend", "skills_mobile", "skills_design", "skills_devops", "skills_other"],
      contact: ["contact_section"]
    };
    
    return contentSections.filter(s => sectionMap[tabName]?.includes(s.section));
  };

  if (loading) {
    return <LoadingScreen message="Užkraunamas turinys..." />;
  }

  return (
    <div className="mt-12">
      <Card className="bg-slate-900 border-0 shadow-2xl">
        <CardHeader className="mb-8 p-6 bg-slate-900 border-b-2 border-blue-500 shadow-lg">
          <Typography variant="h5" color="white" className="font-bold">
            Turinio valdymas
          </Typography>
          <Typography variant="small" color="white" className="mt-1 opacity-80">
            Redaguokite svetainės turinį pagal puslapio sekcijas
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <Tabs value={activeTab} className="px-6">
            <TabsHeader className="bg-slate-800 border border-slate-700">
              {SECTION_TABS.map(({ value, label, icon: Icon }) => (
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
              {SECTION_TABS.map(({ value }) => (
                <TabPanel key={value} value={value} className="py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getSectionsForTab(value).map((section) => (
                      <Card key={section.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 card-hover">
                        <CardBody>
                          <div className="flex justify-between items-start mb-3">
                            <Typography variant="h6" className="text-white font-semibold">
                              {getSectionName(section.section)}
                            </Typography>
                            <Button
                              size="sm"
                              variant="text"
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                              onClick={() => handleEdit(section)}
                            >
                              <PencilIcon className="h-4 w-4 text-blue-400" />
                            </Button>
                          </div>
                          <Chip size="sm" value={section.section} className="mb-3 w-fit bg-gradient-to-r from-slate-700 to-blue-500" />
                          <Typography variant="small" className="font-normal line-clamp-3 text-gray-300">
                            {section.content || section.title}
                          </Typography>
                        </CardBody>
                      </Card>
                    ))}
                    {getSectionsForTab(value).length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <Typography className="text-slate-400">
                          Šioje sekcijoje nėra turinio
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
      <Dialog open={editDialog} handler={handleClose} size="lg">
        <DialogHeader>
          Redaguoti: {currentSection && getSectionName(currentSection.section)}
        </DialogHeader>
        <DialogBody divider className="h-[32rem] overflow-y-scroll">
          <div className="space-y-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Sekcijos kodas
              </Typography>
              <Input
                value={formData.section}
                disabled
                label="Sekcija"
              />
            </div>
            
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Pavadinimas
              </Typography>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                label="Pavadinimas"
              />
            </div>
            
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Turinys
              </Typography>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                label="Aprašymas"
                rows={6}
              />
            </div>

            {/* Image upload for about_me section */}
            {formData.section === "about_me" && (
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Nuotrauka
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Skills section for skill-related content */}
            {formData.section?.startsWith("skills_") && formData.data?.skills && (
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Įgūdžiai (atskirti kableliais)
                </Typography>
                <Textarea
                  value={formData.data.skills.join(", ")}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  label="Įgūdžiai"
                  rows={3}
                />
              </div>
            )}
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
    </div>
  );
}

export default ContentManagement;

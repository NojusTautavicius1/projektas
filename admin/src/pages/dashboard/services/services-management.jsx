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
  Checkbox,
  Select,
  Option,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { AuthContext, AlertContext } from "@/context";
import { LoadingScreen } from "@/components/Spinner";

const TABLE_HEAD = ["Name", "Price", "Delivery", "Popular", "Active", "Sort Order", "Actions"];

const ICON_OPTIONS = ["Zap", "Star", "Crown", "Package", "Rocket", "Shield"];

export function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    icon: "Zap",
    price: "",
    delivery_time: "",
    description: "",
    features: "",
    revisions: "",
    is_popular: false,
    is_active: true,
    sort_order: 0,
    color: "from-blue-500 to-cyan-500",
    border_color: "border-blue-500/30",
    bg_color: "bg-blue-500/10",
    icon_color: "text-blue-400",
  });

  const { token } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);

  // Fetch services
  useEffect(() => {
    fetchServices();
  }, [token]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/services");
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to load services`);
      }
      
      const data = await res.json();
      setServices(data);
    } catch (e) {
      const errorMsg = e.message || "Failed to load services";
      setError(errorMsg);
      addAlert(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle create/edit
  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.name || !formData.price || !formData.description) {
        addAlert("Please fill all required fields", "error");
        return;
      }

      // Parse features from textarea (one per line) to JSON array
      const featuresArray = formData.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const url = selectedService ? `/api/services/${selectedService.id}` : "/api/services";
      const method = selectedService ? "PUT" : "POST";

      const payload = {
        ...formData,
        features: featuresArray,
        is_popular: formData.is_popular ? 1 : 0,
        is_active: formData.is_active ? 1 : 0,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to save service`);
      }

      addAlert(
        selectedService ? "Service updated" : "Service created",
        "success"
      );
      
      setEditDialog(false);
      setSelectedService(null);
      resetForm();
      fetchServices();
    } catch (e) {
      addAlert(e.message || "Failed to save service", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const res = await fetch(`/api/services/${serviceToDelete}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to delete service`);
      }

      addAlert("Service deleted", "success");
      setDeleteDialog(false);
      setServiceToDelete(null);
      fetchServices();
    } catch (e) {
      addAlert(e.message || "Failed to delete service", "error");
    }
  };

  // Handle edit
  const handleEdit = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      icon: service.icon,
      price: service.price,
      delivery_time: service.delivery_time,
      description: service.description,
      features: Array.isArray(service.features) ? service.features.join('\n') : '',
      revisions: service.revisions,
      is_popular: Boolean(service.is_popular),
      is_active: Boolean(service.is_active),
      sort_order: service.sort_order,
      color: service.color,
      border_color: service.border_color,
      bg_color: service.bg_color,
      icon_color: service.icon_color,
    });
    setEditDialog(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      icon: "Zap",
      price: "",
      delivery_time: "",
      description: "",
      features: "",
      revisions: "",
      is_popular: false,
      is_active: true,
      sort_order: 0,
      color: "from-blue-500 to-cyan-500",
      border_color: "border-blue-500/30",
      bg_color: "bg-blue-500/10",
      icon_color: "text-blue-400",
    });
  };

  // Handle create new
  const handleCreateNew = () => {
    setSelectedService(null);
    resetForm();
    setEditDialog(true);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Services Management
          </Typography>
          <Button
            className="flex items-center gap-2"
            size="sm"
            onClick={handleCreateNew}
          >
            <PlusIcon className="h-4 w-4" /> Add New Service
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          {error && (
            <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-lg mx-4">
              {error}
            </div>
          )}
          
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((service) => {
                const className = "py-3 px-5 border-b border-blue-gray-50";
                
                return (
                  <tr key={service.id}>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {service.name}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-600">
                        {service.price}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-600">
                        {service.delivery_time}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={service.is_popular ? "green" : "gray"}
                        value={service.is_popular ? "Popular" : "Standard"}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={service.is_active ? "green" : "red"}
                        value={service.is_active ? "Active" : "Inactive"}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-600">
                        {service.sort_order}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex gap-2">
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => handleEdit(service)}
                        >
                          <PencilIcon className="h-4 w-4 text-blue-500" />
                        </IconButton>
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => {
                            setServiceToDelete(service.id);
                            setDeleteDialog(true);
                          }}
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {services.length === 0 && !error && (
            <div className="p-4 text-center text-gray-500">
              No services found. Click "Add New Service" to create one.
            </div>
          )}
        </CardBody>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialog} handler={() => setEditDialog(false)} size="lg">
        <DialogHeader>
          {selectedService ? "Edit Service" : "Create New Service"}
        </DialogHeader>
        <DialogBody divider className="max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="small" className="mb-2 font-semibold">
                Name *
              </Typography>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                label="Service Name"
              />
            </div>

            <div>
              <Typography variant="small" className="mb-2 font-semibold">
                Icon
              </Typography>
              <Select
                value={formData.icon}
                onChange={(val) => setFormData({ ...formData, icon: val })}
                label="Icon"
              >
                {ICON_OPTIONS.map((icon) => (
                  <Option key={icon} value={icon}>{icon}</Option>
                ))}
              </Select>
            </div>

            <div>
              <Typography variant="small" className="mb-2 font-semibold">
                Price *
              </Typography>
              <Input
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                label="Price (e.g., $299)"
              />
            </div>

            <div>
              <Typography variant="small" className="mb-2 font-semibold">
                Delivery Time *
              </Typography>
              <Input
                value={formData.delivery_time}
                onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                label="Delivery (e.g., 3-5 days)"
              />
            </div>

            <div className="md:col-span-2">
              <Typography variant="small" className="mb-2 font-semibold">
                Description *
              </Typography>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                label="Description"
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Typography variant="small" className="mb-2 font-semibold">
                Features (one per line)
              </Typography>
              <Textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                label="Enter each feature on a new line"
                rows={6}
              />
            </div>

            <div>
              <Typography variant="small" className="mb-2 font-semibold">
                Revisions
              </Typography>
              <Input
                value={formData.revisions}
                onChange={(e) => setFormData({ ...formData, revisions: e.target.value })}
                label="Revisions (e.g., 3 revisions)"
              />
            </div>

            <div>
              <Typography variant="small" className="mb-2 font-semibold">
                Sort Order
              </Typography>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                label="Sort Order"
              />
            </div>

            <div className="flex gap-6">
              <Checkbox
                checked={formData.is_popular}
                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                label="Popular"
              />
              <Checkbox
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                label="Active"
              />
            </div>

            <div className="md:col-span-2">
              <Typography variant="small" className="mb-2 font-semibold text-gray-600">
                Styling Options (Tailwind classes)
              </Typography>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  label="Color"
                  size="sm"
                />
                <Input
                  value={formData.border_color}
                  onChange={(e) => setFormData({ ...formData, border_color: e.target.value })}
                  label="Border Color"
                  size="sm"
                />
                <Input
                  value={formData.bg_color}
                  onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                  label="BG Color"
                  size="sm"
                />
                <Input
                  value={formData.icon_color}
                  onChange={(e) => setFormData({ ...formData, icon_color: e.target.value })}
                  label="Icon Color"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              setEditDialog(false);
              setSelectedService(null);
              resetForm();
            }}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleSubmit}>
            {selectedService ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)} size="sm">
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this service? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => {
              setDeleteDialog(false);
              setServiceToDelete(null);
            }}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ServicesManagement;

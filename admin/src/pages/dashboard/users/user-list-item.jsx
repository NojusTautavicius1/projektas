import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Typography,
  IconButton,
  Tooltip,
  Select,
  Option,
  Switch,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";

import { useContext, useState } from "react";
import { AuthContext, AlertContext } from "@/context";

export function UserListItem({userData, isLast, setError, setRows, roleList}) {
  const { id, role, email, nickname, status} = userData;

  const { token } = useContext(AuthContext);
  const { addAlert, hideAllAlerts } = useContext(AlertContext);
  
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editEmail, setEditEmail] = useState(email);
  const [editNickname, setEditNickname] = useState(nickname || "");

  const classes = isLast ? "p-4" : "p-4 border-b border-gray-700";

  const persistRoleChange = async (userId, fallbackRole, nextRole) => {
    try {
      // setError(null);

      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role: nextRole }),
      });

      if (!res.ok) {
        addAlert(`Nepavyko pakeisti rolės (HTTP ${res.status})`, "error");
      }
      
      try {
        const text = await res.text();
        if (text) {
          const data = JSON.parse(text);
          if (data?.message) {
            addAlert(data.message, "success");
          } else if (data?.error) {
            addAlert(data.error, "error");
          }
        }
      } catch (err) {
          addAlert(`JSON nuskaitymo klaida (HTTP ${res.status})`, "error");
      }
    } catch (err) {
      setRows((prev) =>
        prev.map((row) => {
          if (row.id !== userId) return row;
          if ((row.role ?? null) !== nextRole) return row;
          return { ...row, role: fallbackRole };
        })
      );

      addAlert(err.message || "Nepavyko pakeisti rolės", "error");
    }
  };

  const persistStatusChange = async (userId, fallbackStatus, nextStatus) => {
    try {
      setError(null);

      const res = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        addAlert("Būsenos pakeisti nepavyko", "error");
      }

      try {
        const text = await res.text();
        if (text) {
          const data = JSON.parse(text);
          if (data?.message) {
            addAlert(data.message, "success");
          } else if (data?.error) {
            addAlert(data.error, "error");
          }
        }
      } catch (err) {
          addAlert(`JSON nuskaitymo klaida (HTTP ${res.status})`, "error");
      }

    } catch (err) {
      setRows((prev) =>
        prev.map((row) => {
          if (row.id !== userId) return row;
          if ((row.status ?? null) !== nextStatus) return row;
          return { ...row, status: fallbackStatus };
        })
      );

      addAlert(err.message || "Nepavyko pakeisti būsenos", "error");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Nepavyko ištrinti vartotojo");
      }

      addAlert("Vartotojas sėkmingai ištrintas", "success");
      setRows((prev) => prev.filter(row => row.id !== id));
      setDeleteDialog(false);
    } catch (err) {
      addAlert(err.message || "Klaida trinant vartotoją", "error");
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          email: editEmail, 
          nickname: editNickname,
          password: "unchanged" // We're not changing password in this edit
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Nepavyko atnaujinti vartotojo");
      }

      addAlert("Vartotojas sėkmingai atnaujintas", "success");
      setRows((prev) => prev.map(row => 
        row.id === id ? { ...row, email: editEmail, nickname: editNickname } : row
      ));
      setEditDialog(false);
    } catch (err) {
      addAlert(err.message || "Klaida atnaujinant vartotoją", "error");
    }
  };

  return (
    <>
    <tr>
      <td className={classes}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <Typography variant="small" className="font-normal text-gray-200">
              {email}
            </Typography>
          </div>
        </div>
      </td>

      <td className={classes}>
        <div className="w-40"> 
          <Select 
            label="Vartotojo rolė"
            value={role}

            onChange={(val) => {
              const nextRole = val;

              if (!nextRole) {
                addAlert(`Rolės nėra: ${val}`, "error");
                return;
              }

              const prevRole = role ?? null;

              setRows((prev) =>
                prev.map((r) =>
                  r.id === id ? { ...r, role: val } : r
                )
              );

              persistRoleChange(id, prevRole, nextRole);
            }}
          >
            {roleList.map((r) => (
              <Option key={r} value={r} >{r}</Option>
            ))}
          </Select>                         
        </div>
      </td>

      <td className={classes}>
        <Switch
          checked={status === 1}
          onChange={() => {
            const prevStatus = status === 1 ? 1 : 0;
            const nextStatus = prevStatus === 1 ? 0 : 1;

            setRows((prev) =>
              prev.map((row) =>
                row.id === id ? { ...row, status: nextStatus } : row
              )
            );

            persistStatusChange(id, prevStatus, nextStatus);
          }}
        />
      </td>

      <td className={classes}>
        <div className="flex gap-2">
          <Tooltip content="Redaguoti vartotoją">
            <IconButton variant="text" onClick={() => setEditDialog(true)}>
              <PencilIcon className="h-4 w-4" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Ištrinti vartotoją">
            <IconButton variant="text" color="red" onClick={() => setDeleteDialog(true)}>
              <TrashIcon className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </div>
      </td>
    </tr>

    {/* Delete Confirmation Dialog */}
    <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)} className="bg-gray-800">
      <DialogHeader className="text-gray-100">Ištrinti vartotoją?</DialogHeader>
      <DialogBody className="text-gray-300">
        Ar tikrai norite ištrinti vartotoją <strong>{email}</strong>? Šis veiksmas negrįžtamas.
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

    {/* Edit Dialog */}
    <Dialog open={editDialog} handler={() => setEditDialog(false)} className="bg-gray-800">
      <DialogHeader className="text-gray-100">Redaguoti vartotoją</DialogHeader>
      <DialogBody className="space-y-4">
        <Input
          label="El. paštas"
          value={editEmail}
          onChange={(e) => setEditEmail(e.target.value)}
        />
        <Input
          label="Slapyvardis"
          value={editNickname}
          onChange={(e) => setEditNickname(e.target.value)}
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setEditDialog(false)} className="mr-2">
          Atšaukti
        </Button>
        <Button variant="gradient" color="green" onClick={handleEdit}>
          Išsaugoti
        </Button>
      </DialogFooter>
    </Dialog>
    </>
  );
}

export default UserListItem;

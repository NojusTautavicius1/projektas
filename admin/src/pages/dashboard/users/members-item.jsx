import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Typography,
  IconButton,
  Tooltip,
  Select,
  Option,
  Switch,
} from "@material-tailwind/react";

import { useContext } from "react";
import { AuthContext, AlertContext } from "@/context";

export function MembersTableItem({userData, isLast, setError, setRows, roleList}) {
  const { id, role, userName, email, roleId, roleName, roleTitle, status} = userData;

  const { token } = useContext(AuthContext);
  const { addAlert, hideAllAlerts } = useContext(AlertContext);

  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

  const persistRoleChange = async (userId, fallbackRoleId, nextRoleId) => {
    try {
      // setError(null);

      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ roleId: nextRoleId }),
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
          if ((row.roleId ?? null) !== nextRoleId) return row;
          return { ...row, roleId: fallbackRoleId };
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

  return (
    <tr>
      <td className={classes}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <Typography variant="small" color="blue-gray" className="font-normal">
              {userName}
            </Typography>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal opacity-70"
            >
              {email}
            </Typography>
          </div>
        </div>
      </td>

      <td className={classes}>
        <div className="w-40"> {/* keep it compact */}

          <Select 
            label="Vartotojo rolė"
            value={roleName}

            onChange={(val) => {
              // const normalizedRole = val.toLowerCase();
              // const nextRoleId = ROLE_TITLE_TO_ID[normalizedRole];
              const nextRoleId = roleList.find(r => r.name === val)?.id;

              if (!nextRoleId) {
                setError(`Unknown role: ${val}`);
                return;
              }

              const prevRoleId = roleId ?? null;

              setRows((prev) =>
                prev.map((r) =>
                  r.id === id ? { ...r, role: val, roleId: nextRoleId } : r
                )
              );

              persistRoleChange(id, prevRoleId, nextRoleId);
            }}
          >
            {roleList.map((r) => (
              <Option key={r.id} value={r.name} className="capitalize">{r.title}</Option>
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
        <Tooltip content="Edit User">
          <IconButton variant="text">
            <PencilIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      </td>
    </tr>
  );
}

export default MembersTableItem;

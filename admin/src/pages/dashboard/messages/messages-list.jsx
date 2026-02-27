import { useEffect, useMemo, useState, useContext } from "react";
import { MagnifyingGlassIcon, EnvelopeIcon, EnvelopeOpenIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  CardBody,
  Chip,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { AuthContext, AlertContext } from "@/context";

const TABLE_HEAD = ["Siuntėjas", "El. paštas", "Žinutė", "Data", "Būsena", "Veiksmai"];

export function MessagesList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const { token } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);

  // Fetch messages
  useEffect(() => {
    if (!token) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/contact", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        setMessages(data.data || []);
      } catch (e) {
        const errorMsg = e.message || "Nepavyko užkrauti žinučių";
        setError(errorMsg);
        addAlert(errorMsg, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  // Mark message as read
  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`/api/contact/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) throw new Error("Failed to mark as read");

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, is_read: true } : msg
      ));
      addAlert("Žinutė pažymėta kaip perskaityta", "success");
    } catch (e) {
      addAlert("Nepavyko pažymėti žinutės", "error");
    }
  };

  // Delete message
  const handleDelete = async () => {
    if (!messageToDelete) return;

    try {
      const res = await fetch(`/api/contact/${messageToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setMessages(messages.filter(msg => msg.id !== messageToDelete));
      addAlert("Žinutė ištrinta", "success");
      setDeleteDialog(false);
      setMessageToDelete(null);
    } catch (e) {
      addAlert("Nepavyko ištrinti žinutės", "error");
    }
  };

  // Filter messages
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return messages;

    return messages.filter((msg) =>
      [msg.name, msg.email, msg.message]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(term))
    );
  }, [messages, q]);

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  return (
    <div className="mt-12">
      <Card className="h-full w-full bg-slate-900 border-0 shadow-2xl">
        <CardHeader floated={false} shadow={false} className="rounded-none bg-slate-900 border-b-2 border-blue-500 mb-8 p-6 shadow-lg">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="white" className="font-bold">
                Kontaktų žinutės
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-80">
                Peržiūrėti ir valdyti gautas žinutes
              </Typography>
            </div>
            <div className="flex gap-2">
              <Chip 
                value={`${unreadCount} neperskaitytos`} 
                className="bg-gradient-to-r from-slate-700 to-blue-500 text-white"
              />
              <Chip 
                value={`Iš viso: ${messages.length}`} 
                className="bg-slate-800 text-slate-300"
              />
            </div>
          </div>

          <div className="w-full md:w-72">
            <Input
              label="Ieškoti..."
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardBody className="overflow-scroll px-0">
          {loading && (
            <div className="p-6 text-center text-sm text-gray-400">
              Kraunama...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-400">
              {q ? "Žinučių nerasta" : "Nėra gautų žinučių"}
            </div>
          )}

          {!loading && filtered.length > 0 && (
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
                {filtered.map((msg, index) => {
                  const isLast = index === filtered.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-slate-700/50";

                  return (
                    <tr 
                      key={msg.id}
                      className={`${!msg.is_read ? 'bg-slate-800/30' : ''} hover:bg-slate-800/50 transition-colors`}
                    >
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          {!msg.is_read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                          <Typography className="font-normal text-slate-200">
                            {msg.name}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-300">
                          {msg.email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography 
                          className="font-normal text-slate-400 max-w-xs truncate cursor-pointer hover:text-slate-200"
                          onClick={() => setSelectedMessage(msg)}
                        >
                          {msg.message}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-400 text-sm">
                          {new Date(msg.created_at).toLocaleDateString('lt-LT', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={msg.is_read ? "Perskaityta" : "Nauja"}
                          className={msg.is_read ? "bg-slate-700 text-slate-300" : "bg-blue-500/20 text-blue-400 border border-blue-500/50"}
                        />
                      </td>
                      <td className={classes}>
                        <div className="flex gap-2">
                          {!msg.is_read && (
                            <IconButton
                              variant="text"
                              size="sm"
                              onClick={() => handleMarkAsRead(msg.id)}
                              className="hover:bg-blue-500/20 text-blue-400"
                            >
                              <EnvelopeOpenIcon className="h-4 w-4" />
                            </IconButton>
                          )}
                          <IconButton
                            variant="text"
                            size="sm"
                            onClick={() => {
                              setMessageToDelete(msg.id);
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

      {/* Message Detail Dialog */}
      <Dialog 
        open={!!selectedMessage} 
        handler={() => setSelectedMessage(null)}
        className="bg-slate-900 border border-slate-700"
      >
        <DialogHeader className="text-slate-200 border-b border-slate-700">
          Žinutės detalės
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <Typography variant="small" className="text-slate-400 mb-1">
              Siuntėjas:
            </Typography>
            <Typography className="text-slate-200 font-medium">
              {selectedMessage?.name}
            </Typography>
          </div>
          <div>
            <Typography variant="small" className="text-slate-400 mb-1">
              El. paštas:
            </Typography>
            <Typography className="text-slate-200 font-medium">
              {selectedMessage?.email}
            </Typography>
          </div>
          <div>
            <Typography variant="small" className="text-slate-400 mb-1">
              Data:
            </Typography>
            <Typography className="text-slate-200 font-medium">
              {selectedMessage && new Date(selectedMessage.created_at).toLocaleString('lt-LT')}
            </Typography>
          </div>
          <div>
            <Typography variant="small" className="text-slate-400 mb-1">
              Žinutė:
            </Typography>
            <Typography className="text-slate-200 whitespace-pre-wrap">
              {selectedMessage?.message}
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter className="border-t border-slate-700">
          <Button
            variant="text"
            onClick={() => setSelectedMessage(null)}
            className="mr-2"
          >
            Uždaryti
          </Button>
          {selectedMessage && !selectedMessage.is_read && (
            <Button
              className="bg-slate-900 border-2 border-blue-500 hover:bg-slate-800 hover:border-blue-400"
              onClick={() => {
                handleMarkAsRead(selectedMessage.id);
                setSelectedMessage(null);
              }}
            >
              Pažymėti kaip perskaitytą
            </Button>
          )}
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
            Ar tikrai norite ištrinti šią žinutę? Šio veiksmo negalima atšaukti.
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

export default MessagesList;

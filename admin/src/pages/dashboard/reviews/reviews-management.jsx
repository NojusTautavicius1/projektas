import { useEffect, useMemo, useState, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  IconButton,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AuthContext, AlertContext } from "@/context";

const TABLE_HEAD = ["Vardas", "Role", "Imone", "Ivertinimas", "Atsiliepimas", "Data", "Veiksmai"];

export function ReviewsManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const { token } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/reviews");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Nepavyko uzkrauti atsiliepimu`);
      }

      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      const errorMsg = e.message || "Nepavyko uzkrauti atsiliepimu";
      setError(errorMsg);
      addAlert(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;

    try {
      const res = await fetch(`/api/reviews/${reviewToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Nepavyko istrinti atsiliepimo`);
      }

      setReviews((prev) => prev.filter((review) => review.id !== reviewToDelete));
      addAlert("Atsiliepimas istrintas", "success");
      setDeleteDialog(false);
      setReviewToDelete(null);
    } catch (e) {
      addAlert(e.message || "Nepavyko istrinti atsiliepimo", "error");
    }
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return reviews;

    return reviews.filter((review) =>
      [review.name, review.role, review.company, review.project_type, review.text]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [reviews, q]);

  return (
    <div className="mt-12">
      <Card className="h-full w-full bg-slate-900 border-0 shadow-2xl">
        <CardHeader floated={false} shadow={false} className="rounded-none bg-slate-900 border-b-2 border-blue-500 mb-8 p-6 shadow-lg">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="white" className="font-bold">
                Atsiliepimu valdymas
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-80">
                Perziurekite ir istrinkite netinkamus atsiliepimus
              </Typography>
            </div>
            <Chip
              value={`Is viso: ${reviews.length}`}
              className="bg-slate-800 text-slate-300"
            />
          </div>

          <div className="w-full md:w-72">
            <Input
              label="Ieskoti..."
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

          {!loading && error && (
            <div className="p-6 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-400">
              {q ? "Atsiliepimu nerasta" : "Nera atsiliepimu"}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
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
                {filtered.map((review, index) => {
                  const isLast = index === filtered.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-slate-700/50";

                  return (
                    <tr
                      key={review.id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className={classes}>
                        <Typography className="font-normal text-slate-200">
                          {review.name || "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-400">
                          {review.role || "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-400">
                          {review.company || "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Chip
                          size="sm"
                          value={`${review.rating || 0}/5`}
                          className="bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        />
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-400 max-w-md truncate">
                          {review.text}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-400 text-sm">
                          {review.created_at
                            ? new Date(review.created_at).toLocaleDateString("lt-LT", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => {
                            setReviewToDelete(review.id);
                            setDeleteDialog(true);
                          }}
                          className="hover:bg-red-500/20 text-red-400"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      <Dialog
        open={deleteDialog}
        handler={() => setDeleteDialog(false)}
        className="bg-slate-900 border border-slate-700"
      >
        <DialogHeader className="text-slate-200 border-b border-slate-700">
          Istrinti atsiliepima?
        </DialogHeader>
        <DialogBody className="text-slate-300">
          Sis veiksmas negrazinamas.
        </DialogBody>
        <DialogFooter className="border-t border-slate-700">
          <Button
            variant="text"
            onClick={() => {
              setDeleteDialog(false);
              setReviewToDelete(null);
            }}
            className="mr-2"
          >
            Atsaukti
          </Button>
          <Button
            className="bg-red-700 hover:bg-red-600"
            onClick={handleDelete}
          >
            Istrinti
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ReviewsManagement;

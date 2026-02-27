import { useEffect, useState, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AuthContext, AlertContext } from "@/context";
import Chart from "react-apexcharts";

const TABLE_HEAD = ["Vartotojas", "Veiksmas", "Aprašymas", "IP Adresas", "Data", "Veiksmai"];

const ACTION_COLORS = {
  LOGIN: "blue",
  LOGOUT: "gray",
  CREATE: "green",
  UPDATE: "orange",
  DELETE: "red",
  VIEW: "purple",
};

export function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");

  const { token } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);

  // Fetch activities and stats
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch activities
        const activitiesRes = await fetch("/api/activity?limit=50", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!activitiesRes.ok) {
          const errorData = await activitiesRes.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${activitiesRes.status}: Nepavyko užkrauti veiklos`);
        }
        
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData.data || []);

        // Fetch stats
        const statsRes = await fetch("/api/activity/stats", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }
      } catch (e) {
        const errorMsg = e.message || "Nepavyko užkrauti veiklos žurnalo";
        setError(errorMsg);
        addAlert(errorMsg, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Delete activity
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/activity/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Nepavyko ištrinti įrašo`);
      }

      setActivities(activities.filter(a => a.id !== id));
      addAlert("Įrašas ištrintas", "success");
    } catch (e) {
      addAlert(e.message || "Nepavyko ištrinti įrašo", "error");
    }
  };

  // Filter activities
  const filtered = activities.filter((activity) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    
    return [activity.user_email, activity.action, activity.description]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(term));
  });

  // Chart options for daily logins
  const chartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      background: "transparent",
    },
    theme: {
      mode: "dark",
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      categories: stats?.dailyStats?.map(s => 
        new Date(s.date).toLocaleDateString('lt-LT', { month: 'short', day: 'numeric' })
      ) || [],
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
    },
    grid: {
      borderColor: "#334155",
      strokeDashArray: 4,
    },
    colors: ["#3b82f6"],
  };

  const chartSeries = [{
    name: "Prisijungimai",
    data: stats?.dailyStats?.map(s => s.count) || [],
  }];

  return (
    <div className="mt-12 space-y-6">
      {/* Charts Section */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Activity Chart */}
          <Card className="bg-slate-900 border-0 shadow-2xl">
            <CardHeader floated={false} shadow={false} className="rounded-none bg-slate-900 border-b-2 border-blue-500 p-6">
              <Typography variant="h5" color="white" className="font-bold">
                Prisijungimų statistika (7 dienos)
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-80">
                Vartotojų aktyvumas per paskutines 7 dienas
              </Typography>
            </CardHeader>
            <CardBody>
              <Chart options={chartOptions} series={chartSeries} type="area" height={300} />
            </CardBody>
          </Card>

          {/* Most Active Users */}
          <Card className="bg-slate-900 border-0 shadow-2xl">
            <CardHeader floated={false} shadow={false} className="rounded-none bg-slate-900 border-b-2 border-blue-500 p-6">
              <Typography variant="h5" color="white" className="font-bold">
                Aktyviausi vartotojai
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-80">
                Top 5 pagal veiklos kiekį
              </Typography>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {stats.userStats?.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-700 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <Typography className="text-slate-200 font-medium">
                        {user.user_email}
                      </Typography>
                    </div>
                    <Chip
                      size="sm"
                      value={`${user.activity_count} veiksmų`}
                      className="bg-slate-700 text-slate-300"
                    />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Activity Log Table */}
      <Card className="h-full w-full bg-slate-900 border-0 shadow-2xl">
        <CardHeader floated={false} shadow={false} className="rounded-none bg-slate-900 border-b-2 border-blue-500 mb-8 p-6 shadow-lg">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="white" className="font-bold">
                Veiklos žurnalas
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-80">
                Visi sistemos veiksmai ir prisijungimai
              </Typography>
            </div>
            <Chip 
              value={`Iš viso: ${activities.length}`} 
              className="bg-slate-800 text-slate-300"
            />
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
              {q ? "Įrašų nerasta" : "Nėra veiklos įrašų"}
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
                {filtered.map((activity, index) => {
                  const isLast = index === filtered.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-slate-700/50";

                  return (
                    <tr 
                      key={activity.id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className={classes}>
                        <Typography className="font-normal text-slate-200">
                          {activity.user_email || "System"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={activity.action}
                          className={`${
                            ACTION_COLORS[activity.action]
                              ? `bg-${ACTION_COLORS[activity.action]}-500/20 text-${ACTION_COLORS[activity.action]}-400 border border-${ACTION_COLORS[activity.action]}-500/50`
                              : "bg-slate-700 text-slate-300"
                          }`}
                        />
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-400 max-w-md truncate">
                          {activity.description || "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-400 text-sm">
                          {activity.ip_address || "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography className="font-normal text-slate-400 text-sm">
                          {new Date(activity.created_at).toLocaleString('lt-LT', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => handleDelete(activity.id)}
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
    </div>
  );
}

export default ActivityLog;

import { useEffect, useState, useContext } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import { 
  UserGroupIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon
} from "@heroicons/react/24/solid";
import { AuthContext } from "@/context";

export function Home() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    contentSections: 0,
    adminUsers: 0,
    totalMessages: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users count
        const usersRes = await fetch("/api/users", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (usersRes.ok) {
          const users = await usersRes.json();
          setStats(prev => ({
            ...prev,
            totalUsers: users.length,
            activeUsers: users.filter(u => u.status === 1).length,
            adminUsers: users.filter(u => u.role === 'admin').length
          }));
        }

        // Fetch content sections count
        const contentRes = await fetch("/api/content");
        if (contentRes.ok) {
          const content = await contentRes.json();
          setStats(prev => ({
            ...prev,
            contentSections: content.length
          }));
        }

        // Fetch messages count
        const messagesRes = await fetch("/api/contact", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (messagesRes.ok) {
          const response = await messagesRes.json();
          const messages = response.data || [];
          setStats(prev => ({
            ...prev,
            totalMessages: messages.length,
            unreadMessages: messages.filter(m => !m.is_read).length
          }));
        }
      } catch (err) {
        const errorMsg = err.message || "Nepavyko užkrauti statistikos";
        setError(errorMsg);
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

  const statisticsCardsData = [
    {
      color: "blue",
      icon: UserGroupIcon,
      title: "Viso vartotojų",
      value: stats.totalUsers,
      footer: {
        color: "text-green-500",
        value: stats.activeUsers,
        label: "aktyvūs vartotojai",
      },
    },
    {
      color: "purple",
      icon: DocumentTextIcon,
      title: "Turinio sekcijos",
      value: stats.contentSections,
      footer: {
        color: "text-purple-400",
        value: "redaguojamos",
        label: "per admin panelę",
      },
    },
    {
      color: "orange",
      icon: EnvelopeIcon,
      title: "Žinutės",
      value: stats.totalMessages,
      footer: {
        color: "text-orange-400",
        value: stats.unreadMessages,
        label: "neperskaitytos",
      },
    },
    {
      color: "green",
      icon: CheckCircleIcon,
      title: "Būsena",
      value: "Veikia",
      footer: {
        color: "text-green-400",
        value: "✓",
        label: "Visi servisai aktyvūs",
      },
    },
  ];

  return (
    <div className="mt-12">
      {/* Welcome Section */}
      <div className="mb-12 p-8 rounded-2xl bg-slate-900 border-2 border-blue-500 shadow-2xl">
        <Typography variant="h3" className="mb-2 text-white font-bold">
          Sveiki, {user?.email || 'Admin'}!
        </Typography>
        <Typography variant="paragraph" className="font-normal text-white/90">
          Čia galite valdyti savo svetainės turinį, vartotojus ir kitus nustatymus.
        </Typography>
      </div>

      {/* Statistics Cards */}
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={<icon className="w-6 h-6 text-white" />}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="bg-gray-800 border border-gray-700 shadow-lg">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Greiti veiksmai
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-gray-50 cursor-pointer transition-colors">
                <DocumentTextIcon className="h-5 w-5 text-blue-gray-500" />
                <a href="/admin/turinys" className="font-normal text-blue-gray-700">
                  Redaguoti svetainės turinį
                </a>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-gray-50 cursor-pointer transition-colors">
                <UserGroupIcon className="h-5 w-5 text-blue-gray-500" />
                <a href="/admin/vartotojai" className="font-normal text-blue-gray-700">
                  Valdyti vartotojus
                </a>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-gray-50 cursor-pointer transition-colors">
                <CheckCircleIcon className="h-5 w-5 text-blue-gray-500" />
                <a href="/admin/paskyra" className="font-normal text-blue-gray-700">
                  Mano paskyra
                </a>
              </li>
            </ul>
          </CardBody>
        </Card>

        <Card className="bg-gray-800 border border-gray-700 shadow-lg">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Naudingos nuorodos
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-gray-50 cursor-pointer transition-colors">
                <ClockIcon className="h-5 w-5 text-blue-gray-500" />
                <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" className="font-normal text-blue-gray-700">
                  Peržiūrėti svetainę
                </a>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-gray-50 cursor-pointer transition-colors">
                <DocumentTextIcon className="h-5 w-5 text-blue-gray-500" />
                <span className="font-normal text-blue-gray-700">
                  Visi pakeitimai matomi iškart
                </span>
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;

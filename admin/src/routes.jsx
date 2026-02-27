import {
  HomeIcon,
  UserCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  EnvelopeIcon,
  ClockIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, UserList} from "@/pages/dashboard";
import { ContentManagement } from "@/pages/dashboard/content";
import { FeatureBoxesManagement } from "@/pages/dashboard/content";
import { MessagesList } from "@/pages/dashboard/messages/messages-list";
import { ActivityLog } from "@/pages/dashboard/activity/activity-log";
import { ProjectsManagement } from "@/pages/dashboard/projects/projects-management";
import { SignIn, SignUp, SignOut } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "admin",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Turinio valdymas",
        path: "/turinys",
        element: <ContentManagement />,
      },
      {
        icon: <Squares2X2Icon {...icon} />,
        name: "Feature Boxes",
        path: "/feature-boxes",
        element: <FeatureBoxesManagement />,
      },
      {
        icon: <BriefcaseIcon {...icon} />,
        name: "Projektai",
        path: "/projektai",
        element: <ProjectsManagement />,
      },
      {
        icon: <EnvelopeIcon {...icon} />,
        name: "Žinutės",
        path: "/zinutes",
        element: <MessagesList />,
      },
      {
        icon: <ClockIcon {...icon} />,
        name: "Veiklos žurnalas",
        path: "/veikla",
        element: <ActivityLog />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Vartotojų sąrašas",
        path: "/vartotojai",
        element: <UserList />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Paskyra",
        path: "/paskyra",
        element: <Profile />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Prisijungti",
        path: "/prisijungti",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Registruotis",
        path: "/registruotis",
        element: <SignUp />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Atsijungti",
        path: "/atsijungti",
        element: <SignOut />,
      },
    ],
  },
];

export default routes;

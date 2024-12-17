
import Index from "views/Index.js";

import Maps from "views/Maps.js";
import Comparison from "views/Comparison.js"
import Relationship from "views/Relationship.js"
import Distribution from "views/Distribution.js"
import Composition from "views/Composition.js"
import Composition2 from "views/Composition2.js"
import Maps2 from "views/Maps2.js";
import LandingPage from "views/LandingPage.js";
var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/Comparison",
    name: "Comparison",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Comparison />,
    layout: "/admin",
  },
  {
    path: "/Relationship",
    name: "Relationship",
    icon: "ni ni-bullet-list-67 text-blue",
    component: <Relationship />,
    layout: "/admin",
  },
  {
    path: "/Distribution",
    name: "Distribution",
    icon: "ni ni-bullet-list-67 text-yellow",
    component: <Distribution />,
    layout: "/admin",
  },
  {
    path: "/Composition",
    name: "Composition",
    icon: "ni ni-bullet-list-67 text-pink",
    component: <Composition />,
    layout: "/admin",
  },
  {
    path: "/Composition2",
    name: "Compo (Word Cloud)",
    icon: "ni ni-bullet-list-67 text-grey",
    component: <Composition2 />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Heatmap",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/maps2",
    name: "Bubble Map",
    icon: "ni ni-pin-3 text-red",
    component: <Maps2 />,
    layout: "/admin",
  },
  
  {
    path: "/LandingPage",
    name: "Landing Page",
    icon: "ni ni-circle-08 text-pink",
    component: <LandingPage />,
    layout: "/auth",
  },
];
export default routes;

import Dashboard from "../page/dashboard";
import Playing from "../page/player";
import Playlists from "../page/playlist";
import Test from "../page/test";
import { TypeRoutes } from "./types";

export const sidebar_routes: Array<TypeRoutes> = [
  {
    name: "Dashboard",
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: "Playlist",
    path: "/playlist",
    component: Playlists,
  },
  {
    name: "Player",
    path: "/player",
    component: Playing,
  },
  {
    name: "Test",
    path: "/test",
    component: Test,
  }
];

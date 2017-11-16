import Home from "../app/components/home/Home";
import News from "../app/components/news/News";

const routes = [
  {
    path: "/",
    exact: true,
    component: Home
  },
  {
    path: "/news",
    component: News
  }
];

export default routes;
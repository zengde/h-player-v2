const routes = [
  {
    path: '/import',
    component: () => import(/* webpackChunkName: "import" */ 'layouts/Import'),
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ 'layouts/Home'),
    children: [
      { path: '', component: () => import('pages/VideoList') },
      { path: 'video', component: () => import('pages/Video') },
    ],
  },
  {
    path: '/mini-video',
    component: () => import('layouts/Mini'),
    children: [{ path: '', component: () => import('pages/MiniVideo') }],
  },
  {
    path: '/direct-video',
    component: () => import('layouts/Mini'),
    children: [{ path: '', component: () => import('pages/directVideo') }],
  },
  {
    path: '/config',
    component: () => import(/* webpackChunkName: "config" */ 'layouts/Config'),
    children: [{ path: '', component: () => import('pages/config') }],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404'),
  });
}

export default routes;

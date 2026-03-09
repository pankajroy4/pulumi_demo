import{c,a as n,j as e,r as i,s as d}from"./index-BW3uvrh_.js";/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["path",{d:"M13 17V9",key:"1fwyjl"}],["path",{d:"M18 17V5",key:"sfb6ij"}],["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M8 17v-3",key:"17ska0"}]],x=c("chart-column-increasing",l);/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 14.5 8",key:"12zbmj"}]],p=c("clock-1",h);/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],u=c("zap",m);function j(){const r=n(),s=a=>{d(r,`Clicked ${a} card`,"info")};return e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("h1",{className:"text-4xl font-bold mb-4 text-foreground",children:"Dashboard"}),e.jsx("p",{className:"text-lg text-muted-foreground",children:"Monitor your application metrics and performance"})]}),e.jsx(i.Suspense,{fallback:e.jsxs("div",{className:"text-center py-8 text-muted-foreground",children:[e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"}),"Loading dashboard data..."]}),children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsx(t,{title:"Statistics",description:"View key metrics and analytics",icon:e.jsx(x,{}),onClick:s}),e.jsx(t,{title:"Recent Activity",description:"Track the latest updates and changes",icon:e.jsx(p,{}),onClick:s}),e.jsx(t,{title:"Performance",description:"Monitor system performance metrics",icon:e.jsx(u,{}),onClick:s})]})})]})}function t({title:r,description:s,icon:a,onClick:o}){return e.jsx("div",{className:`p-6 rounded-lg border border-border
        bg-card text-card-foreground shadow-sm hover:shadow-md transition-all
        cursor-pointer group`,onClick:()=>o(r),children:e.jsxs("div",{className:"flex items-start space-x-4",children:[e.jsx("div",{className:`flex-shrink-0 p-2 rounded-lg bg-accent text-accent-foreground
          group-hover:bg-accent/80 dark:group-hover:bg-accent/80 transition-colors`,children:a}),e.jsxs("div",{children:[e.jsx("h2",{className:`text-xl font-semibold mb-2 text-card-foreground group-hover:text-primary
            transition-colors`,children:r}),e.jsx("p",{className:"text-muted-foreground",children:s})]})]})})}export{j as default};

(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3318],{96482:function(e,t,s){Promise.resolve().then(s.bind(s,89378))},89378:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return N}});var n=s(14357),l=s(42996),a=s(17586),i=s(90111),r=s.n(i),c=s(56793);function o(e){let{label:t,value:s}=e;return(0,n.jsxs)("div",{className:"mx-4 flex flex-row space-x-1",children:[(0,n.jsx)("div",{className:"text-sm font-medium text-stone-500",children:t}),(0,n.jsx)("div",{className:"text-sm text-stone-700 dark:text-stone-300",children:s})]})}function x(e){let{id:t,name:s,description:l,created_at:a}=e;return(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"px-4 sm:px-0",children:[(0,n.jsxs)("h3",{className:"text-base font-semibold leading-7 text-stone-900 dark:text-stone-100",children:[(0,n.jsx)("span",{className:"inline-block h-6 w-6 align-middle text-stone-500",children:(0,n.jsx)(c.O4,{})})," ",(0,n.jsx)(r(),{className:"hover:font-bold hover:text-emerald-500",href:{pathname:"/annotation_projects/detail/",query:{annotation_project_id:t}},children:s})]}),(0,n.jsx)("p",{className:"mt-1 max-w-2xl text-sm leading-5 text-stone-600 dark:text-stone-400",children:l})]}),(0,n.jsx)("div",{className:"flex flex-row py-4",children:(0,n.jsx)(o,{label:(0,n.jsx)(c.Qu,{className:"h-4 w-4 align-middle"}),value:a.toDateString()})})]})}var d=s(45003),m=s(63124),h=s(17610),j=s(75765),f=s(91293),u=s(8554);function p(){return(0,n.jsxs)(u.Z,{children:[(0,n.jsx)(c.aN,{className:"h-16 w-16 text-stone-500"}),(0,n.jsx)("p",{children:"No annotation project exist yet!"}),(0,n.jsxs)("p",{children:["To create a new project, click on the",(0,n.jsxs)("span",{className:"text-emerald-500",children:[(0,n.jsx)(c.dt,{className:"h-4 w-4 inline-block ml-2 mr-1"}),"Create"," "]})," ","button above."]})]})}function N(){let{items:e,pagination:t,query:s,filter:i}=(0,l.Z)();return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.Z,{text:"Annotation Projects"}),(0,n.jsxs)("div",{className:"flex w-full flex-col space-y-2 p-8",children:[(0,n.jsxs)("div",{className:"flex flex-row space-x-4",children:[(0,n.jsx)("div",{className:"flex-grow",children:(0,n.jsx)(h.Z,{label:"Search",placeholder:"Search project...",value:i.get("search"),onChange:e=>i.set("search",e),onSubmit:()=>i.submit(),icon:(0,n.jsx)(c.lQ,{})})}),(0,n.jsxs)("div",{className:"h-full inline-flex gap-4",children:[(0,n.jsxs)(d.Z,{mode:"text",href:"/annotation_projects/create/",children:[(0,n.jsx)(c.dt,{className:"inline-block h-4 w-4 align-middle"})," Create"]}),(0,n.jsxs)(d.Z,{mode:"text",href:"/annotation_projects/import/",children:[(0,n.jsx)(c.rG,{className:"inline-block h-4 w-4 align-middle"})," ","Import"]})]})]}),s.isLoading?(0,n.jsx)(u.Z,{children:(0,n.jsx)("div",{className:"p-8",children:(0,n.jsx)(f.Z,{})})}):0===e.length?(0,n.jsx)(p,{}):(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(m.Z,{items:e.map(e=>(0,n.jsx)(x,{...e},e.id))})}),t.numPages>1&&(0,n.jsx)(j.Z,{...t})]})]})}},42996:function(e,t,s){"use strict";s.d(t,{Z:function(){return r}});var n=s(81361),l=s(11441),a=s(54313);let i={};function r(){let{filter:e=i,pageSize:t=10}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},s=(0,a.Z)({fixed:e}),{query:r,pagination:c,items:o,total:x}=(0,l.Z)({name:"annotation_projects",func:n.Z.annotation_projects.getMany,pageSize:t,filter:s.filter});return{filter:s,query:r,pagination:c,items:o,total:x}}}},function(e){e.O(0,[6949,3372,4564,243,2007,1651,111,9530,1361,9803,1930,8702,7431,1744],function(){return e(e.s=96482)}),_N_E=e.O()}]);
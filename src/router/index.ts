import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import DashboardView from "../views/DashboardView.vue";
import MyInformationView from "../views/MyInformationView.vue";
import MyPayslipsView from "../views/MyPayslipsView.vue";
import TimesheetView from "../views/TimesheetView.vue";
import LeavesView from "../views/LeavesView.vue";
import BenefitsView from "../views/BenefitsView.vue";
import OrgChartView from "../views/OrgChartView.vue";
import MyTeamView from "../views/MyTeamView.vue";
import DocumentsView from "../views/DocumentsView.vue";

const routes: RouteRecordRaw[] = [
    { path: "/", redirect: "/dashboard" },
    { path: "/dashboard", name: "dashboard", component: DashboardView },
    { path: "/my-information", name: "my_information", component: MyInformationView },
    { path: "/my-payslips", name: "my_payslips", component: MyPayslipsView },
    { path: "/timesheet", name: "time_entry", component: TimesheetView },
    { path: "/leaves", name: "leaves", component: LeavesView },
    { path: "/benefits", name: "benefits", component: BenefitsView },
    { path: "/orgchart", name: "organizational_chart", component: OrgChartView },
    { path: "/my-team", name: "my_team", component: MyTeamView },
    { path: "/docs", name: "documents", component: DocumentsView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

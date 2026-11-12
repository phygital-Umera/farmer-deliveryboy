import { getDashboardStats } from "@/lib/api/student/dashboardApi";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: getDashboardStats,
    })
}
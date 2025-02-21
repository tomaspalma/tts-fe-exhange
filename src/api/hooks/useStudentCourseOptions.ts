import useSWR from "swr";
import { getStudentSchedule, logout } from "../backend";

export function useStudentCourseOptions(username, setLoggedIn) {
    const studentSchedule = async (username: string) => {
        try {
            const res = await getStudentSchedule(username);

            if (!res.ok) {
                if (res.status === 403) {
                    await logout();
                    setLoggedIn(false);
                }
            }

            return res;

        } catch (error) {
            return error;
        }
    };

    const { isLoading, isValidating, data, error } = useSWR(username, studentSchedule);

    return {
        data,
        error,
        isLoading,
        isValidating
    };
}

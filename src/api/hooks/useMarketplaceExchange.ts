import useSWR from "swr";
import { getMarketPlaceExchanges, logout} from "../backend";

export function useMarketplaceExchange(setLoggedIn) {
    const fetchMarketplaceExchanges = async () => {
        try {
            const res = await getMarketPlaceExchanges();

            // console.log(res);

            if (res.status === 403) {
                await logout();
                setLoggedIn(false);
            }

            return res;
        } catch (error) {
            return error;
        }
    };

    const { isLoading, isValidating, data, error } = useSWR("data", fetchMarketplaceExchanges, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    return {
        data,
        error,
        isLoading,
        isValidating
    };
}
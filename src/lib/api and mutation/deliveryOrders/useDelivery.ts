import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { delivered, deliveryHistory, getDelivery, getDeliveryById, pickupItems } from "./deliveryOrdersApi"
import toast from "react-hot-toast"
import { translate } from "@/i18n/LanguageContext"

export const useGetDelivery=()=>{
    return useQuery({
        queryKey:['delivery'],
        queryFn:getDelivery,
        // Poll so new assigned orders show up (and ring the alarm) without a refresh
        refetchInterval:20000,
        refetchIntervalInBackground:true,
    })
}

export const useGetDeliveryById = (id?: string) => {
    return useQuery({
        queryKey: ['delivery', id],
        queryFn: () => getDeliveryById(id as string),
        enabled: Boolean(id),
    });
};

export const usePickupItems=()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(id:string)=>pickupItems(id),
        onSuccess:(_data, variables)=>{
            toast.success(translate('toast.pickedUp'))
            const id = typeof variables === 'string' ? variables : variables.id;
            queryClient.invalidateQueries({ queryKey: ['delivery'] });
            if (id) {
                queryClient.invalidateQueries({ queryKey: ['delivery', id] });
            }
        },
        onError:()=>{
            toast.error(translate('toast.pickupFailed'))
        }
    })
}

export const useDeliverd=()=>{
    return useMutation({
        mutationFn:(id:string)=>delivered(id),
        onSuccess:()=>{
            toast.success(translate('toast.delivered'))
         
        
        },
        onError:()=>{
            toast.error(translate('toast.deliverFailed'))
        }
    })
}

export const useDeliveryhistory=()=>{
    return useQuery({
        queryKey:['delivery-history'],
        queryFn:deliveryHistory
    })
}
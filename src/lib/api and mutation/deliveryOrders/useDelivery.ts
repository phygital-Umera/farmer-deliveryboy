import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { delivered, deliveryHistory, getDelivery, getDeliveryById, pickupItems } from "./deliveryOrdersApi"
import toast from "react-hot-toast"

export const useGetDelivery=()=>{
    return useQuery({
        queryKey:['delivery'],
        queryFn:getDelivery
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
            toast.success("Items Picked Up")
            const id = typeof variables === 'string' ? variables : variables.id;
            queryClient.invalidateQueries({ queryKey: ['delivery'] });
            if (id) {
                queryClient.invalidateQueries({ queryKey: ['delivery', id] });
            }
        },
        onError:()=>{
            toast.error("Failed to pick up items")
        }
    })
}

export const useDeliverd=()=>{
    return useMutation({
        mutationFn:(id:string)=>delivered(id),
        onSuccess:()=>{
            toast.success("Items Delivered")
         
        
        },
        onError:()=>{
            toast.error("Failed to deliver items")
        }
    })
}

export const useDeliveryhistory=()=>{
    return useQuery({
        queryKey:['delivery-history'],
        queryFn:deliveryHistory
    })
}
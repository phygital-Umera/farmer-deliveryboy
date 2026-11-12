import { api } from "@/utils/axios"

export const getDelivery=()=>{
    try {
        const res = api.get('/delivery/orders')
        return res;
    } catch (error) {
        throw error;
    }
}

export const getDeliveryById=(id:string)=>{
    try {
        const res = api.get(`/delivery/orders/${id}`)
        return res;
    } catch (error) {
        throw error;
    }
}


export const pickupItems=(id:string)=>{
    try {
        const res = api.patch(`/delivery/orders/${id}/pickup`)
        return res;
    } catch (error) {
        throw error;
    }
}


export const delivered=(id:string)=>{
    try {
        const res = api.patch(`/delivery/orders/${id}/delivered`)
        return res;
    } catch (error) {
        throw error;
    }
}

export const deliveryHistory=()=>{
    try {
        const res = api.get(`/delivery/orders/history`)
        return res;
    } catch (error) {
        throw error;
    }
}
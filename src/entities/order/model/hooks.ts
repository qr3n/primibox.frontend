import { useQuery } from "@tanstack/react-query";
import { adminOrderService, orderService } from "@shared/api/services/order";
import { GetUserOrderResponse } from "@shared/api/services/order/types";
import { IOrder } from "@entities/order";

const convertGetUserOrderResponseToIOrder = (response: GetUserOrderResponse): IOrder => {
    return {
        id: response.id,
        cost: response.cost,
        shipmentType: response.shipment_type,
        marketplace: response.marketplace,
        packingType: response.packing_type,
        whatToDeliver: response.what_to_deliver,
        packageLength: response.package_length,
        packageWidth: response.package_width,
        packageHeight: response.package_height,
        deliveryAddresses: response.delivery_addresses,
        pickupAddresses: response.pickup_addresses,
        comment: response.comment,
        senderPhone: response.sender_phone,
        recipientPhone: response.recipient_phone,
        status: response.status,
        active: response.active,
        pickupDate: new Date(response.pickup_date),
        deliveryDate: new Date(response.delivery_date),
        pickupTimeFrom: response.pickup_time_from,
        pickupTimeTo: response.pickup_time_to,
        deliveryTimeFrom: response.delivery_time_from,
        deliveryTimeTo: response.delivery_time_to,
        distance: response.distance,
        placesCount: response.places_count,
        weight: response.weight,
        driverProfile: response.driver_profile && {
            ...response.driver_profile,
            passportNumber: response.driver_profile?.passport_number,
            passportGiven: response.driver_profile?.passport_given,
            passportGiven_date: response.driver_profile?.passport_given_date,
        },
        driverCar: response.driver_car,
        driverId: response.driver_id,
        needSplit: response.need_split,
        feedback: response.feedback,
        userId: response.user_id
    };
};

export const useUserOrders = () => {
    const { data, ...other } = useQuery({
        queryFn: orderService.get,
        queryKey: ['user.orders']
    });

    console.log(data)

    const formattedData = data?.map((order: GetUserOrderResponse) => convertGetUserOrderResponseToIOrder(order)) ?? [];

    return {
        orders: formattedData,
        ...other
    };
};


export const useAdminAllOrders = () => {
    const { data, ...other } = useQuery({
        queryFn: adminOrderService.getAll,
        queryKey: ['admin.orders']
    });

    const formattedData = data?.map((order: GetUserOrderResponse) => convertGetUserOrderResponseToIOrder(order)) ?? [];

    return {
        orders: formattedData,
        ...other
    };
}
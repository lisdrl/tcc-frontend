import { useAtom } from "jotai";
import { ordersAtom } from "../../state";
import { Order } from "../../types";

export const useOrderById = (id: string): Order | undefined => {
    const [orders] = useAtom(ordersAtom);
    return orders.find(order => order.id === id);
  };
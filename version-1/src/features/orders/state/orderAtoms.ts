import { atom } from 'jotai';
import { Order } from '../types';

export const ordersAtom = atom<Order[]>([]);

export const selectedOrderIdAtom = atom<string>('');



import { StateCreator } from "zustand";

type BulkChangeAssignCustomerState = {
  assignCustomer?: {
    customerId?: string;
    customerName?: string;
  } | null;
};
type BulkChangeAssignCustomerAction = {
  setCustomer: (customer: { id: string; name: string }) => void;
  resetAssignCustomer: () => void;
};
export type BulkChangeAssignCustomerStore = BulkChangeAssignCustomerState &
  BulkChangeAssignCustomerAction;

export const bulkChangeAssignCustomerInitState: BulkChangeAssignCustomerState =
  {
    assignCustomer: null,
  };

export const AssignCustomerSlide: StateCreator<
  BulkChangeAssignCustomerStore
> = (set, get) => ({
  ...bulkChangeAssignCustomerInitState,
  setCustomer: (customer) =>
    set({
      assignCustomer: {
        customerId: customer.id,
        customerName: customer.name,
      },
    }),
  resetAssignCustomer: () => set(bulkChangeAssignCustomerInitState),
});

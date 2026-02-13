import { Collection, getModel } from "@lytos/constant-definitions";
import { CreateCustomerDto, Customer, CustomerSchemaMongo, LifecycleStatus } from "@lytos/contracts";

export const createCustomer = async (data: CreateCustomerDto): Promise<Customer | null> => {
    const model = getModel<Customer>(Collection.CUSTOMERS, CustomerSchemaMongo);
    console.log("Informacion")

    const customer = new model({ ...data, lifecycleStatus: LifecycleStatus.ACTIVE });
    const createdCustomer = await customer.save();

    return createdCustomer;
}
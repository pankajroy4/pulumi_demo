import * as network from "@pulumi/azure-native/network";

export function createNetwork(name: string, rg: any, location: string) {

    const vnet = new network.VirtualNetwork(`${name}-vnet`, {
        resourceGroupName: rg,
        location,
        addressSpace: {
            addressPrefixes: ["10.0.0.0/16"],
        },
    });

    const appSubnet = new network.Subnet(`${name}-app-subnet`, {
        resourceGroupName: rg,
        virtualNetworkName: vnet.name,
        addressPrefix: "10.0.1.0/24",
    });

    const dbSubnet = new network.Subnet(`${name}-db-subnet`, {
        resourceGroupName: rg,
        virtualNetworkName: vnet.name,
        addressPrefix: "10.0.2.0/24",
    });

    return {
        vnetId: vnet.id,
        subnetId: dbSubnet.id,
        appSubnetId: appSubnet.id
    };
}
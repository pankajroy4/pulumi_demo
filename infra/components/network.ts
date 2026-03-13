// infra/components/network.ts
import * as network from "@pulumi/azure-native/network";

export function createNetwork(name: string, rg: any, location: string) {

  const vnet = new network.VirtualNetwork(`${name}-vnet`, {
    resourceGroupName: rg,
    location,
    addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
  });

  const appSubnet = new network.Subnet(`${name}-app-subnet`, {
    resourceGroupName: rg,
    virtualNetworkName: vnet.name,
    addressPrefix: "10.0.1.0/24",
    delegations: [{
      name: "appserviceDelegation",
      serviceName: "Microsoft.Web/serverFarms",
    }],
  });

  const dbSubnet = new network.Subnet(`${name}-db-subnet`, {
    resourceGroupName: rg,
    virtualNetworkName: vnet.name,
    addressPrefix: "10.0.2.0/24",

    delegations: [{
      name: "postgresDelegation",
      serviceName: "Microsoft.DBforPostgreSQL/flexibleServers",
    }],
  });

  return {
    vnetId: vnet.id,
    appSubnetId: appSubnet.id,
    dbSubnetId: dbSubnet.id
  };
}
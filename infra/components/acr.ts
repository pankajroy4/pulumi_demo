// infra/components/acr.ts
import * as containerregistry from "@pulumi/azure-native/containerregistry";
import * as pulumi from "@pulumi/pulumi";

export function createAcr(
  name: string,
  rg: pulumi.Input<string>,
  location: string
) {

  const registry = new containerregistry.Registry(`${name}acr`, {
    resourceGroupName: rg,
    location,
    sku: { name: "Basic" },
    adminUserEnabled: false,
  });


  return {
    registry,
    name: registry.name,
    loginServer: registry.loginServer
  };
}
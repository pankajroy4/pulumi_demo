// infra/components/postgres.ts
import * as postgres from "@pulumi/azure-native/dbforpostgresql";
import * as dns from "@pulumi/azure-native/privatedns";
import * as pulumi from "@pulumi/pulumi";

export function createPostgres(
  name: string,
  rg: pulumi.Input<string>,
  location: string,
  subnetId: pulumi.Input<string>,
  vnetId: pulumi.Input<string>,
  password: pulumi.Input<string>
) {

  const stack = pulumi.getStack();

  const adminUser = "pgadmin";
  const databaseName = "appdb";

  // Private DNS zone for Postgres
  const dnsZone = new dns.PrivateZone(`${name}-pg-dns`, {
    resourceGroupName: rg,
    privateZoneName: "privatelink.postgres.database.azure.com",
    location: "global",
  });

  // Link VNet with DNS zone
  new dns.VirtualNetworkLink(`${name}-dns-link`, {
    resourceGroupName: rg,
    privateZoneName: dnsZone.name,
    location: "global",
    virtualNetwork: {
      id: vnetId,
    },
    registrationEnabled: false,
  });

  // PostgreSQL Flexible Server
  const server = new postgres.Server(`${name}-pg`, {
    resourceGroupName: rg,
    location,
    administratorLogin: adminUser,
    administratorLoginPassword: password,
    version: "14",

    storage: {
      storageSizeGB: stack === "production" ? 128 : 32,
    },

    sku: stack === "production"
      ? { name: "Standard_D2s_v3", tier: "GeneralPurpose" }
      : { name: "Standard_B1ms", tier: "Burstable" },

    network: {
      delegatedSubnetResourceId: subnetId,
      privateDnsZoneArmResourceId: dnsZone.id,
    }
  });

  // Database
  new postgres.Database(`${name}-db`, {
    resourceGroupName: rg,
    serverName: server.name,
    databaseName: databaseName,
  });

  return {
    host: server.fullyQualifiedDomainName
  };
}


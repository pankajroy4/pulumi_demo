// import * as pulumi from "@pulumi/pulumi";
// import * as keyvault from "@pulumi/azure-native/keyvault";
// import * as authorization from "@pulumi/azure-native/authorization"; // Import this

// export function createKeyVault(name: string, rg: pulumi.Input<string>, location: string) {

//     // Fetch the current client configuration (Tenant ID, Subscription ID, etc.)
//     const clientConfig = authorization.getClientConfig();

//     const vault = new keyvault.Vault(`${name}-kv`, {
//         // Truncate to 24 chars to satisfy Azure naming constraints
//         vaultName: `${name}-kv`.substring(0, 24), 
//         resourceGroupName: rg,
//         location,
//         properties: {
//             // Dynamically use the Tenant ID from your active login context
//             tenantId: clientConfig.then(conf => conf.tenantId),
//             sku: {
//                 name: "standard",
//                 family: "A",
//             },
//             accessPolicies: [],
//             enableSoftDelete: true,
//         },
//     });

//     return {
//         vaultUri: vault.properties.vaultUri,
//     };
// }

import * as pulumi from "@pulumi/pulumi";
import * as keyvault from "@pulumi/azure-native/keyvault";
import * as authorization from "@pulumi/azure-native/authorization";
import * as random from "@pulumi/random";

export function createKeyVault( name: string, rg: pulumi.Input<string>, location: string) {

  const clientConfig = authorization.getClientConfig();

  const suffix = new random.RandomId(`${name}-kv-suffix`, {
    byteLength: 3,
  });

  // shorten prefix BEFORE adding random suffix
  // const baseName = name.substring(0, 12);
    const baseName = "pda-prod"

  const vaultName = pulumi.interpolate`${baseName}-kv-${suffix.hex}`;

  const vault = new keyvault.Vault(`${name}-kv`, {
    vaultName: vaultName,
    resourceGroupName: rg,
    location,
    properties: {
      tenantId: clientConfig.then(conf => conf.tenantId),
      sku: {
        name: "standard",
        family: "A",
      },
      enableRbacAuthorization: true
    },
  });

  return {
    vaultUri: vault.properties.vaultUri,
  };
}
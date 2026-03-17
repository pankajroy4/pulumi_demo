import * as pulumi from "@pulumi/pulumi";
import * as keyvault from "@pulumi/azure-native/keyvault";
import * as authorization from "@pulumi/azure-native/authorization";
import * as random from "@pulumi/random";

export function createKeyVault(
  name: string,
  rg: pulumi.Input<string>,
  location: string,
  dbPassword: pulumi.Input<string>,
  jwtSecret: pulumi.Input<string>
){

  const clientConfig = authorization.getClientConfig();

  const suffix = new random.RandomId(`${name}-kv-suffix`, {
    byteLength: 3,
  });

  const vaultName = pulumi.interpolate`${name}-kv-${suffix.hex}`;

  const vault = new keyvault.Vault(`${name}-kv`, {
    vaultName,
    resourceGroupName: rg,
    location,
    properties: {
      tenantId: clientConfig.then(c => c.tenantId),
      sku: {
        name: "standard",
        family: "A",
      },
      enableRbacAuthorization: true
    },
  });

  const dbPasswordSecret = new keyvault.Secret(`${name}-db-secret`, {
    resourceGroupName: rg,
    vaultName: vault.name,
    properties: {
      value: dbPassword
    }
  });

  const jwtSecretResource = new keyvault.Secret(`${name}-jwt-secret`, {
    resourceGroupName: rg,
    vaultName: vault.name,
    properties: {
      value: jwtSecret
    }
  });

  return {
    vault,
    vaultUri: vault.properties.vaultUri,
    dbPasswordSecretUri: pulumi.interpolate`${vault.properties.vaultUri}secrets/${dbPasswordSecret.name}/`,
    jwtSecretUri: pulumi.interpolate`${vault.properties.vaultUri}secrets/${jwtSecretResource.name}/`
  };
}
param location string = resourceGroup().location
param environment string = 'dev'
param resourceToken string = uniqueString(resourceGroup().id)

// Container Registry
param containerRegistryName string = 'kyndexacr${resourceToken}'
param containerRegistrySku string = 'Standard'

// Container Apps
param containerAppEnvName string = 'kyndex-env-${environment}'
param frontendContainerAppName string = 'frontend-${environment}'
param backendContainerAppName string = 'backend-${environment}'
param containerAppMinReplicas int = 1
param containerAppMaxReplicas int = 3

// Database
param databaseServerName string = 'kyndex-db-${resourceToken}'
param databaseName string = 'kyndexdb'
param databaseAdminUsername string = 'kyndexadmin'
@secure()
param databaseAdminPassword string

// Key Vault
param keyVaultName string = 'kyndex-kv-${resourceToken}'

// Log Analytics & Application Insights
param logAnalyticsWorkspaceName string = 'kyndex-logs-${environment}'
param applicationInsightsName string = 'kyndex-ai-${environment}'

// Managed Identity
param managedIdentityName string = 'kyndex-identity-${environment}'

// ============================================
// Managed Identity
// ============================================
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: managedIdentityName
  location: location
}

// ============================================
// Log Analytics Workspace
// ============================================
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// ============================================
// Application Insights
// ============================================
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// ============================================
// Container Registry
// ============================================
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: containerRegistryName
  location: location
  sku: {
    name: containerRegistrySku
  }
  properties: {
    adminUserEnabled: true
    publicNetworkAccess: 'Enabled'
    networkRuleBypassOptions: 'AzureServices'
  }
}

// ============================================
// Key Vault
// ============================================
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: false
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: managedIdentity.properties.principalId
        permissions: {
          secrets: ['get', 'list']
          keys: ['get', 'list']
          certificates: ['get', 'list']
        }
      }
    ]
  }
}

// ============================================
// PostgreSQL Database
// ============================================
resource databaseServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-12-01-preview' = {
  name: databaseServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: databaseAdminUsername
    administratorLoginPassword: databaseAdminPassword
    version: '15'
    storage: {
      storageSizeGB: 32
    }
    network: {
      delegatedSubnetResourceId: ''
      privateDnsZoneArmResourceId: ''
    }
    CreateMode: 'Default'
  }
}

// PostgreSQL Database
resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-12-01-preview' = {
  parent: databaseServer
  name: databaseName
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

// PostgreSQL Firewall Rule - Allow Azure Services
resource allowAzureServicesFirewallRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-12-01-preview' = {
  parent: databaseServer
  name: 'AllowAllAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Store database connection string in Key Vault
resource databaseSecretConnectionString 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'DatabaseConnectionString'
  properties: {
    value: 'postgresql://${databaseAdminUsername}:${databaseAdminPassword}@${databaseServer.properties.fullyQualifiedDomainName}:5432/${databaseName}?schema=public'
  }
}

// ============================================
// Container App Environment
// ============================================
resource containerAppEnv 'Microsoft.App/managedEnvironments@2023-11-02-preview' = {
  name: containerAppEnvName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

// ============================================
// ACR Role Assignment for Managed Identity
// ============================================
resource acrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: containerRegistry
  name: guid(containerRegistry.id, managedIdentity.id, 'AcrPull')
  properties: {
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/7f951dda-4ed3-4680-a7ca-43fe172d538d'
  }
}

// ============================================
// Frontend Container App
// ============================================
resource frontendContainerApp 'Microsoft.App/containerApps@2023-11-02-preview' = {
  name: frontendContainerAppName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      secrets: []
      registries: [
        {
          server: containerRegistry.properties.loginServer
          identity: managedIdentity.id
        }
      ]
      ingress: {
        external: true
        targetPort: 3000
        transport: 'auto'
        allowInsecure: false
      }
    }
    template: {
      serviceBinds: []
      containers: [
        {
          image: '${containerRegistry.properties.loginServer}/frontend:latest'
          name: 'frontend'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            {
              name: 'NEXT_PUBLIC_API_URL'
              value: 'https://${backendContainerApp.properties.configuration.ingress.fqdn}/api/v1'
            }
            {
              name: 'NODE_ENV'
              value: 'production'
            }
          ]
        }
      ]
      scale: {
        minReplicas: containerAppMinReplicas
        maxReplicas: containerAppMaxReplicas
      }
    }
  }
  dependsOn: [
    acrPullRoleAssignment
  ]
}

// ============================================
// Backend Container App
// ============================================
resource backendContainerApp 'Microsoft.App/containerApps@2023-11-02-preview' = {
  name: backendContainerAppName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      secrets: [
        {
          name: 'database-connection-string'
          keyVaultUrl: '${keyVault.properties.vaultUri}secrets/DatabaseConnectionString'
          identity: managedIdentity.id
        }
      ]
      registries: [
        {
          server: containerRegistry.properties.loginServer
          identity: managedIdentity.id
        }
      ]
      ingress: {
        external: true
        targetPort: 3001
        transport: 'auto'
        allowInsecure: false
      }
    }
    template: {
      serviceBinds: []
      containers: [
        {
          image: '${containerRegistry.properties.loginServer}/backend:latest'
          name: 'backend'
          resources: {
            cpu: json('0.75')
            memory: '1.5Gi'
          }
          env: [
            {
              name: 'DATABASE_URL'
              secretRef: 'database-connection-string'
            }
            {
              name: 'PORT'
              value: '3001'
            }
            {
              name: 'FRONTEND_URL'
              value: 'https://${frontendContainerApp.properties.configuration.ingress.fqdn}'
            }
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: applicationInsights.properties.ConnectionString
            }
          ]
        }
      ]
      scale: {
        minReplicas: containerAppMinReplicas
        maxReplicas: containerAppMaxReplicas
      }
    }
  }
  dependsOn: [
    acrPullRoleAssignment
  ]
}

// ============================================
// Outputs
// ============================================
output frontendUrl string = 'https://${frontendContainerApp.properties.configuration.ingress.fqdn}'
output backendUrl string = 'https://${backendContainerApp.properties.configuration.ingress.fqdn}'
output containerRegistryLoginServer string = containerRegistry.properties.loginServer
output keyVaultName string = keyVault.name
output databaseServerFqdn string = databaseServer.properties.fullyQualifiedDomainName
output applicationInsightsInstrumentationKey string = applicationInsights.properties.InstrumentationKey

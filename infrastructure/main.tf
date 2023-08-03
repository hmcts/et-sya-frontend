provider "azurerm" {
  features {}
}

locals {
  vaultName = "${var.product}-${var.env}"
  tags = merge(var.common_tags,
    tomap({
      "environment" = var.env,
      "managedBy" = "Employment Tribunals",
      "Team Contact" = "#et-devs",
      "application" = "employment-tribunals",
      "businessArea" = "CFT",
      "builtFrom" = "et-sya"
    })
  )
}

module "et-frontend-session-storage" {
  source   = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product  = "${var.product}-${var.component}-session-storage"
  location = var.location
  env      = var.env
  private_endpoint_enabled = true
  redis_version = "6"
  business_area = "cft"
  public_network_access_enabled = false
  common_tags  = var.common_tags
}

data "azurerm_key_vault" "key_vault" {
  name = local.vaultName
  resource_group_name = local.vaultName
}

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "redis-access-key"
  value        = module.et-frontend-session-storage.access_key
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

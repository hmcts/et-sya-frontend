provider "azurerm" {
  features {}
}

locals {
  vaultName = "${var.product}-${var.env}"
  tagEnv    = var.env == "aat" ? "staging" : var.env == "perftest" ? "testing" : var.env
  tags = merge(var.common_tags,
    tomap({
      "environment"  = local.tagEnv,
      "managedBy"    = "Employment Tribunals",
      "Team Contact" = "#et-devs",
      "application"  = "employment-tribunals",
      "businessArea" = "CFT",
      "builtFrom"    = "et-sya"
    })
  )
}

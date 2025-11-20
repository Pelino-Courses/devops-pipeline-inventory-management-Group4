terraform {
  required_version = ">= 1.0" # Minimum required Terraform version

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0" # Use any version 3.x
    }
  }
}

# Provider block for Azure
# This tells Terraform how to authenticate and which features to enable
provider "azurerm" {
  features {}
}
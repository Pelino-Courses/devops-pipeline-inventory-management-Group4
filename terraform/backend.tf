terraform { 
  required_version = ">= 1.5.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  cloud { 
    organization = "devops-pipeline-org" # <--- Confirm this is your actual organization name
    
    workspaces { 
      name = "devops-pipeline-infrastructure" 
    } 
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}
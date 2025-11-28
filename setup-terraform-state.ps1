# Setup Azure Storage for Terraform State
# Run this script ONCE before using Terraform

$RESOURCE_GROUP="terraform-state-rg"
$STORAGE_ACCOUNT="tfdevops$(Get-Random -Minimum 1000 -Maximum 9999)"  # Random suffix to ensure uniqueness
$CONTAINER_NAME="tfstate"
$LOCATION="southafricanorth"  # South Africa North is available for this student subscription

Write-Host "=== Creating Azure Storage for Terraform State ===" -ForegroundColor Cyan
Write-Host "Storage Account Name: $STORAGE_ACCOUNT" -ForegroundColor Yellow

# Create resource group
Write-Host "`nCreating resource group: $RESOURCE_GROUP in $LOCATION" -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create storage account
Write-Host "`nCreating storage account: $STORAGE_ACCOUNT" -ForegroundColor Yellow
az storage account create `
  --resource-group $RESOURCE_GROUP `
  --name $STORAGE_ACCOUNT `
  --location $LOCATION `
  --sku Standard_LRS `
  --encryption-services blob

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nERROR: Failed to create storage account. Please check the error message above." -ForegroundColor Red
    exit 1
}

# Get storage account key
Write-Host "`nGetting storage account key..." -ForegroundColor Yellow
$ACCOUNT_KEY = az storage account keys list `
  --resource-group $RESOURCE_GROUP `
  --account-name $STORAGE_ACCOUNT `
  --query '[0].value' `
  --output tsv

# Create blob container
Write-Host "`nCreating blob container: $CONTAINER_NAME" -ForegroundColor Yellow
az storage container create `
  --name $CONTAINER_NAME `
  --account-name $STORAGE_ACCOUNT `
  --account-key $ACCOUNT_KEY

Write-Host "`n=== Setup Complete! ===" -ForegroundColor Green
Write-Host "`nStorage Account Details:" -ForegroundColor Cyan
Write-Host "Resource Group: $RESOURCE_GROUP"
Write-Host "Storage Account: $STORAGE_ACCOUNT" -ForegroundColor Yellow
Write-Host "Container: $CONTAINER_NAME"
Write-Host "Location: $LOCATION"

Write-Host "`n=== IMPORTANT: Update backend.tf ===" -ForegroundColor Red
Write-Host "Update the storage_account_name in terraform/backend.tf to:" -ForegroundColor Yellow
Write-Host "  storage_account_name = `"$STORAGE_ACCOUNT`"" -ForegroundColor Cyan

Write-Host "`nThen run 'terraform init' in the terraform directory!" -ForegroundColor Green

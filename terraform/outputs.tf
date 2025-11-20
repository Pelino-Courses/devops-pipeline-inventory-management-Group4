output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "vm_public_ip" {
  description = "Public IP address of the VM"
  value       = azurerm_public_ip.main.ip_address
}

output "vm_name" {
  description = "Name of the virtual machine"
  value       = azurerm_linux_virtual_machine.main.name
}

output "acr_login_server" {
  description = "Login server for the container registry"
  value       = azurerm_container_registry.main.login_server
}

output "acr_name" {
  description = "Name of the container registry"
  value       = azurerm_container_registry.main.name
}

output "acr_admin_username" {
  description = "Admin username for ACR"
  value       = azurerm_container_registry.main.admin_username
  sensitive   = true
}

output "acr_admin_password" {
  description = "Admin password for ACR"
  value       = azurerm_container_registry.main.admin_password
  sensitive   = true
}
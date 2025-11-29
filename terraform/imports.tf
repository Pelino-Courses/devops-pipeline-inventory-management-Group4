# Terraform Import Blocks for Existing Azure Resources
# These import blocks enable Terraform to adopt existing Azure resources into state
# during the automated GitHub Actions workflow. This resolves "resource already exists" errors.
#
# Terraform 1.5+ import blocks are idempotent - they can remain in the configuration
# and will only import if the resource is not already in state.

# 1. Resource Group
import {
  to = azurerm_resource_group.main
  id = "/subscriptions/39986eb2-6bc2-4136-a8cb-4cab9737558f/resourceGroups/devopspipeline-dev-rg"
}

# 2. Virtual Network
import {
  to = azurerm_virtual_network.main
  id = "/subscriptions/39986eb2-6bc2-4136-a8cb-4cab9737558f/resourceGroups/devopspipeline-dev-rg/providers/Microsoft.Network/virtualNetworks/devopspipeline-dev-vnet"
}

# 3. Subnet
import {
  to = azurerm_subnet.vm_subnet
  id = "/subscriptions/39986eb2-6bc2-4136-a8cb-4cab9737558f/resourceGroups/devopspipeline-dev-rg/providers/Microsoft.Network/virtualNetworks/devopspipeline-dev-vnet/subnets/vm-subnet"
}

# 4. Network Security Group
import {
  to = azurerm_network_security_group.main
  id = "/subscriptions/39986eb2-6bc2-4136-a8cb-4cab9737558f/resourceGroups/devopspipeline-dev-rg/providers/Microsoft.Network/networkSecurityGroups/devopspipeline-dev-nsg"
}

# 5. NSG-Subnet Association
import {
  to = azurerm_subnet_network_security_group_association.main
  id = "/subscriptions/39986eb2-6bc2-4136-a8cb-4cab9737558f/resourceGroups/devopspipeline-dev-rg/providers/Microsoft.Network/virtualNetworks/devopspipeline-dev-vnet/subnets/vm-subnet"
}

# 6. Public IP
import {
  to = azurerm_public_ip.main
  id = "/subscriptions/39986eb2-6bc2-4136-a8cb-4cab9737558f/resourceGroups/devopspipeline-dev-rg/providers/Microsoft.Network/publicIPAddresses/devopspipeline-dev-pip"
}

# 7. Network Interface
import {
  to = azurerm_network_interface.main
  id = "/subscriptions/39986eb2-6bc2-4136-a8cb-4cab9737558f/resourceGroups/devopspipeline-dev-rg/providers/Microsoft.Network/networkInterfaces/devopspipeline-dev-nic"
}

# 8. SSH Public Key
import {
  to = azurerm_ssh_public_key.main
  id = "/subscriptions/39986eb2-6bc2-4136-a8cb-4cab9737558f/resourceGroups/devopspipeline-dev-rg/providers/Microsoft.Compute/sshPublicKeys/devopspipeline-dev-sshkey"
}

# 9. Virtual Machine
import {
  to = azurerm_linux_virtual_machine.main
  id = "/subscriptions/39986eb2-6bc2-4136-a8cb-4cab9737558f/resourceGroups/devopspipeline-dev-rg/providers/Microsoft.Compute/virtualMachines/devopspipeline-dev-vm"
}

# 10. Container Registry (ACR)
# Note: The ACR name includes a random suffix from random_string.suffix resource
import {
  to = azurerm_container_registry.main
  id = "/subscriptions/39986eb2-6bc2-4136-a8cb-4cab9737558f/resourceGroups/devopspipeline-dev-rg/providers/Microsoft.ContainerRegistry/registries/devopspipelinedevacr7ax5po"
}

# Note: The random_string.suffix resource may also need to be imported or recreated
# If you encounter issues with the ACR name suffix, you may need to import the random_string or
# adjust the random.tf lifecycle to allow the existing suffix "7ax5po" to be preserved.

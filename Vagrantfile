$hab_setup = <<SCRIPT

groupadd hab
useradd -g hab hab
curl https://raw.githubusercontent.com/habitat-sh/habitat/master/components/hab/install.sh | bash

hab sup load cnunciato/hello-splunk --strategy at-once --channel unstable
hab sup load cnunciato/hello-node --bind splunk:hello-splunk.default --strategy at-once --channel unstable
hab sup load cnunciato/hello-nginx --bind app:hello-node.default --strategy at-once --channel unstable

mkdir -p /hab/user/hello-splunk/config/
echo "[splunk]
host = ''
token = ''
" > /hab/user/hello-splunk/config/user.toml

SCRIPT

Vagrant.configure 2 do |config|
  config.vm.box = 'bento/ubuntu-17.10'
  config.vm.provision :shell, inline: $hab_setup, privileged: true
  config.vm.network 'forwarded_port', guest: 8888, host: 8888
  config.vm.network 'forwarded_port', guest: 8080, host: 8080
  config.vm.network 'forwarded_port', guest: 3000, host: 3000
  config.vm.network 'forwarded_port', guest: 9631, host: 9631

  config.vm.provider "vmware_fusion" do |v|
    v.vmx["memsize"] = "4096"
    v.vmx["numvcpus"] = "2"
  end
end

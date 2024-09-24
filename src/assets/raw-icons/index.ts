import AccountIcon from './icon_account.svg'
import AclIcon from './icon_acl.svg'
import AutoscalingGroupIcon from './icon_autoscaling_group.svg'
import BucketIcon from './icon_bucket.svg'
import CertificateIcon from './icon_certificate.svg'
import CloudIcon from './icon_cloud.svg'
import ConnectionIcon from './icon_connection.svg'
import DatabaseIcon from './icon_database.svg'
import DnsIcon from './icon_dns.svg'
import DnsRecordIcon from './icon_dns_record.svg'
import EndpointIcon from './icon_endpoint.svg'
import FunctionIcon from './icon_function.svg'
import GatewayIcon from './icon_gateway.svg'
import GroupIcon from './icon_group.svg'
import HealthCheckIcon from './icon_health_check.svg'
import InstanceIcon from './icon_instance.svg'
import InstanceProfileIcon from './icon_instance_profile.svg'
import InstanceTypeIcon from './icon_instance_type.svg'
import KeyIcon from './icon_key.svg'
import KeyPairIcon from './icon_keypair.svg'
import LoadBalancerIcon from './icon_load_balancer.svg'
import NetworkIcon from './icon_network.svg'
import NetworkAddressIcon from './icon_network_address.svg'
import NetworkInterfaceIcon from './icon_network_interface.svg'
import PolicyIcon from './icon_policy.svg'
import QuotaIcon from './icon_quota.svg'
import RegionIcon from './icon_region.svg'
import ResourceIcon from './icon_resource.svg'
import RoleIcon from './icon_role.svg'
import RoutingTableIcon from './icon_routing_table.svg'
import SecurityGroupIcon from './icon_security_group.svg'
import SnapshotIcon from './icon_snapshot.svg'
import StackIcon from './icon_stack.svg'
import SubnetIcon from './icon_subnet.svg'
import TunnelIcon from './icon_tunnel.svg'
import TypeIcon from './icon_type.svg'
import UserIcon from './icon_user.svg'
import VolumeIcon from './icon_volume.svg'
import VolumeTypeIcon from './icon_volume_type.svg'
import ZoneIcon from './icon_zone.svg'
import MarkerIcon from './marker-icon.svg'

export const getIconFromResource = (icon?: string) => {
  switch (icon) {
    case 'account':
      return AccountIcon
    case 'acl':
      return AclIcon
    case 'autoscaling':
      return AutoscalingGroupIcon
    case 'bucket':
      return BucketIcon
    case 'certificate':
      return CertificateIcon
    case 'cloud':
      return CloudIcon
    case 'connection':
      return ConnectionIcon
    case 'database':
      return DatabaseIcon
    case 'dns':
      return DnsIcon
    case 'dns_record':
      return DnsRecordIcon
    case 'endpoint':
      return EndpointIcon
    case 'function':
      return FunctionIcon
    case 'gateway':
      return GatewayIcon
    case 'group':
      return GroupIcon
    case 'health_check':
      return HealthCheckIcon
    case 'instance':
      return InstanceIcon
    case 'instance_profile':
      return InstanceProfileIcon
    case 'instance_type':
      return InstanceTypeIcon
    case 'key':
      return KeyIcon
    case 'keypair':
      return KeyPairIcon
    case 'load_balance':
      return LoadBalancerIcon
    case 'network_address':
      return NetworkAddressIcon
    case 'network':
      return NetworkIcon
    case 'network_interface':
      return NetworkInterfaceIcon
    case 'policy':
      return PolicyIcon
    case 'quota':
      return QuotaIcon
    case 'region':
      return RegionIcon
    case 'resource':
      return ResourceIcon
    case 'role':
      return RoleIcon
    case 'routing_table':
      return RoutingTableIcon
    case 'security_group':
      return SecurityGroupIcon
    case 'snapshot':
      return SnapshotIcon
    case 'stack':
      return StackIcon
    case 'subnet':
      return SubnetIcon
    case 'tunnel':
      return TunnelIcon
    case 'type':
      return TypeIcon
    case 'user':
      return UserIcon
    case 'volume':
      return VolumeIcon
    case 'volume_type':
      return VolumeTypeIcon
    case 'zone':
      return ZoneIcon
    default:
      return ResourceIcon
  }
}

export {
  AccountIcon,
  AclIcon,
  AutoscalingGroupIcon,
  BucketIcon,
  CertificateIcon,
  CloudIcon,
  ConnectionIcon,
  DatabaseIcon,
  DnsIcon,
  DnsRecordIcon,
  EndpointIcon,
  FunctionIcon,
  GatewayIcon,
  GroupIcon,
  HealthCheckIcon,
  InstanceIcon,
  InstanceProfileIcon,
  InstanceTypeIcon,
  KeyIcon,
  KeyPairIcon,
  LoadBalancerIcon,
  MarkerIcon,
  NetworkAddressIcon,
  NetworkIcon,
  NetworkInterfaceIcon,
  PolicyIcon,
  QuotaIcon,
  RegionIcon,
  ResourceIcon,
  RoleIcon,
  RoutingTableIcon,
  SecurityGroupIcon,
  SnapshotIcon,
  StackIcon,
  SubnetIcon,
  TunnelIcon,
  TypeIcon,
  UserIcon,
  VolumeIcon,
  VolumeTypeIcon,
  ZoneIcon,
}

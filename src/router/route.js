import Home from '@/view/Home'
import Login from '@/view/Login'
import Error from '@/view/Error'
// 首页
import Index from '@/view/Index'
// 实时监控
import Monitor from '@/view/Monitor'
// 大数据
import BigData from '@/view/BigData'
import Monitor1 from '@/view/Monitor1'
// 冷链
import TempAlarm from '@/view/coldChain/TempAlarm'
import TempMonitor from '@/view/coldChain/TempMonitor'
import TempMonitorDetail from '@/view/coldChain/TempMonitorDetail'
// 历史数据
import TireMonitor from '@/view/history/TireMonitor'
import LoadMonitor from '@/view/history/LoadMonitor'
import LoadingState from '@/view/history/LoadingState'
import TractionState from '@/view/history/TractionState'
import EmergencyBrakeRecord from '@/view/history/EmergencyBrakeRecord'
import VehicleIdleCondition from '@/view/history/VehicleIdleCondition'
import CarCurrentState from '@/view/history/CarCurrentState'
import ABSRecord from '@/view/history/ABSRecord'
import PSIRecord from '@/view/history/PSIRecord'
// 报警提醒
import AlarmDetail from '@/view/alarm/AlarmDetail'
// 报表统计
import MileageStatistics from '@/view/statisticsReport/MileageStatistics'
import RunTimeStatistics from '@/view/statisticsReport/RunTimeStatistics'
import AverageStatistics from '@/view/statisticsReport/AverageStatistics'
import OverspeedStatistics from '@/view/statisticsReport/OverspeedStatistics'
import EmptyRateStatistics from '@/view/statisticsReport/EmptyRateStatistics'
import VehicleUtilizationRateStatistics from '@/view/statisticsReport/VehicleUtilizationRateStatistics'
import BoxingUnloadingStatistics from '@/view/statisticsReport/BoxingUnloadingStatistics'
import ABSStatistics from '@/view/statisticsReport/ABSStatistics'
import PSIStatistics from '@/view/statisticsReport/PSIStatistics'
// 维修保养
import MaintenanceReminder from '@/view/maintenance/MaintenanceReminder'
import MaintenanceRecord from '@/view/maintenance/MaintenanceRecord'
import VehicleMaintenanceConfig from '@/view/maintenance/VehicleMaintenanceConfig'
import CompanyMaintenanceConfiguration from '@/view/maintenance/CompanyMaintenanceConfiguration'
import MaintenanceProjectSet from '@/view/maintenance/MaintenanceProjectSet'
// 档案管理
import DeviceNumber from '@/view/archives/DeviceNumber'
import DeviceManagement from '@/view/archives/DeviceManagement'
import VehicleFiles from '@/view/archives/VehicleFiles'
import AddVehicle from '@/view/archives/AddVehicle'
import EditVehicle from '@/view/archives/EditVehicle'
import ImportVehicle from '@/view/archives/ImportVehicle'
// 数据配置
import GlobalConfiguration from '@/view/configuration/GlobalConfiguration'
import VehicleConfiguration from '@/view/configuration/VehicleConfiguration'
// 系统管理
import CompanyInformationManagement from '@/view/system/CompanyInformationManagement'
import OrganizationalManagement from '@/view/system/OrganizationalManagement'
import RoleManagement from '@/view/system/RoleManagement'
import UserManagement from '@/view/system/UserManagement'
import ChangePassword from '@/view/system/ChangePassword'
import PlatformSet from '@/view/system/PlatformSet'
import AddUser from '@/view/system/AddUser'
import EditUser from '@/view/system/EditUser'
import ImportUser from '@/view/system/ImportUser'
import SetRole from '@/view/system/SetRole'
import AddOrg from '@/view/system/AddOrg'
import EditOrg from '@/view/system/EditOrg'
import AddRole from '@/view/system/AddRole'
import EditRole from '@/view/system/EditRole'
import SetAuth from '@/view/system/SetAuth'
// 历史轨迹、实时跟踪
import ATrack from '@/view/map/ATrack'
import ATrail from '@/view/map/ATrail'
import BTrack from '@/view/map/BTrack'
import BTrail from '@/view/map/BTrail'
import GTrack from '@/view/map/GTrack'
import GTrail from '@/view/map/GTrail'
// GPS卫星定位信息
import Satellite from '@/view/satellite/Satellite'

export default {
  home: {name: 'Home', component: Home},
  login: {name: 'Login', component: Login},
  error: {name: 'Error', component: Error},
  // 实时监控、历史轨迹、实时跟踪
  aTrack: {name: 'ATrack', component: ATrack},
  aTrail: {name: 'ATrail', component: ATrail},
  bTrack: {name: 'BTrack', component: BTrack},
  bTrail: {name: 'BTrail', component: BTrail},
  gTrack: {name: 'GTrack', component: GTrack},
  gTrail: {name: 'GTrail', component: GTrail},
  satellite: {name: 'Satellite', component: Satellite},
  // 首页
  index: {name: 'Index', component: Index},
  // 实时监控
  monitor: {name: 'Monitor', component: Monitor},
  // 大数据
  bigData: {name: 'BigData', component: BigData},
  monitor1: {name: 'Monitor1', component: Monitor1},
  // 冷链
  tempAlarm: {name: 'TempAlarm', component: TempAlarm},
  tempMonitor: {name: 'TempMonitor', component: TempMonitor},
  tempMonitorDetail: {name: 'TempMonitorDetail', component: TempMonitorDetail},
  // 历史数据
  tireMonitor: {name: 'TireMonitor', component: TireMonitor},
  loadMonitor: {name: 'LoadMonitor', component: LoadMonitor},
  loadingState: {name: 'LoadingState', component: LoadingState},
  tractionState: {name: 'TractionState', component: TractionState},
  emergencyBrakeRecord: {name: 'EmergencyBrakeRecord', component: EmergencyBrakeRecord},
  vehicleIdleCondition: {name: 'VehicleIdleCondition', component: VehicleIdleCondition},
  carCurrentState: {name: 'CarCurrentState', component: CarCurrentState},
  absRecord: {name: 'ABSRecord', component: ABSRecord},
  psiRecord: {name: 'PSIRecord', component: PSIRecord},
  // 报警提醒
  alarmDetail: {name: 'AlarmDetail', component: AlarmDetail},
  // 报表统计
  mileageStatistics: {name: 'MileageStatistics', component: MileageStatistics},
  runTimeStatistics: {name: 'RunTimeStatistics', component: RunTimeStatistics},
  averageStatistics: {name: 'AverageStatistics', component: AverageStatistics},
  overspeedStatistics: {name: 'OverspeedStatistics', component: OverspeedStatistics},
  emptyRateStatistics: {name: 'EmptyRateStatistics', component: EmptyRateStatistics},
  vehicleUtilizationRateStatistics: {name: 'VehicleUtilizationRateStatistics', component: VehicleUtilizationRateStatistics},
  boxingUnloadingStatistics: {name: 'BoxingUnloadingStatistics', component: BoxingUnloadingStatistics},
  absStatistics: {name: 'ABSStatistics', component: ABSStatistics},
  psiStatistics: {name: 'PSIStatistics', component: PSIStatistics},
  // 维修保养
  maintenanceReminder: {name: 'MaintenanceReminder', component: MaintenanceReminder},
  maintenanceRecord: {name: 'MaintenanceRecord', component: MaintenanceRecord},
  vehicleMaintenanceConfig: {name: 'VehicleMaintenanceConfig', component: VehicleMaintenanceConfig},
  companyMaintenanceConfiguration: {name: 'CompanyMaintenanceConfiguration', component: CompanyMaintenanceConfiguration},
  maintenanceProjectSet: {name: 'MaintenanceProjectSet', component: MaintenanceProjectSet},
  // 档案管理
  deviceNumber: {name: 'DeviceNumber', component: DeviceNumber},
  deviceManagement: {name: 'DeviceManagement', component: DeviceManagement},
  vehicleFiles: {name: 'VehicleFiles', component: VehicleFiles},
  addVehicle: {name: 'AddVehicle', component: AddVehicle},
  editVehicle: {name: 'EditVehicle', component: EditVehicle},
  importVehicle: {name: 'ImportVehicle', component: ImportVehicle},
  // 数据配置
  globalConfiguration: {name: 'GlobalConfiguration', component: GlobalConfiguration},
  vehicleConfiguration: {name: 'VehicleConfiguration', component: VehicleConfiguration},
  // 系统管理
  companyInformationManagement: {name: 'CompanyInformationManagement', component: CompanyInformationManagement},
  organizationalManagement: {name: 'OrganizationalManagement', component: OrganizationalManagement},
  userManagement: {name: 'UserManagement', component: UserManagement},
  roleManagement: {name: 'RoleManagement', component: RoleManagement},
  changePassword: {name: 'ChangePassword', component: ChangePassword},
  platformSet: {name: 'PlatformSet', component: PlatformSet},
  addUser: {name: 'AddUser', component: AddUser},
  editUser: {name: 'EditUser', component: EditUser},
  importUser: {name: 'ImportUser', component: ImportUser},
  setRole: {name: 'SetRole', component: SetRole},
  addOrg: {name: 'AddOrg', component: AddOrg},
  editOrg: {name: 'EditOrg', component: EditOrg},
  addRole: {name: 'AddRole', component: AddRole},
  editRole: {name: 'EditRole', component: EditRole},
  setAuth: {name: 'SetAuth', component: SetAuth}
}

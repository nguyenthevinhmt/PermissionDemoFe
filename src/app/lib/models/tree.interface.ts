export interface IPermissionConfig {
  permisisonKey: string;
  label: string;
  parentKey: string;
}

export interface IPermissionTreeItem {
  icon: string;
  key: string;
  label: string;
  parentKey: string;
  styleClass: string;
  children: IPermissionTreeItem[];
}

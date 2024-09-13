export interface IMenu {
  label: string;
  isShow?: boolean;
  icon?: string;
  routerLink: [string];
  items: IMenu[];
}

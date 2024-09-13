import { ERole } from './role.enum';

export class RoleConst {
  public static statusList = [
    {
      name: 'Hoạt động',
      code: ERole.ACTIVE,
      class: 'tag-active',
    },
    {
      name: 'Đã hủy',
      code: ERole.DEACTIVE,
      class: 'tag-deactive',
    },
  ];

  public static getStatusInfo(code, field = null) {
    let status = this.statusList.find((status) => status.code == code);
    return status && field ? status[field] : status;
  }
}

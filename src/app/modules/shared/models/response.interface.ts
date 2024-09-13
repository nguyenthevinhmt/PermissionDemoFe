export enum EStatusResonse {
  SUCCESS = 1,
  ERROR = 0,
}

export interface IResponseList<Item> {
  code: number;
  data: {
    items: Item[];
    totalItems: number;
  };
  message: string;
  status: EStatusResonse;
}

export interface IResponseItem<Item> {
  code: number;
  data: Item;
  message: string;
  status: EStatusResonse;
  successFE?: string;
}

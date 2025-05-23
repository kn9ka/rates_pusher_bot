export type Direction = {
  currency_get_id: string;
  currency_give_id: string;
  direction_id: string;
};

export type CalcResponse = {
  data: {
    course_give: number;
    course_get: number;
    [key: string]: any;
  };
};

export type CityResponse = {
  data: {
    dir_fields: {
      city: {
        options: {
          [key: string]: string;
        };
      };
    };
  };
};

export type GetCalcParams = {
  directionId: string;
  amount: number;
  city: string;
};

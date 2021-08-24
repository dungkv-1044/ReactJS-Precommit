enum ROUTES {
  HOME = "/home",
  LOGIN = "/login",
}

export type Params = {
  [k: string]: string;
};

// export interface XXXXDetailParams extends Params {
//   id: string;
// }

export default ROUTES;

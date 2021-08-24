export enum LocalStorageKey {
  ACCESS_TOKEN = "ACCESS_TOKEN",
}

export default class LocalStorage {
  public static get = (key: LocalStorageKey) => {
    return localStorage.getItem(key);
  };
  public static set = (key: LocalStorageKey, value: string) => {
    return localStorage.setItem(key, value);
  };
  public static remove = (key: LocalStorageKey) => {
    return localStorage.removeItem(key);
  };
}

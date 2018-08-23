export class Country {

  code: string;
  name: string;

  constructor() {

  }

  static newInstance(code: string, name: string) {
    let _data = new Country();
    _data.code = code;
    _data.name = name;
    return _data;
  }

}

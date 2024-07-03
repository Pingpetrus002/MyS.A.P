

export default class JObject {
  constructor() {
    this.data = {};
  }

  set(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }

  delete(key) {
    delete this.data[key];
  }

  has(key) {
    return key in this.data;
  }

  keys() {
    return Object.keys(this.data);
  }

  values() {
    return Object.values(this.data);
  }

  entries() {
    return Object.entries(this.data);
  }

  toJSON() {
    return JSON.stringify(this.data);
  }

  fromJSON(json) {
    this.data = JSON.parse(json);
  }

  toFormData() {
    return Object.entries(this.data);
  }


  fromFormData(formData) {
    this.data = Object.fromEntries(formData);
  }

  toQueryString() {
    return new URLSearchParams(this.data).toString();
  }
}
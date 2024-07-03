# Utils

### JObject.js
- Class pour faciliter la manipulation des objets JSON
- Exemple d'utilisation:
```javascript
import JObject from './utils/JObject.js';
const json = `{
    "name": "John",
    "age": 30,
    "cars": {
        "car1": "Ford",
        "car2": "BMW",
        "car3": "Fiat"
    }
    colors: ["red", "green", "blue"]
}`;
const jObject = new JObject();
jObject.fromJSON(json);
console.log(jObject.get("name")); // John
console.log(jObject.get("cars").car1) // Ford
console.log(jObject.get("colors")[2]) // blue
JOject.set("name", "Jane");
console.log(jObject.get("name")); // Jane
JOject.toJSON(); // '{"name":"Jane","age":30,"cars":{"car1":"Ford","car2":"BMW","car3":"Fiat"},"colors":["red","green","blue"]}'
```
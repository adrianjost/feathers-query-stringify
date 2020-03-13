# feathers-query-stringify

This simple code snippet converts feathersJS query objects into an url query string that you can use to build your REST API calls.

It can handle nested Objects as well as Arrays.

## Example

```js
import stringify from "feathers-query-stringify";

const query = {
  $limit: 10,
  $sort: {
    createdAt: -1
  }
}

const output = stringify(query);

// => "$limit=10&$sort[createdAt]=-1"
```

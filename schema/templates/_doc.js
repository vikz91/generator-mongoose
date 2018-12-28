## <%= capSchemaName %>

`<%= capSchemaName %>` Endpoint for managaing <%= lowSchemaName %>s.

### Endpoint Summary

-   `[GET]` /api/<%= lowSchemaName %>s - [Retrieve All *<%= capSchemaName %>s*](#Retrieve-All-<%= capSchemaName %>s)
-   `[POST]` /api/<%= lowSchemaName %> - [Create a new *<%= capSchemaName %>*](#Create-a-new-<%= capSchemaName %>)
-   `[GET]` /api/<%= lowSchemaName %>/<.id> - [Retrieve a single *<%= capSchemaName %>* with `id`](#Retrieve-a-single-<%= capSchemaName %>)
-   `[PUT]` /api/<%= lowSchemaName %>/<.id> - [Edit a single *<%= capSchemaName %>* with `id`](#Edit-a-single-<%= capSchemaName %>)
-   `[DELETE]` /api/<%= lowSchemaName %>/<.id> - [Delete a single *<%= capSchemaName %>* with `id`](#Delete-a-single-<%= capSchemaName %>)
-   `[GET]` /api/<%= lowSchemaName %>s/test - [Quick Test <%= lowSchemaName %>](#Quick-Test-<%= lowSchemaName %>)
-   `[DELETE]` /api/<%= lowSchemaName %>s - [Delete all *<%= lowSchemaName %>s* in the collection](#Delete-all-<%= lowSchemaName %>s)
-   `[GET]` /api/<%= lowSchemaName %>s/search - [Searches all *<%= lowSchemaName %>s* for multiple values](#Search-<%= lowSchemaName %>s)
-   `[POST]` /api/<%= lowSchemaName %>s/search - [Applies Advance search(like ranges, arrays) over _<%= lowSchemaName %>s_ for multiple values](#Search-<%= lowSchemaName %>s-advanced)

**N.B**: The `/test` endpoint of this <%= lowSchemaName %> is for quick development testing only. Do Disable this when in production!

### SDK Summary

    - Unity >= 5
    - Angular >= 4.3

The SDKs have provider code already set

### Retrieve All <%= capSchemaName %>s

-   **Syntax** : `[GET] /api/<%= lowSchemaName %>s [?skip= X & limit= Y]`
-   **URL** : `/api/<%= lowSchemaName %>s`
-   **Method**: `GET`
-   **URL Params**:  
     **Required:** None  
     **Optional:**

    `skip=[Integer]` - Offsets(Skips) index of results  
     `limit=[Integer]` - Total number of results in the current request to return

-   **Success Response:**

    **Code:** 200 <br />
    **Content:**

    ```
    {
      "status": "success",
      "data": {
        "<%= lowSchemaName %>s": [
          {
            "_id": "587100001657a2bd9c5a00df",
            <% schemaFields.forEach(function(field, index) { %><%=field.split(':')[0] %> : <%= field.split(':')[1] %>,<% if(schemaFields.length-1!=index){ %><%= "\n\t\t\t" %> <%} %><% }) %>
            "__v": 0
          },
          .
          .
          .
        ],
        "count": 1
      },
      "message": null
    }
    ```

-   **Sample Call:**

    `curl "http://localhost:3000/api/<%= lowSchemaName %>s"`  
    Fetches 5 <%= lowSchemaName %> results skipping the first 2

-   **Notes:**

### Create a new <%= capSchemaName %>

-   **Syntax** : `[POST] /api/<%= lowSchemaName %>`
-   **URL** : `/api/<%= lowSchemaName %>`
-   **Method**: `POST`
-   **URL Params**:  
     **Optional:** None  
     **Required:**

    `{data:{}}` - The base <%= lowSchemaName %> data object

    ```
     {
       "data" : {
         <% schemaFields.forEach(function(field, index) { %><%=field.split(':')[0] %> : <%= field.split(':')[1] %><% if(schemaFields.length-1!=index){ %><%= "," %> <%} %>
         <% }) %>
       }
     }
    ```

-   **Success Response:**

    **Code:** 201  
     **Content:**

    ```
      {
        "status": "success",
        "data": {
          "__v": 0,
          "_id": "58713aaf1657a2bd9c5a00e0",
          <% schemaFields.forEach(function(field, index) { %><%=field.split(':')[0] %> : <%= field.split(':')[1] %><% if(schemaFields.length-1!=index){ %><%= "," %> <%} %>
          <% }) %>
        },
        "message": null
      }
    ```

-   **Error Response:**

    **Code:** 500 <br />
    **Content:**

    ```
      {
        "status": "error",
        "data": "Invalid <%= lowSchemaName %>/key model provided",
        "message": "There was an error saving this data."
      }
    ```

-   **Sample Call:**

    ```
        curl -X POST -H "Content-Type: application/json"
          -H "Cache-Control: no-cache" -d     '{
          "<%= lowSchemaName %>":{
              "name":"pen",
              "price":2.54
              }
          }' "http://localhost:3000/api/<%= lowSchemaName %>"

    ```

    The key model being `<%= lowSchemaName %>` the saves a 'pen' data

-   **Notes:**

### Retrieve a single <%= capSchemaName %>

-   **Syntax** : `[GET] /api/<%= lowSchemaName %>/:id`
-   **URL** : `/api/<%= lowSchemaName %>/:id`
-   **Method**: `GET`
-   **URL Params**:  
     **Optional:** None  
     **Required:**

    `id` - The object id of the <%= lowSchemaName %>  


-   **Success Response:**

    **Code:** 200  
     **Content:**

    ```
      {
        "status": "success",
        "data": {
          "_id": "587100001657a2bd9c5a00df",
          "__v": 0,
          <% schemaFields.forEach(function(field, index) { %><%=field.split(':')[0] %> : <%= field.split(':')[1] %><% if(schemaFields.length-1!=index){ %><%= "," %> <%} %>
          <% }) %>
        },
        "message": null
      }
    ```

-   **Error Response:**

    **Code:** 404  
     **Content:**

    ```
      {
        "status": "error",
        "data": 404,
        "message": "Not Found Error"
      }
    ```

-   **Sample Call:**

    ```
        curl -X GET -H "Content-Type: application/json"
          -H "Cache-Control: no-cache"
          "http://localhost:3000/api/<%= lowSchemaName %>/587100001657a2bd9c5a00d"

    ```

    Fetches a single <%= lowSchemaName %> from the collection `<%= lowSchemaName %>s`

-   **Notes:**

### Edit a single <%= capSchemaName %>

-   **Syntax** : `[PUT] /api/<%= lowSchemaName %>/:id`
-   **URL** : `/api/<%= lowSchemaName %>/:id`
-   **Method**: `PUT`
-   **URL Params**:  
     **Optional:** None  
     **Required:**

    `id` - The object id of the <%= lowSchemaName %>  
     `{data:{}}` - The base <%= lowSchemaName %> data object that needs to be changed

    ```
     {
       "data" : {
         <% schemaFields.forEach(function(field, index) { %><%=field.split(':')[0] %> : <%= field.split(':')[1] %><% if(schemaFields.length-1!=index){ %><%= "," %> <%} %>
         <% }) %>
       }
     }
    ```

-   **Success Response:**

    **Code:** 202  
     **Content:**

    ```
      {
        "status": "success",
        "data": {
          "_id": "587100001657a2bd9c5a00df",
          "__v": 0,
          <% schemaFields.forEach(function(field, index) { %><%=field.split(':')[0] %> : <%= field.split(':')[1] %><% if(schemaFields.length-1!=index){ %><%= "," %> <%} %>
          <% }) %>
        },
        "message": null
      }
    ```

-   **Error Response:**

    **Code:** 500  
     **Content:**

    ```
      {
        "status": "error",
        "data": "Invalid <%= lowSchemaName %>/key model provided",
        "message": "There was an error updating this data."
      }
    ```

    **Code:** 404  
     **Content:**

    ```
    {
      "status": "error",
      "data": 404,
      "message": "No Data Found"
    }
    ```

-   **Sample Call:**

    ```
        curl -X PUT -H "Content-Type: application/json"
          -H "Cache-Control: no-cache"
          -d '{
                "<%= lowSchemaName %>22":{
                    "name":"sharpner",
                    "price":2.55
                  }
              }' "http://localhost:3000/api/<%= lowSchemaName %>/587100001657a2bd9c5a00df"

    ```

    The key model being `<%= lowSchemaName %>` which updates a 'sharpner' data

-   **Notes:**

### Delete a single <%= capSchemaName %>

-   **Syntax** : `[DELETE] /api/<%= lowSchemaName %>/:id`
-   **URL** : `/api/<%= lowSchemaName %>/:id`
-   **Method**: `DELETE`
-   **URL Params**:  
     **Optional:** None  
     **Required:**

    `id` - The object id of the <%= lowSchemaName %>

-   **Success Response:**

    **Code:** 202  
     **Content:**

    ```
    {
      "status": "success",
      "data": "The <%= lowSchemaName %> got Deleted",
      "message": null
    }
    ```

-   **Error Response:**

    **Code:** 500  
     **Content:**

    ```
      {
      "status": "error",
      "data": "Error in deleting this <%= lowSchemaName %>",
      "message": {
        .
        .
        .
      }
    }
    ```

-   **Sample Call:**

    ```
      curl -X DELETE "http://localhost:3000/api/<%= lowSchemaName %>/58713b0a1657a2bd9c5ad"
    ```

    The key model being `<%= lowSchemaName %>` which updates a 'sharpner' data

-   **Notes:**

### Delete all <%= capSchemaName %>s

-   **Syntax** : `[DELETE] /api/<%= lowSchemaName %>s`
-   **URL** : `/api/<%= lowSchemaName %>s`
-   **Method**: `DELETE`
-   **URL Params**:  
     **Optional:** None  
     **Required:** None
-   **Success Response:**

    **Code:** 202  
     **Content:**

    ```
     {
       "status": "success",
       "data": "All <%= lowSchemaName %>s got Delete",
       "message": null
     }
    ```

-   **Error Response:**

    **Code:** 500  
     **Content:**

    ```
       {
         "status": "error",
         "data": "Error in deleting all <%= lowSchemaName %>s",
         "message": {
           .
           .
           .
         }
       }
    ```

-   **Sample Call:**

    ```
      curl -X DELETE "http://localhost:3000/api/<%= lowSchemaName %>s"
    ```

    The key model being `<%= lowSchemaName %>` which updates a 'sharpner' data

-   **Notes:**

### Search <%= capSchemaName %>s

-   **Syntax** : `[GET] /api/<%= lowSchemaName %>s/search [?skip= X & limit= Y & keyword= field:value [,field:value]]`
-   **URL** : `/api/<%= lowSchemaName %>s/search`
-   **Method**: `GET`
-   **URL Params**:  
     **Required:** keyword  
     **Optional:**

    `skip=[Integer]` - Offsets(Skips) index of results  
     `limit=[Integer]` - Total number of results in the current request to return
    `keyword=[CSV]` - keyword = field1:value1, filed2:value2 ...
    `strict=[Boolean]` - Performs Strict search.

-   **Success Response:**

    **Code:** 200 <br />
    **Content:**

    ```
    {
      "status": "success",
      "data": {
        "<%= lowSchemaName %>s": [
          {
            "_id": "587100001657a2bd9c5a00df",
            name : String,
        price : Number,
            "__v": 0
          },
          .
          .
          .
        ],
        "count": 1
      },
      "message": null
    }
    ```

-   **Sample Call:**

    `curl "http://localhost:3000/api/<%= lowSchemaName %>s/search?keyword=first:Sam,last:Jones"`  
    Searches <%= lowSchemaName %>s with rows with its first name 'Sam' and last name 'Jones'

-   **Notes:**
    To use Strict Search, add param ?strict=true




    ### Search <%= lowSchemaName %>s Advanced

-   **Syntax** : `[POST] /api/<%= lowSchemaName %>s/search [?skip= X & limit= Y`
-   **URL** : `/api/<%= lowSchemaName %>s/search`
-   **Method**: `GET`
-   **URL Params**:  
     **Required:**  
     **Optional:**

        `skip=[Integer]` - Offsets(Skips) index of results
         `limit=[Integer]` - Total number of results in the current request to return
        `{data:{}}` - The base <%= lowSchemaName %> data object that needs to be searched

        ```

    {
    "data":{
    "name": { "search":"single","value":"deb"},
    "price": { "search":"range","value":[25,28]},
    "color": {"search":"array","value":["red","green"]},
    "visited": { "valueNot": ['Tokyo','LA']}
    }
    }

        ```

-   **Success Response:**

    **Code:** 200 <br />
    **Content:**

    ```
    {
      "status": "success",
      "data": {
        "<%= lowSchemaName %>s": [
          {
            "_id": "587100001657a2bd9c5a00df",
            name : String,
        price : Number,
            "__v": 0
          },
          .
          .
          .
        ],
        "count": 1
      },
      "message": null
    }
    ```

-   **Sample Call:**

    ```
    curl -X POST \
    http://localhost:3000/api/<%= lowSchemaName %>s/search \
    -H 'Content-Type: application/json' \
    -d '{ "data":{ "name": { "search":"single","value":"itm2" } } }'
    ```

    Searches <%= lowSchemaName %>s with rows with its first name 'Sam' and last name 'Jones'
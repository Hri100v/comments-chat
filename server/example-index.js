const swagger = require('./src/config/swagger2');
fastify.register(require('fastify-swagger'), swagger.options);

// parse application/x-www-form-urlencoded
fastify.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
fastify.use(bodyParser.json());

// fastify.use((req, res, next)=>{
// console.log('request coming')
// console.log(req.headers);
// next();
// })

const routes = require('./src/routes');

// ES6 promises
mongoose.Promise = Promise;

//PROD
mongoose.connect('MONGO_STRING', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    promiseLibrary: global.Promise
});

const db = mongoose.connection;

// mongodb error
db.on('error', console.error.bind(console, 'connection error:'));

// mongodb connection open
db.once('open', () => {
    console.log(`Connected to Mongo at: ${new Date()}`);
});

routes.forEach((route) => {
    fastify.route(route);
});
fastify.route({
    method: 'POST',
    url: '/api/hellotest',
    handler: async (req, res) => {
        console.log('pinged!!');
        // console.log(arguments)
        res.send({ success: true, message: 'Hello World', body: req.body })
    }
})

/*
And this is my curl command:
curl - X POST - H 'content-type:application/json' --data - raw '{}' http://localhost:5000/api/hellotest

This is the response from curl:
% Total % Received % Xferd Average Speed Time Time Time Current
Dload Upload Total Spent Left Speed
100 2 0 0 0 2 0 0 --: --: --0: 02: 00 --: --: --0
curl: (52) Empty reply from server

Finally this is my swagger2 file or conf:
*/

exports.options = {
    routePrefix: '/docs',
    exposeRoute: true,
    swagger: "2.0",
    swagger: {
        "info": {
            "description": "This is a Shopify Fulfillment API. It enable app developers to give merchants more control and visibility into order fulfillment. It lets you access and change data inside the application from remote. The request must use the protocol HTTPS. Note - it shows feature of an application that is still in development and as such, can change.",
            "version": "1.0.0",
            "title": "Shopify Fulfillment API",
            "termsOfService": "http://macromade.com/terms/",
            "contact": {
                "email": "apiteam@macromade.com"
            },
            "license": {
                "name": "Apache 2.0",
                "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
            }
        },
        "host": "localhost:5000",
        "basePath": "/api",
        "tags": [
            {
                "name": "order",
                "description": "Retrieve info of a specific order"
            },
            {
                "name": "orders",
                "description": "Retrieve info of all the orders made in the last 31 days"
            },
            {
                "name": "article",
                "description": "Retrieve a single article inside the warehouse"
            },
            {
                "name": "articles",
                "description": "Retrieve info of all articles inside the warehouse"
            },
            {
                "name": "cargo",
                "description": "Retrieve info of a single cargo"
            },
            {
                "name": "cargos",
                "description": "Retrieve info of all cargos made in the last 31 days"
            },
            {
                "name": "users",
                "description": "User login authentication and authorization"
            }
        ],
        "schemes": [
            "https", "http"
        ],
        "paths": {
            "/order": {
                "post": {
                    "tags": [
                        "order"
                    ],
                    "summary": "Add a new order",
                    "description": "",
                    "operationId": "addOrder",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "order",
                            "description": "Order object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Order"
                            }
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:order",
                                "read:order"
                            ]
                        }
                    ]
                },
                "put": {
                    "tags": [
                        "order"
                    ],
                    "summary": "Update an existing order",
                    "description": "",
                    "operationId": "updateOrder",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "order",
                            "description": "Order object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Order"
                            }
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Order not found"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:order",
                                "read:order"
                            ]
                        }
                    ]
                }
            },
            "/order/findByStatus": {
                "get": {
                    "tags": [
                        "order"
                    ],
                    "summary": "Finds Order by status",
                    "description": "Multiple status values can be provided with comma separated strings",
                    "operationId": "findOrderByStatus",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "status",
                            "in": "query",
                            "description": "Status values that need to be considered for filter",
                            "required": true,
                            "type": "array",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "placed",
                                    "approved",
                                    "shipped",
                                    "delivered"
                                ],
                                "default": "shipped"
                            },
                            "collectionFormat": "multi"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/Order"
                                }
                            }
                        },
                        "400": {
                            "description": "Invalid status value"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:order",
                                "read:order"
                            ]
                        }
                    ]
                }
            },
            "/order/findByTypes": {
                "get": {
                    "tags": [
                        "order"
                    ],
                    "summary": "Finds Order by types",
                    "description": "Muliple tags can be provided with comma separated strings. Use small, medium, large for testing.",
                    "operationId": "findOrderByTags",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "types",
                            "in": "query",
                            "description": "Tags to filter by",
                            "required": true,
                            "type": "array",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "small",
                                    "medium",
                                    "large"
                                ],
                                "default": "medium"
                            },
                            "collectionFormat": "multi"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/Order"
                                }
                            }
                        },
                        "400": {
                            "description": "Invalid tag value"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:order",
                                "read:order"
                            ]
                        }
                    ],
                    "deprecated": false
                }
            },
            "/order/{orderId}": {
                "get": {
                    "tags": [
                        "order"
                    ],
                    "summary": "Find order by ID",
                    "description": "Returns a single order",
                    "operationId": "getOrderById",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "orderId",
                            "in": "path",
                            "description": "ID of order to return",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "$ref": "#/definitions/Order"
                            }
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Order not found"
                        }
                    },
                    "security": [
                        {
                            "api_key": []
                        }
                    ]
                },
                "post": {
                    "tags": [
                        "order"
                    ],
                    "summary": "Updates an order in the web service with form data",
                    "description": "",
                    "operationId": "updateOrderWithForm",
                    "consumes": [
                        "application/x-www-form-urlencoded"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "orderId",
                            "in": "path",
                            "description": "ID of order that needs to be updated",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        },
                        {
                            "name": "name",
                            "in": "formData",
                            "description": "Updated name of the order",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "status",
                            "in": "formData",
                            "description": "Updated status of the order",
                            "required": false,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:order",
                                "read:order"
                            ]
                        }
                    ]
                },
                "delete": {
                    "tags": [
                        "order"
                    ],
                    "summary": "Deletes an order",
                    "description": "",
                    "operationId": "deleteOrder",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "api_key",
                            "in": "header",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "orderId",
                            "in": "path",
                            "description": "Order id to delete",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Order not found"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:order",
                                "read:order"
                            ]
                        }
                    ]
                }
            },
            "/orders": {
                "post": {
                    "tags": [
                        "orders"
                    ],
                    "summary": "Add new orders",
                    "description": "",
                    "operationId": "addOrders",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "orders",
                            "description": "Orders object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Orders"
                            }
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:orders",
                                "read:orders"
                            ]
                        }
                    ]
                },
                "put": {
                    "tags": [
                        "orders"
                    ],
                    "summary": "Update existing orders",
                    "description": "",
                    "operationId": "updateOrders",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "orders",
                            "description": "Orders object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Orders"
                            }
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Orders not found"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:orders",
                                "read:orders"
                            ]
                        }
                    ]
                }
            },
            "/orders/findByStatus": {
                "get": {
                    "tags": [
                        "orders"
                    ],
                    "summary": "Finds Orders by status",
                    "description": "Multiple status values can be provided with comma separated strings",
                    "operationId": "findOrdersByStatus",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "status",
                            "in": "query",
                            "description": "Status values that need to be considered for filter",
                            "required": true,
                            "type": "array",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "placed",
                                    "approved",
                                    "shipped",
                                    "delivered"
                                ],
                                "default": "shipped"
                            },
                            "collectionFormat": "multi"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/Orders"
                                }
                            }
                        },
                        "400": {
                            "description": "Invalid status value"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:orders",
                                "read:orders"
                            ]
                        }
                    ]
                }
            },
            "/orders/findByTypes": {
                "get": {
                    "tags": [
                        "orders"
                    ],
                    "summary": "Find Orders by types",
                    "description": "Muliple tags can be provided with comma separated strings. Use small, medium, large for testing.",
                    "operationId": "findOrdersByTags",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "types",
                            "in": "query",
                            "description": "Types to filter by",
                            "required": true,
                            "type": "array",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "small",
                                    "medium",
                                    "large"
                                ],
                                "default": "medium"
                            },
                            "collectionFormat": "multi"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/Orders"
                                }
                            }
                        },
                        "400": {
                            "description": "Invalid tag value"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:orders",
                                "read:orders"
                            ]
                        }
                    ],
                    "deprecated": false
                }
            },
            "/orders/{ordersId}": {
                "get": {
                    "tags": [
                        "orders"
                    ],
                    "summary": "Find orders by ID",
                    "description": "Return orders",
                    "operationId": "getOrdersById",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "ordersId",
                            "in": "path",
                            "description": "ID of orders to return",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "$ref": "#/definitions/Orders"
                            }
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Order not found"
                        }
                    },
                    "security": [
                        {
                            "api_key": []
                        }
                    ]
                },
                "post": {
                    "tags": [
                        "orders"
                    ],
                    "summary": "Updates orders in the web service with form data",
                    "description": "",
                    "operationId": "updateOrdersWithForm",
                    "consumes": [
                        "application/x-www-form-urlencoded"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "ordersId",
                            "in": "path",
                            "description": "ID of orders that needs to be updated",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        },
                        {
                            "name": "name",
                            "in": "formData",
                            "description": "Updated name of orders",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "status",
                            "in": "formData",
                            "description": "Updated status of orders",
                            "required": false,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:orders",
                                "read:orders"
                            ]
                        }
                    ]
                },
                "delete": {
                    "tags": [
                        "orders"
                    ],
                    "summary": "Delete orders",
                    "description": "",
                    "operationId": "deleteOrders",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "api_key",
                            "in": "header",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "ordersId",
                            "in": "path",
                            "description": "Orders id to delete",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Order not found"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:orders",
                                "read:orders"
                            ]
                        }
                    ]
                }
            },
            "/article": {
                "post": {
                    "tags": [
                        "article"
                    ],
                    "summary": "Add a new article",
                    "description": "",
                    "operationId": "addArticle",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "article",
                            "description": "Article object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Article"
                            }
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:article",
                                "read:article"
                            ]
                        }
                    ]
                },
                "put": {
                    "tags": [
                        "article"
                    ],
                    "summary": "Update an existing article",
                    "description": "",
                    "operationId": "updateArticle",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "article",
                            "description": "Article object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Article"
                            }
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Article not found"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:article",
                                "read:article"
                            ]
                        }
                    ]
                }
            },
            "/article/{articleId}": {
                "get": {
                    "tags": [
                        "article"
                    ],
                    "summary": "Find article by ID",
                    "description": "Return orders",
                    "operationId": "getArticleById",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "articleId",
                            "in": "path",
                            "description": "ID of an article to return",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "$ref": "#/definitions/Article"
                            }
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Article not found"
                        }
                    },
                    "security": [
                        {
                            "api_key": []
                        }
                    ]
                },
                "post": {
                    "tags": [
                        "article"
                    ],
                    "summary": "Update an article in the web service with form data",
                    "description": "",
                    "operationId": "updateArticleWithForm",
                    "consumes": [
                        "application/x-www-form-urlencoded"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "articleId",
                            "in": "path",
                            "description": "ID of an article that needs to be updated",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        },
                        {
                            "name": "name",
                            "in": "formData",
                            "description": "Updated name of an article",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "status",
                            "in": "formData",
                            "description": "Updated status of an article",
                            "required": false,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:article",
                                "read:article"
                            ]
                        }
                    ]
                },
                "delete": {
                    "tags": [
                        "article"
                    ],
                    "summary": "Delete an article",
                    "description": "",
                    "operationId": "deleteArticle",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "api_key",
                            "in": "header",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "articleId",
                            "in": "path",
                            "description": "Article id to delete",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Article not found"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:article",
                                "read:article"
                            ]
                        }
                    ]
                }
            },
            "/articles": {
                "post": {
                    "tags": [
                        "articles"
                    ],
                    "summary": "Add new articles",
                    "description": "",
                    "operationId": "addArticles",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "articles",
                            "description": "Articles object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Articles"
                            }
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:articles",
                                "read:articles"
                            ]
                        }
                    ]
                },
                "put": {
                    "tags": [
                        "articles"
                    ],
                    "summary": "Update existing articles",
                    "description": "",
                    "operationId": "updateArticles",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "articles",
                            "description": "Articles object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Articles"
                            }
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Article not found"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:articles",
                                "read:articles"
                            ]
                        }
                    ]
                }
            },
            "/articles/{articlesId}": {
                "get": {
                    "tags": [
                        "articles"
                    ],
                    "summary": "Find articles by ID",
                    "description": "Return articles",
                    "operationId": "getArticlesById",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "articlesId",
                            "in": "path",
                            "description": "ID of articles to return",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "$ref": "#/definitions/Articles"
                            }
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Articles not found"
                        }
                    },
                    "security": [
                        {
                            "api_key": []
                        }
                    ]
                },
                "post": {
                    "tags": [
                        "articles"
                    ],
                    "summary": "Update articles in the web service with form data",
                    "description": "",
                    "operationId": "updateArticlesWithForm",
                    "consumes": [
                        "application/x-www-form-urlencoded"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "articlesId",
                            "in": "path",
                            "description": "ID of articles that needs to be updated",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        },
                        {
                            "name": "name",
                            "in": "formData",
                            "description": "Updated name of articles",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "status",
                            "in": "formData",
                            "description": "Updated status of articles",
                            "required": false,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:articles",
                                "read:articles"
                            ]
                        }
                    ]
                },
                "delete": {
                    "tags": [
                        "articles"
                    ],
                    "summary": "Delete articles",
                    "description": "",
                    "operationId": "deleteArticles",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "api_key",
                            "in": "header",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "articlesId",
                            "in": "path",
                            "description": "Articles id to delete",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Articles not found"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:articles",
                                "read:articles"
                            ]
                        }
                    ]
                }
            },
            "/cargo": {
                "post": {
                    "tags": [
                        "cargo"
                    ],
                    "summary": "Add a new cargo",
                    "description": "",
                    "operationId": "addCargo",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "cargo",
                            "description": "Cargo object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Cargo"
                            }
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:cargo",
                                "read:cargo"
                            ]
                        }
                    ]
                },
                "put": {
                    "tags": [
                        "cargo"
                    ],
                    "summary": "Update an existing cargo",
                    "description": "",
                    "operationId": "updateCargo",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "cargo",
                            "description": "Cargo object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Cargo"
                            }
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Cargo not found"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:cargo",
                                "read:cargo"
                            ]
                        }
                    ]
                }
            },
            "/cargo/{cargoId}": {
                "get": {
                    "tags": [
                        "cargo"
                    ],
                    "summary": "Find a cargo by ID",
                    "description": "Return a cargo",
                    "operationId": "getCargoById",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "cargoId",
                            "in": "path",
                            "description": "ID of a cargo to return",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "$ref": "#/definitions/Cargo"
                            }
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Cargo not found"
                        }
                    },
                    "security": [
                        {
                            "api_key": []
                        }
                    ]
                },
                "post": {
                    "tags": [
                        "cargo"
                    ],
                    "summary": "Update a cargo in the web service with form data",
                    "description": "",
                    "operationId": "updateCargoWithForm",
                    "consumes": [
                        "application/x-www-form-urlencoded"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "cargoId",
                            "in": "path",
                            "description": "ID of a cargo that needs to be updated",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        },
                        {
                            "name": "name",
                            "in": "formData",
                            "description": "Updated name of a cargo",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "status",
                            "in": "formData",
                            "description": "Updated status of a cargo",
                            "required": false,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:cargo",
                                "read:cargo"
                            ]
                        }
                    ]
                },
                "delete": {
                    "tags": [
                        "cargo"
                    ],
                    "summary": "Delete a cargo",
                    "description": "",
                    "operationId": "deleteCargo",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "api_key",
                            "in": "header",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "cargoId",
                            "in": "path",
                            "description": "Cargo id to delete",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Cargo not found"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:cargo",
                                "read:cargo"
                            ]
                        }
                    ]
                }
            },
            "/cargos": {
                "post": {
                    "tags": [
                        "cargos"
                    ],
                    "summary": "Add new cargos",
                    "description": "",
                    "operationId": "addCargos",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "cargos",
                            "description": "Cargos object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Cargos"
                            }
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:cargos",
                                "read:cargos"
                            ]
                        }
                    ]
                },
                "put": {
                    "tags": [
                        "cargos"
                    ],
                    "summary": "Update existing cargos",
                    "description": "",
                    "operationId": "updateCargos",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "cargos",
                            "description": "Cargos object that needs to be added to the web service",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/Cargos"
                            }
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Cargos not found"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:cargos",
                                "read:cargos"
                            ]
                        }
                    ]
                }
            },
            "/cargos/{cargosId}": {
                "get": {
                    "tags": [
                        "cargos"
                    ],
                    "summary": "Find cargos by ID",
                    "description": "Return cargos",
                    "operationId": "getCargosById",
                    "consumes": [
                        "application/json"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "cargosId",
                            "in": "path",
                            "description": "ID of cargos to return",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "$ref": "#/definitions/Cargos"
                            }
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Cargos not found"
                        }
                    },
                    "security": [
                        {
                            "api_key": []
                        }
                    ]
                },
                "post": {
                    "tags": [
                        "cargos"
                    ],
                    "summary": "Update cargos in the web service with form data",
                    "description": "",
                    "operationId": "updateCargosWithForm",
                    "consumes": [
                        "application/x-www-form-urlencoded"
                    ],
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "cargosId",
                            "in": "path",
                            "description": "ID of cargos that needs to be updated",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        },
                        {
                            "name": "name",
                            "in": "formData",
                            "description": "Updated name of cargos",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "status",
                            "in": "formData",
                            "description": "Updated status of cargos",
                            "required": false,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:cargos",
                                "read:cargos"
                            ]
                        }
                    ]
                },
                "delete": {
                    "tags": [
                        "cargos"
                    ],
                    "summary": "Delete cargos",
                    "description": "",
                    "operationId": "deleteCargos",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "api_key",
                            "in": "header",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "cargosId",
                            "in": "path",
                            "description": "Cargos id to delete",
                            "required": true,
                            "type": "integer",
                            "format": "int64"
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Cargos not found"
                        }
                    },
                    "security": [
                        {
                            "shopifystore_auth": [
                                "write:cargos",
                                "read:cargos"
                            ]
                        }
                    ]
                }
            },
            "/users": {
                "post": {
                    "tags": [
                        "users"
                    ],
                    "summary": "Create user",
                    "description": "This can only be done by the logged in user.",
                    "operationId": "createUser",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "in": "body",
                            "name": "user",
                            "description": "Created user object",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/User"
                            }
                        }
                    ],
                    "responses": {
                        "default": {
                            "description": "successful operation"
                        }
                    }
                }
            },
            "/users/login": {
                "get": {
                    "tags": [
                        "users"
                    ],
                    "summary": "Logs user into the system",
                    "description": "",
                    "operationId": "loginUser",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "username",
                            "in": "query",
                            "description": "The user name for login",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "password",
                            "in": "query",
                            "description": "The password for login in clear text",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "type": "string"
                            },
                            "headers": {
                                "X-Rate-Limit": {
                                    "type": "integer",
                                    "format": "int32",
                                    "description": "calls per hour allowed by the user"
                                },
                                "X-Expires-After": {
                                    "type": "string",
                                    "format": "date-time",
                                    "description": "date in UTC when token expires"
                                }
                            }
                        },
                        "400": {
                            "description": "Invalid username/password supplied"
                        }
                    }
                }
            },
            "/users/logout": {
                "get": {
                    "tags": [
                        "users"
                    ],
                    "summary": "Logs out current logged in user session",
                    "description": "",
                    "operationId": "logoutUser",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [],
                    "responses": {
                        "default": {
                            "description": "successful operation"
                        }
                    }
                }
            },
            "/users/{username}": {
                "get": {
                    "tags": [
                        "users"
                    ],
                    "summary": "Get user by user name",
                    "description": "",
                    "operationId": "getUserByName",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "username",
                            "in": "path",
                            "description": "The name that needs to be fetched. Use user1 for testing. ",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "$ref": "#/definitions/User"
                            }
                        },
                        "400": {
                            "description": "Invalid username supplied"
                        },
                        "404": {
                            "description": "User not found"
                        }
                    }
                },
                "put": {
                    "tags": [
                        "users"
                    ],
                    "summary": "Updated user",
                    "description": "This can only be done by the logged in user.",
                    "operationId": "updateUser",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "username",
                            "in": "path",
                            "description": "name that need to be updated",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "in": "body",
                            "name": "body",
                            "description": "Updated user object",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/User"
                            }
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid user supplied"
                        },
                        "404": {
                            "description": "User not found"
                        }
                    }
                },
                "delete": {
                    "tags": [
                        "users"
                    ],
                    "summary": "Delete user",
                    "description": "This can only be done by the logged in user.",
                    "operationId": "deleteUser",
                    "produces": [
                        "application/json"
                    ],
                    "parameters": [
                        {
                            "name": "username",
                            "in": "path",
                            "description": "The name that needs to be deleted",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid username supplied"
                        },
                        "404": {
                            "description": "User not found"
                        }
                    }
                }
            }
        },
        "securityDefinitions": {
            "shopifystore_auth": {
                "type": "apiKey",
                "name": "api_key",
                "in": "header",
                "scopes": {
                    "write:order": "modify an order in your account",
                    "read:order": "read an order",
                    "write:orders": "modify orders in your account",
                    "read:orders": "read your orders",
                    "write:article": "modify article in your account",
                    "read:article": "read an article",
                    "write:articles": "modify articles in your account",
                    "read:articles": "read articles",
                    "write:cargo": "modify a cargo in your account",
                    "read:cargo": "read a cargo",
                    "write:cargos": "modify cargos in your account",
                    "read:cargos": "read cargos"
                }
            }
        },
        "definitions": {
            "Order": {
                "type": "object",
                "properties": {
                    "response_code": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "message": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 500,
                        "format": ""
                    },
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "customer_order_id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "type": {
                        "type": "string",
                        "description": "Order Type",
                        "enum": [
                            "small",
                            "medium",
                            "large"
                        ]
                    },
                    "order_date": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "import_date": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "tracking_number": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "tracking_link": {
                        "type": "object",
                        "properties": {
                            "link": {
                                "type": "string",
                                "format": "hostname"
                            },
                            "courier_code": {
                                "type": "integer",
                                "format": "int32"
                            }
                        }
                    },
                    "courier_status_description": {
                        "type": "string",
                        "description": "Order Status",
                        "enum": [
                            "placed",
                            "approved",
                            "shipped",
                            "delivered"
                        ]
                    },
                    "courier_service_description": {
                        "type": "string",
                        "description": "Courier Service Description"
                    },
                    "courier_extra_service_description": {
                        "type": "string",
                        "description": "Courier Extra Service Description"
                    },
                    "status": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string",
                                "description": "Status Code"
                            },
                            "descr": {
                                "type": "string",
                                "description": "Status Description"
                            },
                            "date": {
                                "type": "string",
                                "format": "date-time"
                            }
                        }
                    },
                    "qty_packages": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "packages": {
                        "type": "object",
                        "properties": {
                            "height": {
                                "type": "integer",
                                "description": "package's height in cm",
                                "format": "int64"
                            },
                            "width": {
                                "type": "integer",
                                "description": "package's height in cm",
                                "format": "int64"
                            },
                            "length": {
                                "type": "integer",
                                "description": "package's length in cm",
                                "format": "int64"
                            },
                            "weight": {
                                "type": "integer",
                                "description": "package's weight in kg",
                                "format": "int64"
                            }
                        }
                    }
                },
                "xml": {
                    "name": "Order"
                }
            },
            "Orders": {
                "type": "object",
                "properties": {
                    "response_code": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "message": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 500,
                        "format": ""
                    },
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "customer_order_id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "type": {
                        "type": "string",
                        "description": "Order Type",
                        "enum": [
                            "small",
                            "medium",
                            "large"
                        ]
                    },
                    "order_date": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "import_date": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "tracking_number": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "tracking_link": {
                        "type": "object",
                        "properties": {
                            "link": {
                                "type": "string",
                                "format": "hostname"
                            },
                            "courier_code": {
                                "type": "integer",
                                "format": "int32"
                            }
                        }
                    },
                    "courier_status_description": {
                        "type": "string",
                        "description": "Order Status",
                        "enum": [
                            "placed",
                            "approved",
                            "shipped",
                            "delivered"
                        ]
                    },
                    "courier_service_description": {
                        "type": "string",
                        "description": "Courier Service Description"
                    },
                    "courier_extra_service_description": {
                        "type": "string",
                        "description": "Courier Extra Service Description"
                    },
                    "status": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string",
                                "description": "Status Code"
                            },
                            "descr": {
                                "type": "string",
                                "description": "Status Description"
                            },
                            "date": {
                                "type": "string",
                                "format": "date-time"
                            }
                        }
                    },
                    "qty_packages": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "packages": {
                        "type": "object",
                        "properties": {
                            "height": {
                                "type": "integer",
                                "description": "package's height in cm",
                                "format": "int64"
                            },
                            "width": {
                                "type": "integer",
                                "description": "package's height in cm",
                                "format": "int64"
                            },
                            "length": {
                                "type": "integer",
                                "description": "package's length in cm",
                                "format": "int64"
                            },
                            "weight": {
                                "type": "integer",
                                "description": "package's weight in kg",
                                "format": "int64"
                            }
                        }
                    }
                },
                "xml": {
                    "name": "Orders"
                }
            },
            "Article": {
                "type": "object",
                "properties": {
                    "response_code": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "message": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 500,
                        "format": ""
                    },
                    "company_code": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "sku": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "descr": {
                        "type": "string",
                        "format": ""
                    },
                    "available_qty": {
                        "type": "integer",
                        "description": "Available quantity",
                        "format": "int64"
                    },
                    "stock_qty": {
                        "type": "integer",
                        "description": "Stock quantity",
                        "format": "int64"
                    },
                    "reject_qty": {
                        "type": "integer",
                        "description": "Rejected quantity",
                        "format": "int64"
                    },
                    "accessory_code": {
                        "type": "integer",
                        "format": "int64"
                    }
                },
                "xml": {
                    "name": "Article"
                }
            },
            "Articles": {
                "type": "object",
                "properties": {
                    "response_code": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "message": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 500,
                        "format": ""
                    },
                    "company_code": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "sku": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "descr": {
                        "type": "string",
                        "format": ""
                    },
                    "available_qty": {
                        "type": "integer",
                        "description": "Available quantity",
                        "format": "int64"
                    },
                    "stock_qty": {
                        "type": "integer",
                        "description": "Stock quantity",
                        "format": "int64"
                    },
                    "reject_qty": {
                        "type": "integer",
                        "description": "Rejected quantity",
                        "format": "int64"
                    },
                    "accessory_code": {
                        "type": "integer",
                        "format": "int64"
                    }
                },
                "xml": {
                    "name": "Articles"
                }
            },
            "Cargo": {
                "type": "object",
                "properties": {
                    "response_code": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "message": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 500,
                        "format": ""
                    },
                    "goods_receipts": {
                        "type": "object",
                        "properties": {
                            "list_number": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "company_code": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "supplier_code": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "order_id": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "imported_date": {
                                "type": "string",
                                "format": "date-time"
                            },
                            "ddt_number": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "ddt_date": {
                                "type": "string",
                                "format": "date-time"
                            },
                            "status": {
                                "type": "object",
                                "properties": {
                                    "code": {
                                        "type": "integer",
                                        "format": "int64"
                                    },
                                    "descr": {
                                        "type": "string",
                                        "format": ""
                                    },
                                    "date": {
                                        "type": "string",
                                        "format": "date-time"
                                    }
                                }
                            },
                            "articles": {
                                "type": "object",
                                "properties": {
                                    "item": {
                                        "properties": {
                                            "row_number": {
                                                "type": "integer",
                                                "format": "int64"
                                            },
                                            "subrow_number": {
                                                "type": "integer",
                                                "format": "int64"
                                            },
                                            "sku": {
                                                "type": "integer",
                                                "format": "int64"
                                            },
                                            "ddt_qty": {
                                                "type": "integer",
                                                "description": "quantity declared inside of the transport document",
                                                "format": "int64"
                                            },
                                            "received_qty": {
                                                "type": "integer",
                                                "description": "received quantity",
                                                "format": "int64"
                                            },
                                            "batch": {
                                                "type": "integer",
                                                "description": "received quantity",
                                                "format": "int64"
                                            },
                                            "expiration_date": {
                                                "type": "string",
                                                "format": "date-time"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "xml": {
                    "name": "Cargo"
                }
            },
            "Cargos": {
                "type": "object",
                "properties": {
                    "response_code": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "message": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 500,
                        "format": ""
                    },
                    "goods_receipts": {
                        "type": "object",
                        "properties": {
                            "list_number": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "company_code": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "supplier_code": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "order_id": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "imported_date": {
                                "type": "string",
                                "format": "date-time"
                            },
                            "ddt_number": {
                                "type": "integer",
                                "format": "int64"
                            },
                            "ddt_date": {
                                "type": "string",
                                "format": "date-time"
                            },
                            "status": {
                                "type": "object",
                                "properties": {
                                    "code": {
                                        "type": "integer",
                                        "format": "int64"
                                    },
                                    "descr": {
                                        "type": "string",
                                        "format": ""
                                    },
                                    "date": {
                                        "type": "string",
                                        "format": "date-time"
                                    }
                                }
                            },
                            "articles": {
                                "type": "object",
                                "properties": {
                                    "item": {
                                        "properties": {
                                            "row_number": {
                                                "type": "integer",
                                                "format": "int64"
                                            },
                                            "subrow_number": {
                                                "type": "integer",
                                                "format": "int64"
                                            },
                                            "sku": {
                                                "type": "integer",
                                                "format": "int64"
                                            },
                                            "ddt_qty": {
                                                "type": "integer",
                                                "description": "quantity declared inside of the transport document",
                                                "format": "int64"
                                            },
                                            "received_qty": {
                                                "type": "integer",
                                                "description": "received quantity",
                                                "format": "int64"
                                            },
                                            "batch": {
                                                "type": "integer",
                                                "description": "received quantity",
                                                "format": "int64"
                                            },
                                            "expiration_date": {
                                                "type": "string",
                                                "format": "date-time"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "xml": {
                    "name": "Cargos"
                }
            },
            "User": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "number"
                    },
                    "username": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string"
                    },
                    "phone": {
                        "type": "string"
                    },
                    "userStatus": {
                        "type": "string"
                    }
                },
                "xml": {
                    "name": "User"
                }
            },
            "ApiResponse": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "type": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    }
                }
            }
        },
        "externalDocs": {
            "description": "Find out more about us",
            "url": "http://macromade.com"
        }
    }
};
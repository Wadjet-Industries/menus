# Menu Service System Design
Backend design for menu microservice to handle 2200 RPS. Utilizes PostgreSQL database, Redis caching. Designed to be horionztally scaled behind Nginx load balancer.

![System Design Chart](https://raw.githubusercontent.com/Wadjet-Industries/menus/master/Screen%20Shot%202019-10-01%20at%2010.34.58%20PM.png)

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> npm run server-dev

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
npm run react-dev
```
## CRUD Endpoints
### GET: '/api/restaurant/:L/menu'
RESPONSE:
```sh
[
    {
        "Breakfast": {
            "Starter": {
                "Pancakes": {
                    "description": "served with maple syrup",
                    "price": 9.99
                }
            }
        },
        "Brunch": {
            "Main": {
                "Waffles": {
                    "description": "with syrup and bananas",
                    "price": 11.99
                },
                "facere": {
                    "description": "Non reiciendis quo sunt optio.",
                    "price": 13.99
                },
                "minima": {
                    "description": "Praesentium sequi soluta nihil labore quae quibusdam deleniti.",
                    "price": 13.99
                },
                "repellendus": {
                    "description": "Iste porro nam est rem sunt eos possimus soluta.",
                    "price": 13.99
                }
            },
            "Desserts": {
                "sint": {
                    "description": "Placeat aliquam eum quas praesentium ut natus reprehenderit similique in.",
                    "price": 13.99
                }
            },
            "Drinks": {
                "atque": {
                    "description": "Rem qui necessitatibus.",
                    "price": 13.99
                }
            }
        },
        "Lunch": {
            "Appetizers": {
                "nihil": {
                    "description": "Temporibus voluptatem repellat dicta aut vitae quas dolorem reprehenderit quae.",
                    "price": 13.99
                },
                "consectetur": {
                    "description": "Rem quia excepturi repudiandae maiores aliquam aut.",
                    "price": 13.99
                }
            }
        },
        "Dinner": {
            "Main": {
                "nemo": {
                    "description": "Nihil doloribus illum est.",
                    "price": 13.99
                }
            },
            "Desserts": {
                "laborum": {
                    "description": "Nesciunt ea dolores distinctio quis esse consectetur aut voluptatem.",
                    "price": 13.99
                }
            },
            "Appetizers": {
                "provident": {
                    "description": "Unde qui dolorem aspernatur fugit possimus dolorem quibusdam inventore.",
                    "price": 13.99
                }
            }
        }
    }
]
```
### POST: '/api/restaurant/:L/dish'
FormData Object with the following required key value pairs:
1. name: string
2. mealoption: string
### PUT: '/api/restaurant/:L/dish'
FormData Object with the following required key value pairs:
1. name: string
2. mealoption: string
### DELETE: '/api/restaurant/:L/dish'
FormData Object with the following required key value pairs:
1. name: string
2. mealoption: string

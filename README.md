# ProshopDjangoReact

## `Section 2: BackEnd and API`
* we will send a `GET` request to the django `View` the View will which will send a request to the database, our database will send that data back to the view, the view will serialize that data and send it back to the client.

* * when we are sending the data, we will send the `form` data from the frontEnd.
* * when we are going to deploy our project, we will make the react project a static one with the help of `Run build` which will be served in the django project and it will be on the same server rather then on different servers.

### `setting up Virtual Environment`
```
$ pip list
$ pip install virtualenv
$ virtualenv venv
```

activate the virtual environment.

### `Building BackEnd`

```pip
$ pip install django
$ python manage.py runserver
$ python manage.py startapp <app_name>
```
configure your base app in the settings.py.

```py
# settings.py
INSTALLED_APPS = [
 # ......
     'base.apps.BaseConfig',
]
```

```py
# // backend/base/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
]
```

```py
# /backend/urls.py
urlpatterns = [
    # .....
    path('api/', include('base.urls')),
]
```
we going to have lots of API's for Products, Orders, Users etc.
```py
from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

def getRoutes(request):
    routes = [
        '/api/products/',
        '/api/products/create/',
        '/api/products/upload/',

        '/api/products/<id>/reviews/',

        '/api/products/top/',
        '/api/products/<id>/'

        '/api/products/delete/<id>/',
        '/api/products/update/<id>/'
    ]
    return JsonResponse(routes, safe=False)
```

* the 1st thing we are going to do now is to use the fake data for products, we have to convert that into python file. and return that with an API call.
* * copy the products.js fake file from the frontend
* * paste it in the backend app, and change the extension from .js to .py, and then get rid off const, and export default because python don't know what that is.

```py
from .products import products

#.....
def getProducts(request):
    return JsonResponse(products, safe=False)
```
```py
# /base/urls.py
urlpatterns = [
    #.....
    path('products/', views.getProducts, name="products"),
]
```
at this point all we are doing is just using `JsonResponse`
---
`pip install djangorestframework`

```py
# settings.py
INSTALLED_APPS = [
# .....
'rest_framework',
]
```
```py
# /base/views.py
from django.shortcuts import render
from .products import products
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/products/',
        '/api/products/create/',
        '/api/products/upload/',
        
        '/api/products/<id>/reviews/',
        
        '/api/products/top/',
        '/api/products/<id>/'
        
        '/api/products/delete/<id>/',
        '/api/products/update/<id>/'
    ]
    return Response(routes)


@api_view(['GET'])
def getProducts(request):
    return Response(products)

@api_view(['GET'])
def getProduct(request, pk):
    product = None
    
    for i in products:
        if i['_id'] == pk:
            product = i
            break
    return Response(product)
```

```py
# /base/urls.py
urlpatterns = [
    #....
    path('products/<str:pk>', views.getProduct, name="product"),

]
```
---
---









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

### `Fetching Data`
Now we are going to connect the frontEnd to the backEnd.
and for that we have to install `Axios` , or `Fetch` or `AJAX`

go to the frontend and install `npm install axios`
and then start the frontend server.

then go the frontend and `import Axios` and `useState, useEffect` in the HomeScreen.

1. the first thing we are going to do in the Home screen, is to create `products` in the state.
```js
// /src/screens/HomeScreen.js
    // get rid of `import products from `../products`. and do it with states.
    const [products, setProducts] = useState([]);
```
at this point our product array will be empty. so we will use an API call and then use setProducts value to update the state.
so at this point we will be seeing the products array empty.

so to add data into the array, we will use the `useEffect` hook.
in the useEffect we are going to use `axios` to make a request to load the data and then actually update the products state.

```js
// /src/screens/HomeScreen.js
//......
 useEffect (() => {
        console.log('useEffect is triggered')
    }, []);
```
so if that works , then now we are going to use `axios`, 
and in the axios we are going to request `GET` method, and pass the URL that we are requesting on `http://127.0.0.1:8000/api/products/` at this time it will be the backend url. and then use `.then` to make a promise. and in that promise we will get the response `res` and we can set products `setProducts`.

instead of using promise we can use `async await`.
so will use `await axios.get(`http://127.0.0.1:8000/api/products/`)` and then destructure that response, so we will set that variable to `data`.
```js
// /src/screens/HomeScreen.js
       const {data} = await axios.get('http://127.0.0.1:8000/api/products/')
```
 in order to use the above await function we have to wrap that call into the `Async` function.
 inside of our response we want to set `setProducts`. so we are going to get back the data from the API  call.
 ```js
             setProducts(data)
```
so now we have the products array will filled with `data` response from the API.

now we need to trigger the `fetchProducts` function inside the `useEffect` hook.

so this should know make the call and load the data.

we have one problem here, we made the call but didn't load the data. so we have to check the `console.` and we will see that the error that we are getting is the `CORS` error.
at this point we have to configure our backend to allow cross site requests.

we are going to ``` pip install django-cors-headers ```
and add it in the install apps.
```py
INSTALLED_APPS = [
    ...,
    "corsheaders",
    ...,
]
```
and then add some middleware in the `settings.py`
```py
"corsheaders.middleware.CorsMiddleware",
```
and then configure the `CORS`
```py
CORS_ALLOW_ALL_ORIGINS= True
```
at this point the data should be loaded in the front end from backend.

    Steps:
    1. delete `import products from `../products`. and do it with states. `const [products, setProducts] = useState([]);`
    2. add `useEffect (() => { console.log('useEffect triggered') }, []);`
    3. use `axios` for api call and pass the url to the axios
    4. destructure the response and set the data to `setProducts`
    5. make the response an Async function
    6. call the function in the useEffect so that it will be triggered when the component loads.

at this point we are going to make a proxy URL in the `package.json` file.
```json
{
  "name": "frontend",
  "proxy": "http://127.0.0.1:8000/",

  //......
}
```
```js
// /src/screens/HomeScreen.js
            const {data} = await axios.get('/api/products/')
```
so this way we don't have to hard code the `http://127.0.0.1:8000` in the frontend.
and then restart the server

    Steps:
    1. set the proxy in the `package.json` file
    2. restart the server
    3. delete the hard coded `http://127.0.0.1:8000` from the frontend.
    4. now the data should be loaded in the front end from backend.and it will know where to look for the backend.

Now we are going to do the same thing for our product page.

import useState, useEffect and axios.
do the same steps in the `HomeScreen.js` file.

the only thing that will be different is the `product id`,  for that we have `{match}` so remember how we did that before 
```js
// without axios
const product = products.find((p) => p._id === match.params.id);
``` 

```js
//  with axios api call.
const {data} = await axios.get(`/api/products/${match.params.id}`)
```
```js
// /src/screens/ProductScreen.js
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card } from 'react-bootstrap';
import Rating from '../components/Rating';
// import products from '../products';
import axios from 'axios';

function ProductScreen({ match }) {

    const [product, setProduct] = useState([]);
    // const product = products.find((p) => p._id === match.params.id);

    useEffect (() => {
        // console.log('useEffect is triggered')
        async function fetchProduct(){
            const {data} = await axios.get(`/api/products/${match.params.id}`)
            setProduct(data)
        }

        fetchProduct();
    }, []);

    return (
        # ........
    )
```
###### `do remember the steps`
---
---

## `Database and Admin Panel`

    Steps:
    1. create a our database
    2. python manange.py migrate
    3. how to query that database
    4. how to serialize that data
    5. return Real data to make this  dynamic.
    6. python manage.py createsuperuser
    7. set the credentials
    8. python manage.py runserver
    9. go to the admin panel
---
---

## `Modeling the database`

we will model our data in `models.py`
for the `image` to use in the database with python we have to install `pillow` 


```py
from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    # image =
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    countInStcok = models.IntegerField(null=True, blank=True, default=0)
    createAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=True)

    def __str__(self):
        return self.name
```

now we have to migrate our database and Register that Product model to the admin.py
```shell
$ python manage.py makemigrations
$ python manage.py migrate
```
```py
# admin.py
from django.contrib import admin
from .models import Product
# Register your models here.

admin.site.register(Product)
```
Now add a product from admin panel 

    Steps:
    1. Make a model e.g Product in the models.py
    2. Register the model in the admin.py
    3. migrate the database
    4. run the server
    5. add product in the Product model from admin panel.


#### `Adding more Models`
```py
# models.py
from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    # image =
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    countInStcok = models.IntegerField(null=True, blank=True, default=0)
    createAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=True)

    def __str__(self):
        return self.name
    

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(default=0, null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=True)


    def __str__(self):
        return str(self.rating)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=True)

    def __str__(self):
        return str(self.createdAt)


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(default=0, null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=True)

    def __str__(self):
        return str(self.name)

class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode= models.CharField(max_length=200, null=True, blank=True)
    country= models.CharField(max_length=200, null=True, blank=True)
    shippingPrice= models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=True)

    def __str__(self):
        return str(self.address)
```

and then register all those models in the `admin.py`

```py
# admin.py
from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)

```

### `Product Image Field`

```shell
pip install pillow
```

```py
# models.py
class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)

    #..........
    #..........
```
    steps:
    1. pip install pillow
    2. image = models.ImageField(null=True, blank=True)
    3. makemigrations and migrate
    4. change the static folder to `media`

### `Static Files`

create a `static` folder in the `root` folder
at this point python don't know about that folder so go to the settings.py and let Django know about it.
```py
# settings.py
STATIC_URL = '/static/'

STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
```

Now django know about static folder but not about the image folder.
for that we need to configure media root in the settings.py. it's for the user uploaded content.
```py
# settings.py
STATIC_URL = '/static/'

MEDIA_URL = '/images/'

STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

MEDIA_ROOT = 'static/images'
```
at this point we have a static folder and a media folder.

```py
# urls.py
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('base.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

    steps:
    1. create a directory in the backend root directory called `static`
    2. configure the STATICFILES_DIRS and MEDIA_ROOT in the settings.py
    3.set the MEDIA_URL in the settings.py and in the urls.py

### `Serializing Data`
we have to `Serialize` our model data, because we have our database setup, we have an item in that database, we need to render this data out in `JSON` format.

now we want to make queries to our database and return back the real data into our API instead of that static data.

import models in the `views.py`

to make this query, we need to set the variable, and get the model `Product`
but this wouldn't work because we are working with Django RestFramework and we haven't serialized our data yet. 
```py
# views.py
# ..........
from .models import Product

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    return Response(products)
```

we have to make a file called `serializer.py` in the base folder.

    Note:
    Serializer is going to wrap our model and then turn it into a JSON object.

we need to create a Serializer for every single model that we want to return.

in order to make a serializer, this is going to be a class.

```py
# serializer.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
```

now we have to import this serializer in the `views.py`

after we get our querySet `products = Product.objects.all()` we are going to create a serializer and this is going to be an object and will set it to the `ProductSerializer` and pass the `products` querySet.


```py
# views.py
from .serializers import ProductSerializer


@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    # return Response(products)
    return Response(serializer.data)
```

know we are getting real data back.
now our real data has been rendered in to the Frontend from backend. to check this, go to the frontend folder and start the server.

we aren't pulling from static data anymore, this is item from our database and we are rendering it to the frontend.

adding serializer to `getProduct`

```py
# views.py

# .......
#........
@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)
```

    steps:
    1. import the model in the views.py
    2. make a query to the database
    3. serialize your data
    4. import your serializer in the views.py
    5. create the serializer object in the views.py and pass the querySet
    6. go to the frontEnd and start the server.
    7. our Real data has been rendered in to the frontend.
    8. know do the same for the getProduct single item function

---
---

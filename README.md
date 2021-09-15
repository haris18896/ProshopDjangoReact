# ProshopDjangoReact

## `Section 5: Backend User Authentication`

### `JWT Authentication`

we will be storing our JWT tokens in localStorage. but we can also store them in cookies.

Here we will be using Djnago Rest_framework Authentication with JWT tokens.

```shell
pip install djangorestframework-simplejwt
```
after that we are going to add this authentication to our `settings.py` file in the backend, below the installed apps, check this link for documentation `https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html`

```py
# settings.py
REST_FRAMEWORK = {
    ...
    'DEFAULT_AUTHENTICATION_CLASSES': (
        ...
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
    ...
}
```

here we can use refresh tokens and regular tokens, we are going to use Regular tokens and will customize the life span of the token.

copy and paste the following code in your `urls.py` file according to the token you are working with.
```py
# urls.py
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    ...
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    ...
]
```
after that check that route. and post the `username` and `password` you want to use and then you will get a token.
```json
{ "Refresh" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYzMTgwMTkyMiwianRpIjoiZDM0NmZkNjI1ZGUwNDU3ZjgzYzU5MDlmYmQwNjUzNGYiLCJ1c2VyX2lkIjoyfQ.yUYVVQ7xW_CBKcdYWCUWzRPYsxYV9AlWGOU5JHyHFJk" ,

"Access" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjMxNzE1ODIyLCJqdGkiOiI4ODRlMTY1ZDA2OTU0ODYxYWM3MzNmZWU5YWFiNGNiOSIsInVzZXJfaWQiOjJ9.CXs4AtgaJMuKuAcWcty7UOb8kJy48saWAXc_xKmSFu0" }
```

if you want to decode the token go to this link `https://jwt.io/` and decode,

customizing the time span of the token, below the rest_framework_simplejwt.authentication.JWTAuthentication
```py
# Django project settings.py

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    # 'SIGNING_KEY': settings.SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}
```

name of the token is `Bearer` and the token is `JWT Access Token`, but here we are only going to change the life span of the token. and then generate new token.

by decoding in `jwt.io` we are only getting the user_id, and expiry time of the token, so we are going to encode more information in the token so that we can load this into the frontend.
For that go the documentation `Customizing token claims` of jwt.io.
```py
# views.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
```
delete this from urls.py
```py
# urls.py
from rest_framework_simplejwt.views import TokenObtainPairView
```
after we take those import in `views.py` file. we need to customize this
```py
# views.py
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.name
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
```

all we are doing here is using the same `TokenObtainPairView` class and we are adding some custom claims to the `MyTokenObtainPairSerializer` class. so we are going to customize the serailizer.
```py
# views.py
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['message'] = 'Welcome!'

        return token
```
```py
# urls.py
    path('users/login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
```

and check the token in the browser.

but at this point we aren't now going to use this classMethod so delete and write your own
```py
# views.py
@classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['message'] = 'Welcome!'

        return token
```

```py
# views.py
class TokenObtainPairSerializer(TokenObtainSerializer):
    @classmethod
    def get_token(cls, user):
        return RefreshToken.for_user(user)

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data
```
Now we are going to customize this class in `views.py` to the given code below and then check in the browser.
```py
# views.py
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        data['username'] = self.user.username
        data['email'] = self.user.email

        return data
```

so this way we don't need to decode the token and we can use the `username` and `email` of the user.
```py
# views.py
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # data['username'] = self.user.username
        # data['email'] = self.user.email
        # data['first_name'] = self.user.first_name

        serializer = UserSerializerWithToken(self.user).data
        for key, value in serializer.items():
            data[key] = value

        return data
```

    Steps:
    1. pip install djangorestframework-simplejwt
    2. add this authentication to your settings.py file
    3. Customize the life span of the token
    4. import TokenObtainPairView and add path to urlpatterns
    5. and then change the `api/token/` to `users/login/`
    6. check the route and post the `username` and `password` you want to use and then you will get a token.
    7. to decode the token go to this link `https://jwt.io/`.
    8. customize the token, copy the source code from the doucumentation and paste it in your settings.py file and customize the life span of the token.
    9. import `TokenObtainPairView` and `TokenObtainPairSerializer` into the `views.py` file. and delete `TokenObtainPairView` from `urls.py` file. and then customize the `TokenObtainPairView` and `TokenObtainPairSerializer` in `views.py` file.
    10. delete the classMethod from `views.py` file.
    11. copy the `TokenObtainPairView` from `https://github.com/jazzband/djangorestframework-simplejwt/blob/master/rest_framework_simplejwt/serializers.py` and customize it.

---
---

### `User Serializer`

```py
# serializers.py
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
```

```py
# views.py
@api_view(['GET'])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)
```

```py
# urls.py
    path('users/profile/', views.getUserProfile, name="users-profile"),

```

right now we get nothing back in our response, the `request.user` can't find the user. because we wraped our `getUserProfile` function in `@api_view` decorator because of which the software is looking for a token rather than that default authentication.

to do so, we can check it in `postman`, by sending the token along with the request in Header. `Bearer`.

now we are going to customize the `UserSerializer` fields in the `serializers.py` file, if we look in the django user model we have, first_name, last_name, username, email, etc.
so we want the user to be logged in weather if they put their first_name as a fullName or email.

we will be checking if the user has a name, if the user doesn't have a name then we will be using the email.

```py
# serializers.py
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name']

    def get_name(self, obj):
        name = obj.first_name

        if name == '':
            name = obj.email
        return name
```

and then we will customize the same class `UserSerializer` file for `_id` field, becuase for all other things we are using the `_id` field.
```py
# serializers.py
class UserSerializer(serializers.ModelSerializer):
    #......
    _id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name']

    def get__id(self, obj):
        return obj.id

    #....
    #....
```

```py
# serializers.py

class UserSerializer(serializers.ModelSerializer):
    #......
    isAdmin = serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get_isAdmin(self, obj):
        return obj.is_staff

    #....
    #....
```

Now we are going to create another serialzer similar to `UserSerializer` class, but this time we are going to make this serializer for `refresh` token.

we will need this for when the user first register, when a user resets their account information, we will need a new token to represent the new user information.

for that we will first import the refresh token function, and create a new serializer class.and in that new serializer we will extend the `UserSerializer` class. so that we can have access to all the data of `UserSerializer` class

```py
# serializers.py
#....
from rest_framework.simplejwt.token import RefreshToken

    # ..........
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

#....
#....
```

now we are going to clean the `MyTokenObtainPairView` class, so that we can use the `UserSerializerWithToken` class. and can return more data for that we make a `for loop` and output the data from `UserSerializerWithToken` class. in the `MyTokenObtainPairView` class we will be looping over the `UserSerializerWithToken` class and output the data.

```py
# views.py

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for key, value in serializer.items():
            data[key] = value

        return data
```



    Steps:
    1. create a `UserSerializer` class in `serializers.py` file.
    2. define the userProfile in the `views.py` file.
    3. make the route in the `urls.py` file for `users/profile/`
    4. send the `Bearer` token along with the request in the Header using `Postman`.
    5. customizing the `UserSerializer` class fields in `serializers.py` file for the `name` field.
    6. customizing the `UserSerializer` class fields in `serializers.py` file for the `_id` field.
    7. customizing the `UserSerializer` class fields in `serializers.py` file for the `isAdmin` field.
    8. make a serializer for `refresh` token in `serializers.py` file.
    9. import refresh token function in `serializers.py` file.
    10. clean `MyTokenObtainPairSerializer` class in `views.py` file. and loop over the `UserSerializerWithToken` class to output the data.


---
---

### `Protected Routes`







from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework import routers
from met_django.views import *

router = routers.DefaultRouter()
router.register(r'entries', CEntryViewSet)

urlpatterns = [
    path('signup/', SignupView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('weather/<int:coordinate_id>/', weather_data),
    path('coordinates/', CoordinatesView, name='coordinates'),
    path('coordinates/update/<int:id>', CoordinatesUpdate, name='update'),
    path('coordinates/delete/<int:id>', CoordinatesDelete, name='delete'),
    path('coordinates/add/', CoordinatesAdd, name='add'),
    path('coordinates/detail/<int:id>', CoordinatesDetail, name='detail'),
    path('cities/', CitiesView, name='cities'),
    path('cities/detail/<int:id>', CitiesDetail, name='citydetail'),
    path('', include(router.urls)),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


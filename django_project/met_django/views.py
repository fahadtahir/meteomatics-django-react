import json
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from .models import CEntry, Cities
from .serializers import CEntrySerializer, UserSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
import requests
from django.conf import settings
from django.http import Http404, JsonResponse
from datetime import datetime, timedelta, timezone
from django.shortcuts import render
from .models import CEntry
from django.contrib.auth.models import User

# Create your views here.

class CEntryViewSet(viewsets.ModelViewSet):
    queryset = CEntry.objects.all()
    serializer_class = CEntrySerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]



#Authentication

class SignupView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    serializer_class = UserSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful.'})
        else:
            return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful.'})
    


#weather APIs
def get_weather_data(coordinates):
    now = datetime.utcnow()
    url = settings.METEOMATICS_API_URL + now.isoformat("T")+"Z" + '/t_2m:C/' + coordinates + '/json/'
    response = requests.get(url, auth=(settings.METEOMATICS_USERNAME, settings.METEOMATICS_PASSWORD))
    if response.status_code == 200:
        data = response.json()
        return "The temperature is "+ str(data["data"][0]["coordinates"][0]["dates"][0]["value"]) + " C"
    else:
        return None
    

def get_weather_data_custom(coordinates, param):
    now = datetime.utcnow()
    url = settings.METEOMATICS_API_URL + now.isoformat("T")+"Z" + param + coordinates + '/json/'
    response = requests.get(url, auth=(settings.METEOMATICS_USERNAME, settings.METEOMATICS_PASSWORD))
    if response.status_code == 200:
        data = response.json()
        return str(data["data"][0]["coordinates"][0]["dates"][0]["value"])
    else:
        return None
    
#####    
def get_weather_data_timeseries(coordinates, param):
    now = datetime.utcnow().strftime('%Y-%m-%d')
    tomorrow = (datetime.utcnow() + timedelta(days=1)).strftime('%Y-%m-%d')
    url = settings.METEOMATICS_API_URL + now +"T00:00:00Z--" + tomorrow +"T00:00:00Z:PT1H" + param + coordinates + '/json/'
    print(url)
    response = requests.get(url, auth=(settings.METEOMATICS_USERNAME, settings.METEOMATICS_PASSWORD))
    if response.status_code == 200:
        data = response.json()
        dates = (data["data"][0]["coordinates"][0]["dates"])
        values = [d['value'] for d in dates]
        return values
    else:
        return None

def weather_data(request, coordinate_id):
    try:
        c_entry = get_object_or_404(CEntry, coordinate_id=coordinate_id)
        lat = c_entry.latitude
        long = c_entry.longitude
        data = get_weather_data(str(lat)+","+str(long))
        if data is not None:
            return JsonResponse(data, safe=False)
        else:
            return JsonResponse({'error': 'Weather data not available.'}, status=404)
        
    except Http404:
        return JsonResponse({'error': 'Coordinate not found.'}, status=404)



#ٌُِREACT
def CoordinatesView(request):
    c_entries = []

    for entry in CEntry.objects.all():
        latitude = str(entry.latitude)
        longitude = str(entry.longitude)
        user = User.objects.get(id=entry.user_id)
        temp = {
            "coordinate_id" : entry.coordinate_id,
            "user_id" : user.username,
            "latitude" : latitude,
            "longitude" : longitude,
            "created_at" : (entry.created_at).replace(tzinfo=timezone.utc).astimezone(tz=None).strftime("%d-%m-%Y %I:%M %p"),
            "min_temp" : get_weather_data_custom(latitude+","+longitude, '/t_min_2m_24h:C/'),
            "max_temp" : get_weather_data_custom(latitude+","+longitude, '/t_max_2m_24h:C/'),
            "symbol" :   get_weather_data_custom(latitude+","+longitude, '/weather_symbol_24h:idx/'),
        }
        c_entries.append(temp)
    return render(request, str(settings.BASE_DIR)+'\\met_django\\templates\\coordinate_list_react.html', {'props': json.dumps(c_entries)})


def CoordinatesUpdate(request, id):
    body = (json.loads(request.body))
    lat = body['latitude']
    long = body['longitude']
    entry = CEntry.objects.get(coordinate_id=id)
    entry.latitude = lat
    entry.longitude = long
    entry.min_temp = get_weather_data_custom(str(lat)+","+str(long), '/t_min_2m_24h:C/')
    entry.max_temp = get_weather_data_custom(str(lat)+","+str(long), '/t_max_2m_24h:C/')
    entry.symbol = get_weather_data_custom(str(lat)+","+str(long), '/weather_symbol_24h:idx/')
    entry.save()

    updatedData = {
        "min_temp" : entry.min_temp,
        "max_temp" : entry.max_temp,
        "symbol" :   entry.symbol,
    }
    return JsonResponse({'success': 'Coordinate updated', 'data': updatedData}, status=200)

def CoordinatesDelete(request, id):
    entry = CEntry.objects.get(coordinate_id=id)
    entry.delete()
    return JsonResponse({'success': 'Coordinate deleted'}, status=200)

def CoordinatesAdd(request):
    body = (json.loads(request.body))
    lat = body['latitude']
    long = body['longitude']
    entry = CEntry(latitude=lat, longitude=long, user_id=0)
    entry.min_temp = get_weather_data_custom(str(lat)+","+str(long), '/t_min_2m_24h:C/')
    entry.max_temp = get_weather_data_custom(str(lat)+","+str(long), '/t_max_2m_24h:C/')
    entry.symbol = get_weather_data_custom(str(lat)+","+str(long), '/weather_symbol_24h:idx/')
    entry.save()
    temp = {
        "coordinate_id" : entry.coordinate_id,
        "user_id" : User.objects.get(id=entry.user_id).username,
        "latitude" : lat,
        "longitude" : long,
        "created_at" : entry.created_at.replace(tzinfo=timezone.utc).astimezone(tz=None).strftime("%d-%m-%Y %I:%M %p"),
        "min_temp" : entry.min_temp,
        "max_temp" : entry.max_temp,
        "symbol" :   entry.symbol,
    }

    return JsonResponse( {'newRow': temp}, status=200)



def CoordinatesDetail(request, id):
    entry = CEntry.objects.get(coordinate_id=id)
    lat = entry.latitude
    long = entry.longitude
    temp = {
        "coordinates": str(lat)+","+str(long),
        "symbol" : get_weather_data_timeseries(str(lat)+","+str(long), '/weather_symbol_1h:idx/'),
        "temp" : get_weather_data_timeseries(str(lat)+","+str(long), '/t_2m:C/'),
        "precipitation" :get_weather_data_timeseries(str(lat)+","+str(long), '/precip_1h:mm/'),
        "wind_speed" : get_weather_data_timeseries(str(lat)+","+str(long), '/wind_speed_10m:ms/'),
        "wind_direction" : get_weather_data_timeseries(str(lat)+","+str(long), '/wind_dir_10m:d/'),
    }
    return render(request, str(settings.BASE_DIR)+'\\met_django\\templates\\details.html', {'props': json.dumps(temp)})


def CitiesView(request):
    c_entries = []

    for entry in Cities.objects.all():
        temp = {
            "id" : entry.city_id,
            "name" : (entry.name_en).replace("'", ""), #fix dumps not working
        }
        c_entries.append(temp)
    return render(request, str(settings.BASE_DIR)+'\\met_django\\templates\\cities.html', {'props': json.dumps(c_entries)})




def CitiesDetail(request, id):
    entry = Cities.objects.get(city_id=id)
    lat = entry.latitude
    long = entry.longitude
    temp = {
        "coordinates": str(lat)+","+str(long),
        "location": entry.name_en.replace("'", ""), #fix dumps not working,
        "symbol" : get_weather_data_timeseries(str(lat)+","+str(long), '/weather_symbol_1h:idx/'),
        "temp" : get_weather_data_timeseries(str(lat)+","+str(long), '/t_2m:C/'),
        "precipitation" :get_weather_data_timeseries(str(lat)+","+str(long), '/precip_1h:mm/'),
        "wind_speed" : get_weather_data_timeseries(str(lat)+","+str(long), '/wind_speed_10m:ms/'),
        "wind_direction" : get_weather_data_timeseries(str(lat)+","+str(long), '/wind_dir_10m:d/'),
    }
    return render(request, str(settings.BASE_DIR)+'\\met_django\\templates\\details.html', {'props': json.dumps(temp)})
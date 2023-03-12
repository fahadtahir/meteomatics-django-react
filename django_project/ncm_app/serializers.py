from rest_framework import serializers
from .models import CEntry
from django.contrib.auth.models import User
from rest_framework import generics, status, permissions


class CEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CEntry
        fields = ['coordinate_id', 'user_id', 'latitude', 'longitude', 'created_at', 'updated_at']
        extra_kwargs = {'coordinate_id': {'required': False},'user_id': {'required': False},
                        'created_at': {'required': False},'updated_at': {'required': False}}

    def create(self, validated_data):
        validated_data['user_id'] = self.context['request'].user.id
        return super().create(validated_data)    


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'password')

class CitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CEntry
        fields = ['city_id', 'region_id', 'latitude', 'longitude', 'name_ar', 'name_en']
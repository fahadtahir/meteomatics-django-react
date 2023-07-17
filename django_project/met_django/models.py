from django.db import models

# Create your models here.
class CEntry(models.Model):  
    coordinate_id = models.AutoField(primary_key=True) 
    user_id = models.IntegerField()  
    latitude = models.DecimalField(max_digits=11, decimal_places=8) 
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  
    class Meta:  
        db_table = "tb_coordinates"


class Cities(models.Model):  
    city_id = models.IntegerField(primary_key=True) 
    region_id = models.IntegerField()
    latitude = models.DecimalField(max_digits=11, decimal_places=8) 
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    name_ar = models.CharField(max_length=100)  
    name_en = models.CharField(max_length=100)  
    class Meta:  
        db_table = "tb_cities"
from django.urls import path
from .api import IntegratedDataAPI, BrandsAPI

urlpatterns = [
    path('integrated-data/', IntegratedDataAPI.as_view(), name='integrated-data-api'),
    path('brands/', BrandsAPI.as_view(), name='brands'),            # all brands
    path('brands/<str:brand>/', BrandsAPI.as_view(), name='brand'), # single brand
]

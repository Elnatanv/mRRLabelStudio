import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')
BRANDS_FILE = os.path.join(os.path.dirname(__file__), 'brands.json')


class IntegratedDataAPI(APIView):

    def get(self, request):
        if not os.path.exists(DATA_FILE):
            return Response([], status=status.HTTP_200_OK)
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        return Response(data, status=status.HTTP_200_OK)

    def put(self, request):
        new_items = request.data.get('items', [])
        if not isinstance(new_items, list):
            return Response({'error': 'items must be a list of strings'}, status=status.HTTP_400_BAD_REQUEST)

        # --- Load or create data.json ---
        if not os.path.exists(DATA_FILE):
            data = []
        else:
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)

        # Extend the data list
        data.extend(new_items)

        # Save back to data.json
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f)

        # --- Load or create brands.json ---
        if not os.path.exists(BRANDS_FILE):
            shoeModelData = {}
        else:
            with open(BRANDS_FILE, 'r') as f:
                shoeModelData = json.load(f)

        # Ensure each new brand exists in brands.json
        for brand_name in new_items:
            if brand_name not in shoeModelData:
                shoeModelData[brand_name] = []  # create empty model list

        # Save back to brands.json
        with open(BRANDS_FILE, 'w') as f:
            json.dump(shoeModelData, f, indent=2)

        return Response(data, status=status.HTTP_200_OK)



class BrandsAPI(APIView):

    def get(self, request, brand=None):
        """Return all brands or a specific brand's models"""
        if not os.path.exists(BRANDS_FILE):
            data = {}
        else:
            with open(BRANDS_FILE, 'r') as f:
                data = json.load(f)

        if brand:  # return models for a specific brand
            if brand not in data:
                return Response({'error': f'Brand "{brand}" not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response({brand: data[brand]}, status=status.HTTP_200_OK)

        return Response(data, status=status.HTTP_200_OK)

    def put(self, request, brand=None):
        """Add models to a brand"""
        brand_name = brand or request.data.get('brand')
        models = request.data.get('models', [])

        if not brand_name or not isinstance(brand_name, str):
            return Response({'error': 'brand must be a string'}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(models, list):
            return Response({'error': 'models must be a list of strings'}, status=status.HTTP_400_BAD_REQUEST)

        # Load existing brands file
        if not os.path.exists(BRANDS_FILE):
            data = {}
        else:
            with open(BRANDS_FILE, 'r') as f:
                data = json.load(f)

        # Add or extend models
        if brand_name not in data:
            data[brand_name] = []
        data[brand_name].extend(models)

        # Deduplicate
        data[brand_name] = list(set(data[brand_name]))

        # Save back
        with open(BRANDS_FILE, 'w') as f:
            json.dump(data, f, indent=2)

        return Response({brand_name: data[brand_name]}, status=status.HTTP_200_OK)

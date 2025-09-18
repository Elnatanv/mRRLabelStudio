from django_filters.rest_framework import FilterSet, CharFilter
from tasks.models import Task
from django.db.models import Q
import json

class BibNumberFilter(FilterSet):
    bib_number = CharFilter(method='filter_by_bib_number')

    class Meta:
        model = Task
        fields = ['bib_number']

    def filter_by_bib_number(self, queryset, name, value):
        filtered_queryset = queryset.filter(Q(data__image__icontains=value))
        
        return filtered_queryset
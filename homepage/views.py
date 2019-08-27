from django.shortcuts import render
from django.http import HttpResponse
import random
import math
# Create your views here.

def index(request):
    r = random.random()
    return render(request,'homepage/RayCasting.html')
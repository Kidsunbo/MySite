from django.shortcuts import render
from django.http import HttpResponse
import random
import math
# Create your views here.

def index(request):
    r = random.random()
    if r>=0.5:
        return render(request,'homepage/BeautifulBubbles.html')
    else:
        return render(request,'homepage/RayCasting.html')
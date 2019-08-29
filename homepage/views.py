from django.shortcuts import render
from django.http import HttpResponse
import random
import math
# Create your views here.

def index(request):
    page = random.choice([
        'homepage/BeautifulBubbles.html',
        'homepage/RayCasting.html',
        'homepage/Circles.html',
    ])
    return render(request,page)
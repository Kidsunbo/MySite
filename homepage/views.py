from django.shortcuts import render
from django.views import View
from .models import Article


# Create your views here.

class HomePageView(View):
    def get(self,request):
        return render(request,"homepage/Base.html",context={"articles":Article.objects.all})
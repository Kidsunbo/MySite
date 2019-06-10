from django.contrib import admin
from .models import  Article
# Register your models here.

class ArticleAdmin(admin.ModelAdmin):
    fieldsets = [("Title & Date",{"fields":["title","pub_date"]}),
                 ("Main Content",{"fields":["content"]})]

admin.site.register(Article,ArticleAdmin)
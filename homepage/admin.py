from django.contrib import admin
from .models import  Article
from django.db import models
from tinymce.widgets import TinyMCE

# Register your models here.

class ArticleAdmin(admin.ModelAdmin):
    fieldsets = [("Title & Date",{"fields":["title","pub_date"]}),
                 ("Main Content",{"fields":["content"]})]

    formfield_overrides = {
        models.TextField:{'widget':TinyMCE()}
    }

admin.site.register(Article,ArticleAdmin)
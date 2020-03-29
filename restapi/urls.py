from django.urls import path,re_path
from . import views
urlpatterns = [
    path('kieraym/all/',views.keyraym_all),
    path('kieraym/append/',views.keyraym_append),
    path('kieraym/delete/',views.keyraym_delete),
]